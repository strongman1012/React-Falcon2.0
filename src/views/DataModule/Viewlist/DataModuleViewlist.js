import Axios from 'axios';
import moment from 'moment';
import { clone } from 'ramda';
import FadeIn from 'react-fade-in';
import { CSVLink } from 'react-csv';
import debounce from 'lodash/debounce';
import { FaFileCsv } from 'react-icons/fa';
import IconButton from 'components/common/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { Dropdown as BootstrapDropdown } from 'react-bootstrap';
import { CaretDownFilled, SearchOutlined } from '@ant-design/icons';
import { Button, Radio, Col, DatePicker, Dropdown, Input } from 'antd';
import { CopyOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Menu, message, Modal, Pagination, Row, Table, Tooltip } from 'antd';

import vars from 'utils/vars';
import keys from 'utils/keys';
import endpoint from 'utils/endpoint';
import handleError from 'utils/handleError';
import { checkHasPermission } from 'helpers/utils';
import CustomizeFieldsUI from '../CustomizeFieldsUI';
import LoaderOverlay from 'components/loading/Overlay';
import { setThemeData } from 'redux/slices/themeSlice';
import DeleteDataItemBtn from '../Elements/DeleteDataItemBtn';
import TemplateChecker from '../CustomTemplate/TemplateChecker';
import TemplateSelectInput from 'components/custom/TemplateSelect';
import { EditableCell, EditableRow } from '../FormBuilder/InlineAddEdit';
import { getErrorAlert, getTableScrollProps, isEmpty } from 'helpers/utils';
import {
  resetViewlistState,
  updateViewlistState,
  setViewlistLoadingState
} from 'redux/slices/viewlistSlice';
import {
  CustomRow,
  SuffixCaretIcon,
  renderTabElement,
  generateColumnDefs,
  PrefixCalendarIcon,
  getCSVData
} from '../HelperElements';

const noFilterDataModule = [];
const noViewButtonModule = [];
const noEditButtonModule = [];
const noViewByClickModule = [];
const csvExportNotAllowedModules = [];
const editIconForViewButtonModules = [];

function DataModuleViewlist(props) {
  const {
    fields,
    module,
    refetch,
    permissions,
    finalEndpoint,
    activeTemplate,
    user_customize,
    setActiveTemplate
  } = props;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const _isMounted = useRef(false);
  let { module_name } = useParams();
  const { user } = useSelector(state => state.auth);
  const state = useSelector(state => state.viewlistState);

  const [errorRes, setErrorRes] = useState(null);
  const [customizeFieldsModal, setCustomizeFieldsModal] = useState(false);

  const updateTheme = obj => dispatch(setThemeData(obj));
  const updateState = obj => dispatch(updateViewlistState(obj));
  const debounceUpdateState = debounce(
    obj => dispatch(updateViewlistState(obj)),
    vars.DEBOUNCE_TIME
  );

  const {
    selectedTableRowKeys,
    loading,
    initialCall,
    columnDefs,
    processing,
    dataResObj,
    textFilterField,
    dateFilterField,
    paginationCurrentPage,
    paginationPageSize,
    data,
    searchText,
    dateRange,
    sortByQuery
  } = state;

  const init = async (ep, qs = window.location.search) => {
    try {
      _isMounted.current && setErrorRes(null);
      dispatch(setViewlistLoadingState(true));

      let _ep = ep || endpoint.getModuleDataEndpoint(module_name);

      // Query vars passed via url bar
      if (!isEmpty(qs)) {
        if (_ep.includes('?')) {
          _ep += qs.replace('?', '&');
        } else {
          _ep += qs;
        }
      }

      // For pagination | After this portion '?' is always present
      const paginationQuery = `limit=${paginationPageSize}&page=${paginationCurrentPage}`;
      const paginationQueryPrefix = _ep.includes('?') ? '&' : '?';
      _ep += paginationQueryPrefix + paginationQuery;

      // For filters
      if (searchText) {
        let queryKey = textFilterField === 'all' ? 'query' : textFilterField;
        _ep += `&${queryKey}=${searchText}`;
      }
      if (dateFilterField) {
        const [startData, endDate] = dateRange;
        if (startData) _ep += `&${dateFilterField}[from]=${startData}`;
        if (endDate) _ep += `&${dateFilterField}[to]=${endDate}`;
      }

      // For sorting
      if (sortByQuery) {
        const [order, sort] = sortByQuery.split('@');
        _ep += `&order=${order}&sort=${sort}`;
      }

      const dataRes = await Axios.get(_ep);
      console.log('Data:', dataRes.data);
      updateState({ dataResObj: dataRes.data || {} });

      const data = dataRes?.data?.list || [];
      const columnDefs = generateColumnDefs(fields);

      updateState({ data, columnDefs });
    } catch (error) {
      const _errorRes = handleError(error, true);
      _isMounted.current && setErrorRes(_errorRes);
    } finally {
      dispatch(setViewlistLoadingState(false));
    }
  };

  const searchableDateFields = fields.filter(x => {
    if (
      x.searchable &&
      [keys.DATE_FIELD_KEY, keys.DATE_TIME_FIELD_KEY].includes(x.type)
    ) {
      return true;
    }
    return false;
  });
  const noSearchableDateFields = isEmpty(searchableDateFields);

  useEffect(() => {
    if (_isMounted.current && state.searchText) {
      init();
    }
  }, [state.textFilterField]);

  useEffect(() => {
    if (_isMounted.current && state.dateFilterField) {
      init();
    }
  }, [state.dateRange]);

  useEffect(() => {
    if (_isMounted.current && state.dateRange) {
      const [startData, endDate] = dateRange;
      startData && endDate && init();
    }
  }, [state.dateFilterField]);

  useEffect(() => {
    if (_isMounted.current) {
      init();
    }
  }, [
    state.searchText,
    state.sortByQuery,
    state.paginationPageSize,
    state.paginationCurrentPage
  ]);

  useEffect(() => {
    _isMounted.current = true;
    if (!noSearchableDateFields) {
      // Set the first one as the default
      updateState({ dateFilterField: searchableDateFields[0].field });
    }
    init();
    return () => {
      debounceUpdateState.cancel();
      dispatch(resetViewlistState());
      _isMounted.current = false;
    };
  }, []);

  const { _permissions: localPermission, total_rows } = dataResObj || {};
  const rowsSelected = selectedTableRowKeys.length !== 0;
  const tableRowSelection = {
    selectedTableRowKeys,
    onChange: arr => updateState({ selectedTableRowKeys: arr })
  };
  const available_templates = props.available_templates || [];
  const csvExportShow = !csvExportNotAllowedModules.includes(module);
  const cloneYN = localPermission?.clone;
  let showCloneButton = false;
  let showDeleteAllOption = true;

  const onTemplateSelect = newTemplate => {
    if (!newTemplate) return;
    const isTemplateChanged = activeTemplate?.name !== newTemplate.name;
    if (!isTemplateChanged && activeTemplate?.dynamic_tabYN !== true) {
      const { data_endpoint } = newTemplate;
      const mn = data_endpoint?.replace('/module/', '') || module_name;
      const ep = endpoint.getModuleDataEndpoint(mn);
      init(ep);
    }
    setActiveTemplate(newTemplate, isTemplateChanged);
  };

  const refetchData = (qs = window.location.search) => {
    const { data_endpoint } = activeTemplate;
    const ep = endpoint.getModuleDataEndpoint(
      data_endpoint?.replace('/module/', '') || module_name
    );
    console.log(ep, qs);
    init(ep, qs);
  };

  const goToModuleAction = (action, id) => {
    const currentDataID =
      action[0].toUpperCase() + action.slice(1) + ' - ' + id ?? '*';
    updateTheme({ currentDataID });

    navigate(`/data/${module_name}/${action}/${id}`);
  };

  const handleDataItemDelete = id => {
    const copy = clone(data);
    const update = copy.filter(x => x._id !== id);
    updateState({ data: update });
    message.info('Successfully deleted!', 1.5);
  };

  const handleUpdateUI = row => {
    // TODO: Test
    const newData = clone(data);
    const index = newData.findIndex(item => row._id === item._id);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    updateState({ searchText: '', dateRange: ['', ''], data: newData });
  };

  const handleBulkDelete = async e => {
    e.preventDefault();
    if (selectedTableRowKeys.length === 0) {
      message.info('No item selected.');
      return;
    }
    updateState({ processing: true });
    try {
      const postData = { ids: selectedTableRowKeys };
      console.log('Data bulk delete postData:', postData);
      const res = await Axios.delete(
        endpoint.getModuleDataEndpoint(module_name),
        { data: { ...postData } }
      );
      console.log('Data bulk delete response:', res.data);
      const copy = clone(data);
      const update = copy.filter(x => !selectedTableRowKeys.includes(x._id));
      updateState({ data: update });
      message.info(
        `Successfully deleted ${selectedTableRowKeys.length} row${
          selectedTableRowKeys.length > 0 ? 's' : ''
        }!`,
        1.5
      );
    } catch (error) {
      handleError(error, true);
    } finally {
      updateState({ processing: false });
    }
  };

  const onTableChange = (pagination, filters, sorter) => {
    const { columnKey, order } = sorter;
    if (order) {
      updateState({ sortByQuery: `${columnKey}@${order.replace('end', '')}` });
    } else {
      updateState({ sortByQuery: '' });
    }
  };

  const searchableTextFields = fields.filter(x => {
    if (
      x.searchable &&
      ![keys.DATE_FIELD_KEY, keys.DATE_TIME_FIELD_KEY].includes(x.type)
    ) {
      return true;
    }
    return false;
  });
  const noSearchableTextFields = isEmpty(searchableTextFields);

  const searchMenu = noSearchableTextFields ? null : (
    <Menu>
      <Menu.Item
        key="all"
        onClick={() => updateState({ textFilterField: 'all' })}
      >
        <Radio checked={textFilterField === 'all'} className="w-100">
          All
        </Radio>
      </Menu.Item>
      {searchableTextFields.map(x => {
        return (
          <Menu.Item
            key={x.field}
            onClick={() => updateState({ textFilterField: x.field })}
          >
            <Radio checked={textFilterField === x.field} className="w-100">
              {x.label}
            </Radio>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  const dateMenu = noSearchableDateFields ? null : (
    <Menu>
      {searchableDateFields.map(x => {
        return (
          <Menu.Item
            key={x.field}
            onClick={() => updateState({ dateFilterField: x.field })}
          >
            <Radio className="w-100" checked={dateFilterField === x.field}>
              {x.label}
            </Radio>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  const { csv = false } = user?.ui_settings?.page || {};
  const csvData = csvExportShow ? getCSVData(data, columnDefs) : [];

  const HeaderContent = (
    <CustomRow align="middle" gutter={[10, 10]} justify="space-between">
      <Col>
        <TemplateSelectInput {...props} />
      </Col>
      <Col>
        {!noFilterDataModule.includes(module_name) && (
          <CustomRow gutter={[10, 10]}>
            {!noSearchableTextFields && (
              <Col>
                <Input
                  allowClear
                  onChange={e => {
                    const val = e.target.value;
                    debounceUpdateState({
                      searchText: isEmpty(val) ? '' : val
                    });
                  }}
                  disabled={loading}
                  placeholder="Search"
                  prefix={
                    <SearchOutlined
                      style={{ color: vars.PRIMARY_COLOR, opacity: 0.7 }}
                    />
                  }
                  style={{ width: '200px' }}
                  suffix={
                    <Dropdown
                      placement="bottomRight"
                      overlay={searchMenu}
                      trigger={['click']}
                    >
                      <CaretDownFilled className="caret-icon" />
                    </Dropdown>
                  }
                />
              </Col>
            )}

            {!noSearchableDateFields && (
              <Col>
                <CustomRow className="h-100">
                  <PrefixCalendarIcon />
                  <DatePicker.RangePicker
                    suffixIcon={null}
                    allowClear={true}
                    disabled={loading}
                    separator="To"
                    className="app-date-input"
                    style={{ width: '250px' }}
                    value={dateRange.map(x => (x ? moment(x) : null))}
                    onChange={(_, dateRange) => {
                      updateState({ dateRange });
                    }}
                  />
                  <Dropdown
                    placement="bottomRight"
                    overlay={dateMenu}
                    trigger={['click']}
                  >
                    <SuffixCaretIcon className="caret-icon" />
                  </Dropdown>
                </CustomRow>
              </Col>
            )}

            {csv && csvExportShow && (
              <Col>
                <CustomRow>
                  <Tooltip title="Export to CSV">
                    <CSVLink
                      data={csvData}
                      filename={`${props.name ? `${props.name} - ` : ''}${
                        activeTemplate?.title
                          ? `${activeTemplate.title} Data`
                          : 'Data'
                      }.csv`}
                      href="#"
                      style={{
                        pointerEvents: data.length > 0 ? 'auto' : 'none',
                        opacity: data.length > 0 ? 1 : 0.5
                      }}
                    >
                      <Button icon={<FaFileCsv style={{ opacity: 0.6 }} />} />
                    </CSVLink>
                  </Tooltip>
                </CustomRow>
              </Col>
            )}

            {user_customize && (
              <Col>
                <Tooltip title="Customize Fields" placement="left">
                  <IconButton
                    className="px-2"
                    variant="falcon-default"
                    icon="list"
                    transform="shrink-3"
                    onClick={() => setCustomizeFieldsModal(true)}
                  />
                </Tooltip>
              </Col>
            )}
          </CustomRow>
        )}
      </Col>
    </CustomRow>
  );

  const getMainContent = () => {
    if (!isEmpty(errorRes)) {
      return getErrorAlert({
        msg: errorRes.finalMsg,
        onRetry: () => refetchData()
      });
    } else {
      return (
        <FadeIn>
          <div className="mt-3" style={{ marginBottom: 16 }}>
            <Table
              bordered
              rowKey="_id"
              size="small"
              loading={loading}
              pagination={false}
              onChange={onTableChange}
              scroll={getTableScrollProps()}
              components={{
                body: { row: EditableRow, cell: EditableCell }
              }}
              rowSelection={permissions.bulk ? tableRowSelection : false}
              dataSource={data}
              columns={columnDefs.map(column => {
                const { dataIndex } = column;
                if (dataIndex === 'action') {
                  return {
                    ...column,
                    width: showCloneButton ? 140 : column.width,
                    align: 'center',
                    render: (_, dataRow) => {
                      const { _id, _permissions } = dataRow;

                      const hasEditPermission = checkHasPermission(
                        keys.EDIT_PERMISSIONS_KEY,
                        _permissions,
                        permissions
                      );
                      const hasDeletePermission = checkHasPermission(
                        keys.DELETE_PERMISSIONS_KEY,
                        _permissions,
                        permissions
                      );

                      // console.log({ hasEditPermission, hasDeletePermission })
                      const viewAsEdit =
                        editIconForViewButtonModules.includes(module_name);
                      return (
                        <Row align="middle" justify="center">
                          {!noViewButtonModule.includes(module_name) && (
                            <Tooltip title={viewAsEdit ? 'Edit' : 'View'}>
                              <Button
                                type="link"
                                size="small"
                                onClick={() => {
                                  updateTheme({ currentTitle: '' });
                                  goToModuleAction(
                                    keys.DATA_VIEW_ACTION,
                                    _id,
                                    dataRow
                                  );
                                }}
                              >
                                {viewAsEdit ? (
                                  <EditOutlined className="edit-icon-color" />
                                ) : (
                                  <EyeOutlined className="view-icon-color" />
                                )}
                              </Button>
                            </Tooltip>
                          )}

                          {hasEditPermission &&
                            !noEditButtonModule.includes(module_name) && (
                              <Tooltip title="Edit">
                                <Button
                                  type="link"
                                  size="small"
                                  onClick={() => {
                                    updateTheme({ currentTitle: '' });
                                    goToModuleAction(
                                      keys.DATA_EDIT_ACTION,
                                      _id
                                    );
                                  }}
                                >
                                  <EditOutlined className="edit-icon-color" />
                                </Button>
                              </Tooltip>
                            )}

                          {showCloneButton && (
                            <>
                              <Tooltip
                                title={cloneYN ? 'Clone' : ''}
                                disabled={!cloneYN}
                              >
                                <Button
                                  type="link"
                                  size="small"
                                  disabled={!cloneYN}
                                  onClick={() => {
                                    navigate(
                                      `/data/${module_name}/${keys.ADD_PERMISSIONS_KEY}?preload_id=${_id}&copyYN=1`
                                    );
                                  }}
                                >
                                  <CopyOutlined
                                    className="clone-icon-color"
                                    rotate={-180}
                                    style={cloneYN ? {} : { color: 'grey' }}
                                  />
                                </Button>
                              </Tooltip>
                            </>
                          )}

                          <DeleteDataItemBtn
                            hasDeletePermission={hasDeletePermission}
                            id={_id}
                            module={module}
                            onDelete={handleDataItemDelete}
                          />
                        </Row>
                      );
                    }
                  };
                }

                if (column.type) {
                  column = { ...column, sorter: () => null };
                }

                if (!column.editable) return column;

                return {
                  ...column,
                  onCell: record => {
                    const hasEditPermission = checkHasPermission(
                      keys.EDIT_PERMISSIONS_KEY,
                      record._permissions,
                      permissions
                    );
                    return {
                      column: column,
                      record,
                      editable: column.editable,
                      dataIndex: column.dataIndex,
                      handleUpdateUI: handleUpdateUI,
                      moduleData: { module_name },
                      hasEditPermission,
                      singleClickGoToView:
                        !noViewByClickModule.includes(module_name),
                      setThemeData: updateTheme
                    };
                  }
                };
              })}
            />
          </div>

          <CustomRow
            className="mb-3"
            gutter={[10, 10]}
            justify="space-between"
            style={initialCall ? { display: 'none' } : {}}
          >
            <Col>
              <div
                style={{
                  opacity: rowsSelected ? 1 : 0.6,
                  pointerEvents: rowsSelected ? 'auto' : 'none'
                }}
              >
                {permissions.bulk && (
                  <BootstrapDropdown>
                    <BootstrapDropdown.Toggle variant="falcon-default">
                      Bulk Action
                    </BootstrapDropdown.Toggle>
                    <BootstrapDropdown.Menu className="py-2">
                      {showDeleteAllOption && (
                        <BootstrapDropdown.Item onClick={handleBulkDelete}>
                          Delete All
                        </BootstrapDropdown.Item>
                      )}
                    </BootstrapDropdown.Menu>
                  </BootstrapDropdown>
                )}
              </div>
            </Col>
            <Col>
              <Pagination
                total={total_rows ?? 0}
                current={paginationCurrentPage}
                pageSize={paginationPageSize}
                pageSizeOptions={vars.PAGINATION_PAGE_SIZE_OPTIONS}
                onChange={(page, pageSize) => {
                  updateState({
                    paginationCurrentPage: page,
                    paginationPageSize: pageSize
                  });
                }}
              />
            </Col>
          </CustomRow>
        </FadeIn>
      );
    }
  };

  return (
    <>
      {processing && <LoaderOverlay />}
      {renderTabElement({
        available_templates,
        activeTemplate,
        onTemplateSelect
      })}

      <div className="bg-white p-3 min-vh-75" style={{ color: 'inherit' }}>
        <TemplateChecker
          {...props}
          {...state}
          isProfileAction={false}
          available_templates={available_templates}
          onTemplateSelect={onTemplateSelect}
          goToModuleAction={goToModuleAction}
          refetchData={refetchData}
          setThemeData={updateTheme}
        >
          {HeaderContent}
          {getMainContent()}
        </TemplateChecker>
      </div>

      <Modal
        destroyOnClose
        footer={null}
        style={{ top: 40 }}
        title="Customize Fields"
        visible={customizeFieldsModal}
        onCancel={() => {
          setCustomizeFieldsModal(false);
          refetch();
        }}
        bodyStyle={{ height: '80vh', overflow: 'scroll', position: 'relative' }}
      >
        <CustomizeFieldsUI finalEndpoint={finalEndpoint} />
      </Modal>
    </>
  );
}

export default DataModuleViewlist;
