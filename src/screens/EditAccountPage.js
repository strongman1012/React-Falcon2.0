import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { QuestionCircleOutlined } from '@ant-design/icons';
// import { useParams } from 'react-router-dom';
import endpoint from 'utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { setMemberMenuData } from 'redux/slices/currentDataSlice';
import { useNavigate } from 'react-router-dom';
// import { ExclamationCircleFilled } from '@ant-design/icons';
import {
  Form,
  Input,
  Col,
  Tooltip,
  DatePicker,
  Radio,
  // Switch,
  // Select,
  Typography,
  Row,
  message
} from 'antd';
import { Button, Card, Form as BootstrapForm } from 'react-bootstrap';
// import { NavLink } from 'react-router-dom';
// const { TextArea } = Input;
// const { Option } = Select;
const { Title, Text } = Typography;
const inputStyle = { width: '100%', borderRadius: '10px' };

const btnQuestion = {
  backgroundColor: '#359DD9',
  borderRadius: '50%',
  border: 'none',
  color: 'white',
  fontSize: '21px'
};
function EditAccount() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  //   let { routeKey, id } = useParams();
  const _isMounted = useRef(false);
  // let { routeKey } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);

  const initPageModule = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getDataManagerSchemaEndpoint('add');
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      dispatch(setMemberMenuData({ currentMemberMenuSchema: schema.menu })); // store current member menu
      console.log(layoutSchema.options.fields, 'this is fields');

      const session_obj = JSON.parse(localStorage.getItem('session_obj'));
      const _id = session_obj._id;
      const get_data = await Axios.get(endpoint.appUsers(`/app/users/${_id}`));
      const user_data = get_data.data;
      form.setFieldsValue({
        first_name: user_data.first_name,
        last_name: user_data.last_name,
        email: user_data.email,
        _id: user_data._id
      });
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
  }, [onFinish]);
  if (loadingSchema) {
    return <Loading style={{ marginTop: 150 }} msg="Loading Schema..." />;
  }
  if (!layoutData) return getErrorAlert({ onRetry: initPageModule });

  const onFinish = async values => {
    console.log('Success:', values);
    try {
      _isMounted.current && setLoadingSchema(true);
      const { _id, first_name, last_name, email } = values;

      const EditAccount = await Axios.patch(
        endpoint.appUsers(`/app/users/${_id}`),
        {
          _id,
          first_name,
          last_name,
          email,
          user_type: 3
        }
      );
      const user = EditAccount.data;
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

  let layoutFields = layoutData.options.fields;

  return (
    <>
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row className="my-3">
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              <Title level={3} className="mx-4">
                Edit your account
              </Title>
              <Row className="mx-4 mt-5">
                <Col xxl={10} xl={12} lg={15}>
                  <Form
                    name="Add"
                    labelCol={{
                      span: 0
                    }}
                    wrapperCol={{
                      span: 24
                    }}
                    style={{
                      maxWidth: 550
                    }}
                    initialValues={{
                      remember: true
                    }}
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                  >
                    <Form.Item name="_id" style={inputStyle} hidden="hidden">
                      <Input />
                    </Form.Item>
                    <Row>
                      <Col span={22}>
                        {layoutFields.first_name ? (
                          <Form.Item
                            name="first_name"
                            rules={[
                              {
                                required: true,
                                message: 'Please input your First name!'
                              }
                            ]}
                            className="m-0"
                          >
                            <Input
                              placeholder={layoutFields.first_name}
                              style={inputStyle}
                            />
                          </Form.Item>
                        ) : null}
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col span={22}>
                        {layoutFields.last_name ? (
                          <Form.Item
                            name="last_name"
                            rules={[
                              {
                                required: true,
                                message: 'Please input your Last name!'
                              }
                            ]}
                            className="m-0"
                          >
                            <Input
                              placeholder={layoutFields.last_name}
                              style={inputStyle}
                            />
                          </Form.Item>
                        ) : null}
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col span={22}>
                        {layoutFields.company_name ? (
                          <>
                            <Form.Item
                              name="companyname"
                              rules={[
                                {
                                  required: false,
                                  message: 'Please input your Company name!'
                                }
                              ]}
                              className="m-0"
                            >
                              <Input
                                placeholder={layoutFields.company_name}
                                style={inputStyle}
                              />
                            </Form.Item>
                          </>
                        ) : null}
                      </Col>
                    </Row>
                    <Row className="mt-3" align="middle">
                      <Col span={22}>
                        {layoutFields.email ? (
                          <>
                            <Form.Item
                              name="email"
                              rules={[
                                {
                                  type: 'email',
                                  required: true,
                                  message: 'Please input your Email!'
                                }
                              ]}
                              className="m-0"
                            >
                              <Input
                                type="email"
                                placeholder={layoutFields.email}
                                style={inputStyle}
                              />
                            </Form.Item>
                          </>
                        ) : null}
                      </Col>
                      <Col span={2} style={{ textAlign: 'end' }}>
                        <Tooltip
                          placement="right"
                          title="email"
                          color="#359dd9"
                        >
                          <QuestionCircleOutlined style={btnQuestion} />
                        </Tooltip>
                      </Col>
                    </Row>
                    <Row className="mt-3" align="middle">
                      <Col span={22}>
                        <BootstrapForm.Select
                          placeholder="country"
                          style={inputStyle}
                        >
                          <option value="0">country</option>
                          <option value="1">nation1</option>
                          <option value="2">nation2</option>
                        </BootstrapForm.Select>
                      </Col>
                      <Col span={2} style={{ textAlign: 'end' }}>
                        <Tooltip
                          placement="right"
                          title="Mobile"
                          color="#359dd9"
                        >
                          <QuestionCircleOutlined style={btnQuestion} />
                        </Tooltip>
                      </Col>
                    </Row>

                    <Row className="mt-3" align="middle">
                      <Col span={22}>
                        {layoutFields.cell ? (
                          <>
                            <Form.Item
                              name="mobile"
                              rules={[
                                {
                                  required: false,
                                  message: 'Please input your Mobile!'
                                }
                              ]}
                              className="m-0"
                            >
                              <Input
                                placeholder={layoutFields.cell}
                                style={inputStyle}
                              />
                            </Form.Item>
                          </>
                        ) : null}
                      </Col>
                      <Col span={2} style={{ textAlign: 'end' }}>
                        <Tooltip
                          placement="right"
                          title="email"
                          color="#359dd9"
                        >
                          <QuestionCircleOutlined style={btnQuestion} />
                        </Tooltip>
                      </Col>
                    </Row>
                    <Row className="mt-3" gutter={[16, 16]}>
                      <Col span={11}>
                        <Form.Item
                          name="birth"
                          rules={[
                            {
                              required: false,
                              message: 'Please input your Date of Birth'
                            }
                          ]}
                          className="m-0"
                        >
                          <DatePicker
                            style={inputStyle}
                            placeholder="Date of Birth"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={11}>
                        {layoutFields.street_zipcode ? (
                          <Form.Item
                            name="street_state"
                            rules={[
                              {
                                required: false,
                                message: 'Please input State!'
                              }
                            ]}
                            className="m-0"
                          >
                            <Input
                              placeholder={layoutFields.street_zipcode}
                              style={inputStyle}
                            />
                          </Form.Item>
                        ) : null}
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col span={22}>
                        {layoutFields.street_state ? (
                          <Form.Item
                            name="street_state"
                            rules={[
                              {
                                required: false,
                                message: 'Please input State!'
                              }
                            ]}
                            className="m-0"
                          >
                            <Input
                              placeholder={layoutFields.street_state}
                              style={inputStyle}
                            />
                          </Form.Item>
                        ) : null}
                      </Col>
                    </Row>
                    {/* 
                    {layoutFields.street_city ? (
                      <Form.Item
                        name="street_city"
                        rules={[
                          {
                            required: false,
                            message: 'Please input City!'
                          }
                        ]}
                        className="m-0"
                      >
                        <Input
                          placeholder={layoutFields.street_city}
                          style={inputStyle}
                        />
                      </Form.Item>
                    ) : null} */}

                    <Row className="mt-3" align="top">
                      <Col span={22}>
                        {layoutFields.street_address ? (
                          <Form.Item
                            name="street_address"
                            rules={[
                              {
                                required: false,
                                message: 'Please input your Address 1'
                              }
                            ]}
                            className="m-0"
                          >
                            <Input.TextArea
                              rows={3}
                              placeholder={layoutFields.street_address}
                              style={inputStyle}
                            />
                          </Form.Item>
                        ) : null}
                      </Col>
                      <Col span={2} style={{ textAlign: 'end' }}>
                        <Tooltip
                          placement="right"
                          title="email"
                          color="#359dd9"
                        >
                          <QuestionCircleOutlined style={btnQuestion} />
                        </Tooltip>
                      </Col>
                    </Row>
                    <Row className="mt-3" align="middle">
                      <Col span={20}>
                        <Text strong className="text-label">
                          Email communications
                        </Text>
                      </Col>
                      <Col span={2} style={{ textAlign: 'end' }}>
                        <Radio value="radio1" />
                      </Col>
                    </Row>
                    <Row className="mt-3" align="middle">
                      <Col span={20}>
                        <Text strong className="text-label">
                          Mobile communications
                        </Text>
                      </Col>
                      <Col span={2} style={{ textAlign: 'end' }}>
                        <Radio value="radio1" />
                      </Col>
                    </Row>
                    <Row className="mt-3" align="middle">
                      <Col span={20}>
                        <Text strong className="text-label">
                          Postal communications
                        </Text>
                      </Col>
                      <Col span={2} style={{ textAlign: 'end' }}>
                        <Radio value="radio1" />{' '}
                      </Col>
                    </Row>

                    {/*   
                    {layoutFields.street_address2 ? (
                      <Form.Item
                        name="postal"
                        rules={[
                          {
                            required: false,
                            message: 'Please input your Address 2'
                          }
                        ]}
                      >
                        <Input
                          placeholder={layoutFields.street_address2}
                          style={inputStyle}
                        />
                      </Form.Item>
                    ) : null}
                    {layoutFields.street_suburb ? (
                      <Form.Item
                        name="postal"
                        rules={[
                          {
                            required: false,
                            message: 'Please input your Address 3'
                          }
                        ]}
                      >
                        <Input
                          placeholder={layoutFields.street_suburb}
                          style={inputStyle}
                        />
                      </Form.Item>
                    ) : null}
                    {layoutFields.street_zipcode ? (
                      <Form.Item
                        name="postal"
                        rules={[
                          {
                            required: false,
                            message: 'Please input your Zip/Post Code'
                          }
                        ]}
                      >
                        <Input
                          placeholder={layoutFields.street_zipcode}
                          style={inputStyle}
                        />
                      </Form.Item>
                    ) : null} */}
                    {/* <Form.Item
              name="code"
              rules={[{ required: false, message: 'Please input code' }]}
              style={twoInputStyle}
            >
              <Input placeholder="Code" style={inputStyle} />
            </Form.Item>

            <Form.Item
              name="code"
              rules={[{ required: false, message: 'Please input code' }]}
              style={twoInputStyle}
            >
              <Input placeholder="Code" style={inputStyle} />
            </Form.Item>
            <Tooltip placement="right" title="Code" color="#359dd9">
              <QuestionCircleOutlined style={btnQuestion} />
            </Tooltip>
            <Form.Item
              name="subscription_date_from"
              rules={[
                {
                  required: false,
                  message: 'Please input Subscription date from'
                }
              ]}
              style={twoInputStyle}
            >
              <DatePicker
                style={dateStyle}
                placeholder="Subscription date from"
              />
            </Form.Item>
            <Form.Item
              name="subscription_date_to"
              rules={[
                {
                  required: false,
                  message: 'Please input Subscription date to'
                }
              ]}
              style={twoInputStyle}
            >
              <DatePicker
                style={dateStyle}
                placeholder="Subscription date to"
              />
            </Form.Item>
            <Tooltip placement="right" title="Subscription" color="#359dd9">
              <QuestionCircleOutlined style={btnQuestion} />
            </Tooltip>
            <p
              style={{ display: 'inline-block', marginTop: '5px' }}
              className="mx-4"
            >
              <strong>Group</strong>
            </p>
            <Form.Item
              name="group"
              style={{
                display: 'inline-block',
                width: '200px'
              }}
            >
              <Select placeholder="No groups/tiers added yet.">
                <Option value="group1"></Option>
                <Option value="group2"></Option>
                <Option value="group3"></Option>
              </Select>
            </Form.Item>
            <span className="mx-4">
              <NavLink to="/datamanager/bb_loyal2_members/edit/1">
                Manage
              </NavLink>
            </span>
            <br />
            <p
              style={{ display: 'inline-block', marginTop: '5px' }}
              className="mx-4"
            >
              <strong>Branch</strong>
            </p>
            <Form.Item
              name="branch"
              style={{
                display: 'inline-block',
                width: '200px'
              }}
            >
              <Select placeholder="Select options.">
                <Option value="branch1"></Option>
                <Option value="branch2"></Option>
                <Option value="branch3"></Option>
              </Select>
            </Form.Item>
            <br />

            <span>Email communications</span>
            <Radio style={{ float: 'right' }} value="radio1" />
            <br />
            <br />
            <span>Mobile communications</span>
            <Radio style={{ float: 'right' }} value="radio1" />
            <br />
            <br />
            <span>Postal communications</span>
            <Radio style={{ float: 'right' }} value="radio1" /> 
            <br />
            <br />
            <span>Sign up date</span>
            <span className="mx-5">{date_value}</span>
            <CalendarOutlined style={{ marginTop: '-3px' }} />

            <Form.Item
              style={{
                display: 'inline-block',
                marginTop: '-7px',
                float: 'right'
              }}
            >
              <Switch />
            </Form.Item>
            <span style={{ float: 'right', marginRight: '10px' }}>
              Suspended
            </span>
            */}

                    <Row className="mt-5">
                      <Col span={6}>
                        <Button
                          className="btn-active-command rounded-pill px-4 py-2"
                          type="submit"
                        >
                          Save
                        </Button>
                      </Col>
                      <Col span={16} style={{ textAlign: 'end' }}>
                        <Button
                          variant="outline-primary"
                          className="rounded-pill px-4 py-2"
                          onClick={() => navigate('/view_account')}
                        >
                          Back to your account
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}

export default EditAccount;
