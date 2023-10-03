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
  DatePicker,
  Divider,
  message
} from 'antd';
import { useParams } from 'react-router-dom';
import endpoint from '../../../utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { setMemberMenuData } from 'redux/slices/currentDataSlice';
import { Button, Form as BootstrapForm } from 'react-bootstrap';
import ListItems from 'components/custom/ListItems';
import moment from 'moment';
import VoucherList from 'components/custom/VoucherList';
const { Title, Text } = Typography;

const inputBorderRadius = { borderRadius: '10px' };
// const inputNumberStyle = { borderRadius: '10px', width: '100%' };

function UpdateIssuedVouchers() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  // const navigate = useNavigate();
  const dateFormat = 'YYYY-MM-DD HH:mm:ss';
  const _isMounted = useRef(false);
  let { routeKey, id } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const [branches, setBranches] = useState(null);
  const [memberList, setMemberList] = useState([]);
  const [voucherList, setVoucherList] = useState([]);
  const [branchISbb_loyal2_branchesID, set_branchISbb_loyal2_branchesID] =
    useState(null);
  const [memberISbb_usersID, set_memberISbb_usersID] = useState(null);
  const [voucherISbb_loyal2_vouchersID, set_voucherISbb_loyal2_vouchersID] =
    useState(null);
  const [filterVoucherStr, setFilterVoucherStr] = useState('');
  const [filterMemberStr, setFilterMemberStr] = useState('');
  const initPageModule = async () => {
    try {
      // default part
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getDataIssuedVoucherSchemaEndpoint(
        `${routeKey}/${id}`
      );
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      console.log(layoutSchema, ' schema.menu schema.menu schema.menu');
      dispatch(setMemberMenuData({ currentMemberMenuSchema: schema.menu })); // store current member menu
      const branchesList = await Axios.get(
        endpoint.getModuleDataEndpoint('bb_loyal2_branches')
      );
      setBranches(branchesList.data.list);
      const membersList = await Axios.get(
        endpoint.getDataManagerSchemaEndpoint('list')
      );
      setMemberList(membersList.data.layout.data);
      const vouchersList = await Axios.get(
        endpoint.getDataAllVoucherSchemaEndpoint('list')
      );
      setVoucherList(vouchersList.data.layout.data);
      set_branchISbb_loyal2_branchesID(
        layoutSchema.data[0][0].branchISbb_loyal2_branchesID
      );
      set_memberISbb_usersID(layoutSchema.data[0][0].memberISbb_usersID);
      set_voucherISbb_loyal2_vouchersID(
        layoutSchema.data[0][0].voucherISbb_loyal2_vouchersID
      );

      let value = layoutSchema.data[0][0].memberISbb_usersID;
      let index = membersList.data.layout.data.findIndex(val => {
        return value == val._id;
      });
      if (index === -1) value = '';
      else
        value =
          membersList.data.layout.data[index].last_name +
          ', ' +
          membersList.data.layout.data[index].first_name +
          ' ' +
          (membersList.data.layout.data[index].company_name === null
            ? ''
            : membersList.data.layout.data[index].company_name);
      setFilterMemberStr(value);

      value = layoutSchema.data[0][0].voucherISbb_loyal2_vouchersID;
      index = vouchersList.data.layout.data.findIndex(val => {
        return value == val._id;
      });
      if (index === -1) value = '';
      else value = vouchersList.data.layout.data[index].name;
      setFilterVoucherStr(value);
      const FieldsData = layoutSchema.data[0];
      form.setFieldsValue({
        voucherISbb_loyal2_vouchersID:
          FieldsData[0].voucherISbb_loyal2_vouchersID,
        ownerISbb_usersID: FieldsData[0].ownerISbb_usersID,
        code: FieldsData[0].code,
        points_usedNUM: FieldsData[0].points_usedNUM,
        _id: FieldsData[0]._id
      });
      _isMounted.current && setLayoutData(layoutSchema);
      //   setTransaction_date(layoutSchema.data[0][0].transaction_date);
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
      const {
        _id,
        // voucherISbb_loyal2_vouchersID,
        // ownerISbb_usersID
        code,
        points_usedNUM
        // memberISbb_usersID
      } = values;
      const transaction_date = values['transaction_date'].format(
        'YYYY-MM-DD HH:mm:ss'
      );
      const addMember = await Axios.patch(
        endpoint.getDataAddEndpoint(`bb_loyal2_vouchers_issued/${_id}`),
        {
          _id,
          voucherISbb_loyal2_vouchersID,
          // ownerISbb_usersID,
          transaction_date,
          code,
          points_usedNUM,
          memberISbb_usersID,
          branchISbb_loyal2_branchesID
        }
      );
      const user = addMember.data;
      if (user.error) return message.error(user.error);
      message.success('Updated successful!');
      // navigate('/datamanager/bb_loyal2_vouchers_issued/list');
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
  const changeBranch = e => {
    set_branchISbb_loyal2_branchesID(e.target.value);
  };
  let FieldsData = layoutData.data[0];
  const selectedStartDate = moment(FieldsData[0].transaction_date, dateFormat);

  const initValues = {
    transaction_date: selectedStartDate
  };

  return (
    <>
      <Row className="mx-4 mt-3">
        <Col span={24}>
          <Title level={3}>Vouchers Issued</Title>
        </Col>
      </Row>
      <Divider />
      <Row className="mx-4 mt-3">
        <Col span={24}>
          <Title level={4} className="mb-3">
            Edit a voucher issued record
          </Title>
        </Col>
      </Row>
      <Row className="mx-4 mt-3">
        <Col span={24}>
          <Form
            name="basic"
            labelCol={{
              span: 0
            }}
            wrapperCol={{
              span: 24
            }}
            initialValues={initValues}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            form={form}
            autoComplete="off"
          >
            <Form.Item name="_id" hidden="hidden">
              <Input />
            </Form.Item>
            <Row gutter={[16, 16]}>
              <Col xs={20} sm={10} md={10} lg={10} xl={10}>
                <Text strong className="text-label">
                  Voucher
                </Text>
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
              <Col xs={20} sm={10} md={10} lg={10} xl={10}>
                <Text strong className="text-label">
                  Qty
                </Text>
                <Form.Item
                  name="ownerISbb_usersID"
                  className="mt-1"
                  rules={[
                    {
                      required: false,
                      message: 'Please input Qty!'
                    }
                  ]}
                >
                  <Input style={inputBorderRadius} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={20} sm={10} md={10} lg={10} xl={10}>
                <Text strong className="text-label">
                  Member
                </Text>
                <Input
                  style={{ borderRadius: '10px' }}
                  type="text"
                  className="mt-1"
                  value={filterMemberStr}
                  onChange={e => setFilterMemberStr(e.target.value)}
                />
                <ListItems
                  items={memberList}
                  filter={filterMemberStr}
                  onCancel={() => {
                    set_memberISbb_usersID(null);
                    setFilterMemberStr('');
                  }}
                  onItemClick={(id, name) => {
                    set_memberISbb_usersID(id);
                    setFilterMemberStr(name);
                  }}
                ></ListItems>
              </Col>
              <Col xs={20} sm={10} md={10} lg={10} xl={10}>
                <Text strong className="text-label">
                  Code
                </Text>
                <Form.Item
                  name="code"
                  className="mt-1"
                  rules={[
                    {
                      required: false,
                      message: 'Please input code!'
                    }
                  ]}
                >
                  <Input style={inputBorderRadius} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={20} sm={10} md={10} lg={10} xl={10}>
                <Text strong className="text-label">
                  Transaction Date
                </Text>
                <Form.Item name="transaction_date" className="mt-1">
                  <DatePicker
                    value={selectedStartDate}
                    style={{ borderRadius: '10px', width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={20} sm={10} md={10} lg={10} xl={10}>
                <Text strong className="text-label">
                  Points Used
                </Text>
                <Form.Item
                  name="points_usedNUM"
                  className="mt-1"
                  rules={[
                    {
                      required: false,
                      message: 'Please input Points!'
                    }
                  ]}
                >
                  <Input style={inputBorderRadius} />
                </Form.Item>
              </Col>
            </Row>
            <Row align="middle" gutter={[16, 16]}>
              <Col xs={20} sm={10} md={10} lg={10} xl={10}>
                <Row align="middle">
                  <Col span={12}>
                    <Text strong className="text-label">
                      Branch
                    </Text>
                  </Col>
                  <Col span={12}>
                    <BootstrapForm.Select
                      style={inputBorderRadius}
                      defaultValue={branchISbb_loyal2_branchesID}
                      onChange={e => changeBranch(e)}
                    >
                      <option key={'null'} value={null}></option>
                      {branches.map((item, index) => {
                        return (
                          <>
                            <option key={index} value={item._id}>
                              {item.name}
                            </option>
                          </>
                        );
                      })}
                    </BootstrapForm.Select>
                  </Col>
                </Row>
              </Col>
              <Col xs={20} sm={10} md={10} lg={10} xl={10}>
                <Row justify="end" align="middle">
                  <Button
                    variant="outline-primary"
                    className="rounded-pill px-4 py-2"
                    type="submit"
                  >
                    Save
                  </Button>
                </Row>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </>
  );
}
export default UpdateIssuedVouchers;
