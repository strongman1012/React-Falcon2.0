import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  Typography,
  Form,
  Input,
  // Select,
  Row,
  Col,
  message,
  InputNumber,
  DatePicker
} from 'antd';

import { useParams, useNavigate } from 'react-router-dom';
import endpoint from '../../utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { setTransactionMenuData } from 'redux/slices/currentDataSlice';
import { Button, Form as BootstrapForm } from 'react-bootstrap';
import ListItems from 'components/custom/ListItems';
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const inputStyle = {
  borderRadius: '10px',
  width: '100%'
};
function UpdateTransaction() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const _isMounted = useRef(false);
  let { routeKey, id } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const dateFormat = 'YYYY-MM-DD';
  const [branch_val, setBranch_val] = useState('');
  const [branches, setBranches] = useState([]);
  const [memberIDList, setMemberIDList] = useState([]);
  const [memberISbb_usersID, set_memberISbb_usersID] = useState(null);
  const [setting_show, setSetting_show] = useState(false);
  const [filterMemberStr, setFilterMemberStr] = useState('');
  const setting_click = () => {
    if (setting_show == false) {
      setSetting_show(true);
    }
    if (setting_show == true) {
      setSetting_show(false);
    }
  };
  const selectchange1 = e => {
    setBranch_val(e.target.value);
  };
  console.log(routeKey, id, '123');
  const initPageModule = async () => {
    try {
      // default part
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getDataTransactionSchemaEndpoint(`${routeKey}/${id}`);
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      const branchesList = await Axios.get(
        endpoint.getModuleDataEndpoint('bb_loyal2_branches')
      );
      setBranches(branchesList.data.list);
      const membersIDList = await Axios.get(
        endpoint.getDataManagerSchemaEndpoint('list')
      );
      setMemberIDList(membersIDList.data.layout.data);
      let layoutSchema = schema.layout;
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      setBranch_val(layoutSchema.data[0][0].branchISbb_loyal2_branchesID);
      set_memberISbb_usersID(layoutSchema.data[0][0].memberISbb_usersID);

      dispatch(
        setTransactionMenuData({ currentTransactionMenuSchema: schema.menu })
      ); // store current point menu

      let value = layoutSchema.data[0][0].memberISbb_usersID;
      let index = membersIDList.data.layout.data.findIndex(val => {
        return value == val._id;
      });
      if (index === -1) value = '';
      else
        value =
          membersIDList.data.layout.data[index].last_name +
          ', ' +
          membersIDList.data.layout.data[index].first_name +
          ' ' +
          (membersIDList.data.layout.data[index].company_name === null
            ? ''
            : membersIDList.data.layout.data[index].company_name);
      setFilterMemberStr(value);
      const FieldsData = layoutSchema.data;
      form.setFieldsValue({
        // ownerISbb_usersID: FieldsData[0][0].ownerISbb_usersID,
        // memberISbb_usersID: FieldsData[0][0].memberISbb_usersID,
        total_valueNUM: FieldsData[0][0].total_valueNUM,
        transaction_ref: FieldsData[0][0].transaction_ref,
        _id: FieldsData[0][0]._id,
        code: FieldsData[0][0].code,
        qtyNUM: FieldsData[0][0].qtyNUM,
        notes: FieldsData[0][0].notes,
        ex_tax_amountNUM: FieldsData[0][0].ex_tax_amountNUM,
        tax_amountNUM: FieldsData[0][0].tax_amountNUM,
        tax_type: FieldsData[0][0].tax_type,
        grand_totalNUM: FieldsData[0][0].grand_totalNUM,
        unit_priceNUM: FieldsData[0][0].unit_priceNUM,
        branchISbb_loyal2_branchesID:
          FieldsData[0][0].branchISbb_loyal2_branchesID
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
      const branchISbb_loyal2_branchesID = branch_val;
      // const memberISbb_usersID = branch_val;

      const {
        _id,
        // ownerISbb_usersID,
        // memberISbb_usersID,
        total_valueNUM,
        transaction_ref,
        code,
        qtyNUM,
        notes,
        ex_tax_amountNUM,
        tax_amountNUM,
        tax_type,
        grand_totalNUM,
        unit_priceNUM
      } = values;
      const transaction_date = values['transaction_date'].format(
        'YYYY-MM-DD HH:mm:ss'
      );

      const updateMember = await Axios.patch(
        endpoint.appUsers(`/module/bb_loyal2_transactions/${_id}`),
        {
          _id,
          // ownerISbb_usersID,
          ownerISbb_usersID: 4,
          memberISbb_usersID,
          total_valueNUM,
          transaction_ref,
          code,
          qtyNUM,
          notes,
          ex_tax_amountNUM,
          tax_amountNUM,
          tax_type,
          grand_totalNUM,
          unit_priceNUM,
          branchISbb_loyal2_branchesID,
          transaction_date
        }
      );
      const user = updateMember.data;
      console.log(user, 'userusfjdlksjfdlksjlk');
      if (user.error) return message.error(user.error);
      message.success('Updated successful!');
      navigate('/datamanager/bb_loyal2_transactions/list');
      // initPageModule();
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
    }
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  // const onSearch = value => {
  //   console.log('search:', value);
  // };

  let FieldsData = layoutData.data;
  console.log(FieldsData[0][0], 'FieldData');
  const selectedStartDate = moment(
    FieldsData[0][0].transaction_date,
    dateFormat
  );
  const initValues = {
    transaction_date: selectedStartDate
  };
  // console.log("transaction_date",FieldsData[0][0].transaction_date)

  return (
    <>
      <Row className="mx-4">
        <Col>
          <Title level={4} className="text-label">
            Update a transaction
          </Title>
        </Col>
      </Row>
      <br />
      <Form
        name="Add"
        initialValues={initValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
      >
        <Row className="mx-4 mt-3">
          <Col span={24}>
            <Form.Item name="_id" hidden="hidden">
              <Input />
            </Form.Item>
            {/* <Row>
              <Col span={20}>
                <Text strong>Owner</Text>
                <Form.Item
                  className="mb-3"
                  name="ownerISbb_usersID"
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <Input style={inputStyle} />
                </Form.Item>
              </Col>
            </Row> */}
            <Row>
              <Col span={20}>
                <Text strong>Member</Text>
                <Input
                  style={{ borderRadius: '10px' }}
                  type="text"
                  className="mt-1"
                  value={filterMemberStr}
                  onChange={e => setFilterMemberStr(e.target.value)}
                />
                <ListItems
                  items={memberIDList}
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
            </Row>

            <Row gutter={[24, 24]} className="mt-3">
              <Col span={6}>
                <Text strong>Total value</Text>

                <Form.Item
                  className="mb-3"
                  name="total_valueNUM"
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <InputNumber min={1} style={inputStyle} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Text strong>Oty</Text>
                <Form.Item className="mb-3" name="qtyNUM">
                  <InputNumber min={1} style={inputStyle} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Text strong>Transaction Date</Text>
                <Form.Item
                  className="mb-3"
                  name="transaction_date"
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <DatePicker
                    value={selectedStartDate}
                    // onChange={DateChange}
                    style={inputStyle}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="mx-4 mt-5" span={20}>
          <Col span={10}>
            <Button
              variant="outline-primary"
              className="rounded-pill px-4 py-2"
              onClick={() => setting_click()}
            >
              Advanced Settings <DownOutlined style={{ fontSize: '14px' }} />
            </Button>
          </Col>
          <Col span={10}>
            <Button
              variant="outline-primary"
              className="rounded-pill px-4 py-2"
              style={{ float: 'right' }}
              type="submit"
            >
              Update
            </Button>
          </Col>
        </Row>

        {setting_show == true && (
          <>
            <Row className="mx-4 mt-7">
              <Col span={6}>
                <Text strong>Transaciton Ref</Text>
                <Form.Item
                  className="mb-3"
                  name="transaction_ref"
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <Input type="text" style={inputStyle} />
                </Form.Item>
              </Col>
              <Col offset={1} span={6}>
                <Text strong>Code</Text>
                <Form.Item className="mb-3" name="code">
                  <Input type="text" style={inputStyle} />
                </Form.Item>
              </Col>
              <Col offset={2} span={5}>
                <Text strong>Notes</Text>
                <Form.Item className="mb-3" name="notes">
                  <Input type="text" style={inputStyle} />
                </Form.Item>
              </Col>
            </Row>
            <Row className="mx-4 mt-3">
              <Col span={6}>
                <Text strong>Ex Tax Amount</Text>
                <Form.Item className="mb-3" name="ex_tax_amountNUM">
                  <InputNumber
                    min={0}
                    style={inputStyle}
                    // onChange={onChange}
                  />
                </Form.Item>
              </Col>
              <Col offset={1} span={6}>
                <Text strong>Tax Amount</Text>
                <Form.Item className="mb-3" name="tax_amountNUM">
                  <InputNumber
                    min={0}
                    style={inputStyle}
                    // onChange={onChange}
                  />
                </Form.Item>
              </Col>
              <Col offset={2} span={5}>
                <Text strong>Tax Type</Text>
                <Form.Item className="mb-3" name="tax_type">
                  <Input
                    type="text"
                    style={inputStyle}
                    // onChange={onChange}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row className="mx-4 mt-3">
              <Col span={6}>
                <Text strong>Branch</Text>
                {/* <Form.Item className="mb-3" name="branchISbb_loyal2_branchesID">
                  <Select
                    showSearch
                    placeholder="Select"
                    optionFilterProp="children"
                    style={{ width: '100%' }}
                    // onChange={onselectChange}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      (option?.label ?? '')
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={[
                      {
                        value: '1',
                        label: 'Branch1'
                      },
                      {
                        value: '2',
                        label: 'Branch2'
                      },
                      {
                        value: '3',
                        label: 'Branch3'
                      }
                    ]}
                  />
                </Form.Item> */}
                <BootstrapForm.Select
                  defaultValue={FieldsData[0][0].branchISbb_loyal2_branchesID}
                  name="branch"
                  onChange={e => selectchange1(e)}
                  style={{ width: '100%', borderRadius: '10px' }}
                  // onChange={handleChange}
                >
                  <option key={'null'} value={null}></option>
                  {branches.map((item, index) => {
                    return (
                      <option key={index} value={item._id}>
                        {item.name}
                      </option>
                    );
                  })}
                </BootstrapForm.Select>
              </Col>
              <Col offset={1} span={6}>
                <Text strong>Grand Total</Text>
                <Form.Item className="mb-3" name="grand_totalNUM">
                  <InputNumber
                    min={0}
                    style={inputStyle}
                    // onChange={onChange}
                  />
                </Form.Item>
              </Col>
              <Col offset={2} span={5}>
                <Text strong>Unit Price</Text>
                <Form.Item className="mb-3" name="unit_priceNUM">
                  <InputNumber
                    min={0}
                    style={inputStyle}

                    // onChange={onChange}
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
      </Form>
    </>
  );
}
export default UpdateTransaction;
