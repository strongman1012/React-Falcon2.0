import axios from 'axios';
import moment from 'moment';
import debounce from 'lodash/debounce';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Row, Col, Form, message, Popconfirm, Button } from 'antd';
import { PlusCircleOutlined, SaveOutlined } from '@ant-design/icons';

import keys from 'utils/keys';
import endpoint from 'utils/endpoint';
import handleError from 'utils/handleError';
import Skeleton from 'components/loading/Skeleton';
import getFormsField from '../FormBuilder/getFormsField';
import NoPermission from 'components/custom/NoPermission';
import {
  createBraftEditorState,
  getFileObjForAjax,
  getGridUtils,
  isNewFileSelected,
  removeAttribute
} from 'views/DataModule/HelperElements';
import {
  checkHasPermission,
  cleanAndAdjustData,
  getAllQueryVariables,
  getBase64,
  getCols,
  isEmpty
} from 'helpers/utils';

const defaultFinishGoToListModules = [];
const customHiddenFields = [];

function DataModuleAddComponent(props) {
  const navigate = useNavigate();
  const {
    showInnerChildren = false,
    onFinishGoToView = true,
    onFinishGoToViewlist = false,
    onSubmitJustReturnTheData = false,
    onFinishCallback,
    initialFormValues = {},
    defaultFormStyles = { minHeight: 300 },
    defaultValues = {},
    valuesToConstructLookupEndpoint = {},
    excludeFields = [],
    lookupEndpointSuffix = '',
    submitBtnLookAsSave = false,
    POST_ENDPOINT,
    successMessage = 'Data added successfully!',
    submitBtnTxt = 'Create',
    gridStyles = {},
    submitBtnLeftElements = null,
    submitBtnRightElements = null,
    deleteBtnReplacement = null,
    originFromModal = false,
    needToCheckPermission = true,
    isParentSubmitting = false,
    submitWithConfirm,
    submitBtnIcon = <PlusCircleOutlined />,
    directProps = {},
    isParentSubmitDisabled = false,
    elementBeforeSubmitButton = null,
    submitRowJustifyValue = 'space-between',
    defaultDeleteBtnReplacement = <div />,
    submitRowClassName = '',
    setDisplayValToo = false
  } = props;

  let { checkSubmitBtnShouldDisable = true } = props;
  const userIsAdmin = useSelector(
    state => state.auth?.user?.permissions?.admin
  );
  const userPermissions = useSelector(state => state.auth?.user?.permissions);
  const queryVars = getAllQueryVariables(window.location.search);
  const preload_id = queryVars?.preload_id;
  const copyYN = queryVars?.copyYN;
  const [form] = Form.useForm();
  const _isMounted = React.useRef(false);
  const [, forceUpdate] = useState();
  const [faIconList, setFAIconList] = React.useState([]);
  const [allLookupFields, setAllLookupFields] = useState({});
  const [allPluginFields, setAllPluginFields] = useState({});
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingPreloadData, setLoadingPreloadData] = useState(true);
  const [preloadData, setPreloadData] = useState({});
  const [selectOptionsDB, setSelectOptionsDB] = useState({}); // For field type 'lookup_select'
  const fields = props.fields.filter(
    x => !x.hidden && !excludeFields.includes(x.field)
  );
  const hasAddPermission = needToCheckPermission
    ? checkHasPermission(keys.ADD_PERMISSIONS_KEY, null, props.permissions)
    : true;

  // To disable submit button at the beginning.
  useEffect(() => {
    _isMounted.current = true;
    if (!hasAddPermission) return noPermission('add');

    forceUpdate({});
    getPreloadData();

    const pluginFields = {};
    fields.forEach(x => {
      if (x.type === 'plugin_table') {
        pluginFields[x.field] = [];
      }
    });
    setAllPluginFields(pluginFields);

    setTimeout(() => {
      removeAttribute();
      removeAttribute('ant-form-item-control-input-content');
    }, 5000);

    return () => {
      _isMounted.current = false;
    };
  }, []);

  const noPermission = type =>
    message.warning(`You don't have permission to ${type}.`);

  const getPreloadData = async () => {
    if (!preload_id) {
      _isMounted.current && setLoadingPreloadData(false);
      return initLookupFields();
    }

    const hide = message.loading('Loading preload data...', 0);
    let directPreloadData = {};
    try {
      _isMounted.current && setLoadingPreloadData(true);
      const { module } = props;
      const ep = endpoint.getDataItemViewEndpoint(module, preload_id);
      const dataItemRes = await axios.get(ep);
      const itemData = dataItemRes.data || {};
      console.log('Data item view response:', itemData);
      delete itemData._id;
      // If other url param is passed and matches a field on the form, it will take preference
      for (let key of Object.keys(queryVars)) {
        itemData[key] = queryVars[key];
      }

      _isMounted.current && setPreloadData(itemData);
      directPreloadData = itemData;
    } catch (error) {
      handleError(error, true);
    } finally {
      hide();
      _isMounted.current && setLoadingPreloadData(false);
      initLookupFields(directPreloadData);
    }
  };

  const parseDateDefaultVal = value => {
    return value === 'now' ? undefined : value;
  };

  const getInitialValues = source => {
    const initValues = {};

    fields.forEach(x => {
      const isOkay = !isEmpty(source)
        ? true
        : x.hasOwnProperty('default_value') &&
          x.default_value !== null &&
          x.default_value !== undefined;

      if (isOkay) {
        const type = x.type;
        const field = x.field;
        const value = source ? source[field] : x.default_value;

        if (type === 'date') {
          initValues[field] = value
            ? moment(parseDateDefaultVal(value, type)).format('YYYY-MM-DD')
            : value;
        } else if (type === 'datetime') {
          initValues[field] = value
            ? moment(parseDateDefaultVal(value, type))
            : value;
        } else if (type === 'textarea-rich') {
          const val =
            value === '<p></p>' ? value.replace('<p></p>', '') : value;
          initValues[field] = createBraftEditorState(val);
        } else if (type === 'textarea') {
          const val =
            value === '<p></p>' ? value.replace('<p></p>', '') : value;
          initValues[field] = val;
        } else {
          initValues[field] = value;
        }
      }
    });

    if (source || !isEmpty(initValues)) {
      checkSubmitBtnShouldDisable = false;
    }

    return initValues;
  };

  const initLookupFields = async (directPreloadData = {}) => {
    const queryVarsKeyList = queryVars ? Object.keys(queryVars) : [];
    const lookupFields = {};
    const needImmediateLookup = [];

    fields
      .filter(x => x.type === 'lookup')
      .forEach(x => {
        const key = x.field;
        lookupFields[key] = { ...x, lookupQuery: '', lookupData: [] };
        if (
          queryVarsKeyList.includes(key) ||
          directPreloadData.hasOwnProperty(key)
        ) {
          lookupFields[key].lookupLoading = true;
          needImmediateLookup.push(key);
        } else {
          lookupFields[key].lookupLoading = false;
        }
      });

    setAllLookupFields(lookupFields); // For backup if any ajax req goes wrong

    try {
      _isMounted.current && setLoading(true);

      for (const lookupFieldKey of needImmediateLookup) {
        const ep = endpoint.getLookupEndpoint(
          lookupFields[lookupFieldKey].endpoint +
            `&_id=${
              queryVars[lookupFieldKey] || directPreloadData[lookupFieldKey]
            }` +
            lookupEndpointSuffix
        );
        console.log(`Initial '${lookupFieldKey}' lookup endpoint:`, ep);
        const res = await axios.get(ep);
        console.log(`Initial '${lookupFieldKey}' lookup response:`, res.data);
        const lookupFieldData = {
          ...lookupFields[lookupFieldKey],
          lookupLoading: false,
          lookupData: res.data.list
        };
        lookupFields[lookupFieldKey] = lookupFieldData;
      }

      for (const field of fields) {
        if (field.type === 'lookup_select') {
          let ep = endpoint.getLookupEndpoint(field.endpoint);
          const res = await axios.get(ep);
          console.log(
            `LABEL: ${field.label} TYPE: '${field.type}' response:`,
            res.data
          );
          const list = res.data?.list || [];
          setSelectOptionsDB(prevData => {
            return { ...prevData, [field.field]: list };
          });
        }
      }

      _isMounted.current && setAllLookupFields(lookupFields);

      let has_FA_Field = false;
      fields.forEach(x => {
        if (x.type === keys.FA_FIELD_TYPE) {
          has_FA_Field = true;
        }
      });

      if (has_FA_Field) {
        const iconsReq = await axios.get(endpoint.fontAwesomeIcons);
        const iconsData = iconsReq.data;
        console.log('Icons Response: ', iconsData);
        _isMounted.current && setFAIconList(iconsData);
      }
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoading(false);
    }
  };

  const setLookupData = (lookupFieldKey, data = []) => {
    if (!lookupFieldKey) return;
    const current = allLookupFields[lookupFieldKey];
    if (isEmpty(current?.lookupData)) return;
    current.lookupData = data;
    current.lookupLoading = false;
    setAllLookupFields({
      ...allLookupFields,
      [lookupFieldKey]: { ...current }
    });
  };

  const setPluginData = (fieldKey, data) => {
    if (!fieldKey) return;
    setAllPluginFields({ ...allPluginFields, [fieldKey]: data });
  };

  const fetchLookupData = async (fieldKey, query, ep) => {
    const lookupFieldInfo = allLookupFields[fieldKey];
    lookupFieldInfo.lookupQuery = query;
    setAllLookupFields({ ...allLookupFields, [fieldKey]: lookupFieldInfo });
    if (!query || !ep) return;
    lookupFieldInfo.lookupLoading = true;
    setAllLookupFields({ ...allLookupFields, [fieldKey]: lookupFieldInfo });
    let _endpoint = endpoint.getLookupEndpoint(
      ep + `&query=${query}` + lookupEndpointSuffix
    );

    try {
      const res = await axios.get(_endpoint);
      const resData = res.data;
      console.log(`Lookup response:`, resData);
      lookupFieldInfo.lookupData = resData.list;
      lookupFieldInfo.lookupLoading = false;
      if (resData.module) {
        lookupFieldInfo.module = resData.module;
      }
      _isMounted.current &&
        setAllLookupFields({ ...allLookupFields, [fieldKey]: lookupFieldInfo });
    } catch (error) {
      handleError(error, true);
      lookupFieldInfo.lookupLoading = false;
      _isMounted.current &&
        setAllLookupFields({ ...allLookupFields, [fieldKey]: lookupFieldInfo });
    }
  };

  const onFinish = async values => {
    if (!hasAddPermission) return noPermission('add');
    if (!checkFieldsError()) {
      _isMounted.current && setProcessing(true);

      const fileTypeFields = fields
        .filter(x => x.type === 'file')
        .map(y => y.field);
      for (const fileTypeField of fileTypeFields) {
        const file = values[fileTypeField];
        if (isNewFileSelected(file)) {
          const data = await getBase64(file);
          values[fileTypeField] = getFileObjForAjax(file, data);
        }
      }

      const dateTimeTypeFields = fields
        .filter(x => x.type === 'datetime')
        .map(y => y.field);
      for (const dateTimeTypeField of dateTimeTypeFields) {
        if (values[dateTimeTypeField]) {
          const dateTime = moment(values[dateTimeTypeField]).format(
            'YYYY-MM-DD HH:mm'
          );
          values[dateTimeTypeField] = dateTime;
        }
      }

      let richTxtFieldsValid = true;
      const richTxtTypeFields = fields.filter(x => x.type === 'textarea-rich');
      for (const richTxtField of richTxtTypeFields) {
        const { field, label, required } = richTxtField;
        const richTxt = values[field];
        if (required && richTxt.isEmpty()) {
          richTxtFieldsValid = false;
          message.warning(`'${label}' field is required.`);
        } else {
          values[field] = richTxt?.toHTML?.();
        }
      }
      if (!richTxtFieldsValid)
        return _isMounted.current && setProcessing(false);

      const { module } = props;
      const pluginFieldsData = {};
      for (const [key, value] of Object.entries(allPluginFields)) {
        console.log(`${key}: ${value}`);
        pluginFieldsData[key] = value.map(x => {
          if (x.local === true) {
            delete x._id;
            delete x.local;
          }
          return x;
        });
      }

      const __queryVars =
        queryVars.__passQueryVars === '1' ? { ...queryVars } : {};
      delete __queryVars.__passQueryVars;
      const postData = {
        ...__queryVars,
        ...values,
        ...pluginFieldsData,
        ...defaultValues
      };

      if (preload_id) {
        postData['preload_id'] = preload_id;
        const hiddenFields = props.fields.filter(x => x.hidden);
        hiddenFields.forEach(x => {
          if (queryVars.hasOwnProperty(x.field) && x.field !== '_id') {
            postData[x.field] = queryVars[x.field];
          }
        });
      }
      console.log(`[${module}]PostData for ADD action:`, postData);

      if (onSubmitJustReturnTheData) {
        onFinishCallback(postData);
        setTimeout(() => _isMounted.current && setProcessing(false), 500);
      } else {
        saveToDB(postData, module);
      }
    } else {
      message.error('Form validation failed. Please fix the errors!');
    }
  };

  const saveToDB = async (postData, module) => {
    try {
      const ep = POST_ENDPOINT
        ? POST_ENDPOINT
        : endpoint.getDataAddEndpoint(module);
      const res = await axios.post(ep, postData);
      if (!POST_ENDPOINT) {
        console.log(`[${module}]ADD action response:`, res.data);
      }
      message.success(successMessage);
      form.resetFields();
      if (onFinishCallback) {
        onFinishCallback(res.data);
      }
      if (
        onFinishGoToViewlist ||
        defaultFinishGoToListModules.includes(module)
      ) {
        navigate(`/data/${module}/${keys.DATA_VIEW_LIST_ACTION}`);
      } else if (onFinishGoToView) {
        navigate(`/data/${module}/${keys.DATA_VIEW_ACTION}/${res.data._id}`);
      }
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setProcessing(false);
    }
  };

  if (!hasAddPermission) return <NoPermission />;

  if (loadingPreloadData || loading) {
    return (
      <div className="mx-3">
        <Skeleton number={preload_id && copyYN ? 4 : 2} />
      </div>
    );
  }

  const initialValues = cleanAndAdjustData({
    data: isEmpty(queryVars)
      ? { ...getInitialValues(), ...initialFormValues }
      : {
          ...getInitialValues(),
          ...initialFormValues,
          ...queryVars,
          ...getInitialValues(preloadData)
        },
    fields,
    module_name: props.module
  });

  fields
    .filter(x => x.type === 'textarea-rich')
    .forEach(y => {
      const key = y.field;
      initialValues[key] = createBraftEditorState(initialValues[key]);
    });

  // console.log(initialValues)
  const keysOfInitialValues = Object.keys(initialValues);
  const requiredFields = fields.filter(x => x.required).map(y => y.field);
  const fieldsNeedToTouch = requiredFields.filter(
    x => !keysOfInitialValues.includes(x)
  );

  const checkFieldsError = () =>
    !!form.getFieldsError().filter(({ errors }) => errors.length).length;

  let rowClassName = '';
  let rowStyles = {};
  const commonFormStyles = { overflowX: 'hidden', ...defaultFormStyles };

  const generateSingleField = (column, index, specialFieldProps = {}) => {
    if (!column) return null;
    const { shouldDefaultRender = true } = specialFieldProps;
    if (!shouldDefaultRender) return null;
    const maxColumns = props.template?.colsNUM ?? 3;
    // console.log({ maxColumns })
    const cols = props.overrideCols || getCols(column.cols, maxColumns);
    const {
      SECTION_ELEMENT,
      SEPARATOR_ELEMENTS_BEFORE,
      SEPARATOR_ELEMENTS_AFTER,
      BEFORE_ELEMENT,
      AFTER_ELEMENT
    } = getGridUtils(column, maxColumns, fields, index, { gridStyles });

    let requiredLinkedField = column.linked_field_required;
    if (requiredLinkedField) {
      requiredLinkedField = fields.find(
        col => col.field === requiredLinkedField
      );
    }
    const dependentFields = fields.filter(
      col => col.linked_field_required === column.field
    );
    // console.log(column.label, cols)

    const topElements = (
      <>
        {SEPARATOR_ELEMENTS_BEFORE}
        {SECTION_ELEMENT}
        {BEFORE_ELEMENT}
      </>
    );

    const fieldElement = (
      <Col xs={24} sm={cols} md={cols} key={index}>
        <Row align={'middle'} style={{ flexWrap: 'nowrap' }}>
          <Col flex={1}>
            {getFormsField(
              'add',
              column,
              form,
              index + 1 === fields.length,
              allLookupFields,
              debounce(fetchLookupData, 500),
              initialValues, // initialValues
              undefined,
              undefined,
              undefined,
              {
                fields,
                faIconList,
                valuesToConstructLookupEndpoint,
                coreData: {
                  navigate,
                  selectOptionsDB,
                  module_name: props.module,
                  userIsAdmin,
                  userPermissions,
                  activeTemplate: props.activeTemplate,
                  _template: props.template,
                  setDisplayValToo: setDisplayValToo
                },
                requiredLinkedField,
                dependentFields,
                setLookupData,
                setPluginData,
                originFromModal,
                specialFieldProps,
                lookupEndpointSuffix,
                ...directProps
              }
            )}
          </Col>
        </Row>
      </Col>
    );

    return (
      <>
        {topElements}
        {fieldElement}
        {AFTER_ELEMENT}
        {SEPARATOR_ELEMENTS_AFTER}
      </>
    );
  };

  return (
    <>
      <Form
        style={{ ...commonFormStyles }}
        form={form}
        initialValues={initialValues}
        name={props.template.name}
        scrollToFirstError={true}
        onFinish={onFinish}
      >
        <Row gutter={24} className={rowClassName} style={rowStyles}>
          {fields.map((column, index) => {
            return (
              <React.Fragment key={column.field}>
                {generateSingleField(column, index, {
                  shouldDefaultRender: !customHiddenFields.includes(
                    column.field
                  )
                })}
              </React.Fragment>
            );
          })}
        </Row>
        {showInnerChildren && props.children}
        {elementBeforeSubmitButton}
        <Form.Item shouldUpdate={true} style={{ marginTop: 20 }}>
          {() => {
            const isFieldsNotTouched =
              requiredFields.length > 0
                ? !form.isFieldsTouched(fieldsNeedToTouch)
                : false;
            const haveFieldsError = checkFieldsError();

            // console.log({ isFieldsNotTouched, haveFieldsError })
            const disabled = checkSubmitBtnShouldDisable
              ? isFieldsNotTouched || haveFieldsError
              : false;

            const finalDisabled =
              disabled ||
              processing ||
              isParentSubmitting ||
              isParentSubmitDisabled;
            const finalProcessing = processing || isParentSubmitting;

            const submitButtonEl = (
              <>
                {submitBtnLookAsSave ? (
                  <Button
                    id={keys.ADD_FORM_SUBMIT_BUTTON}
                    type="primary"
                    icon={<SaveOutlined />}
                    htmlType="submit"
                    disabled={finalDisabled}
                    loading={finalProcessing}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    id={keys.ADD_FORM_SUBMIT_BUTTON}
                    type="primary"
                    icon={submitBtnIcon}
                    htmlType="submit"
                    disabled={finalDisabled}
                    loading={finalProcessing}
                  >
                    {submitBtnTxt}
                  </Button>
                )}
              </>
            );

            return (
              <Row
                className={submitRowClassName}
                justify={submitRowJustifyValue}
                align="middle"
              >
                {deleteBtnReplacement
                  ? deleteBtnReplacement
                  : defaultDeleteBtnReplacement}

                <div>
                  {submitBtnLeftElements}
                  {submitWithConfirm ? (
                    <Popconfirm
                      title="Are you sure?"
                      okText="Yes"
                      cancelText="No"
                      onConfirm={() => form.submit()}
                    >
                      <div>{submitButtonEl}</div>
                    </Popconfirm>
                  ) : (
                    submitButtonEl
                  )}
                </div>
                {submitBtnRightElements}
              </Row>
            );
          }}
        </Form.Item>
      </Form>
    </>
  );
}

export default DataModuleAddComponent;
