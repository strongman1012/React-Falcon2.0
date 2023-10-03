import React from 'react';
import {
  Typography,
  Row,
  Col,
  Input,
  InputNumber,
  DatePicker,
  Form,
  message
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Button } from 'react-bootstrap';
import Form1 from 'react-bootstrap/Form';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import endpoint from '../../utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { setTransactionMenuData } from 'redux/slices/currentDataSlice';
import ListItems from 'components/custom/ListItems';
const { Title, Text } = Typography;

const inputStyle = {
  borderRadius: '10px'
};

function AddTransaction() {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const _isMounted = useRef(false);
  // let { routeKey } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const [branchISbb_loyal2_branchesID, setBranchISbb_loyal2_branchesID] =
    useState('');
  const [branches, setBranches] = useState([]);
  const [memberIDList, setMemberIDList] = useState([]);
  const [memberISbb_usersID, set_memberISbb_usersID] = useState(null);
  const [filterMemberStr, setFilterMemberStr] = useState('');
  const handleChange = e => {
    console.log(e.target.value);
    setBranchISbb_loyal2_branchesID(e.target.value);
  };
  const initPageModule = async () => {
    try {
      // default part
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getDataTransactionSchemaEndpoint('add');
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      dispatch(
        setTransactionMenuData({ currentTransactionMenuSchema: schema.menu })
      ); // store current member menu
      _isMounted.current && setLayoutData(layoutSchema);
      const branchesList = await Axios.get(
        endpoint.getModuleDataEndpoint('bb_loyal2_branches')
      );
      setBranches(branchesList.data.list);
      const membersIDList = await Axios.get(
        endpoint.getDataManagerSchemaEndpoint('list')
      );
      setMemberIDList(membersIDList.data.layout.data);
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

  const [setting_show, setSetting_show] = useState(false);
  const setting_click = () => {
    if (setting_show == false) {
      setSetting_show(true);
    }
    if (setting_show == true) {
      setSetting_show(false);
    }
  };

  // Loading part
  if (loadingSchema) {
    return <Loading style={{ marginTop: 150 }} msg="Loading Schema..." />;
  }
  if (!layoutData) return getErrorAlert({ onRetry: initPageModule });
  const onFinish = async values => {
    console.log('Success:', values);
    try {
      _isMounted.current && setLoadingSchema(true);
      const {
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
        // branchISbb_loyal2_branchesID
      } = values;
      const transaction_date = values['transaction_date'].format(
        'YYYY-MM-DD HH:mm:ss'
      );
      console.log(transaction_date, 'transactiondate');
      console.log(endpoint.appUsers(layoutData.options.post_endpoint));

      const addMember = await Axios.post(
        endpoint.getDataAddEndpoint('bb_loyal2_transactions'),
        {
          // ownerISbb_usersID,
          ownerISbb_usersID: 4,
          memberISbb_usersID,
          total_valueNUM,
          transaction_ref,
          transaction_date,
          code,
          qtyNUM,
          notes,
          ex_tax_amountNUM,
          tax_amountNUM,
          tax_type,
          grand_totalNUM,
          unit_priceNUM,
          branchISbb_loyal2_branchesID
        }
      );
      const user = addMember.data;
      // if (user.error) return message.error(user.error);
      message.success('Added successful!');
      console.log(`${endpoint.appUsers} response -> `, user);
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
      <Row className="mx-4">
        <Col>
          <Title level={4} className="text-label">
            Add a transaction
          </Title>
        </Col>
      </Row>

      <Form
        name="Add"
        initialValues={{
          remember: true
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Row className="mx-4 mt-3">
          <Col span={24}>
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
                  <InputNumber
                    min={1}
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Text strong>Oty</Text>
                <Form.Item className="mb-3" name="qtyNUM">
                  <InputNumber
                    min={1}
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
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
                  <DatePicker style={{ width: '100%', borderRadius: '10px' }} />
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
              Advanced Settings
              <DownOutlined style={{ marginLeft: '10px', fontSize: '14px' }} />
            </Button>
          </Col>
          <Col span={10}>
            <Button
              variant="outline-primary"
              className="rounded-pill py-2 px-4"
              style={{ float: 'right' }}
              type="submit"
            >
              Add
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
                    style={{ width: '100%', borderRadius: '10px' }}
                    // onChange={onChange}
                  />
                </Form.Item>
              </Col>
              <Col offset={1} span={6}>
                <Text strong>Tax Amount</Text>
                <Form.Item className="mb-3" name="tax_amountNUM">
                  <InputNumber
                    min={0}
                    style={{ width: '100%', borderRadius: '10px' }}
                    // onChange={onChange}
                  />
                </Form.Item>
              </Col>
              <Col offset={2} span={5}>
                <Text strong>Tax Type</Text>
                <Form.Item className="mb-3" name="tax_type">
                  <Input
                    type="text"
                    style={{ width: '100%', borderRadius: '10px' }}
                    // onChange={onChange}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row className="mx-4 mt-3">
              <Col span={6}>
                <Text strong>Branch</Text>
                <Form1.Select
                  defaultValue="select"
                  placeholder="Select"
                  style={{ width: '100%', borderRadius: '10px' }}
                  onChange={e => handleChange(e)}
                >
                  <option value={null}></option>
                  {branches.map((item, index) => {
                    return (
                      <option key={index} value={item._id}>
                        {item.name}
                      </option>
                    );
                  })}
                </Form1.Select>
              </Col>
              <Col offset={1} span={6}>
                <Text strong>Grand Total</Text>
                <Form.Item className="mb-3" name="grand_totalNUM">
                  <InputNumber
                    min={0}
                    style={{ width: '100%', borderRadius: '10px' }}
                    // onChange={onChange}
                  />
                </Form.Item>
              </Col>
              <Col offset={2} span={5}>
                <Text strong>Unit Price</Text>
                <Form.Item className="mb-3" name="unit_priceNUM">
                  <InputNumber
                    min={0}
                    style={{ width: '100%', borderRadius: '10px' }}
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
export default AddTransaction;
