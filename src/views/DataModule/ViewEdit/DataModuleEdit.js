import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { clone } from 'ramda';
import debounce from 'lodash/debounce';
import { FaCcStripe } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import useOnclickOutside from 'react-cool-onclickoutside';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { QuestionCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Row, Col, Form, Popconfirm, message, Modal } from 'antd';

import keys from 'utils/keys';
import endpoint from 'utils/endpoint';
import handleError from 'utils/handleError';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'components/loading/Skeleton';
import ImageValueEdit from '../Elements/ImageValueEdit';
import getFormsField from '../FormBuilder/getFormsField';
import NoPermission from 'components/custom/NoPermission';
import { setCurrentData } from 'redux/slices/currentDataSlice';
import {
  checkHasPermission,
  cleanAndAdjustData,
  getBase64,
  getCols,
  getPopupContainer,
  isEmpty
} from 'helpers/utils';
import {
  createBraftEditorState,
  getFileObjForAjax,
  getGridUtils,
  isNewFileSelected,
  removeAttribute
} from '../HelperElements';

const defaultFinishGoToListModules = [];

export default function DataModuleEditForm(props) {
  const navigate = useNavigate();
  const {
    moduleID = '',
    showInnerChildren = false,
    topSubmitBtnStyles = {},
    defaultFormStyles = {},
    showDeleteButton = true,
    onFinishGoToView = true,
    onFinishGoToViewlist = false,
    cloneSubmitButtonTop = false,
    disableOutsideClickHandler = true,
    checkSubmitBtnShouldDisable = true,
    showBottomSubmitButton = true,
    defaultValues = {},
    overrideInitialValues = {},
    valuesToConstructLookupEndpoint = {},
    excludeFields = [],
    disabledFields = [],
    omitFieldsFromPostData = [],
    isProfileAction,
    closeToProfileAction = false,
    originatedFromModal,
    checkForCoreData = false,
    onDeletedCallback,
    lookupEndpointSuffix = '',
    PATCH_ENDPOINT,
    shouldUsePOST = false,
    ajaxReqTypePOST = false,
    needExtraPadding = false,
    gridStyles = {},
    refetchData,
    isParentSubmitting = false,
    onSubmitJustReturnTheData = false,
    topSubmitBtnLeftElements = [],
    topSubmitBtnLeftElementsContainerStyles = {},
    deleteBtnReplacement = null,
    deleteBtnRightElements = null,
    needToCheckEditPermission = true,
    directProps = {},
    hideBottomSubmitRow = false,
    bottomSubmitRowStyles = {},
    bottomSubmitInnerRowStyles = {},
    bottomSubmitInnerColProps = {},
    stripePublicKeyField = 'microsite_payment_stripe_public_key',
    stripeSecretKeyField = 'microsite_payment_stripe_secret_key',
    formTopElement = null,
    formProps = {},
    checkStripeLogic = false,
    onValuesChangeCallback,
    submitBtnIcon = <SaveOutlined />,
    submitButtonText = 'Save',
    elementBeforeSubmitButton = null
  } = props;
  let { submitBtnLeftElements = null, submitBtnRightElements = null } = props;
  const dispatch = useDispatch();
  const _isMounted = React.useRef(false);
  const formContainerRef = useOnclickOutside(
    () => {
      // console.log('Clicked outside...', e)
    },
    { disabled: disableOutsideClickHandler, excludeScrollbar: true }
  );
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const [, forceUpdate] = useState();
  const { editFormSaved } = useSelector(state => state.currentData);
  const [faIconList, setFAIconList] = React.useState([]);
  const [allLookupFields, setAllLookupFields] = useState({});
  const [allPluginFields, setAllPluginFields] = useState({});
  const [leaderboardElSelectOptions] = useState([]);
  const [initLoading, setInitLoading] = useState(true);
  const [stripeVerifyLoading, setStripeVerifyLoading] = useState(false);
  const [stripeVerifyResponse, setStripeVerifyResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isStripeVerified, setIsStripeVerified] = React.useState(true);
  const fields = props.fields.filter(
    x => !x.hidden && !excludeFields.includes(x.field)
  );
  const fieldKeyList = fields.map(x => x.field);
  const hasEditPermission = needToCheckEditPermission
    ? checkHasPermission(
        keys.EDIT_PERMISSIONS_KEY,
        props.data?._permissions,
        props.permissions
      )
    : true;
  const hasDeletePermission = checkHasPermission(
    keys.DELETE_PERMISSIONS_KEY,
    props.data?._permissions,
    props.permissions
  );

  let { module_name, id } = props?.params || {};
  if (originatedFromModal || checkForCoreData) {
    // This modal from custom template
    module_name = props.module;
    id = props.data?._id;
  }

  const setEditFormSaved = val =>
    dispatch(setCurrentData({ editFormSaved: val }));

  // To disable submit button at the beginning.
  useEffect(() => {
    _isMounted.current = true;
    setEditFormSaved(true);

    if (hasEditPermission) {
      forceUpdate({});
      initLookupFields();

      const pluginFields = {};
      fields.forEach(x => {
        if (x.type === 'plugin_table') {
          pluginFields[x.field] = [];
        }
      });
      setAllPluginFields(pluginFields);
    } else {
      noPermission('edit');
    }

    window.EDIT_FORM_SAVED = editFormSaved;

    const timer = window.setInterval(() => {
      // console.log({ editFormSaved })
      if (
        _isMounted.current &&
        window.EDIT_FORM_SAVED === true &&
        disableOutsideClickHandler === false
      ) {
        if (form && form.isFieldsTouched(fieldKeyList)) {
          setEditFormSaved(false);
          window.EDIT_FORM_SAVED = false;
        }
      }
    }, 1000);

    setTimeout(() => {
      removeAttribute();
      removeAttribute('ant-form-item-control-input-content');
    }, 5000);

    return () => {
      window.clearInterval(timer);
      _isMounted.current = false;
    };
  }, []);

  const noPermission = type =>
    message.warning(`You don't have ${type} permission.`);

  const initLookupFields = async () => {
    try {
      const lookupFields = {};

      fields
        .filter(x => x.type === 'lookup')
        .forEach(x => {
          const key = x.field;
          lookupFields[key] = {
            ...x,
            lookupQuery: '',
            lookupLoading: false,
            lookupData: []
          };
        });

      setAllLookupFields(lookupFields);

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
      _isMounted.current && setInitLoading(false);
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
    setEditFormSaved(false);
  };

  const setPluginData = (fieldKey, data) => {
    if (!fieldKey) return;
    setAllPluginFields({ ...allPluginFields, [fieldKey]: data });
    setEditFormSaved(false);
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
      if (resData.module) {
        lookupFieldInfo.module = resData.module;
      }
      lookupFieldInfo.lookupLoading = false;
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
    if (!hasEditPermission) return noPermission('edit');
    _isMounted.current && setProcessing(true);

    const fileTypeFields = fields
      .filter(x => x.type === 'file')
      .map(y => y.field);
    for (const fileTypeField of fileTypeFields) {
      const file = values[fileTypeField];
      if (isNewFileSelected(file)) {
        const data = await getBase64(file);
        values[fileTypeField] = getFileObjForAjax(file, data);
      } else {
        values[fileTypeField] = props.data[fileTypeField];
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
    if (!richTxtFieldsValid) return _isMounted.current && setProcessing(false);

    // Remove read only fields value
    fields
      .filter(x => x.readonly === true)
      .forEach(y => {
        delete values[y.field];
      });
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

    if (props.template?.name === 'emma_event_signup_fields_add_edit') {
      if (
        values.hasOwnProperty('answers') &&
        Array.isArray(values.answers) &&
        values.answers.length > 0
      ) {
        values.answers = values.answers.map(x => {
          if (x._id) {
            return x;
          } else {
            return { ...x, _id: null };
          }
        });
      }
    }

    const postData = { ...values, ...pluginFieldsData, ...defaultValues };
    if (!isEmpty(omitFieldsFromPostData)) {
      omitFieldsFromPostData.forEach(x => {
        delete postData[x];
      });
    }
    console.log(`[${module}]PostData for Edit action:`, postData);

    if (checkStripeLogic) {
      _isMounted.current && setIsStripeVerified(true);
    }
    if (onSubmitJustReturnTheData) {
      setTimeout(() => _isMounted.current && setProcessing(false), 500);
      return props.onEdit(postData);
    } else {
      saveToDB(postData);
    }
  };

  const saveToDB = async postData => {
    try {
      let ep = endpoint.getDataItemEditEndpoint(module_name, id);

      if (PATCH_ENDPOINT) {
        ep = PATCH_ENDPOINT;
      } else if (isProfileAction) {
        ep = endpoint.userProfile;
      }

      let res;
      if (shouldUsePOST) {
        // Special Case
        res = await axios.post(
          endpoint.getDataAddEndpoint(module_name),
          postData
        );
      } else if (ajaxReqTypePOST) {
        res = await axios.post(ep, postData);
      } else {
        res = await axios.patch(ep, postData);
      }

      console.log(`[${module_name}]Edit action response:`, res.data);
      setEditFormSaved(true);
      props.onEdit(res.data);
      form.resetFields();

      if (!isProfileAction) {
        if (
          onFinishGoToViewlist ||
          defaultFinishGoToListModules.includes(module_name)
        ) {
          navigate(`/data/${module_name}/${keys.DATA_VIEW_LIST_ACTION}`);
        } else if (onFinishGoToView) {
          navigate(`/data/${module_name}/${keys.DATA_VIEW_ACTION}/${id}`);
        }
      }
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setProcessing(false);
    }
  };

  const getInitialValues = () => {
    let finalData =
      clone(cleanAndAdjustData({ data: props.data, fields, module_name })) ||
      {};

    finalData = { ...finalData, ...overrideInitialValues };

    fields
      .filter(x => x.type === 'date' || x.type === 'datetime')
      .forEach(y => {
        const key = y.field;
        const val = finalData[key];
        if (y.type === 'date') {
          finalData[key] = val ? moment(val).format('YYYY-MM-DD') : val;
        } else if (y.type === 'datetime') {
          finalData[key] = val ? moment(val) : val;
        }
      });

    fields
      .filter(x => x.type === 'textarea-rich')
      .forEach(y => {
        const key = y.field;
        finalData[key] = createBraftEditorState(finalData[key]);
      });

    // Override read only fields value
    fields
      .filter(x => x.readonly === true)
      .forEach(y => {
        const key = y.field;
        const displayKey = `${key}_display`;
        if (!['toggle', 'checkbox', 'number'].includes(y.type)) {
          if (finalData.hasOwnProperty(displayKey)) {
            finalData[key] = finalData[displayKey];
          }
        }
      });

    return finalData;
  };

  const handleDelete = async () => {
    if (!hasDeletePermission) return noPermission('delete');
    try {
      _isMounted.current && setLoading(true);
      const res = await axios.delete(
        endpoint.getDataItemDeleteEndpoint(module_name, id)
      );
      console.log('Data item delete response:', res.data);
      _isMounted.current && setLoading(false);
      if (onDeletedCallback) {
        onDeletedCallback();
      }
      if (onFinishGoToView) {
        navigate(`/data/${module_name}/${keys.DATA_VIEW_LIST_ACTION}`);
      }
    } catch (error) {
      _isMounted.current && setLoading(false);
      handleError(error, true);
    }
  };

  const handleStripeVerify = async () => {
    try {
      form.validateFields();
      const haveFieldsError = !!form.getFieldsError().filter(({ errors }) => {
        return errors.length;
      }).length;
      if (haveFieldsError) return message.warn('Please fix the form errors.');
      const p = form.getFieldValue(stripePublicKeyField);
      const s = form.getFieldValue(stripeSecretKeyField);
      if (p === s) return message.warn('Please fix the form errors.');
      _isMounted.current && setStripeVerifyLoading(true);
      const postData = {};
      postData['microsite_payment_stripe_public_key'] = p;
      postData['microsite_payment_stripe_secret_key'] = s;
      const res = await axios.post(
        endpoint.getEndpointWithSuffix(`/module/bb_emma_stripe/account-info`),
        postData
      );
      console.log('Stripe verify response:', res.data);
      _isMounted.current && setStripeVerifyResponse(res.data);
      _isMounted.current && setIsStripeVerified(true);
    } catch (error) {
      handleError(error, true);
      _isMounted.current && setIsStripeVerified(false);
    } finally {
      _isMounted.current && setStripeVerifyLoading(false);
    }
  };

  const initialValues = getInitialValues();

  if (!hasEditPermission) return <NoPermission />;
  if (initLoading) return <Skeleton number={2} />;
  if (props.data === undefined || props.data === null) {
    console.error('Do data provided to edit.');
    return null;
  }

  let commonFormStyles = {
    position: 'relative',
    overflowX: 'hidden',
    ...defaultFormStyles
  };
  let rowClassName = '';
  let rowStyles = {};
  if (needExtraPadding) {
    rowClassName = '';
    rowStyles = { marginLeft: -20, marginRight: -20 };
  }

  console.log('Edit form initial values:', initialValues);

  const onValuesChange = args => {
    if (checkStripeLogic) {
      if (
        args.hasOwnProperty(stripePublicKeyField) ||
        args.hasOwnProperty(stripeSecretKeyField)
      ) {
        _isMounted.current && setIsStripeVerified(false);
      }
    }
    if (onValuesChangeCallback) {
      onValuesChangeCallback(args);
    }
  };

  const getStipeVerifyEl = _field => {
    let stripeVerifyEl = null;
    const stripeVerifyBtn = (
      <Button
        onClick={handleStripeVerify}
        loading={stripeVerifyLoading}
        type="primary"
        disabled={isStripeVerified}
        icon={<FaCcStripe />}
      >
        &nbsp;Verify
      </Button>
    );
    if (
      _field === 'microsite_payment_stripe_secret_key' ||
      _field === 'secret_key'
    ) {
      let _submitBtnLeftElements = Array.isArray(submitBtnLeftElements)
        ? submitBtnLeftElements
        : [];
      submitBtnLeftElements = [
        ..._submitBtnLeftElements,
        <div key="stripe_verify" className="mr-3">
          {stripeVerifyBtn}
        </div>
      ];
    }

    return stripeVerifyEl;
  };

  return (
    <>
      <div ref={formContainerRef} className="h-100">
        <Form
          form={form}
          style={
            needExtraPadding
              ? { padding: '0 20px', ...commonFormStyles }
              : { ...commonFormStyles }
          }
          className={needExtraPadding ? 'bg-white pb-2 mb-4' : ''}
          name={props.template.name}
          onFinish={onFinish}
          scrollToFirstError={true}
          initialValues={initialValues}
          onValuesChange={onValuesChange}
          {...formProps}
        >
          <>
            {formTopElement}
            {!isEmpty(topSubmitBtnLeftElements) && (
              <div style={topSubmitBtnLeftElementsContainerStyles}>
                {topSubmitBtnLeftElements.map((x, i) => (
                  <React.Fragment key={i}>{x}</React.Fragment>
                ))}
              </div>
            )}
            {cloneSubmitButtonTop && (
              <Form.Item shouldUpdate={true} noStyle>
                {() => {
                  const isFieldsNotTouched = !form.isFieldsTouched(
                    fields.map(x => x.field)
                  );
                  const haveFieldsError = !!form
                    .getFieldsError()
                    .filter(({ errors }) => {
                      return errors.length;
                    }).length;

                  // console.log({ isFieldsNotTouched, haveFieldsError })
                  const disabled = checkSubmitBtnShouldDisable
                    ? isFieldsNotTouched || haveFieldsError
                    : false;

                  let finalDisabled =
                    disabled || processing || loading || isParentSubmitting;

                  if (checkStripeLogic) {
                    finalDisabled = finalDisabled || !isStripeVerified;
                  }

                  return (
                    <Row
                      style={{
                        position: 'absolute',
                        top: 15,
                        right: 15,
                        ...topSubmitBtnStyles
                      }}
                    >
                      {!isEmpty(submitBtnLeftElements) && (
                        <Col>{submitBtnLeftElements}</Col>
                      )}
                      <Col>
                        <Button
                          type="primary"
                          icon={submitBtnIcon}
                          htmlType="submit"
                          disabled={finalDisabled}
                          loading={processing || isParentSubmitting}
                          style={{}}
                        >
                          {submitButtonText}
                        </Button>
                      </Col>
                    </Row>
                  );
                }}
              </Form.Item>
            )}
          </>
          <Row
            gutter={needExtraPadding ? 64 : 24}
            className={rowClassName}
            style={rowStyles}
          >
            {fields.map((column, index) => {
              const maxColumns = props.template?.colsNUM ?? 3;
              const cols =
                props.overrideCols || getCols(column.cols, maxColumns);
              const {
                SECTION_ELEMENT,
                SEPARATOR_ELEMENTS_BEFORE,
                SEPARATOR_ELEMENTS_AFTER,
                BEFORE_ELEMENT,
                AFTER_ELEMENT
              } = getGridUtils(column, maxColumns, fields, index, {
                needExtraPadding,
                microsite_url: props?.data?.microsite_url,
                rsvp_url: props?.data?.rsvp_url,
                share_url: props?.data?.share_url,
                gridStyles,
                activeTemplate: props.activeTemplate
              });

              let requiredLinkedField = column.linked_field_required;
              if (requiredLinkedField) {
                requiredLinkedField = fields.find(
                  col => col.field === requiredLinkedField
                );
              }
              const dependentFields = fields.filter(
                col => col.linked_field_required === column.field
              );

              const styles = { flexWrap: 'nowrap' };

              // if (
              //   screens?.xs === false &&
              //   (isProfileAction || closeToProfileAction)
              // ) {
              //   if (column.field === 'email' || column.field === 'cell') {
              //     styles['marginTop'] = -63;
              //   }
              // }

              const imageValueEditComponent = (
                <ImageValueEdit
                  column={column}
                  moduleID={moduleID}
                  record={initialValues}
                  params={props?.params}
                  styles={{ marginTop: maxColumns < 3 ? 15 : 0 }}
                  onEdit={data => props.onEdit(data, true)} // 2nd argument is for 'isImageEdited'
                  originatedFromModal={originatedFromModal}
                  parentProps={props}
                  isProfileAction={isProfileAction}
                  closeToProfileAction={closeToProfileAction}
                />
              );

              if (disabledFields.includes(column.field)) {
                column['readonly'] = true;
              }

              return (
                <React.Fragment key={column.field}>
                  {SEPARATOR_ELEMENTS_BEFORE}
                  {SECTION_ELEMENT}
                  {BEFORE_ELEMENT}
                  <Col xs={24} sm={cols} md={cols}>
                    <Row align={'middle'} style={styles}>
                      <Col flex={1}>
                        {getFormsField(
                          'edit',
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
                            coreData: {
                              navigate,
                              module_name,
                              id,
                              userIsClient: props.userIsClient,
                              userIsAdmin: props.userIsAdmin,
                              activeTemplate: props.activeTemplate,
                              _template: props.template
                            },
                            valuesToConstructLookupEndpoint,
                            onEditCallback: props.onEdit,
                            isProfileAction,
                            closeToProfileAction,
                            imageValueEditComponent,
                            leaderboardElSelectOptions,
                            requiredLinkedField,
                            dependentFields,
                            lookupEndpointSuffix,
                            setLookupData,
                            setPluginData,
                            originFromModal: originatedFromModal,
                            setEditFormSaved,
                            screens,
                            refetchData: refetchData ? refetchData : () => {},
                            ...directProps
                          }
                        )}
                      </Col>
                      {(isProfileAction || closeToProfileAction) &&
                      column.field === keys.PROFILE_IMAGE_FIELD_KEY ? null : (
                        <Col>{imageValueEditComponent}</Col>
                      )}
                    </Row>
                  </Col>
                  {AFTER_ELEMENT}
                  {SEPARATOR_ELEMENTS_AFTER}

                  {getStipeVerifyEl(column.field)}
                </React.Fragment>
              );
            })}
          </Row>
          {showInnerChildren && props.children}
          {elementBeforeSubmitButton}
          {!hideBottomSubmitRow && (
            <Form.Item
              shouldUpdate={true}
              style={{ marginTop: 20, ...bottomSubmitRowStyles }}
            >
              {() => {
                const isFieldsNotTouched = !form.isFieldsTouched(
                  fields.map(x => x.field)
                );
                const haveFieldsError = !!form
                  .getFieldsError()
                  .filter(({ errors }) => {
                    return errors.length;
                  }).length;

                // console.log({ isFieldsNotTouched, haveFieldsError })
                const disabled = checkSubmitBtnShouldDisable
                  ? isFieldsNotTouched || haveFieldsError
                  : false;

                let finalDisabled =
                  disabled || processing || loading || isParentSubmitting;

                if (checkStripeLogic) {
                  finalDisabled = finalDisabled || !isStripeVerified;
                }

                return (
                  <Row justify="space-between" align="middle">
                    {deleteBtnReplacement ? (
                      deleteBtnReplacement
                    ) : (
                      <>
                        <Row align="middle">
                          {showDeleteButton && hasDeletePermission ? (
                            <>
                              <Popconfirm
                                onConfirm={handleDelete}
                                title="Are you sure？"
                                icon={
                                  <QuestionCircleOutlined
                                    style={{ color: 'red' }}
                                  />
                                }
                                okText="Yes"
                                cancelText="No"
                                placement="topLeft"
                                getPopupContainer={getPopupContainer}
                              >
                                <Button
                                  danger
                                  className="mr-2"
                                  style={{ borderRadius: 4 }}
                                  htmlType="button"
                                  loading={loading}
                                  disabled={processing}
                                >
                                  Delete
                                </Button>
                              </Popconfirm>
                            </>
                          ) : (
                            <div />
                          )}
                          {deleteBtnRightElements}
                        </Row>
                      </>
                    )}

                    <Col {...bottomSubmitInnerColProps}>
                      <Row style={bottomSubmitInnerRowStyles}>
                        {!isEmpty(submitBtnLeftElements) && (
                          <Col>{submitBtnLeftElements}</Col>
                        )}
                        {showBottomSubmitButton && (
                          <Col>
                            <Button
                              type="primary"
                              icon={submitBtnIcon}
                              htmlType="submit"
                              disabled={finalDisabled}
                              loading={processing || isParentSubmitting}
                            >
                              {submitButtonText}
                            </Button>
                          </Col>
                        )}
                        {!isEmpty(submitBtnRightElements) && (
                          <Col>{submitBtnRightElements}</Col>
                        )}
                      </Row>
                    </Col>
                  </Row>
                );
              }}
            </Form.Item>
          )}
        </Form>
      </div>

      <Modal
        title="Stripe Account Info"
        visible={!isEmpty(stripeVerifyResponse)}
        footer={null}
        destroyOnClose
        onCancel={() => setStripeVerifyResponse(null)}
        bodyStyle={{ paddingLeft: 24, paddingRight: 24 }}
      >
        <table>
          <tbody>
            <tr>
              <th>Account ID</th>
              <td className="pl-2">{stripeVerifyResponse?.id}</td>
            </tr>
            <tr>
              <th>Dashboard Name</th>
              <td className="pl-2">
                {stripeVerifyResponse?.settings?.dashboard?.display_name}
              </td>
            </tr>
            <tr>
              <th>Business Name</th>
              <td className="pl-2">
                {stripeVerifyResponse?.business_profile?.name}
              </td>
            </tr>
            <tr>
              <th>Business Support Email</th>
              <td className="pl-2">
                {stripeVerifyResponse?.business_profile?.support_email}
              </td>
            </tr>
            <tr>
              <th>Business URL</th>
              <td className="pl-2">
                {stripeVerifyResponse?.business_profile?.url}
              </td>
            </tr>
          </tbody>
        </table>
      </Modal>
    </>
  );
}
