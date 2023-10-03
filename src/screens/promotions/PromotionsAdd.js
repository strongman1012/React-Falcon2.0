import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
// import { QuestionCircleOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import endpoint from '../../utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { setPromotionsMenuData } from 'redux/slices/currentDataSlice';

import {
  Form,
  Input,
  Col,
  DatePicker,
  Typography,
  Row,
  message,
  InputNumber
} from 'antd';
import { Button, Form as BootstrapForm } from 'react-bootstrap';
// import { ConsoleSqlOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
// const inputStyle = { width: '93%' };
const inputBorderRadius = { borderRadius: '10px', width: '100%' };

// const inputQuestion = {
//   display: 'inline-block',
//   width: '93%',
//   borderRadius: '15px'
// };

function PromotionsAdd() {
  const dispatch = useDispatch();
  let { routeKey } = useParams();
  const _isMounted = useRef(false);
  // let { routeKey } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const [branchISbb_loyal2_branchesID, setBranch] = useState('');
  const [groupISbb_loyal2_groupsID, setGroup] = useState('');
  const [eventISbb_loyal2_eventsID, setAuto] = useState('');
  const [date_from, setDate_from] = useState('');
  const [date_to, setDate_to] = useState('');
  const [branches, setBranches] = useState([]);
  const [groups, setGroups] = useState([]);
  const onDate_from = a => {
    setDate_from(a.format('YYYY-MM-DD HH:mm:ss'));
  };
  const onDate_to = a => {
    setDate_to(a.format('YYYY-MM-DD HH:mm:ss'));
  };
  const handleChange1 = e => {
    console.log(e.target.value);
    setBranch(e.target.value);
  };
  const handleChange2 = e => {
    console.log(e.target.value);
    setGroup(e.target.value);
  };
  const handleChange3 = e => {
    console.log(e.target.value);
    setAuto(e.target.value);
  };
  const initPageModule = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getPromotionsDataManagerSchemaEndpoint(
        routeKey.replace('/', '')
      );
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      dispatch(
        setPromotionsMenuData({ currentPromotionsMenuSchema: schema.menu })
      ); // store current Promotions menu

      const branchesList = await Axios.get(
        endpoint.getModuleDataEndpoint('bb_loyal2_branches')
      );
      setBranches(branchesList.data.list);
      const groupsList = await Axios.get(
        endpoint.getModuleDataEndpoint('bb_loyal2_groups')
      );
      setGroups(groupsList.data.list);

      _isMounted.current && setLayoutData(layoutSchema);
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
      const { name, points_to_awardNUM, code, quickscan_function } = values;

      // console.log(date_test_success,"date_test_success");
      const addPromotions = await Axios.post(
        endpoint.getDataAddEndpoint('bb_loyal2_promotions'),
        {
          ownerISbb_usersID: 4,
          name,
          points_to_awardNUM,
          code,
          quickscan_function,
          date_from,
          date_to,
          branchISbb_loyal2_branchesID,
          groupISbb_loyal2_groupsID,
          eventISbb_loyal2_eventsID
          // user_type: 3
        }
      );
      const user = addPromotions.data;
      if (user.error) return message.error(user.error);
      message.success('Added successful!');
      // console.log(`${endpoint.appUsers} response -> `, user);
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
    }
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  let layoutFields = layoutData.options.fields;
  return (
    <>
      <Row className="mx-4">
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
            autoComplete="off"
          >
            <Row>
              <Title level={4} className="mb-4">
                Add a new non-transactional promotion record
              </Title>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                {layoutFields.name ? (
                  <>
                    <Text strong className="text-label">
                      {layoutFields.name}
                    </Text>
                    <Form.Item
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: 'Please input your Name!'
                        }
                      ]}
                    >
                      <Input
                        className="mt-1"
                        placeholder={layoutFields.name}
                        style={inputBorderRadius}
                      />
                    </Form.Item>
                  </>
                ) : null}
              </Col>
              <Col span={12}>
                {layoutFields.points_to_awardNUM ? (
                  <>
                    <Text strong className="text-label">
                      {layoutFields.points_to_awardNUM}
                    </Text>
                    <Form.Item
                      name="points_to_awardNUM"
                      rules={[
                        {
                          required: true,
                          message: 'Please input your Points to awardNUM!'
                        }
                      ]}
                    >
                      <InputNumber
                        className="mt-1"
                        style={{ borderRadius: '10px', width: '100%' }}
                        placeholder={layoutFields.points_to_awardNUM}
                      />
                    </Form.Item>
                  </>
                ) : null}
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                {layoutFields.code ? (
                  <>
                    <Text strong className="text-label">
                      {layoutFields.code}
                    </Text>
                    <Form.Item
                      name="code"
                      rules={[
                        {
                          required: true,
                          message: 'Please input your Code!'
                        }
                      ]}
                    >
                      <Input
                        className="mt-1"
                        placeholder={layoutFields.code}
                        style={inputBorderRadius}
                      />
                    </Form.Item>
                  </>
                ) : null}
              </Col>
              <Col span={12}>
                {layoutFields.quickscan_function ? (
                  <>
                    <Text strong className="text-label">
                      {layoutFields.quickscan_function}
                    </Text>
                    <Form.Item name="quickscan_function">
                      <Input
                        className="mt-1"
                        placeholder={layoutFields.quickscan_function}
                        style={inputBorderRadius}
                      />
                    </Form.Item>
                  </>
                ) : null}
              </Col>
            </Row>
            <Row gutter={[16, 16]} className="mt-3">
              <Col span={12}>
                {layoutFields.date_from ? (
                  <>
                    <Row align="middle">
                      <Col span={10}>
                        <Text strong className="text-label">
                          {layoutFields.date_from}
                        </Text>
                      </Col>
                      <Col span={14}>
                        <Form.Item name="date_from" className="m-0">
                          <DatePicker
                            placeholder={layoutFields.date_from}
                            style={inputBorderRadius}
                            onChange={onDate_from}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                ) : null}
              </Col>
              <Col span={12}>
                {layoutFields.branchISbb_loyal2_branchesID ? (
                  <Form.Item name="branchISbb_loyal2_branchesID">
                    <Row align="middle">
                      <Col span={8}>
                        <Text
                          strong
                          className="text-label"
                          style={{ padding: '0px 3px' }}
                        >
                          {layoutFields.branchISbb_loyal2_branchesID}
                        </Text>
                      </Col>
                      <Col span={16}>
                        <BootstrapForm.Select
                          placeholder={
                            layoutFields.branchISbb_loyal2_branchesID
                          }
                          style={inputBorderRadius}
                          onChange={e => handleChange1(e)}
                        >
                          <option value={null}></option>
                          {branches.map((item, index) => {
                            return (
                              <option key={index} value={item._id}>
                                {item.name}
                              </option>
                            );
                          })}
                        </BootstrapForm.Select>
                      </Col>
                    </Row>
                  </Form.Item>
                ) : null}
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="mt-3">
              <Col span={12}>
                {layoutFields.date_to ? (
                  <>
                    <Row align="middle">
                      <Col span={10}>
                        <Text strong className="text-label">
                          {layoutFields.date_to}
                        </Text>
                      </Col>
                      <Col span={14}>
                        <Form.Item name="date_to" className="m-0">
                          <DatePicker
                            placeholder={layoutFields.date_to}
                            style={inputBorderRadius}
                            onChange={onDate_to}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                ) : null}
              </Col>
              <Col span={12}>
                {layoutFields.groupISbb_loyal2_groupsID ? (
                  <Form.Item name="groupISbb_loyal2_groupsID">
                    <Row align="middle">
                      <Col span={8}>
                        <Text
                          strong
                          className="text-label"
                          style={{ padding: '0px 3px' }}
                        >
                          {layoutFields.groupISbb_loyal2_groupsID}
                        </Text>
                      </Col>
                      <Col span={16}>
                        <BootstrapForm.Select
                          placeholder={layoutFields.groupISbb_loyal2_groupsID}
                          style={inputBorderRadius}
                          onChange={e => handleChange2(e)}
                        >
                          <option key={'null'} value={null}></option>
                          {groups.map((item, index) => {
                            return (
                              <option key={index} value={item._id}>
                                {item.name}
                              </option>
                            );
                          })}
                        </BootstrapForm.Select>
                      </Col>
                    </Row>
                  </Form.Item>
                ) : null}
              </Col>
            </Row>
            <Row gutter={[16, 16]} className="mt-3">
              <Col span={19}>
                {layoutFields.eventISbb_loyal2_eventsID ? (
                  <>
                    <Row align="middle">
                      <Col span={10}>
                        <Text strong className="text-label">
                          Auto Allocate On Event
                        </Text>
                      </Col>
                      <Col span={14}>
                        {/* <Form.Item
                          name="eventISbb_loyal2_eventsID"
                          style={inputQuestion}
                        > */}
                        <BootstrapForm.Select
                          placeholder={layoutFields.eventISbb_loyal2_eventsID}
                          style={inputBorderRadius}
                          onChange={e => handleChange3(e)}
                        >
                          <option value></option>
                          <option value="5">Every Month on the 1st</option>
                          <option value="2">On Member Birthday</option>
                          <option value="8">On Member First Login</option>
                          <option value="1">On Member Signup</option>
                          <option value="7">On QuickScan</option>
                          <option value="9">On QuickScan (Button)</option>
                        </BootstrapForm.Select>
                        {/* </Form.Item> */}
                      </Col>
                    </Row>
                  </>
                ) : null}
              </Col>
              <Col span={5} style={{ textAlign: 'end' }}>
                <Button
                  className="rounded-pill py-2 px-4"
                  variant="outline-primary"
                  type="submit"
                  //   onClick={() => add()}
                >
                  Add
                </Button>
              </Col>
            </Row>
          </Form>
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
            autoComplete="off"
          >
            <Row className="mt-5" gutter={[16, 16]}>
              <Row>
                <Title level={4} className="mb-4">
                  Add a new transactional promotion record
                </Title>
              </Row>

              <Col span={24}>
                <Row align="middle">
                  <Col span={5}>
                    <Text className="text-label" strong>
                      Name
                    </Text>
                  </Col>
                  <Col span={19}>
                    <Form.Item>
                      <Input
                        style={{
                          borderRadius: '10px',
                          width: '100%'
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row className="mt-3" align="middle">
                  <Col span={5}>
                    <Text strong className="text-label">
                      Percent of spent
                    </Text>
                  </Col>
                  {/* <Form.Item> */}
                  <Col span={6}>
                    <Input style={{ borderRadius: '10px' }} />
                  </Col>
                  {/* </Form.Item> */}

                  <Col span={1}></Col>
                  <Col span={6}>
                    <Text strong className="text-label">
                      Fixed points value
                    </Text>
                  </Col>
                  {/* <Form.Item> */}
                  <Col span={6}>
                    <Input style={{ borderRadius: '10px' }} />
                  </Col>
                  {/* </Form.Item> */}
                </Row>
                <Row className="mt-3" align="middle">
                  {/* <Col span={5}>
                    <Text strong className="text-label">
                      Category
                    </Text>
                  </Col>
                  <Col span={6}>
                    <BootstrapForm.Select style={{ borderRadius: '10px' }}>
                      <option></option>
                      <option value="1">Category1</option>
                      <option value="2">Category2</option>
                      <option value="3">Category3</option>
                    </BootstrapForm.Select>
                  </Col>
                  <Col span={1}></Col> */}

                  <Col span={5}>
                    <Text strong className="text-label">
                      Code
                    </Text>
                  </Col>
                  <Col span={6}>
                    <Input style={{ borderRadius: '10px' }} />
                  </Col>
                </Row>

                <Row className="mt-3" align="middle">
                  <Col span={5}>
                    <Text strong className="text-label">
                      Group
                    </Text>
                  </Col>
                  <Col span={6}>
                    <BootstrapForm.Select style={{ borderRadius: '10px' }}>
                      <option key={'null'} value={null}></option>
                      {groups.map((item, index) => {
                        return (
                          <option key={index} value={item._id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </BootstrapForm.Select>
                  </Col>
                  <Col span={1}></Col>
                  <Col span={3}>
                    <Text strong className="text-label">
                      Date From
                    </Text>
                  </Col>
                  <Col span={4}>
                    <DatePicker style={{ borderRadius: '10px' }} />
                  </Col>
                  <Col span={1} style={{ textAlign: 'center' }}>
                    <Text strong className="text-label">
                      to
                    </Text>
                  </Col>
                  <Col span={4}>
                    <DatePicker style={{ borderRadius: '10px' }} />
                  </Col>
                </Row>
                <Row className="mt-3" align="middle">
                  <Col span={5}>
                    <Text strong className="text-label">
                      Branch
                    </Text>
                  </Col>
                  <Col span={6}>
                    <BootstrapForm.Select style={{ borderRadius: '10px' }}>
                      <option value={null}></option>
                      {branches.map((item, index) => {
                        return (
                          <option key={index} value={item._id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </BootstrapForm.Select>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col span={24} style={{ textAlign: 'end' }}>
                    <Button
                      bv
                      className="rounded-pill px-4 py-2"
                      lavel="Get sample CSV"
                      variant="outline-primary"
                      style={{ textAlign: 'end', float: 'right' }}
                      //   onClick={() => subadd()}

                      type="submit"
                    >
                      Add
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </>
  );
}
export default PromotionsAdd;
