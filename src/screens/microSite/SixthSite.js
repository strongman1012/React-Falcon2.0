import React from 'react';
import { Typography, Row, Col, Form, Input, message } from 'antd';
import { Button, Card } from 'react-bootstrap';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
// import { useDispatch } from 'react-redux';
import endpoint from 'utils/endpoint';
// import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
const { Title, Text } = Typography;
const cardStyle = {
  // backgroundColor: '#F8F8F8',
  borderRadius: '10px',
  border: '0 solid white',
  boxShadow: '0px 0px 0px 0px rgba(0, 0, 0, 1)'
};
const inputStyle = {
  width: '100%',
  borderRadius: '10px'
};

function SixthSite() {
  const [form] = Form.useForm();
  const _isMounted = useRef(false);
  const [loadingSchema, setLoadingSchema] = useState(true);

  const initPageModule = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      const session_obj = JSON.parse(localStorage.getItem('session_obj'));
      const _id = session_obj._id;
      const get_data = await Axios.get(endpoint.appUsers(`/app/users/${_id}`));
      const user_data = get_data.data.user_data[0];
      form.setFieldsValue({
        member_page_welcomeISsmallplaintextbox:
          user_data.member_page_welcomeISsmallplaintextbox,
        member_page_aboutISsmallplaintextbox:
          user_data.member_page_aboutISsmallplaintextbox,
        member_page_contactISsmallplaintextbox:
          user_data.member_page_contactISsmallplaintextbox,
        member_page_homeISsmallplaintextbox:
          user_data.member_page_homeISsmallplaintextbox,
        member_page_suspendedISsmallplaintextbox:
          user_data.member_page_suspendedISsmallplaintextbox,
        member_page_expiredISsmallplaintextbox:
          user_data.member_page_expiredISsmallplaintextbox,
        member_page_linksISsmallplaintextbox:
          user_data.member_page_linksISsmallplaintextbox,
        alternate_signup_url: user_data.alternate_signup_url,
        alternate_contact_url: user_data.alternate_contact_url,
        member_page_termsISsmallplaintextbox:
          user_data.member_page_termsISsmallplaintextbox
      });
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
  // if (!layoutData) return getErrorAlert({ onRetry: initPageModule });

  const onFinish = async values => {
    console.log('Success:', values);
    try {
      _isMounted.current && setLoadingSchema(true);
      const session_obj = JSON.parse(localStorage.getItem('session_obj'));
      const _id = session_obj._id;
      const first_name = session_obj.first_name;
      const last_name = session_obj.last_name;
      const email = session_obj.email;
      const user_type = session_obj.code;
      const {
        member_page_welcomeISsmallplaintextbox,
        member_page_aboutISsmallplaintextbox,
        member_page_contactISsmallplaintextbox,
        member_page_homeISsmallplaintextbox,
        member_page_suspendedISsmallplaintextbox,
        member_page_expiredISsmallplaintextbox,
        member_page_linksISsmallplaintextbox,
        alternate_signup_url,
        alternate_contact_url,
        member_page_termsISsmallplaintextbox
      } = values;
      const addMember = await Axios.patch(
        endpoint.appUsers(`/app/users/${_id}`),
        {
          first_name,
          last_name,
          email,
          user_type,
          member_page_welcomeISsmallplaintextbox,
          member_page_aboutISsmallplaintextbox,
          member_page_contactISsmallplaintextbox,
          member_page_homeISsmallplaintextbox,
          member_page_suspendedISsmallplaintextbox,
          member_page_expiredISsmallplaintextbox,
          member_page_linksISsmallplaintextbox,
          alternate_signup_url,
          alternate_contact_url,
          member_page_termsISsmallplaintextbox
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
      <Row className="mx-4 mt-5">
        <Col span={24} style={{ textAlign: 'center' }}>
          <Title level={3}>Micro-site Content</Title>
        </Col>
      </Row>
      <Row className="mx-4 mt-5">
        <Col span={24}>
          <Card style={cardStyle}>
            <Card.Body className="p-4">
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
                form={form}
              >
                <Row>
                  <Text strong className="text-label">
                    Micro-site Welcome Message (Not logged in)
                  </Text>
                </Row>
                <Row>
                  <Col span={22}>
                    <Form.Item
                      name="member_page_welcomeISsmallplaintextbox"
                      className="mt-1"
                      rules={[
                        {
                          required: true,
                          message: 'Please input Name!'
                        }
                      ]}
                    >
                      <Input style={inputStyle} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Text strong className="text-label">
                    Micro-site About Message
                  </Text>
                </Row>
                <Row>
                  <Col span={22}>
                    <Form.Item
                      name="member_page_aboutISsmallplaintextbox"
                      className="mt-1"
                      rules={[
                        {
                          required: true,
                          message: 'Please input Name!'
                        }
                      ]}
                    >
                      <Input style={inputStyle} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Text strong className="text-label">
                    Micro-site Contact Details
                  </Text>
                </Row>
                <Row>
                  <Col span={22}>
                    <Form.Item
                      name="member_page_contactISsmallplaintextbox"
                      className="mt-1"
                      rules={[
                        {
                          required: true,
                          message: 'Please input Name!'
                        }
                      ]}
                    >
                      <Input style={inputStyle} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Text strong className="text-label">
                    Micro-site Home Page Message (Logged in)
                  </Text>
                </Row>
                <Row>
                  <Col span={22}>
                    <Form.Item
                      name="member_page_homeISsmallplaintextbox"
                      className="mt-1"
                      rules={[
                        {
                          required: true,
                          message: 'Please input Name!'
                        }
                      ]}
                    >
                      <Input style={inputStyle} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Text strong className="text-label">
                    Member Suspended Message
                  </Text>
                </Row>
                <Row>
                  <Col span={22}>
                    <Form.Item
                      name="member_page_suspendedISsmallplaintextbox"
                      className="mt-1"
                      rules={[
                        {
                          required: true,
                          message: 'Please input Name!'
                        }
                      ]}
                    >
                      <Input style={inputStyle} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Text strong className="text-label">
                    Subscription Expired Message
                  </Text>
                </Row>
                <Row>
                  <Col span={22}>
                    <Form.Item
                      name="member_page_expiredISsmallplaintextbox"
                      className="mt-1"
                      rules={[
                        {
                          required: true,
                          message: 'Please input Name!'
                        }
                      ]}
                    >
                      <Input style={inputStyle} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Text strong className="text-label">
                    Micro-site External Menu Links
                  </Text>
                </Row>
                <Row>
                  <Col span={22}>
                    <Form.Item
                      name="member_page_linksISsmallplaintextbox"
                      className="mt-1"
                      rules={[
                        {
                          required: true,
                          message: 'Please input Name!'
                        }
                      ]}
                    >
                      <Input style={inputStyle} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Text strong className="text-label">
                    Micro-site External Registration Form
                  </Text>
                </Row>
                <Row>
                  <Col span={22}>
                    <Form.Item
                      name="alternate_signup_url"
                      className="mt-1"
                      rules={[
                        {
                          required: true,
                          message: 'Please input Name!'
                        }
                      ]}
                    >
                      <Input style={inputStyle} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Text strong className="text-label">
                    Micro-site External Contact Form
                  </Text>
                </Row>
                <Row>
                  <Col span={22}>
                    <Form.Item
                      name="alternate_contact_url"
                      className="mt-1"
                      rules={[
                        {
                          required: true,
                          message: 'Please input Name!'
                        }
                      ]}
                    >
                      <Input style={inputStyle} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Text strong className="text-label">
                    Micro-site Terms & Conditions/Privacy Policy
                  </Text>
                </Row>
                <Row>
                  <Col span={22}>
                    <Form.Item
                      name="member_page_termsISsmallplaintextbox"
                      className="mt-1"
                      rules={[
                        {
                          required: true,
                          message: 'Please input Name!'
                        }
                      ]}
                    >
                      <Input style={inputStyle} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row className="mt-5 mb-3">
                  <Button
                    variant="outline-primary"
                    type="submit"
                    className="btn-active-command rounded-pill px-4 py-2"
                  >
                    Save
                  </Button>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
export default SixthSite;
