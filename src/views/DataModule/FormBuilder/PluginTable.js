import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Row, Spin, Table } from 'antd';

import endpoint from 'utils/endpoint';
import { isEmpty } from 'helpers/utils';
import handleError from 'utils/handleError';
import { generateColumnDefs } from '../HelperElements';
import { setCurrentData } from 'redux/slices/currentDataSlice';

class PluginTableComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      schema: null,
      dataList: this.props.initValue || [],
      rowKey: '_id'
    };
  }

  async init() {
    try {
      const { fieldData, record, setCurrentData, idFieldKey } = this.props;
      const _id = record[idFieldKey] || record._id;
      setCurrentData({
        fieldPluginTable: this.props.initValue || [],
        fieldPluginTableLoading: true
      });
      const { endpoint: ep, endpoint_2 } = fieldData;
      this.mounted && this.setState({ loading: true });
      const res = await axios.get(
        endpoint.getEndpointWithSuffix(ep.replace(':id', _id))
      );
      console.log('Plugin View Schema:', res.data);
      this.mounted && this.setState({ schema: res.data });
      if (endpoint_2) {
        const dataRes = await axios.get(
          endpoint.getEndpointWithSuffix(endpoint_2.replace(':id', _id))
        );
        console.log('Plugin View Res:', dataRes.data);
        const dataListRes = dataRes.data?.list || [];
        this.mounted &&
          this.setState({
            rowKey: '__serial',
            dataList: dataListRes.map((x, i) => ({ ...x, __serial: i }))
          });
        setCurrentData({
          fieldPluginTable: dataListRes,
          fieldPluginTableLoading: false
        });
      }
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

  render() {
    const { loading, schema, dataList, rowKey } = this.state;

    if (loading) {
      return (
        <Row justify="center" className="w-100 my-2">
          <Spin />
        </Row>
      );
    }

    if (isEmpty(schema)) return null;

    const genActionCol = false;
    const columnDefs = generateColumnDefs(schema.fields, genActionCol);

    return (
      <>
        <div style={{ fontWeight: 'normal' }}>
          <Table
            rowKey={rowKey}
            pagination={false}
            size="small"
            bordered
            className="my-2"
            loading={this.state.loading}
            scroll={{ x: 'max-content' }}
            dataSource={dataList}
            columns={columnDefs}
          />
        </div>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setCurrentData: data => dispatch(setCurrentData(data))
});

export default connect(null, mapDispatchToProps)(PluginTableComponent);
