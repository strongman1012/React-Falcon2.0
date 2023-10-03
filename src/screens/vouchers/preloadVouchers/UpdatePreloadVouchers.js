import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  Typography,
  Form,
  // InputNumber,
  Input,
  Row,
  Col,
  Tooltip,
  message,
  Divider
  // DatePicker
} from 'antd';
import { useParams } from 'react-router-dom';
import { QuestionCircleOutlined } from '@ant-design/icons';
import endpoint from '../../../utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { setMemberMenuData } from 'redux/slices/currentDataSlice';
import { Button } from 'react-bootstrap';
import VoucherList from 'components/custom/VoucherList';

const { Title, Text } = Typography;

const inputBorderRadius = { borderRadius: '10px' };
const btnQuestion = {
  backgroundColor: '#359DD9',
  borderRadius: '50%',
  border: 'none',
  color: 'white',
  fontSize: '21px'
};
// const inputNumberStyle = { borderRadius: '10px', width: '100%' };

function UpdatePreloadVouchers() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const _isMounted = useRef(false);
  let { routeKey, id } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const [voucherList, setVoucherList] = useState([]);
  const [voucherISbb_loyal2_vouchersID, set_voucherISbb_loyal2_vouchersID] =
    useState(null);
  const [filterVoucherStr, setFilterVoucherStr] = useState('');
  const initPageModule = async () => {
    try {
      // default part
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getDataPreloadVoucherSchemaEndpoint(
        `${routeKey}/${id}`
      );
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      dispatch(setMemberMenuData({ currentMemberMenuSchema: schema.menu })); // store current member menu
      const vouchersList = await Axios.get(
        endpoint.getDataAllVoucherSchemaEndpoint('list')
      );
      setVoucherList(vouchersList.data.layout.data);
      set_voucherISbb_loyal2_vouchersID(
        layoutSchema.data[0][0].voucherISbb_loyal2_vouchersID
      );
      let value = layoutSchema.data[0][0].voucherISbb_loyal2_vouchersID;
      let index = vouchersList.data.layout.data.findIndex(val => {
        return value == val._id;
      });
      if (index === -1) value = '';
      else value = vouchersList.data.layout.data[index].name;
      setFilterVoucherStr(value);
      let FieldsData = layoutSchema.data[0];
      form.setFieldsValue({
        code: FieldsData[0].code,
        voucherISbb_loyal2_vouchersID:
          FieldsData[0].voucherISbb_loyal2_vouchersID,
        _id: FieldsData[0]._id
      });
      _isMounted.current && setLayoutData(layoutSchema);
      // end default part
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
    }
  };

  useEffect(() => {
    _isMounted.current = true;
    initPageModule();
    return () => {
      _isMounted.current = false;
    };
  }, []);

  if (loadingSchema) {
    return <Loading style={{ marginTop: 150 }} msg="Loading Schema..." />;
  }
  if (!layoutData) return getErrorAlert({ onRetry: initPageModule });

  const onFinish = async values => {
    console.log('Success:', values);
    try {
      _isMounted.current && setLoadingSchema(true);
      const { _id, code } = values;
      const addMember = await Axios.patch(
        endpoint.getDataAddEndpoint(`bb_loyal2_vouchers_precodes/${_id}`),
        {
          _id,
          code,
          voucherISbb_loyal2_vouchersID
        }
      );
      const user = addMember.data;
      if (user.error) return message.error(user.error);
      message.success('Updated successful!');
      initPageModule();
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
    }
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Row className="mx-4 mt-3">
        <Col span={24}>
          <Title level={3}>Pre-loaded Voucher Codes</Title>
        </Col>
      </Row>
      <Divider />
      <Row className="mx-4 mt-3">
        <Col span={24}>
          <Title level={4} className="mb-3">
            Edit a pre-loaded voucher code
          </Title>
        </Col>
      </Row>
      <Row className="mx-4 mt-3">
        <Col span={20}>
          <Form
            name="basic"
            labelCol={{
              span: 0
            }}
            wrapperCol={{
              span: 24
            }}
            initialValues={{
              remember: true
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            form={form}
            autoComplete="off"
          >
            <Form.Item name="_id" hidden="hidden">
              <Input />
            </Form.Item>
            <Row gutter={[16, 16]} className="mt-4" align="bottom">
              <Col xs={24} sm={12} md={9} lg={9} xl={9}>
                <Row align="middle">
                  {' '}
                  <Text strong className="text-label">
                    Code
                  </Text>{' '}
                  <Tooltip
                    placement="right"
                    className="mx-2"
                    title="code"
                    color="#359dd9"
                  >
                    <QuestionCircleOutlined style={btnQuestion} />
                  </Tooltip>
                </Row>
                <Row className="mt-1">
                  <Col span={24}>
                    <Form.Item
                      name="code"
                      className="m-0"
                      rules={[
                        {
                          required: true,
                          message: 'Please input Cod!'
                        }
                      ]}
                    >
                      <Input style={inputBorderRadius} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={12} md={9} lg={9} xl={9}>
                <Row align="middle">
                  {' '}
                  <Text strong className="text-label">
                    Voucher
                  </Text>{' '}
                  <Tooltip
                    placement="right"
                    className="mx-2"
                    title="voucher"
                    color="#359dd9"
                  >
                    <QuestionCircleOutlined style={btnQuestion} />
                  </Tooltip>
                </Row>
                <Row className="mt-1">
                  <Col span={24}>
                    <Input
                      style={{ borderRadius: '10px' }}
                      type="text"
                      className="mt-1"
                      value={filterVoucherStr}
                      onChange={e => setFilterVoucherStr(e.target.value)}
                    />
                    <VoucherList
                      items={voucherList}
                      filter={filterVoucherStr}
                      onCancel={() => {
                        set_voucherISbb_loyal2_vouchersID(null);
                        setFilterVoucherStr('');
                      }}
                      onItemClick={(id, name) => {
                        set_voucherISbb_loyal2_vouchersID(id);
                        setFilterVoucherStr(name);
                      }}
                    ></VoucherList>
                  </Col>
                </Row>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={6}
                lg={6}
                xl={6}
                style={{ textAlign: 'end' }}
              >
                <Button
                  variant="outline-primary"
                  className="rounded-pill px-4 py-2"
                  type="submit"
                >
                  Save
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </>
  );
}
export default UpdatePreloadVouchers;
