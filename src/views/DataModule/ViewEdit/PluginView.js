import axios from 'axios';
import { clone } from 'ramda';
import shortid from 'shortid';
import { connect } from 'react-redux';
import { Card } from 'react-bootstrap';
import React, { Component } from 'react';
import { CaretDownFilled, PlusSquareOutlined } from '@ant-design/icons';
import { EditOutlined, EyeOutlined, SaveOutlined } from '@ant-design/icons';
import {
  Select,
  Table,
  Button,
  message,
  Tooltip,
  Row,
  Spin,
  Modal
} from 'antd';

import keys from 'utils/keys';
import vars from 'utils/vars';
import endpoint from 'utils/endpoint';
import handleError from 'utils/handleError';
import GenericViewer from './GenericViewer';
import { withRouter } from 'utils/withRouter';
import DataModuleEditForm from './DataModuleEdit';
import { setThemeData } from 'redux/slices/themeSlice';
import DataModuleAddComponent from '../Add/DataModuleAdd';
import DeleteDataItemBtn from '../Elements/DeleteDataItemBtn';
import { EditableCell, EditableRow } from '../FormBuilder/InlineAddEdit';
import {
  Btn,
  CustomRow,
  generateColumnDefs,
  getDataSlice
} from '../HelperElements';
import {
  checkHasPermission,
  defaultLocalSortFunction,
  getTableScrollProps,
  isEmpty
} from 'helpers/utils';

class PluginView extends Component {
  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  constructor(props) {
    super(props);
    this.state = {
      localDataToAdd: [],
      loading: false,
      paginationPageSize: vars.PAGINATION_PAGE_SIZE_OPTIONS[0],
      addModal: false,
      editingData: null,
      viewingData: null
    };
  }

  handleSaveNew = async () => {
    const { plugin, schema } = this.props.pluginData;
    const { localDataToAdd, paginationPageSize } = this.state;
    if (!localDataToAdd || localDataToAdd.length === 0) return;
    const requireFields = schema.fields
      .filter(x => !!x.required)
      .map(y => y.field);
    const data = clone(localDataToAdd).map(x => {
      delete x._id;
      delete x.local;
      if (x.hasOwnProperty(`${plugin.module_link_field}_display`)) {
        delete x[`${plugin.module_link_field}_display`];
      }
      return x;
    });
    const valid = data
      .map(x => {
        const fields = Object.keys(x);
        return requireFields
          .map(y => fields.includes(y) && x[y] !== null && x[y] !== undefined)
          .every(z => !!z);
      })
      .every(item => !!item);

    if (!valid) {
      return message.error(
        'Form missing required value. Please fill all the fields correctly!'
      );
    }

    try {
      const { module } = schema;
      console.log(`[${module}]PostData for Bulk ADD action:`, data);
      this.mounted && this.setState({ loading: true });
      const res = await axios.post(
        endpoint.getDataAddEndpoint(module) + '/batch',
        data
      );
      console.log(`[${module}]Bulk ADD action response:`, res.data);
      if (this.getTotalDataLength() === paginationPageSize) {
        // That means showing 'all' and just added new items. So update the paginationPageSize
        const length = res.data?.list?.length || 0;
        this.mounted &&
          this.setState({ paginationPageSize: paginationPageSize + length });
      }
      this.props.addItemsToPlugin(plugin, res.data.list);
      this.mounted && this.setState({ loading: false, localDataToAdd: [] });
      message.success('Data saved successfully!');
    } catch (error) {
      handleError(error, true);
      this.mounted && this.setState({ loading: false });
    }
  };

  updateLocalDataToAdd = item => {
    this.setState({
      localDataToAdd: this.state.localDataToAdd.map(x => {
        if (x._id === item._id) {
          return { ...x, ...item };
        } else {
          return x;
        }
      })
    });
  };

  deletePluginDataItem = id => {
    const { plugin } = this.props.pluginData;
    this.props.handlePluginDataItemDelete(plugin, id, () => {
      this.setState({ paginationPageSize: this.getTotalDataLength() });
    });
  };

  filterLocalDataToAdd = id => {
    this.setState({
      localDataToAdd: this.state.localDataToAdd.filter(x => {
        return x._id !== id;
      })
    });
  };

  getData = () => {
    const data = this.props.pluginData?.data?.list || [];
    const localData = this.state.localDataToAdd || [];

    return [
      ...getDataSlice(data, 1, this.state.paginationPageSize),
      ...localData
    ];
  };

  getTotalDataLength = () => {
    const data = this.props.pluginData?.data?.list || [];
    // const localData = this.state.localDataToAdd || []
    // return data.length + localData.length
    return data.length;
  };

  getAddModalTitle = () => {
    const {
      plugin: { module }
    } = this.props.pluginData;

    switch (module) {
      default:
        return 'Add';
    }
  };

  getEditModalTitle = () => {
    const {
      plugin: { module }
    } = this.props.pluginData;

    switch (module) {
      default:
        return 'Edit';
    }
  };

  getViewModalTitle = () => {
    const {
      plugin: { module }
    } = this.props.pluginData;

    switch (module) {
      default:
        return 'View';
    }
  };

  getModalHeight = () => {
    const {
      plugin: { module }
    } = this.props.pluginData;

    switch (module) {
      default:
        return '80vh';
    }
  };

  shouldShowViewIcon = () => {
    const {
      plugin: { module }
    } = this.props.pluginData;

    switch (module) {
      default:
        return true;
    }
  };

  render() {
    const { params, navigate, pluginData } = this.props;
    const { id: parentID } = params;
    const { plugin, schema } = pluginData;
    const hasAddPermission = checkHasPermission(
      keys.ADD_PERMISSIONS_KEY,
      null,
      schema.permissions
    );

    let components = {};
    if (plugin.dynamic) {
      components = { body: { row: EditableRow, cell: EditableCell } };
    }

    const tableData = this.getData();

    let addBtnLabel = 'Add Row';

    return (
      <>
        <Card className="mt-3 mb-0">
          {/* Left Second*/}
          <Card.Header className="app-table-header">
            <CustomRow style={{ minHeight: 32 }}>
              <h5 style={{ margin: 0 }} className="me-1">
                {plugin.name}
              </h5>
              {tableData.length > keys.PAGINATION_PAGE_SIZE_OPTIONS[0] && (
                <Select
                  value={this.state.paginationPageSize}
                  style={{ width: 125 }}
                  suffixIcon={<CaretDownFilled className="caret-icon" />}
                  onChange={value => {
                    this.mounted &&
                      this.setState({ paginationPageSize: value });
                  }}
                >
                  {keys.PAGINATION_PAGE_SIZE_OPTIONS.map((size, index) => (
                    <Select.Option key={index} value={size}>
                      {size} / page
                    </Select.Option>
                  ))}
                  <Select.Option key={'all'} value={this.getTotalDataLength()}>
                    View All
                  </Select.Option>
                </Select>
              )}
            </CustomRow>
          </Card.Header>

          <Table
            rowKey="_id"
            pagination={false}
            size="small"
            bordered
            loading={this.state.loading}
            components={components}
            scroll={getTableScrollProps(this.props)}
            dataSource={tableData}
            columns={generateColumnDefs(
              schema.fields.filter(x => x.field !== plugin.module_link_field)
            ).map(column => {
              const { dataIndex } = column;
              if (dataIndex === 'action') {
                return {
                  ...column,
                  align: 'center',
                  render: (_, dataRow) => {
                    const { _id, local, _permissions } = dataRow;
                    const goToModuleAction = action => {
                      this.props.setThemeData({
                        currentDataID:
                          action[0].toUpperCase() +
                            action.slice(1) +
                            ' - ' +
                            _id ?? '*'
                      });
                      navigate(`/data/${schema.module}/${action}/${_id}`);
                    };

                    const hasEditPermission = checkHasPermission(
                      keys.EDIT_PERMISSIONS_KEY,
                      _permissions,
                      schema.permissions
                    );
                    const hasDeletePermission = checkHasPermission(
                      keys.DELETE_PERMISSIONS_KEY,
                      _permissions,
                      schema.permissions
                    );

                    return (
                      <>
                        {local !== true && (
                          <>
                            {this.shouldShowViewIcon() && (
                              <Tooltip title="View">
                                <Button
                                  type="link"
                                  size="small"
                                  onClick={() => {
                                    if (plugin.dynamic === false)
                                      return this.setState({
                                        viewingData: dataRow
                                      });
                                    goToModuleAction(keys.DATA_VIEW_ACTION);
                                  }}
                                >
                                  <EyeOutlined />
                                </Button>
                              </Tooltip>
                            )}

                            {hasEditPermission && (
                              <Tooltip title="Edit">
                                <Button
                                  type="link"
                                  size="small"
                                  onClick={() => {
                                    if (plugin.dynamic === false)
                                      return this.setState({
                                        editingData: dataRow
                                      });
                                    goToModuleAction(keys.DATA_EDIT_ACTION);
                                  }}
                                >
                                  <EditOutlined className="edit-icon-color" />
                                </Button>
                              </Tooltip>
                            )}
                          </>
                        )}

                        <DeleteDataItemBtn
                          hasDeletePermission={hasDeletePermission}
                          id={_id}
                          module={schema.module}
                          local={local}
                          onDelete={id =>
                            local
                              ? this.filterLocalDataToAdd(id)
                              : this.deletePluginDataItem(id)
                          }
                        />
                      </>
                    );
                  }
                };
              }

              let className = column.className;
              if (plugin.dynamic === false) {
                className += ' cursor-auto';
              }
              if (column.type) {
                column = {
                  ...column,
                  className,
                  sorter: (a, b) =>
                    defaultLocalSortFunction(a, b, dataIndex, column)
                };
              }

              if (!column.editable || plugin.dynamic === false) return column;

              return {
                ...column,
                onCell: record => {
                  const hasEditPermission = checkHasPermission(
                    keys.EDIT_PERMISSIONS_KEY,
                    record._permissions,
                    schema.permissions
                  );
                  return {
                    column: column,
                    record,
                    editable: column.editable,
                    dataIndex: column.dataIndex,
                    handleUpdateUI: row =>
                      this.props.handleUpdateUI(row, plugin),
                    moduleData: { module_name: schema.module },
                    updateLocalDataToAdd: this.updateLocalDataToAdd,
                    plugin,
                    hasEditPermission
                  };
                }
              };
            })}
          />

          {hasAddPermission && (
            <Card.Footer className="app-table-footer">
              <Btn
                icon={
                  <PlusSquareOutlined
                    style={{ fontSize: 18, verticalAlign: 'initial' }}
                  />
                }
                label={addBtnLabel}
                onClick={() => {
                  if (plugin.dynamic === false) {
                    return this.setState({ addModal: true });
                  }
                  const requireFields = schema.fields.filter(x => !!x.required);
                  const newPluginDataItem = {
                    _id: shortid.generate(),
                    local: true
                  };
                  requireFields.forEach(
                    x => (newPluginDataItem[x.field] = null)
                  ); // Set all required field val null
                  newPluginDataItem[plugin.module_link_field] = parentID;
                  newPluginDataItem[`${plugin.module_link_field}_display`] =
                    this.props.parentName;
                  this.setState({
                    localDataToAdd: [
                      ...this.state.localDataToAdd,
                      newPluginDataItem
                    ]
                  });
                }}
              />

              {this.state.localDataToAdd.length > 0 && (
                <Btn
                  icon={
                    <SaveOutlined
                      style={{ fontSize: 18, verticalAlign: 'initial' }}
                    />
                  }
                  label="Save"
                  style={{ fontWeight: 500 }}
                  onClick={this.handleSaveNew}
                />
              )}
            </Card.Footer>
          )}
        </Card>

        <Modal
          title={this.getAddModalTitle()}
          visible={this.state.addModal}
          footer={null}
          destroyOnClose
          onCancel={() => this.setState({ addModal: false })}
          maskClosable={false}
          style={{ top: 40 }}
          bodyStyle={{ height: this.getModalHeight(), overflow: 'scroll' }}
          className="ant-modal-width-mid"
        >
          <AddPluginUI
            parentID={parentID}
            parentProps={this.props}
            onFinish={() => {
              this.setState({ addModal: false }, this.props.refetchData);
            }}
          />
        </Modal>

        <Modal
          title={this.getEditModalTitle()}
          visible={!isEmpty(this.state.editingData)}
          footer={null}
          destroyOnClose
          onCancel={() => this.setState({ editingData: null })}
          maskClosable={false}
          style={{ top: 40 }}
          bodyStyle={{ height: this.getModalHeight(), overflow: 'scroll' }}
          className="ant-modal-width-mid"
        >
          <EditPluginUI
            parentID={parentID}
            parentProps={this.props}
            data={this.state.editingData}
            onFinish={() => {
              this.setState({ editingData: null }, this.props.refetchData);
            }}
          />
        </Modal>

        <Modal
          title={this.getViewModalTitle()}
          visible={!isEmpty(this.state.viewingData)}
          footer={null}
          destroyOnClose
          onCancel={() => this.setState({ viewingData: null })}
          style={{ top: 40 }}
          bodyStyle={{ height: this.getModalHeight(), overflow: 'scroll' }}
          className="ant-modal-width-mid"
        >
          <ViewPluginUI
            parentID={parentID}
            parentProps={this.props}
            data={this.state.viewingData}
            onFinish={() => {
              this.setState({ viewingData: null });
            }}
          />
        </Modal>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setThemeData: themeData => dispatch(setThemeData(themeData))
});

export default connect(null, mapDispatchToProps)(withRouter(PluginView));

function AddPluginUI(props) {
  const { parentID, parentProps, onFinish } = props;
  const { plugin, schema } = parentProps.pluginData;
  const _isMounted = React.useRef(false);
  const [loading, setLoading] = React.useState(true);
  const [schemaData, setSchemaData] = React.useState(true);

  const getModuleSchema = async () => {
    try {
      _isMounted.current && setLoading(true);
      const ep = endpoint.getDataModuleSchemaEndpoint(
        schema.module,
        keys.DATA_ADD_ACTION
      );
      const moduleSchemaRes = await axios.get(ep);
      console.log('Add Page Module Schema:', moduleSchemaRes.data);
      _isMounted.current && setSchemaData(moduleSchemaRes.data);
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoading(false);
    }
  };

  React.useEffect(() => {
    _isMounted.current = true;
    getModuleSchema();
    return () => {
      _isMounted.current = false;
    };
  }, []);

  if (loading)
    return (
      <Row justify="center" align="middle" style={{ minHeight: 400 }}>
        <Spin size="large" />
      </Row>
    );

  if (isEmpty(schemaData)) return null;

  const getSubmitBtnText = () => {
    switch (plugin.module) {
      default:
        return undefined;
    }
  };

  // console.log({ parentProps, schemaData })

  return (
    <DataModuleAddComponent
      {...parentProps}
      {...schemaData}
      onFinishCallback={onFinish}
      onFinishGoToView={false}
      originFromModal={true}
      submitBtnTxt={getSubmitBtnText()}
      defaultValues={{
        [plugin.module_link_field]: parentID
      }}
      excludeFields={[plugin.module_link_field]}
    />
  );
}

function EditPluginUI(props) {
  const { parentID, parentProps, onFinish, data } = props;
  const { plugin, schema } = parentProps.pluginData;
  const _isMounted = React.useRef(false);
  const [loading, setLoading] = React.useState(true);
  const [dataItem, setDataItem] = React.useState({});
  const [schemaData, setSchemaData] = React.useState(true);

  const getModuleSchema = async () => {
    try {
      _isMounted.current && setLoading(true);
      const ep = endpoint.getModuleSchemaEndpoint(
        schema.module,
        keys.DATA_EDIT_ACTION
      );
      const moduleSchemaRes = await axios.get(ep);
      console.log('Plugin edit Module Schema:', moduleSchemaRes.data);
      _isMounted.current && setSchemaData(moduleSchemaRes.data);
      const dataItemReq = await axios.get(
        endpoint.getDataItemViewEndpoint(schema.module, data._id)
      );
      const dataItemRes = dataItemReq.data || {};
      console.log('Plugin edit data item:', dataItemRes);
      _isMounted.current && setDataItem(dataItemRes);
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoading(false);
    }
  };

  React.useEffect(() => {
    _isMounted.current = true;
    getModuleSchema();
    return () => {
      _isMounted.current = false;
    };
  }, []);

  if (loading)
    return (
      <Row justify="center" align="middle" style={{ minHeight: 400 }}>
        <Spin size="large" />
      </Row>
    );

  if (isEmpty(schemaData)) return null;

  return (
    <DataModuleEditForm
      {...parentProps}
      {...schemaData}
      data={{ ...data, ...dataItem }}
      originatedFromModal={true}
      onEdit={onFinish}
      isProfileAction={false}
      onFinishGoToView={false}
      showDeleteButton={false}
      checkSubmitBtnShouldDisable={false}
      defaultValues={{
        [plugin.module_link_field]: parentID
      }}
      excludeFields={[plugin.module_link_field]}
    />
  );
}

function ViewPluginUI(props) {
  const { parentProps, data } = props;
  const { schema } = parentProps.pluginData;
  const _isMounted = React.useRef(false);
  const [loading, setLoading] = React.useState(false);
  const [schemaData, setSchemaData] = React.useState(null);
  const [dataItem, setDataItem] = React.useState({});

  React.useEffect(() => {
    _isMounted.current = true;
    getData();
    return () => {
      _isMounted.current = false;
    };
  }, []);

  const getData = async () => {
    try {
      _isMounted.current && setLoading(true);
      const ep = endpoint.getModuleSchemaEndpoint(
        schema.module,
        keys.DATA_VIEW_ACTION
      );
      const moduleSchemaRes = await axios.get(ep);
      console.log('Plugin View Schema:', moduleSchemaRes.data);
      _isMounted.current && setSchemaData(moduleSchemaRes.data);
      const dataItemRes = await axios.get(
        endpoint.getDataItemViewEndpoint(schema.module, data._id)
      );
      console.log('Plugin Item View:', dataItemRes.data);
      _isMounted.current && setDataItem(dataItemRes.data || {});
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoading(false);
    }
  };

  if (loading) {
    return (
      <Row justify="center" className="w-100 mt-3">
        <Spin />
      </Row>
    );
  }

  if (isEmpty(schemaData)) return null;

  return (
    <>
      <GenericViewer
        data={{ ...data, ...dataItem }}
        columns={schemaData.fields}
        maxColsNUM={schemaData.template?.colsNUM ?? 3}
        gridStyles={{ sectionTitleBeforeElClass: 'mt-3' }}
      />
    </>
  );
}
