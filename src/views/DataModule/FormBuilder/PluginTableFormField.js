import axios from 'axios';
import React from 'react';
import shortid from 'shortid';
import { PlusSquareOutlined } from '@ant-design/icons';
import { arrayMoveImmutable as arrayMove } from 'array-move';
import { Spin, Button, Tooltip, message, Row, Table, Card, Modal } from 'antd';

import keys from 'utils/keys';
import endpoint from 'utils/endpoint';
import handleError from 'utils/handleError';
import { EditableCell, EditableRow } from './InlineAddEdit';
import { getPopupContainer, getTableScrollProps, isEmpty } from 'helpers/utils';
import {
  SortableItem,
  SortableContainer,
  generateColumnDefs
} from '../HelperElements';

export default class PluginTableFormField extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      schema: null,
      dataList: this.props.initValue || [],
      itemDeleting: '',
      addModal: false,
      editingData: null,
      viewingData: null,
      savingSort: false,
      addModalTitle: '',
      editModalTitle: '',
      modalClass: ''
    };
  }

  async init() {
    try {
      const { fieldData, allData } = this.props;
      const { endpoint: ep, endpoint_2 } = fieldData;
      this.mounted && this.setState({ loading: true });
      const res = await axios.get(endpoint.getEndpointWithSuffix(ep));
      console.log('Plugin Field Dynamic Schema:', res.data);
      if (endpoint_2) {
        const dataRes = await axios.get(
          endpoint.getEndpointWithSuffix(endpoint_2.replace(':id', allData._id))
        );
        console.log('Plugin View Res:', dataRes.data);
        const dataListRes = dataRes.data?.list || [];
        this.mounted && this.setState({ dataList: dataListRes });
      }
      this.mounted && this.setState({ schema: res.data });
    } catch (error) {
      handleError(error, true);
    } finally {
      this.mounted && this.setState({ loading: false });
    }
  }

  componentDidMount() {
    this.mounted = true;
    this.init();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateLocalDataToAdd = item => {
    const updates = this.state.dataList.map(x => {
      if (x._id === item._id) {
        return { ...x, ...item };
      } else {
        return x;
      }
    });
    this.mounted && this.setState({ dataList: updates });
    this.props.updatePluginData(this.props.fieldData.field, updates);
  };

  handleItemDelete = async (row, onlyLocal = false) => {
    let updates;
    if (row.local === true) {
      updates = this.state.dataList.filter(x => x._id !== row._id);
    } else {
      updates = this.state.dataList.map(x => {
        if (x._id === row._id) {
          return { ...x, _deleted: 1 };
        } else if (x.id === row.id) {
          return { ...x, _deleted: 1 };
        } else {
          return x;
        }
      });
    }

    this.mounted && this.setState({ dataList: updates });
    if (!onlyLocal) {
      this.props.updatePluginData(this.props.fieldData.field, updates);
    }
  };

  getTableData = () =>
    this.state.dataList.filter(
      x => typeof x._deleted !== 'string' && !x._deleted
    );

  onSortEnd = async ({ oldIndex, newIndex }) => {
    const { dataList, schema } = this.state;
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(dataList), oldIndex, newIndex).filter(
        el => !!el
      );
      console.log('Sorted items: ', newData);
      this.mounted && this.setState({ dataList: newData, savingSort: true });

      let hide;
      try {
        hide = message.loading('Saving Changes...', 0);
        const postData = newData.map((x, i) => ({
          _id: x._id,
          orderNUM: i + 1
        }));
        console.log('Sorting PostData:', postData);
        const sortingRes = await axios.patch(
          endpoint.getBatchEndpointForSort(schema.module),
          postData
        );
        const resData = sortingRes.data;
        console.log('Sorting Res:', resData);
        this.mounted && this.setState({ dataList: resData?.list || [] });
      } catch (error) {
        handleError(error, true);
      } finally {
        hide && hide();
        this.mounted && this.setState({ savingSort: false });
      }
    }
  };

  DraggableContainer = props => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={this.onSortEnd}
      {...props}
    />
  );

  // eslint-disable-next-line no-unused-vars
  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const data = this.getTableData();
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = data.findIndex(x => x._id === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  handleAddNew = () => {
    const { schema } = this.state;
    const requireFields = schema.fields.filter(x => !!x.required);
    const newPluginDataItem = { _id: shortid.generate(), local: true };
    requireFields.forEach(x => (newPluginDataItem[x.field] = null)); // Set all required field val null
    this.setState({ dataList: [...this.state.dataList, newPluginDataItem] });
  };

  getEditButton = () => {
    return null;
  };

  getDeleteButton = () => {
    return null;
  };

  getViewButton = () => {
    return null;
  };

  getAddButton = () => {
    return (
      <Tooltip
        title="Add Row"
        getPopupContainer={getPopupContainer}
        placement="left"
      >
        <Button
          type="link"
          size="small"
          icon={<PlusSquareOutlined style={{ verticalAlign: 'initial' }} />}
          onClick={this.handleAddNew}
        />
      </Tooltip>
    );
  };

  onAddFinish = newItem => {
    this.mounted &&
      this.setState({ dataList: [...this.state.dataList, newItem] }, () =>
        this.setState({ addModal: false })
      );
  };

  onEditFinish = item => {
    this.mounted &&
      this.setState(
        {
          dataList: this.state.dataList.map(x => {
            if (x._id === item._id) {
              return { ...x, ...item };
            } else if (x.id === item.id) {
              return { ...x, ...item };
            }
            return x;
          })
        },
        () => this.setState({ editingData: null })
      );
  };

  getDynamicModalComponent = () => {
    return null;
  };

  render() {
    const { loading, schema, savingSort } = this.state;

    if (loading) {
      return (
        <Row justify="center" className="w-100 my-2">
          <Spin />
        </Row>
      );
    }

    if (isEmpty(schema)) return null;

    const { template } = schema;

    let isCellEditable = true;
    let actionCol = false;
    let rowKey = '_id';
    let addModalClassName = '';
    let editModalClassName = '';
    let modalBodyCommonStyles = {};

    return (
      <>
        <Card
          size="small"
          extra={this.getAddButton()}
          bodyStyle={{ padding: 0 }}
          style={{
            pointerEvents: savingSort ? 'none' : 'auto',
            opacity: savingSort ? 0.6 : 1
          }}
        >
          <Table
            rowKey={rowKey}
            pagination={false}
            size="small"
            bordered
            loading={this.state.loading}
            components={
              template?.sortableYN
                ? {
                    body: {
                      wrapper: this.DraggableContainer,
                      row: this.DraggableBodyRow
                    }
                  }
                : { body: { row: EditableRow, cell: EditableCell } }
            }
            scroll={getTableScrollProps(this.props)}
            dataSource={this.getTableData()}
            columns={generateColumnDefs(
              schema.fields,
              actionCol,
              template?.sortableYN,
              isCellEditable
            ).map((column, index) => {
              if (index === 2) {
                column.className = 'drag-visible';
              }
              const { dataIndex } = column;
              if (dataIndex === 'action') {
                return {
                  ...column,
                  align: 'center',
                  render: (_, row) => {
                    return (
                      <>
                        {this.getViewButton(row)}

                        {this.getEditButton(row)}

                        {this.getDeleteButton(row)}
                      </>
                    );
                  }
                };
              }

              if (!column.editable) return column;

              return {
                ...column,
                onCell: record => {
                  return {
                    column: column,
                    record,
                    editable: column.editable,
                    dataIndex: column.dataIndex,
                    moduleData: { module_name: schema.module },
                    updateLocalDataToAdd: this.updateLocalDataToAdd,
                    hasEditPermission: true,
                    origin_plugin_table: true,
                    havingDropdownProblem: [
                      ...keys.SELECT_TYPES,
                      'lookup'
                    ].includes(column.type)
                      ? true
                      : false,
                    formFieldGenExtraData: this.props.extraData,
                    singleClickGoToView: false,
                    singleClickOpenEdit: true
                  };
                }
              };
            })}
          />
        </Card>
        <Modal
          destroyOnClose
          title={this.state.addModalTitle}
          className={this.state.modalClass || addModalClassName}
          visible={this.state.addModal}
          onCancel={() => this.setState({ addModal: false })}
          style={{ top: 40 }}
          bodyStyle={{
            minHeight: '50vh',
            overflow: 'scroll',
            ...modalBodyCommonStyles
          }}
          footer={null}
        >
          {this.getDynamicModalComponent('add')}
        </Modal>
        <Modal
          title={this.state.editModalTitle}
          visible={!isEmpty(this.state.editingData)}
          footer={null}
          destroyOnClose
          onCancel={() => this.setState({ editingData: null })}
          maskClosable={false}
          style={{ top: 40 }}
          bodyStyle={{
            minHeight: '50vh',
            overflow: 'scroll',
            ...modalBodyCommonStyles
          }}
          className={this.state.modalClass || editModalClassName}
        >
          {this.getDynamicModalComponent('edit')}
        </Modal>
      </>
    );
  }
}
