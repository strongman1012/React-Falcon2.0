import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, Form, Input, Switch, Row, Col, message } from 'antd';
// import { QuestionCircleOutlined } from '@ant-design/icons';
// import { useParams } from 'react-router-dom';
import endpoint from '../../utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { setMemberMenuData } from 'redux/slices/currentDataSlice';
import { Button, Form as BootstrapForm } from 'react-bootstrap';

const { Title, Text } = Typography;
// const btnQuestion = {
//   backgroundColor: '#359DD9',
//   borderRadius: '50%',
//   border: 'none',
//   color: 'white',
//   fontSize: '21px',
//   float: 'right'
// };
const inputBorderRadius = { borderRadius: '10px' };

function AddManageUsers() {
  const dispatch = useDispatch();
  const _isMounted = useRef(false);
  // let { routeKey } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const [branches, setBranches] = useState([]);
  const [branchISbb_loyal2_branchesID, set_branchISbb_loyal2_branchesID] =
    useState(null);
  const initPageModule = async () => {
    try {
      // default part
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getDataManagerSchemaEndpoint('add');
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      dispatch(setMemberMenuData({ currentMemberMenuSchema: schema.menu })); // store current member menu
      const branchesList = await Axios.get(
        endpoint.getModuleDataEndpoint('bb_loyal2_branches')
      );
      setBranches(branchesList.data.list);
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
      const { first_name, last_name, email } = values;
      console.log(endpoint.appUsers(layoutData.options.post_endpoint));

      const addMember = await Axios.post(
        endpoint.appUsers(layoutData.options.post_endpoint),
        {
          first_name,
          last_name,
          email,
          branchISbb_loyal2_branchesID,
          user_type: 3
        }
      );
      const user = addMember.data;
      if (user.error) return message.error(user.error);
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
  const onChange = checked => {
    console.log(`switch to ${checked}`);
  };
  const changeBranch = e => {
    set_branchISbb_loyal2_branchesID(e.target.value);
  };
  return (
    <>
      <Row className="mx-4 mt-3">
        <Col span={24}>
          <Title level={4} className="mb-3">
            Add a user
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
            initialValues={{
              remember: true
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Row gutter={[24, 16]}>
              <Col xs={12} lg={10}>
                <Text strong className="text-label">
                  First Name
                </Text>
                <Row className="mt-1">
                  <Col span={24}>
                    <Form.Item
                      name="first_name"
                      rules={[
                        {
                          required: true,
                          message: 'Please input First name!'
                        }
                      ]}
                    >
                      <Input style={inputBorderRadius} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col xs={12} lg={10}>
                <Text strong className="text-label">
                  Last Name
                </Text>
                <Row className="mt-1">
                  <Col span={24}>
                    <Form.Item
                      name="last_name"
                      rules={[
                        {
                          required: true,
                          message: 'Please input Last name!'
                        }
                      ]}
                    >
                      <Input style={inputBorderRadius} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Text strong className="text-label">
              Email
            </Text>
            <Row className="mt-1">
              <Col xs={21} lg={20}>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      type: 'email',
                      required: true,
                      message: 'Please input Email!'
                    }
                  ]}
                >
                  <Input style={inputBorderRadius} />
                </Form.Item>
              </Col>
            </Row>
            <Text strong className="text-label">
              Code
            </Text>
            <Row className="mt-1">
              <Col xs={21} lg={20}>
                <Form.Item
                  name="code"
                  rules={[
                    {
                      required: false,
                      message: 'Please input Code!'
                    }
                  ]}
                >
                  <Input style={inputBorderRadius} />
                </Form.Item>
              </Col>
              {/* <Col sm={3} lg={1}>
                <Tooltip placement="right" title="Code" color="#359dd9">
                  <QuestionCircleOutlined
                    className="mt-1"
                    style={btnQuestion}
                  />
                </Tooltip>
              </Col> */}
            </Row>
            <Row align="middle" className="mt-3" gutter={[24, 24]}>
              <Col xs={12} lg={10}>
                <Row>
                  <Col span={18}>
                    <Text strong>Disable Backoffice Access</Text>
                  </Col>
                  <Col span={6}>
                    <Switch
                      onChange={onChange}
                      style={{
                        scale: '1.3',
                        backgroundColor: '#359DD9'
                      }}
                    />
                  </Col>
                </Row>
              </Col>
              <Col xs={12} lg={10}>
                <Row align="middle">
                  <Col span={8}>
                    <Text strong>Branch</Text>
                  </Col>
                  <Col span={16}>
                    <BootstrapForm.Select
                      onChange={e => changeBranch(e)}
                      style={{ borderRadius: '10px' }}
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
            </Row>

            <Button
              className="btn-active-command rounded-pill mt-5 px-4 py-2"
              type="submit"
            >
              Add
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  );
}
export default AddManageUsers;
