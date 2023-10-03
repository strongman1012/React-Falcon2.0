import he from 'he';
import React from 'react';
import moment from 'moment';
import BraftEditor from 'braft-editor';
import BraftTable from 'braft-extensions/dist/table';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ColorPicker from 'braft-extensions/dist/color-picker';
import reactComponentDebounce from 'react-component-debounce';
import {
  CheckOutlined,
  CloseOutlined,
  CaretDownFilled,
  InfoCircleOutlined,
  CopyOutlined
} from '@ant-design/icons';
import {
  Form,
  Input,
  Radio,
  Select,
  Checkbox,
  Switch,
  InputNumber,
  Empty,
  Spin,
  Button,
  DatePicker,
  Tooltip,
  message,
  Row,
  Col
} from 'antd';

import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/table.css';
import 'braft-extensions/dist/color-picker.css';

import keys from 'utils/keys';
import store from 'redux/store';
import PluginTableFormField from './PluginTableFormField';
import { getPopupContainer, isEmpty } from 'helpers/utils';
import CustomColorPicker from 'components/custom/ColorPicker';
import {
  checkAdditionalValidationRules,
  checkDisabledDate,
  checkGoodToGo,
  constructFinalLookUpEndpoint,
  getFinalLookUpEndpoint,
  getLabelForCheckboxAndToggle,
  getPlaceholderInput,
  getRequiredIfLinkedFieldSetRule,
  minMaxCheckerForNumberField,
  NotFoundAddButton,
  NumberInputPrefix,
  ProfileImageChangeUI
} from './formHelpers';
import {
  createBraftEditorState,
  makeRegexFromLiteralNotationString
} from '../HelperElements';

const defaultDebounceTime = 700;
const DebounceInput = reactComponentDebounce({
  valuePropName: 'value',
  triggerMs: defaultDebounceTime
})(Input);
const DebounceTextArea = reactComponentDebounce({
  valuePropName: 'value',
  triggerMs: defaultDebounceTime
})(Input.TextArea);
const DebounceInputNumber = reactComponentDebounce({
  valuePropName: 'value',
  triggerMs: defaultDebounceTime
})(InputNumber);
const DebounceBraftEditor = reactComponentDebounce({
  valuePropName: 'value',
  triggerMs: defaultDebounceTime
})(BraftEditor);
const DebounceSwitch = reactComponentDebounce({
  valuePropName: 'checked',
  triggerMs: 200
})(Switch);

export const requiredStyles = { fontSize: 20, color: 'red', lineHeight: 0 };
const draftProps = { spellCheck: true };
const labelCol = { span: 24 };
const copyableFields = [];
const dateFormat = 'YYYY-MM-DD HH:mm';

BraftEditor.use(
  BraftTable({
    withDropdown: false,
    columnResizable: true,
    defaultColumns: 2,
    defaultRows: 2
  })
);
BraftEditor.use(
  ColorPicker({
    theme: 'light',
    clearButtonText: 'Clear',
    closeButtonText: 'Close'
  })
);

export const getFormFields = (
  from,
  info,
  form,
  isLastField,
  allLookupFields,
  fetchLookupData,
  initialValues,
  inputRef, // Only for inline editing form
  save, // Only for inline editing form
  toggleEdit, // Only for inline editing form
  extraData
) => {
  if (!info) return null;
  const {
    type,
    field,
    label,
    label_html,
    label_hidden,
    endpoint,
    tooltip,
    validation_regex,
    input_group_suffix,
    input_group_prefix,
    placeholder,
    linked_field_diff
  } = info;
  let { hidden, required, readonly } = info;
  const allFormFields = extraData?.fields || [];
  const requiredLinkedField = extraData?.requiredLinkedField;
  const dependentFields = extraData?.dependentFields;
  const specialFieldProps = extraData?.specialFieldProps;
  const lookupEndpointSuffix = extraData?.lookupEndpointSuffix || '';
  let formItemClassName = `${type}__${field}`;
  const _placeholder = placeholder || label;
  const selectOptionsDB = extraData?.coreData?.selectOptionsDB;
  const navigate = extraData?.coreData?.navigate;
  const setDisplayValToo = extraData?.coreData?.setDisplayValToo;
  const linked_field_diff_info = linked_field_diff
    ? allFormFields.find(x => x.field === linked_field_diff)
    : {};

  if (specialFieldProps) {
    if (specialFieldProps.hasOwnProperty('hidden')) {
      hidden = specialFieldProps.hidden;
    }
    if (specialFieldProps.hasOwnProperty('readonly')) {
      readonly = specialFieldProps.readonly;
    }
    if (specialFieldProps.hasOwnProperty('required')) {
      required = specialFieldProps.required;
    }
  }

  const validations = [];
  if (required) {
    if (type === 'text') {
      validations.push({
        whitespace: true,
        required: true,
        message: `${label} is required`
      });
    } else {
      validations.push({ required: true, message: `${label} is required` });
    }
  }

  const styles = {};
  const formItemWrapperProps = { className: formItemClassName };
  const formItemProps = {};
  const inputFieldProps = {};
  if (type === 'text' || type === 'password') {
    if (
      field.includes('public_key') ||
      field.includes('private_key') ||
      field.includes('secret_key') ||
      field.includes('password')
    ) {
      formItemProps['autoComplete'] = 'new-password';
      inputFieldProps['autoComplete'] = 'new-password';
    }
  }

  const richTextExcludeControls = ['superscript', 'code', 'subscript', 'clear'];
  let extraPrefixElement = null;

  if (tooltip) {
    formItemWrapperProps.tooltip = {
      title: tooltip,
      icon: <InfoCircleOutlined />,
      placement: 'right',
      getPopupContainer: getPopupContainer
    };
  }

  const getRequiredSign = (overrideVal = false) => {
    if (required || overrideVal) {
      return <span style={requiredStyles}>*</span>;
    } else {
      return null;
    }
  };

  // For toggle and checkbox input as they are not using default label
  const generateTooltipEl = () => {
    if (!tooltip) return null;
    return (
      <>
        &nbsp;
        <Tooltip
          title={tooltip}
          placement="right"
          getPopupContainer={getPopupContainer}
        >
          <InfoCircleOutlined />
        </Tooltip>
      </>
    );
  };

  if (type === keys.DATE_FIELD_KEY) {
    if (!isEmpty(info.range)) {
      const { min, max } = info.range;
      if (type === keys.DATE_FIELD_KEY) {
        if (min) {
          inputFieldProps.min = moment(min).format('YYYY-MM-DD');
        }
        if (max) {
          inputFieldProps.max = moment(max).format('YYYY-MM-DD');
        }
      }
    }
  }

  if (type === 'number') {
    if (!isEmpty(info.range)) {
      const { min, max } = info.range;
      if (typeof min === 'number') {
        inputFieldProps.min = min;
        validations.push({
          type: 'number',
          min,
          message: `Minimum value is ${min}`
        });
      }
      if (typeof max === 'number') {
        inputFieldProps.max = max;
        validations.push({
          type: 'number',
          max,
          message: `Maximum value is ${max}`
        });
      }
      // console.log(validations)
    }
  }

  if (
    keys.SELECT_TYPES.includes(type) ||
    type === 'lookup' ||
    type === keys.DATE_TIME_FIELD_KEY
  ) {
    inputFieldProps.getPopupContainer = getPopupContainer;
  }

  if (from === 'inline-edit' || from === 'inline-add') {
    richTextExcludeControls.push('fullscreen');

    if (from !== 'inline-add') {
      // This block for only inline edit and same things happening at InlineAddEdit.js -> toggleEdit()
      if (type === keys.DATE_FIELD_KEY && initialValues[field]) {
        // If value is not null and field type is date
        formItemProps.initialValue = moment(initialValues[field]).format(
          'YYYY-MM-DD'
        );
      } else if (type === keys.DATE_TIME_FIELD_KEY && initialValues[field]) {
        formItemProps.initialValue = moment(initialValues[field]);
      } else {
        formItemProps.initialValue = initialValues[field];
      }
    }

    styles.margin = 0;
    if (type === 'textarea-rich') {
      styles.maxWidth = '500px';
    }

    if (
      type === 'checkbox' ||
      type === 'toggle' ||
      type === 'radio' ||
      keys.SELECT_TYPES.includes(type) ||
      type === 'lookup' ||
      type === keys.DATE_FIELD_KEY ||
      type === keys.DATE_TIME_FIELD_KEY ||
      type === 'file'
    ) {
      inputFieldProps.onChange = save;
    }

    if (
      keys.SELECT_TYPES.includes(type) ||
      type === 'lookup' ||
      type === 'textarea' ||
      type === 'textarea-rich' ||
      type === 'text' ||
      type === keys.DATE_FIELD_KEY ||
      type === 'email' ||
      type === 'number'
    ) {
      inputFieldProps.onBlur = save;
    }

    if (
      type === 'textarea' ||
      type === 'text' ||
      type === 'email' ||
      type === 'number'
    ) {
      inputFieldProps.onPressEnter = save;
    }
  } else {
    // Add & Edit -> (NOT INLINE)
    if (!label_hidden && type !== 'checkbox' && type !== 'toggle') {
      const labelElement = label_html ? (
        <>
          <span dangerouslySetInnerHTML={{ __html: label_html }} />
          {getRequiredSign()}
        </>
      ) : (
        <>
          {label}
          {getRequiredSign()}
        </>
      );

      formItemWrapperProps.label = labelElement;
    }

    styles.marginBottom = 5;
    if (
      type === 'text' ||
      type === 'data' ||
      type === 'textarea' ||
      type === 'textarea-rich'
    ) {
      inputFieldProps.allowClear = true;
    }

    if (
      type === 'checkbox' ||
      type === 'toggle' ||
      type === 'radio' ||
      keys.SELECT_TYPES.includes(type) ||
      type === 'lookup' ||
      type === keys.DATE_FIELD_KEY ||
      type === keys.DATE_TIME_FIELD_KEY ||
      type === 'file'
    ) {
      inputFieldProps.onChange = async (_, _option) => {
        resetDependentFields();
        /* Other Logic */

        if (setDisplayValToo) {
          if (keys.SELECT_TYPES.includes(type) || type === 'lookup') {
            console.log('Setting up display value ->');
            console.log({ key: `${field}_display`, val: _option?.children });
            _option &&
              form.setFieldsValue({ [`${field}_display`]: _option?.children });
          }
        }
      };
    }
  }

  const resetDependentFields = () => {
    if (isEmpty(dependentFields) || !form) return;
    const fieldKeyList = dependentFields.map(x => {
      if (x.type === 'lookup') {
        if (extraData?.setLookupData) {
          extraData.setLookupData(x.field, []);
        }
      }
      return x.field;
    });
    form.resetFields(fieldKeyList);
  };

  const getTextInputSuffix = () => {
    if (field.endsWith('_color')) {
      return (
        <CustomColorPicker
          color={initialValues[field]}
          onColorSelect={value => {
            form.setFieldsValue({ [field]: value });
          }}
        />
      );
    } else {
      return null;
    }
  };

  const getTextInputAfterAddon = () => {
    if (
      copyableFields.includes(field) ||
      input_group_suffix === '(#copy_btn#)'
    ) {
      const copyText = (input_group_prefix || '') + form.getFieldValue(field);
      if (
        copyText &&
        (typeof copyText === 'string' || typeof copyText === 'number')
      ) {
        return (
          <Tooltip
            title="Copy to clipboard"
            placement="top"
            getPopupContainer={getPopupContainer}
          >
            <CopyToClipboard
              text={copyText}
              onCopy={() => message.success(`Copied '${label}'!`)}
            >
              <CopyOutlined
                style={{ marginBottom: 6, cursor: 'pointer' }}
                rotate={-180}
              />
            </CopyToClipboard>
          </Tooltip>
        );
      } else {
        return null;
      }
    } else if (input_group_suffix) {
      return (
        <div
          className="d-flex align-items-center"
          dangerouslySetInnerHTML={{ __html: input_group_suffix }}
        />
      );
    } else {
      return null;
    }
  };

  const getSpecialPopupContainer = () => {
    if (
      extraData?.havingDropdownProblem === true &&
      extraData?.originFromModal === true
    ) {
      const element = document.getElementsByClassName('ant-modal-body')[0];
      return () => element;
    } else if (extraData?.havingDropdownProblem === true) {
      return null;
    } else {
      return getPopupContainer;
    }
  };

  if (validation_regex) {
    // console.log({ validation_regex })
    const re = makeRegexFromLiteralNotationString(validation_regex);
    // console.log({ re })
    const rule = { pattern: re, message: `${label} is invalid` };

    validations.push(rule);
  }

  switch (type) {
    case 'checkbox': {
      return (
        <Form.Item
          key={field}
          shouldUpdate={true}
          style={{ ...styles }}
          {...formItemWrapperProps}
        >
          {() => {
            const goodToGo = checkGoodToGo(form, requiredLinkedField);
            if (!goodToGo)
              return getPlaceholderInput(
                requiredLinkedField,
                info,
                from,
                generateTooltipEl,
                getRequiredSign
              );
            return (
              <>
                {extraPrefixElement}
                <Form.Item
                  key={field}
                  name={field}
                  validateFirst
                  valuePropName={'checked'}
                  rules={[...validations]}
                  style={{ ...styles }}
                  hidden={hidden}
                  {...formItemProps}
                >
                  <Checkbox
                    disabled={readonly}
                    ref={inputRef}
                    {...inputFieldProps}
                  >
                    {getLabelForCheckboxAndToggle({
                      info,
                      from,
                      generateTooltipEl,
                      getRequiredSign
                    })}
                  </Checkbox>
                </Form.Item>
              </>
            );
          }}
        </Form.Item>
      );
    }

    case 'toggle': {
      return (
        <Form.Item
          key={field}
          shouldUpdate={true}
          style={{ ...styles }}
          {...formItemWrapperProps}
        >
          {() => {
            const goodToGo = checkGoodToGo(form, requiredLinkedField);
            if (!goodToGo)
              return getPlaceholderInput(
                requiredLinkedField,
                info,
                from,
                generateTooltipEl,
                getRequiredSign
              );

            const customProps = {};

            return (
              <>
                {extraPrefixElement}
                {getLabelForCheckboxAndToggle({
                  info,
                  from,
                  generateTooltipEl,
                  getRequiredSign
                })}
                <Form.Item
                  key={field}
                  name={field}
                  validateFirst
                  valuePropName={'checked'}
                  rules={[...validations]}
                  style={{ ...styles }}
                  hidden={hidden}
                  {...formItemProps}
                >
                  <DebounceSwitch
                    ref={inputRef}
                    disabled={readonly}
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    {...inputFieldProps}
                    {...customProps}
                  />
                </Form.Item>
              </>
            );
          }}
        </Form.Item>
      );
    }

    case 'checkbox-group': {
      return (
        <>
          <Form.Item
            key={field}
            shouldUpdate={true}
            labelCol={labelCol}
            style={{ ...styles }}
            {...formItemWrapperProps}
          >
            {() => {
              const goodToGo = checkGoodToGo(form, requiredLinkedField);
              if (!goodToGo) return getPlaceholderInput(requiredLinkedField);
              return (
                <>
                  {extraPrefixElement}
                  <Form.Item
                    key={field}
                    name={field}
                    validateFirst
                    rules={[...validations]}
                    style={{ ...styles }}
                    hidden={hidden}
                    {...formItemProps}
                  >
                    <Checkbox.Group
                      ref={inputRef}
                      disabled={readonly}
                      options={[]}
                      {...inputFieldProps}
                    />
                  </Form.Item>
                </>
              );
            }}
          </Form.Item>

          <Form.Item shouldUpdate={true} style={{ ...styles }}>
            {() => {
              const goodToGo = checkGoodToGo(form, requiredLinkedField);
              if (!goodToGo) return null;
              return (
                <>
                  {extraPrefixElement}
                  <Form.Item>
                    <Button size="small" type="link" ghost onClick={toggleEdit}>
                      Cancel
                    </Button>
                    <Button size="small" type="primary" ghost onClick={save}>
                      Save
                    </Button>
                  </Form.Item>
                </>
              );
            }}
          </Form.Item>
        </>
      );
    }

    case 'radio': {
      return (
        <Form.Item
          key={field}
          shouldUpdate={true}
          labelCol={labelCol}
          style={{ ...styles }}
          {...formItemWrapperProps}
        >
          {() => {
            const goodToGo = checkGoodToGo(form, requiredLinkedField);
            if (!goodToGo) return getPlaceholderInput(requiredLinkedField);
            return (
              <>
                {extraPrefixElement}
                <Form.Item
                  key={field}
                  name={field}
                  validateFirst
                  rules={[...validations]}
                  style={{ ...styles }}
                  hidden={hidden}
                  {...formItemProps}
                >
                  <Radio.Group
                    ref={inputRef}
                    disabled={readonly}
                    options={[]}
                    {...inputFieldProps}
                  />
                </Form.Item>
              </>
            );
          }}
        </Form.Item>
      );
    }

    case keys.SELECT_TYPES[0]: // 'lookup_select'
    case keys.SELECT_TYPES[1]: // 'select'
    case 'select_multi':
    case keys.FA_FIELD_TYPE: {
      let options =
        type === keys.FA_FIELD_TYPE
          ? extraData?.faIconList || []
          : selectOptionsDB?.[field] || info.select_options || [];
      return (
        <Form.Item
          key={field}
          shouldUpdate={true}
          labelCol={labelCol}
          style={{ ...styles }}
          {...formItemWrapperProps}
        >
          {() => {
            const goodToGo = checkGoodToGo(form, requiredLinkedField);
            if (!goodToGo) return getPlaceholderInput(requiredLinkedField);

            const { rules: r, props: p } = getRequiredIfLinkedFieldSetRule(
              form,
              info,
              requiredLinkedField,
              getRequiredSign
            );
            const customProps = { ...p };

            if (type === 'select_multi') {
              customProps['mode'] = 'multiple';
            }

            const OPTIONS_TO_CHOOSE =
              type === keys.FA_FIELD_TYPE
                ? options.map((icon, i) => {
                    return (
                      <Select.Option key={i} value={icon.css_class}>
                        <i className={icon.css_class} />
                        &nbsp;&nbsp;{he.decode(icon.name)}
                      </Select.Option>
                    );
                  })
                : options.map((option, index) => {
                    const { text, value, disabled } = option;
                    return (
                      <Select.Option
                        key={index}
                        value={value}
                        disabled={disabled}
                      >
                        {he.decode(text)}
                      </Select.Option>
                    );
                  });

            return (
              <>
                {extraPrefixElement}
                <Form.Item
                  key={field}
                  name={field}
                  validateFirst
                  rules={[...validations, ...r]}
                  style={{ ...styles }}
                  hidden={hidden}
                  {...formItemProps}
                >
                  <Select
                    ref={inputRef}
                    disabled={readonly}
                    placeholder={_placeholder}
                    suffixIcon={<CaretDownFilled className="caret-icon" />}
                    showSearch
                    {...inputFieldProps}
                    getPopupContainer={getSpecialPopupContainer()}
                    filterOption={
                      type === keys.FA_FIELD_TYPE
                        ? null
                        : (input, option) => {
                            // console.log(input, option)
                            const title = (
                              option?.children || ''
                            ).toLowerCase();
                            const value = (option?.value || '').toLowerCase();
                            const _input = (input || '').toLowerCase();
                            return (
                              title.includes(input) || value.includes(_input)
                            );
                          }
                    }
                    dropdownRender={originNode => <>{originNode}</>}
                    {...customProps}
                  >
                    {OPTIONS_TO_CHOOSE}
                  </Select>
                </Form.Item>
              </>
            );
          }}
        </Form.Item>
      );
    }

    case 'textarea': {
      return (
        <Form.Item
          key={field}
          shouldUpdate={true}
          labelCol={labelCol}
          style={{ ...styles }}
          {...formItemWrapperProps}
        >
          {() => {
            const goodToGo = checkGoodToGo(form, requiredLinkedField);
            if (!goodToGo) return getPlaceholderInput(requiredLinkedField);

            const { rules: r, props: p } = getRequiredIfLinkedFieldSetRule(
              form,
              info,
              requiredLinkedField,
              getRequiredSign
            );
            const customProps = { ...p };
            let validationRules = [
              ...validations,
              ...r,
              ...checkAdditionalValidationRules(
                linked_field_diff,
                field,
                form,
                {
                  cTitle: label,
                  lTitle: linked_field_diff_info?.label || ''
                }
              )
            ];

            return (
              <>
                {customProps.labelSuffix && (
                  <span
                    className="override-label-item"
                    style={{
                      marginLeft:
                        (document.querySelector(`.${formItemClassName} label`)
                          ?.offsetWidth || 0) + 1
                    }}
                  >
                    {customProps.labelSuffix}
                  </span>
                )}
                {extraPrefixElement}
                <Form.Item
                  key={field}
                  name={field}
                  validateFirst
                  rules={validationRules}
                  style={{ ...styles }}
                  hidden={hidden}
                  {...formItemProps}
                >
                  <DebounceTextArea
                    ref={inputRef}
                    disabled={readonly}
                    placeholder={_placeholder}
                    rows={
                      from === 'inline-edit' || from === 'inline-add'
                        ? 1
                        : info.rows
                        ? info.rows
                        : 4
                    }
                    {...inputFieldProps}
                    {...customProps}
                  />
                </Form.Item>
              </>
            );
          }}
        </Form.Item>
      );
    }

    case 'textarea-rich': {
      return (
        <Form.Item
          key={field}
          shouldUpdate={true}
          labelCol={labelCol}
          style={{ ...styles }}
          {...formItemWrapperProps}
        >
          {() => {
            const goodToGo = checkGoodToGo(form, requiredLinkedField);
            if (!goodToGo) return getPlaceholderInput(requiredLinkedField);
            const editorClassName = `braft-editor-form-item ${field}`;
            return (
              <>
                {extraPrefixElement}
                <Form.Item
                  key={field}
                  name={field}
                  validateFirst
                  rules={[...validations]}
                  style={{ ...styles }}
                  hidden={hidden}
                  {...formItemProps}
                >
                  <DebounceBraftEditor
                    className={editorClassName}
                    excludeControls={richTextExcludeControls}
                    language="en"
                    ref={inputRef}
                    media={{ accepts: { video: false, audio: false } }}
                    disabled={readonly}
                    placeholder={_placeholder}
                    draftProps={draftProps}
                    onFocus={() => {
                      const wrapperEl = document.querySelector(
                        `.${field} .bf-dropdown.control-item.dropdown.link-editor-dropdown`
                      );

                      const callback = mutationList => {
                        mutationList.forEach(function (mutation) {
                          if (
                            mutation.attributeName === 'class' &&
                            mutation.target?.className?.includes?.('active')
                          ) {
                            form.setFieldsValue({
                              [field]: createBraftEditorState(
                                form.getFieldValue(field) || null
                              )
                            });
                            // Link modal is open
                            const inputEl = document.querySelector(
                              `.${field} .bf-link-editor input`
                            );
                            inputEl.disabled = true;
                            inputEl.placeholder = 'Loading...';

                            setTimeout(() => {
                              inputEl.disabled = false;
                              inputEl.placeholder = 'Input Link URL';
                            }, 1700);
                          }
                        });
                      };

                      const observer = new MutationObserver(callback);
                      const options = { attributes: true };
                      observer.observe(wrapperEl, options);
                    }}
                    {...inputFieldProps}
                  />
                </Form.Item>
              </>
            );
          }}
        </Form.Item>
      );
    }

    case 'number': {
      return (
        <Form.Item
          key={field}
          shouldUpdate={true}
          labelCol={labelCol}
          style={{ ...styles }}
          className={formItemClassName}
          {...formItemWrapperProps}
        >
          {() => {
            const goodToGo = checkGoodToGo(form, requiredLinkedField);
            if (!goodToGo) return getPlaceholderInput(requiredLinkedField);
            const { rules: r, props: p } = getRequiredIfLinkedFieldSetRule(
              form,
              info,
              requiredLinkedField,
              getRequiredSign
            );
            const customProps = { ...p };
            let validationRules = [
              ...validations,
              ...r,
              ...checkAdditionalValidationRules(
                linked_field_diff,
                field,
                form,
                {
                  cTitle: label,
                  lTitle: linked_field_diff_info?.label || ''
                }
              ),
              ...minMaxCheckerForNumberField(field, info.range, form)
            ];

            if (customProps.disabled === true) {
              validationRules = [];
            }

            // console.log(field, customProps)
            // console.log(field, { validationRules })

            return (
              <>
                {customProps.labelSuffix && (
                  <span
                    className="override-label-item"
                    style={{
                      marginLeft:
                        (document.querySelector(`.${formItemClassName} label`)
                          ?.offsetWidth || 0) + 1
                    }}
                  >
                    {customProps.labelSuffix}
                  </span>
                )}
                {extraPrefixElement}
                <Row style={{ ...styles }}>
                  {input_group_prefix && (
                    <NumberInputPrefix
                      className="d-flex align-items-center"
                      dangerouslySetInnerHTML={{ __html: input_group_prefix }}
                    />
                  )}
                  <Form.Item
                    key={field}
                    name={field}
                    validateFirst
                    rules={validationRules}
                    style={{ ...styles, flex: 1 }}
                    hidden={hidden}
                    {...formItemProps}
                  >
                    <DebounceInputNumber
                      ref={inputRef}
                      disabled={readonly}
                      placeholder={_placeholder}
                      style={{ width: '100%' }}
                      {...inputFieldProps}
                      {...customProps}
                    />
                  </Form.Item>
                </Row>
              </>
            );
          }}
        </Form.Item>
      );
    }

    case 'lookup': {
      const { lookupQuery, lookupLoading, lookupData, module } =
        allLookupFields[field] || {};
      let finalLookupData = lookupData || [];
      // console.log({ module })
      if (
        (from === 'edit' || from === 'inline-edit') &&
        Object.keys(initialValues).length > 0
      ) {
        const fieldName = `${field}_display`;
        const text = initialValues.hasOwnProperty(fieldName)
          ? initialValues[fieldName]
          : initialValues[field];
        const value = initialValues[field];
        if (
          value !== undefined &&
          text !== undefined &&
          value !== null &&
          text !== null
        ) {
          const current = { text, value };
          if (finalLookupData.length === 0) {
            finalLookupData.push(current);
          } else {
            const item = finalLookupData.find(x => x.value === value);
            if (!item) {
              finalLookupData.push(current);
            }
          }
        }
      }

      const getEndpoint = () => {
        const valuesToConstructLookupEndpoint =
          extraData?.valuesToConstructLookupEndpoint || {};
        let finalEndpoint = constructFinalLookUpEndpoint(
          endpoint || '',
          valuesToConstructLookupEndpoint
        );
        if (!isEmpty(requiredLinkedField) && form && endpoint) {
          finalEndpoint = getFinalLookUpEndpoint(
            endpoint,
            form,
            requiredLinkedField
          );
        }
        return finalEndpoint;
      };

      const handleSearch = value => {
        const finalEndpoint = getEndpoint();
        fetchLookupData(field, value, finalEndpoint);
      };

      const { rules: r, props: p } = getRequiredIfLinkedFieldSetRule(
        form,
        info,
        requiredLinkedField,
        getRequiredSign
      );
      const customProps = { ...p };

      return (
        <Form.Item key={field} shouldUpdate={true} noStyle>
          {() => {
            return (
              <Form.Item
                key={field}
                shouldUpdate={true}
                labelCol={labelCol}
                style={{ ...styles }}
                {...formItemWrapperProps}
              >
                {() => {
                  const goodToGo = checkGoodToGo(form, requiredLinkedField);
                  if (!goodToGo)
                    return getPlaceholderInput(requiredLinkedField);

                  const getNotFoundAddButton = () => {
                    const oProps = {};

                    return (
                      <NotFoundAddButton
                        navigate={navigate}
                        lookupEndpointSuffix={lookupEndpointSuffix}
                        module_name={module}
                        {...oProps}
                      />
                    );
                  };

                  const lookupFieldAdditionalOptions =
                    store.getState().currentData
                      ?.lookupFieldAdditionalOptions || {};
                  const additionalOptions =
                    lookupFieldAdditionalOptions[field] || [];

                  const getSelectOptions = _options => {
                    return _options.map((option, index) => {
                      const { text, value, disabled } = option;
                      return (
                        <Select.Option
                          key={index + value.toString()}
                          value={value}
                          disabled={disabled}
                        >
                          {he.decode(text)}
                        </Select.Option>
                      );
                    });
                  };

                  return (
                    <>
                      {extraPrefixElement}
                      <Form.Item
                        key={field}
                        name={field}
                        validateFirst
                        rules={[...validations, ...r]}
                        style={{ ...styles }}
                        hidden={hidden}
                        {...formItemProps}
                      >
                        <Select
                          className="app-lookup-select-input"
                          ref={inputRef}
                          disabled={readonly}
                          placeholder={placeholder || `Search for ${label}`}
                          suffixIcon={
                            isEmpty(finalLookupData) &&
                            isEmpty(additionalOptions) ? (
                              <span />
                            ) : (
                              <CaretDownFilled className="caret-icon" />
                            )
                          }
                          showSearch
                          allowClear
                          onSearch={handleSearch}
                          filterOption={(input, option) => {
                            if (type === 'lookup') {
                              return true; // Local filter disabled
                            } else {
                              return (
                                option?.children
                                  ?.toLowerCase?.()
                                  .indexOf?.(input?.toLowerCase?.()) >= 0
                              );
                            }
                          }}
                          notFoundContent={
                            lookupLoading ? (
                              <span className="d-block d-flex justify-content-center">
                                <Spin size="small" />
                              </span>
                            ) : lookupQuery ? (
                              <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                  <>
                                    <span>No match found.</span>
                                    <br />
                                    {getNotFoundAddButton()}
                                  </>
                                }
                              />
                            ) : null
                          }
                          {...inputFieldProps}
                          getPopupContainer={getSpecialPopupContainer()}
                          {...customProps}
                        >
                          {getSelectOptions(finalLookupData)}
                          {getSelectOptions(additionalOptions)}
                        </Select>
                      </Form.Item>
                    </>
                  );
                }}
              </Form.Item>
            );
          }}
        </Form.Item>
      );
    }

    case 'file': {
      return (
        <Form.Item
          key={field}
          shouldUpdate={true}
          labelCol={labelCol}
          style={{ ...styles }}
          {...formItemWrapperProps}
        >
          {() => {
            const goodToGo = checkGoodToGo(form, requiredLinkedField);
            if (!goodToGo) return getPlaceholderInput(requiredLinkedField);

            if (
              (extraData?.isProfileAction === true ||
                extraData?.closeToProfileAction === true) &&
              field === 'imageFILE'
            ) {
              return (
                <ProfileImageChangeUI
                  extraData={extraData}
                  isProfileImage={extraData?.isProfileAction === true} // Means my profile image not the team
                />
              );
            }

            return (
              <>
                {extraPrefixElement}
                <Form.Item
                  key={field}
                  name={field}
                  rules={[...validations]}
                  hasFeedback={true}
                  validateFirst
                  style={{ ...styles }}
                  hidden={hidden}
                  valuePropName="uncontrolled-input"
                  getValueFromEvent={e => {
                    e.persist();
                    return e.target.files?.[0];
                  }}
                  {...formItemProps}
                >
                  <Input
                    className="antd-custom-file-input"
                    ref={inputRef}
                    disabled={readonly}
                    placeholder={_placeholder}
                    type={type}
                    {...inputFieldProps}
                  />
                </Form.Item>
              </>
            );
          }}
        </Form.Item>
      );
    }

    case keys.DATE_TIME_FIELD_KEY: {
      return (
        <Form.Item
          key={field}
          shouldUpdate={true}
          labelCol={labelCol}
          style={{ ...styles, width: '100%' }}
          {...formItemWrapperProps}
        >
          {() => {
            const goodToGo = checkGoodToGo(form, requiredLinkedField);
            if (!goodToGo) return getPlaceholderInput(requiredLinkedField);
            if (readonly)
              return (
                <Input placeholder={initialValues[field]} disabled={true} />
              );

            return (
              <>
                {extraPrefixElement}
                <Form.Item
                  key={field}
                  name={field}
                  rules={[...validations]}
                  hasFeedback={true}
                  validateFirst
                  style={{ ...styles, width: '100%' }}
                  hidden={hidden}
                  {...formItemProps}
                >
                  <DatePicker
                    format={dateFormat}
                    showTime={{ format: 'HH:mm' }}
                    ref={inputRef}
                    disabled={readonly}
                    placeholder={_placeholder}
                    style={{ width: '100%' }}
                    disabledDate={current =>
                      checkDisabledDate(current, info?.range, form)
                    }
                    {...inputFieldProps}
                  />
                </Form.Item>
              </>
            );
          }}
        </Form.Item>
      );
    }

    case 'hidden': {
      return null;
    }

    case 'custom': {
      if (field === 'answers') {
        const getColourPicker = fieldName => {
          return (
            <CustomColorPicker
              color={initialValues[fieldName] || '#000000'}
              onColorSelect={val => {
                form.setFieldsValue({ [fieldName]: val });
              }}
            />
          );
        };

        const otherProps = {};
        if (from === 'add') {
          otherProps.initialValue = '#000000';
        }

        const getInputEl = n => {
          const n1 = n + 1;
          const fieldName = `color${
            n1.toString().length === 1 ? `0${n1}` : n1
          }`;

          return (
            <Row>
              <div style={{ display: 'none' }}>
                <Form.Item
                  noStyle
                  name={fieldName}
                  style={{ display: 'none' }}
                  {...otherProps}
                >
                  <Input allowClear type="hidden" />
                </Form.Item>
              </div>
              <Col style={{ width: 105 }} />
              <Col flex={1}>
                <Form.Item
                  shouldUpdate={true}
                  colon={false}
                  label={null}
                  name={['answers', n]}
                >
                  <Input allowClear suffix={getColourPicker(fieldName)} />
                </Form.Item>
              </Col>
            </Row>
          );
        };

        return (
          <>
            <div style={{ display: 'none' }}>
              <Form.Item
                noStyle
                name={`color01`}
                style={{ display: 'none' }}
                {...otherProps}
              >
                <Input allowClear type="hidden" />
              </Form.Item>
            </div>
            <Form.Item
              shouldUpdate={true}
              label="Poll Answers"
              name={['answers', 0]}
              rules={[
                { required: true, message: `One poll answer is required.` }
              ]}
            >
              <Input allowClear suffix={getColourPicker(`color01`)} />
            </Form.Item>
            {getInputEl(1)}
            {getInputEl(2)}
            {getInputEl(3)}
            {getInputEl(4)}
            {getInputEl(5)}
            {getInputEl(6)}
            {getInputEl(7)}
            {getInputEl(8)}
            {getInputEl(9)}
          </>
        );
      } else {
        return null;
      }
    }

    case 'plugin_table': {
      if (from === 'add' || from === 'edit') {
        return (
          <Form.Item
            key={field}
            shouldUpdate={true}
            labelCol={labelCol}
            style={{ ...styles, width: '100%' }}
            {...formItemWrapperProps}
          >
            {() => {
              const goodToGo = checkGoodToGo(form, requiredLinkedField);
              if (!goodToGo) return getPlaceholderInput(requiredLinkedField);
              const initValue = initialValues[field];

              return (
                <>
                  {extraPrefixElement}
                  <PluginTableFormField
                    fieldData={info}
                    form={form}
                    initValue={initValue}
                    refetchData={
                      extraData?.refetchData ? extraData?.refetchData : () => {}
                    }
                    allData={initialValues}
                    updatePluginData={extraData?.setPluginData}
                    extraData={extraData || {}}
                  />
                </>
              );
            }}
          </Form.Item>
        );
      } else {
        return null;
      }
    }

    case 'password': {
      return (
        <Form.Item
          key={field}
          shouldUpdate={true}
          labelCol={labelCol}
          style={{ ...styles, width: '100%' }}
          {...formItemWrapperProps}
        >
          {() => {
            const goodToGo = checkGoodToGo(form, requiredLinkedField);
            if (!goodToGo) return getPlaceholderInput(requiredLinkedField);
            return (
              <>
                {extraPrefixElement}
                <Form.Item
                  key={field}
                  name={field}
                  rules={[
                    ...validations,
                    ...checkAdditionalValidationRules(
                      linked_field_diff,
                      field,
                      form,
                      {
                        cTitle: label,
                        lTitle: linked_field_diff_info?.label || ''
                      }
                    )
                  ]}
                  hasFeedback={copyableFields.includes(field) ? false : true}
                  validateFirst
                  style={{ ...styles, width: '100%' }}
                  hidden={hidden}
                  {...formItemProps}
                >
                  <Input.Password
                    ref={inputRef}
                    disabled={readonly}
                    placeholder={_placeholder}
                    type={type}
                    addonBefore={
                      input_group_prefix && (
                        <div
                          className="d-flex align-items-center"
                          dangerouslySetInnerHTML={{
                            __html: input_group_prefix
                          }}
                        />
                      )
                    }
                    addonAfter={getTextInputAfterAddon()}
                    suffix={getTextInputSuffix()}
                    {...inputFieldProps}
                  />
                </Form.Item>
              </>
            );
          }}
        </Form.Item>
      );
    }

    default: {
      return (
        <Form.Item
          key={field}
          shouldUpdate={true}
          labelCol={labelCol}
          style={{ ...styles, width: '100%' }}
          {...formItemWrapperProps}
        >
          {() => {
            const goodToGo = checkGoodToGo(form, requiredLinkedField);
            if (!goodToGo) return getPlaceholderInput(requiredLinkedField);

            const { rules: r, props: p } = getRequiredIfLinkedFieldSetRule(
              form,
              info,
              requiredLinkedField,
              getRequiredSign
            );
            const customProps = { ...p };
            let validationRules = [
              ...validations,
              ...r,
              ...checkAdditionalValidationRules(
                linked_field_diff,
                field,
                form,
                {
                  cTitle: label,
                  lTitle: linked_field_diff_info?.label || ''
                }
              )
            ];

            return (
              <>
                {customProps.labelSuffix && (
                  <span
                    className="override-label-item"
                    style={{
                      marginLeft:
                        (document.querySelector(`.${formItemClassName} label`)
                          ?.offsetWidth || 0) + 1
                    }}
                  >
                    {customProps.labelSuffix}
                  </span>
                )}
                {extraPrefixElement}
                <Form.Item
                  key={field}
                  name={field}
                  rules={validationRules}
                  hasFeedback={copyableFields.includes(field) ? false : true}
                  validateFirst
                  style={{ ...styles, width: '100%' }}
                  hidden={hidden}
                  {...formItemProps}
                >
                  <DebounceInput
                    ref={inputRef}
                    disabled={readonly}
                    placeholder={_placeholder}
                    type={type}
                    addonBefore={
                      input_group_prefix && (
                        <div
                          className="d-flex align-items-center"
                          dangerouslySetInnerHTML={{
                            __html: input_group_prefix
                          }}
                        />
                      )
                    }
                    addonAfter={getTextInputAfterAddon()}
                    suffix={getTextInputSuffix()}
                    {...inputFieldProps}
                    {...customProps}
                  />
                </Form.Item>
              </>
            );
          }}
        </Form.Item>
      );
    }
  }
};

export default getFormFields;
