import React from 'react';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Row, Button, Form, Input, message } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';

import endpoint from '../utils/endpoint';
import handleError from '../utils/handleError';

function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const { auth_username_title } = useSelector(state => state.settings);

  const onFinish = async values => {
    try {
      setLoading(true);
      const { username } = values;
      const res = await Axios.post(endpoint.forgotPassword, { username });
      console.log(`${endpoint.forgotPassword} response -> `, res.data);
      message.success(
        'A password reset link has been successfully sent to your email address.'
      );
      setLoading(false);
    } catch (error) {
      handleError(error, true);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-4">
        <h5>Forgot your password?</h5>
        <small className="mt-3 fw-semi-bold">
          Enter your {auth_username_title} and we will send a password reset
          link.
        </small>
        <br />
        <small>
          Password reset tokens are only valid for 1 hour after issuing.
        </small>
      </div>
      <Form name="forgot-password-request-form" onFinish={onFinish}>
        <Form.Item
          name="username"
          hasFeedback
          rules={[
            {
              whitespace: true,
              required: true,
              message: `Please input your ${auth_username_title.toLowerCase()}!`
            }
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder={auth_username_title} />
        </Form.Item>

        <Row align="middle" justify="center" style={{ marginTop: 22 }}>
          <Button
            block
            type="primary"
            htmlType="submit"
            icon={<SendOutlined />}
            style={{ minWidth: 100 }}
            loading={loading}
          >
            Request Link
          </Button>
        </Row>

        <Row align="middle" justify="center" style={{ marginTop: 20 }}>
          <Button
            htmlType="button"
            type="link"
            style={{ padding: 0, fontWeight: 500, color: 'silver' }}
            disabled={loading}
            onClick={() => navigate('/login')}
          >
            Back To Login
          </Button>
        </Row>
      </Form>
    </>
  );
}

export default ForgotPassword;
