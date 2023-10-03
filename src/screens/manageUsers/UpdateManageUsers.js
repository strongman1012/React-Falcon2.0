import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  Typography,
  //   Tooltip,
  Form,
  Divider,
  Input,
  Switch,
  Row,
  Col,
  message,
  Modal
} from 'antd';
// import { QuestionCircleOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import endpoint from '../../utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { setMemberMenuData } from 'redux/slices/currentDataSlice';
import { Button, Form as BootstrapForm } from 'react-bootstrap';
import { ExclamationCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;
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

function UpdateManageUsers() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const _isMounted = useRef(false);
  let { routeKey, id } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const [branches, setBranches] = useState([]);
  const initPageModule = async () => {
    try {
      // default part
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getDataManagerSchemaEndpoint(`${routeKey}/${id}`);
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
      let FieldsData = layoutSchema.data;
      form.setFieldsValue({
        first_name: FieldsData[0].first_name,
        last_name: FieldsData[0].last_name,
        email: FieldsData[0].email,
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
      const { _id, first_name, last_name, email } = values;

      const updateMember = await Axios.patch(
        endpoint.appUsers(`/app/users/${_id}`),
        {
          _id,
          first_name,
          last_name,
          email,
          user_type: 3
        }
      );
      const user = updateMember.data;
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
  const onChange = checked => {
    console.log(`switch to ${checked}`);
  };
  const showDeleteConfirm = id => {
    confirm({
      title: 'Delete selected items?',
      icon: <ExclamationCircleFilled />,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        onDelete(id);
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      }
    });
  };
  const onDelete = async id => {
    try {
      _isMounted.current && setLoadingSchema(true);

      const deleteMember = await Axios.delete(
        endpoint.appUsers(`/app/users/${id}`)
      );
      const user = deleteMember.data;
      if (user.error) return message.error(user.error);
      message.success('Deleted successful!');
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
      navigate('/manage_users/list');
    }
  };

  return (
    <>
      <Row className="mx-4 mt-3">
        <Col span={24}>
          <Title level={3}>Users</Title>
        </Col>
      </Row>
      <Divider />
      <Row className="mx-4 mt-3">
        <Col span={24}>
          <Title level={4}>Update this user</Title>
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
            form={form}
            autoComplete="off"
          >
            <Form.Item name="_id" hidden="hidden">
              <Input />
            </Form.Item>
            <Row gutter={[16, 16]}>
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
              <Col xs={24} lg={20}>
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
              <Col xs={24} lg={20}>
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
            <Row className="mt-3" align="middle" gutter={[24, 24]}>
              <Col xs={12} lg={10}>
                <Row align="middle">
                  <Col span={18}>
                    <Text className="text-label" strong>
                      Disable Backoffice Access
                    </Text>
                  </Col>
                  <Col span={6}>
                    <Switch onChange={onChange} />
                  </Col>
                </Row>
              </Col>
              <Col xs={12} lg={10}>
                <Row align="middle">
                  <Col span={8}>
                    <Text className="text-label" strong>
                      Branch
                    </Text>
                  </Col>
                  <Col span={16}>
                    <BootstrapForm.Select
                      placeholder="Select"
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
            <Row className="mt-5" gutter={[16, 16]}>
              <Col xs={12} lg={10}>
                <Row align="middle">
                  <Col span={6}>
                    <Text className="text-label" strong>
                      Set password
                    </Text>
                  </Col>
                  <Col span={18}>
                    <Input style={inputBorderRadius} />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="mt-5">
              <Col xs={12} lg={10}>
                <Button
                  className="btn-active-command rounded-pill px-4 py-2"
                  type="submit"
                >
                  Save
                </Button>
              </Col>
              <Col xs={12} lg={10}>
                <Button
                  variant="outline-primary"
                  className="rounded-pill px-4 py-2"
                  style={{ float: 'right' }}
                  onClick={() => showDeleteConfirm(id)}
                >
                  Delete
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </>
  );
}
export default UpdateManageUsers;
