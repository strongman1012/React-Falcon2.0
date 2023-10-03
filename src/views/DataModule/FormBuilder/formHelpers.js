import React from 'react';
import axios from 'axios';
import moment from 'moment';
import shortid from 'shortid';
import styled from 'styled-components';
import { Input, Button, Row } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

import vars from 'utils/vars';
import keys from 'utils/keys';
import endpoint from 'utils/endpoint';
import { isEmpty } from 'helpers/utils';
import ImageChangeButton from 'components/custom/ImageChangeButton';

export const ProfileImageChangeUI = props => {
  const { isProfileImage } = props;
  const _isMounted = React.useRef(false);
  const [renderKey, setRenderKey] = React.useState(shortid.generate());

  React.useEffect(() => {
    _isMounted.current = true;
    return () => {
      _isMounted.current = false;
    };
  }, []);

  const {
    imageValueEditComponent,
    onEditCallback,
    coreData = {}
  } = props.extraData || {};
  // const notMobile = extraData?.screens?.xs === false
  const styles = { flexDirection: 'column' };
  return (
    <Row justify={'center'} align="middle" style={styles} key={renderKey}>
      <div className="mr-2">{imageValueEditComponent}</div>
      <div className="mt-1">
        <ImageChangeButton
          onFinish={data => {
            onEditCallback(data);
            _isMounted.current && setRenderKey(shortid.generate());
          }}
          isProfileImage={isProfileImage}
          {...coreData}
        />
      </div>
    </Row>
  );
};

export function NotFoundAddButton(props) {
  const {
    module_name,
    lookupEndpointSuffix,
    callback,
    direct = false,
    navigate
  } = props;

  const _isMounted = React.useRef(false);
  const [loading, setLoading] = React.useState(false);
  const [schema, setSchema] = React.useState(null);

  React.useEffect(() => {
    _isMounted.current = true;
    getData();
    return () => {
      _isMounted.current = false;
    };
  }, []);

  const getData = async () => {
    if (!module_name || direct) return null;
    try {
      _isMounted.current && setLoading(true);
      const ep = endpoint.getDataModuleSchemaEndpoint(
        module_name,
        keys.DATA_ADD_ACTION
      );
      const moduleSchemaRes = await axios.get(ep);
      console.log(module_name + ' View Schema: ', moduleSchemaRes.data);
      _isMounted.current && setSchema(moduleSchemaRes.data);
    } catch (error) {
      console.log('No permission to add.');
    } finally {
      _isMounted.current && setLoading(false);
    }
  };

  const content = (
    <>
      <Button
        size="small"
        className="mt-2"
        icon={<PlusCircleOutlined />}
        onClick={() => {
          if (callback) return callback();
          let suffix = '';
          if (lookupEndpointSuffix) {
            if (lookupEndpointSuffix.startsWith('&')) {
              suffix = lookupEndpointSuffix.replace('&', '?');
            } else if (lookupEndpointSuffix.startsWith('/')) {
              suffix = lookupEndpointSuffix.replace('/', '?');
            } else if (!lookupEndpointSuffix.startsWith('?')) {
              suffix = `?${lookupEndpointSuffix}`;
            }
          }
          navigate(
            `/data/${module_name}/${keys.DATA_ADD_ACTION}${suffix}${
              suffix ? '&__passQueryVars=1' : ''
            }`
          );
        }}
      >
        Add New
      </Button>
    </>
  );

  if (loading) return 'Checking permission...';
  if (!module_name) return null;
  if (direct) return content;
  if (!schema || isEmpty(schema)) return null;

  return content;
}

export const NumberInputPrefix = styled.div`
  height: 32px;
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-right: none;
  border-bottom-left-radius: 2px;
  border-top-left-radius: 2px !important;
  background: #fff;
  color: ${vars.PRIMARY_COLOR};
`;

export const disableAddFormSubmit = value => {
  const button = document.getElementById(keys.ADD_FORM_SUBMIT_BUTTON);
  if (button) {
    button.disabled = value;
    if (value === true) {
      button.style.opacity = 0.5;
      button.style.pointerEvents = 'none';
    } else {
      button.style.opacity = 1;
      button.style.pointerEvents = 'auto';
    }
  }
};

export const disableEnableElement = (selector = '', value = true) => {
  const el = document.querySelector(selector);
  if (el) {
    const parent = el?.parentNode;
    el.disabled = value;
    if (value === true) {
      el.style.opacity = 0.7;
      el.style.pointerEvents = 'none';
      if (parent) parent.style.cursor = 'not-allowed';
    } else {
      el.style.opacity = 1;
      el.style.pointerEvents = 'auto';
      if (parent) parent.style.cursor = 'auto';
    }
  }
};

export const checkAdditionalValidationRules = (
  linkedField,
  currentField,
  form,
  others = {}
) => {
  if (!linkedField || !currentField || !form) return [];

  const { cTitle, lTitle } = others;

  return [
    ({ getFieldValue }) => {
      return {
        validator(_, value) {
          let lVal = value;
          let cVal = getFieldValue(linkedField);
          if (lVal === null || lVal === undefined || lVal === '')
            return Promise.resolve();
          if (cVal === null || cVal === undefined || cVal === '')
            return Promise.resolve();

          lVal = String(lVal).trim();
          cVal = String(cVal).trim();

          if (lVal !== cVal) return Promise.resolve();

          return Promise.reject(
            new Error(`${cTitle} cannot be the same as ${lTitle}`)
          );
        }
      };
    }
  ];
};

export const minMaxCheckerForNumberField = (fieldName, range, form) => {
  if (!fieldName) return [];
  const { min_linked_field, max_linked_field } = range || {};
  if (!max_linked_field && !min_linked_field) return [];
  const currentVal = form.getFieldValue(fieldName);
  if (currentVal === null || currentVal === undefined) return [];
  const maxVal = max_linked_field && form.getFieldValue(max_linked_field);
  const minVal = min_linked_field && form.getFieldValue(min_linked_field);
  if (
    maxVal === null &&
    maxVal === undefined &&
    minVal === null &&
    minVal === undefined
  ) {
    return [];
  }

  let rules = [];
  if (maxVal !== null && maxVal !== undefined) {
    if (currentVal > maxVal) {
      rules.push({
        type: 'number',
        min: maxVal,
        message: `Maximum value is ${maxVal}`
      });
    }
  }
  if (minVal !== null && minVal !== undefined) {
    if (currentVal < minVal) {
      rules.push({
        type: 'number',
        min: minVal,
        message: `Minimum value is ${minVal}`
      });
    }
  }

  return rules;
};

export const getLabelForCheckboxAndToggle = ({
  info,
  from,
  generateTooltipEl,
  getRequiredSign
}) => {
  if (isEmpty(info) || isEmpty(from)) return null;
  const { type, label_hidden, label_html, label } = info;
  if (type === 'checkbox') {
    return (
      !label_hidden && (
        <span className="d-flex align-items-center">
          {label_html ? (
            <>
              <span dangerouslySetInnerHTML={{ __html: label_html }} />
              {getRequiredSign()}
            </>
          ) : (
            <>
              {label}
              {getRequiredSign()}
            </>
          )}
          {generateTooltipEl()}
        </span>
      )
    );
  } else if (type === 'toggle') {
    return (
      !label_hidden &&
      (from === 'edit' || from === 'add') && (
        <label className="" title={label} style={{ marginBottom: 4 }}>
          <span className="d-flex align-items-center">
            {label_html ? (
              <>
                <span dangerouslySetInnerHTML={{ __html: label_html }} />
                {getRequiredSign()}
              </>
            ) : (
              <>
                {label}
                {getRequiredSign()}
              </>
            )}
            {generateTooltipEl()}
          </span>
        </label>
      )
    );
  } else {
    return null;
  }
};

export const getPlaceholderInput = (
  linkedFieldData,
  info,
  from,
  generateTooltipEl,
  getRequiredSign
) => {
  let placeholder = 'First provide required linked field value';
  if (linkedFieldData) {
    const { label, type } = linkedFieldData;
    if (keys.SELECT_TYPES.includes(type) || type === 'lookup') {
      placeholder = `Select ${label}...`;
    } else {
      placeholder = `${label} required!`;
    }
  }
  return (
    <>
      {getLabelForCheckboxAndToggle({
        info,
        from,
        generateTooltipEl,
        getRequiredSign
      })}
      <Input placeholder={placeholder} disabled={true} />
    </>
  );
};

export const checkGoodToGo = (form, linkedFieldData) => {
  let goodToGo = true;
  if (!form || isEmpty(linkedFieldData)) return goodToGo;
  const { field } = linkedFieldData;
  const fieldError = form.getFieldError(field);
  const fieldValue = form.getFieldValue(field);
  // console.log({ fieldError, fieldValue })
  if (!isEmpty(fieldError)) {
    goodToGo = false;
  } else if (typeof fieldValue === 'boolean' && fieldValue === false) {
    goodToGo = false;
  } else if (isEmpty(fieldValue)) {
    goodToGo = false;
  }
  return goodToGo;
};

export const getRequiredIfLinkedFieldSetRule = (
  form,
  fieldData,
  linkedFieldData,
  getRequiredSign
) => {
  let rules = [];
  let props = {};
  if (!form || isEmpty(linkedFieldData) || isEmpty(fieldData))
    return { rules, props };
  const { label, required_if_linked_field_set } = fieldData;
  if (!required_if_linked_field_set) return { rules, props };
  const { field: linkedField } = linkedFieldData;
  const fieldError = form.getFieldError(linkedField);
  const fieldValue = form.getFieldValue(linkedField);
  const requiredRule = { required: true, message: `${label} is required` };
  // console.log({ fieldError, fieldValue })
  if (!isEmpty(fieldError)) {
    rules = [];
  } else if (typeof fieldValue === 'boolean' && fieldValue === true) {
    rules = [requiredRule];
    props['required'] = true;
    props['labelSuffix'] = getRequiredSign(true);
  } else if (!isEmpty(fieldValue)) {
    rules = [requiredRule];
    props['required'] = true;
    props['labelSuffix'] = getRequiredSign(true);
  }
  return { rules, props };
};

export const constructFinalLookUpEndpoint = (endpoint, keyValuePair = {}) => {
  for (const property in keyValuePair) {
    if (endpoint.includes(`:${property}`)) {
      endpoint = endpoint.replace(`:${property}`, keyValuePair[property]);
    }
  }
  // console.log({ endpoint })
  return endpoint;
};

export const getFinalLookUpEndpoint = (endpoint, form, requiredLinkedField) => {
  const fieldKey = requiredLinkedField.field;
  // console.log({ fieldKey })
  const fieldValue = form.getFieldValue(fieldKey);
  // console.log({ fieldValue })
  if (isEmpty(fieldValue)) return endpoint;
  const finalEndpoint = endpoint.replace(`:${fieldKey}`, fieldValue);
  // console.log(endpoint, ' => ', finalEndpoint)
  return finalEndpoint;
};

export const minMaxChecker = (current, range, form) => {
  const { min_linked_field, max_linked_field } = range;
  if (!max_linked_field && !min_linked_field) return false;

  const maxVal = max_linked_field && form.getFieldValue(max_linked_field);
  const minVal = min_linked_field && form.getFieldValue(min_linked_field);
  // console.log({ minVal, maxVal })
  if (minVal && maxVal) {
    return (
      current &&
      current.isBefore(moment(minVal)) &&
      current.isAfter(moment(maxVal))
    );
  } else if (minVal && !maxVal) {
    return current && current.isBefore(moment(minVal));
  } else if (maxVal && !minVal) {
    return current && current.isAfter(moment(maxVal));
  } else {
    return false;
  }
};

export const checkDisabledDate = (current, range, form) => {
  if (isEmpty(range)) return false;
  const { min, max } = range;
  if (min & max) {
    // console.log('1')
    return (
      current &&
      ((current.isBefore(moment(min)) && current.isAfter(moment(max))) ||
        minMaxChecker(current, range, form))
    );
  } else if (max && !min) {
    // console.log('2')
    return (
      current &&
      (current.isAfter(moment(max)) || minMaxChecker(current, range, form))
    );
  } else if (min && !max) {
    // console.log('3')
    return (
      current &&
      (current.isBefore(moment(min)) || minMaxChecker(current, range, form))
    );
  } else {
    // console.log('4')
    return minMaxChecker(current, range, form);
  }
};
