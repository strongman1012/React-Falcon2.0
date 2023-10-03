/* eslint-disable no-unused-expressions */
import he from 'he';
import axios from 'axios';
import moment from 'moment';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';
import { message, Form, Row, Col, Spin } from 'antd';
import React, { useContext, useState, useEffect, useRef } from 'react';

import keys from 'utils/keys';
import endpoint from 'utils/endpoint';
import handleError from 'utils/handleError';
import getFormsField from './getFormsField';
import ImageValueEdit from '../Elements/ImageValueEdit';
import { getBase64, isEmpty, truncate } from 'helpers/utils';
import {
  createBraftEditorState,
  getFileObjForAjax,
  isNewFileSelected
} from '../HelperElements';

const EditableContext = React.createContext();

export const EditableRow = ({ ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export const EditableCell = ({
  column,
  editable,
  children,
  dataIndex,
  record,
  handleUpdateUI,
  moduleData = {},
  valuesToConstructLookupEndpoint = {},
  updateLocalDataToAdd,
  plugin,
  lookupEndpointSuffix = '',
  hasEditPermission,
  origin_plugin_table = false,
  havingDropdownProblem = false,
  formFieldGenExtraData = {},
  singleClickGoToView = true,
  singleClickOpenEdit = false,
  setThemeData,
  ...restProps
}) => {
  const navigate = useNavigate();

  const getInitLookupFields = () => {
    if (column && column.type === 'lookup') {
      return {
        [column.field]: {
          ...column,
          lookupQuery: '',
          lookupLoading: false,
          lookupData: []
        }
      };
    } else return {};
  };

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [faIconList, setFAIconList] = React.useState([]);
  const [allLookupFields, setAllLookupFields] = useState(getInitLookupFields());
  const inputRef = useRef();
  const form = useContext(EditableContext);
  const _isMounted = React.useRef(false);
  const local = record?.local === true;

  useEffect(() => {
    if (editing) {
      initField();
      if (column.type === 'textarea-rich') {
        inputRef?.current?.draftInstance?.focus?.();
      } else {
        inputRef?.current?.focus?.();
      }
    }
  }, [editing]);

  useEffect(() => {
    _isMounted.current = true;
    return () => {
      _isMounted.current = false;
    };
  }, []);

  const initField = async () => {
    try {
      if (column.type === keys.FA_FIELD_TYPE) {
        _isMounted.current && setLoading(true);
        const iconsReq = await axios.get(endpoint.fontAwesomeIcons);
        const iconsData = iconsReq.data;
        console.log('FA Icons Response: ', iconsData);
        _isMounted.current && setFAIconList(iconsData || []);
      }
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoading(false);
    }
  };

  const goToItemView = () => {
    if (!column) return;
    const { module_name } = moduleData;
    navigate(`/data/${module_name}/${keys.DATA_VIEW_ACTION}/${record._id}`);
  };

  const toggleEdit = () => {
    if (!local && column.readonly) {
      return message.warning('Sorry, field is readonly.');
    }

    _isMounted.current && setEditing(!editing);

    let initialValue = record[dataIndex];

    if (column.type === 'date' && initialValue) {
      // If value is not null and field type is date
      initialValue = moment(initialValue).format('YYYY-MM-DD');
    }
    if (column.type === 'datetime' && initialValue) {
      // If value is not null and field type is date
      initialValue = moment(initialValue);
    }

    if (column.type === 'textarea-rich') {
      initialValue = createBraftEditorState(initialValue);
    }

    _isMounted.current && form.setFieldsValue({ [dataIndex]: initialValue });
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

  const save = async () => {
    try {
      const { type, label, required } = column;
      let values = {};

      if (type === 'textarea-rich') {
        const richTxt = form.getFieldValue(dataIndex);
        if (required && richTxt.isEmpty()) {
          return message.warning(`'${label}' field is required.`);
        } else {
          values[dataIndex] = richTxt?.toHTML?.();
        }
      } else {
        values = await form.validateFields();
      }

      if (checkFieldsError())
        return message.error('Form validation failed. Please fix the errors!');

      if (type === 'file') {
        const file = values[dataIndex];
        if (isNewFileSelected(file)) {
          const data = await getBase64(file);
          values[dataIndex] = getFileObjForAjax(file, data);
        }
      }

      if (type === 'datetime' && values[dataIndex]) {
        values[dataIndex] = moment(values[dataIndex]).format(
          'YYYY-MM-DD HH:mm'
        );
      }

      if (record?.local === true || origin_plugin_table) {
        return updateLocalDataToAdd({ _id: record._id, ...values });
      }

      const keys = Object.keys(values);
      if (!keys || keys.length === 0) return;
      const key = keys[0]; // Because single(inline) edit at a time so there will be only one value
      const newValue = values[key];
      let previousValue = record[key];
      if (type === 'date' && previousValue) {
        // If value is not null and field type is date
        previousValue = moment(previousValue).format('YYYY-MM-DD');
      } else if (type === 'datetime' && previousValue) {
        previousValue = moment(previousValue).format('YYYY-MM-DD HH:mm');
      }

      if (previousValue === newValue) {
        console.log(
          `Nothing changed prev: '${previousValue}' new: '${newValue}'`
        );
        _isMounted.current && toggleEdit();
        return;
      }

      await saveToDB(values);
    } catch (error) {
      console.log('Inline Save Failed. Error: ', error);
    }
  };

  const saveToDB = async postData => {
    const key = 'msgKey';
    message.loading({ content: 'Saving changes...', key });
    try {
      const { module_name } = moduleData;
      console.log(`[${module_name}]PostData for inline edit action:`, postData);
      const res = await axios.patch(
        endpoint.getDataItemEditEndpoint(module_name, record._id),
        postData
      );
      console.log(`[${module_name}]Inline edit action response:`, res.data);
      _isMounted.current && handleUpdateUI({ ...record, ...res.data });
      _isMounted.current && toggleEdit();
      message.success({ content: 'Saved successfully!', key, duration: 2 });
    } catch (error) {
      handleError(error, true);
      message.error({ content: 'Failed to save!', key, duration: 2 });
    }
  };

  const checkFieldsError = () =>
    !!form.getFieldsError().filter(({ errors }) => errors.length).length;

  let childNode = children;

  const fieldIsReadOnly =
    (plugin &&
      plugin?.module_link_field === dataIndex &&
      record[dataIndex] !== null) ||
    dataIndex === '_id'; // Can't edit id field

  const handleDoubleClick = () => {
    if (!hasEditPermission) {
      return message.warning("You don't have edit permission.");
    } else if (fieldIsReadOnly) {
      return message.info('Field is readonly!');
    } else {
      toggleEdit();
      if (column.type === 'file') {
        setTimeout(() => _isMounted.current && setEditing(false), 20000);
      }
    }
  };

  const renderDataView = () => {
    if (isEmpty(record) || isEmpty(column) || isEmpty(dataIndex))
      return children;

    const fieldName = `${dataIndex}_display`;
    let value = record.hasOwnProperty(fieldName)
      ? record[fieldName]
      : record[dataIndex];

    if (column.type === 'number') {
      if (typeof value === 'string') {
        return truncate(he.decode(value), 35, true, column.title);
      } else {
        return <span style={{ marginLeft: 'auto' }}>{value}</span>;
      }
    } else if (typeof value === 'string') {
      return truncate(he.decode(value), 35, true, column.title);
    } else {
      return children;
    }
  };

  const getDataCellStyles = () => {
    const styles = {
      minHeight: local ? 30 : 22,
      border: local && '1px solid silver',
      borderRadius: local && '3px',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: local && 10
    };

    if (column.type === 'number') {
      styles['justifyContent'] = 'flex-end';
    }

    return styles;
  };

  if (editable) {
    childNode = editing ? (
      <Row style={{ flexWrap: 'nowrap' }}>
        <Col flex={1}>
          {loading ? (
            <Spin size="small" />
          ) : (
            getFormsField(
              local ? 'inline-add' : 'inline-edit',
              column,
              form,
              false, // isLast not applicable
              allLookupFields,
              debounce(fetchLookupData, 500),
              record, // initialValues
              inputRef,
              save,
              toggleEdit,
              {
                havingDropdownProblem,
                lookupEndpointSuffix,
                valuesToConstructLookupEndpoint,
                ...formFieldGenExtraData,
                faIconList,
                coreData: { ...moduleData, navigate }
              }
            )
          )}
        </Col>
        <Col>
          <ImageValueEdit
            column={column}
            record={record}
            params={moduleData}
            onEdit={handleUpdateUI}
          />
        </Col>
      </Row>
    ) : (
      <div style={getDataCellStyles()} onDoubleClick={handleDoubleClick}>
        {renderDataView()}
      </div>
    );
  }

  return (
    <TableCell
      cellProps={restProps}
      editing={editing}
      goToItemView={goToItemView}
      record={record}
      dataIndex={dataIndex}
      column={column}
      setThemeData={setThemeData}
      toggleEdit={toggleEdit}
      fieldIsReadOnly={fieldIsReadOnly}
      singleClickGoToView={singleClickGoToView}
      singleClickOpenEdit={singleClickOpenEdit}
    >
      {childNode}
    </TableCell>
  );
};

class TableCell extends React.Component {
  constructor(props) {
    super(props);
    this.clickCount = 0;
    this.singleClickTimer = '';
  }

  componentWillUnmount() {
    this.singleClickTimer && clearTimeout(this.singleClickTimer);
  }

  singleClick = () => {
    const { editing, goToItemView, record, singleClickGoToView } = this.props;

    if (!editing && record?.local !== true) {
      singleClickGoToView && goToItemView();
    }
  };

  // handleDoubleClick = () => {
  // 	console.log('double click')
  // }

  handleClicks() {
    const {
      fieldIsReadOnly,
      editing,
      record,
      toggleEdit,
      singleClickOpenEdit
    } = this.props;
    if (fieldIsReadOnly && record?.local === true) return;
    if (!editing && record?.local === true) return toggleEdit();
    if (!editing && singleClickOpenEdit) return toggleEdit();

    this.clickCount++;

    if (this.clickCount === 1) {
      this.singleClickTimer = setTimeout(
        function () {
          this.clickCount = 0;
          this.singleClick();
        }.bind(this),
        300
      );
    } else if (this.clickCount === 2) {
      clearTimeout(this.singleClickTimer);
      this.clickCount = 0;
      // this.handleDoubleClick()
    }
  }

  getCellProps = () => {
    const { column, cellProps } = this.props;
    const style = { ...cellProps.style } || {};

    if (column?.label === 'Profile Picture') {
      style.marginBottom = 0;
      style.paddingTop = 3;
      style.paddingBottom = 3;
    }

    return { ...cellProps, style };
  };

  render() {
    // console.log(this.props.cellProps)
    return (
      <td {...this.getCellProps()} onClick={() => this.handleClicks()}>
        {this.props.children}
      </td>
    );
  }
}
