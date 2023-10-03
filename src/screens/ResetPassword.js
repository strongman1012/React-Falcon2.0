import React from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Row, Button, Form, Input, message } from 'antd';
import { LockOutlined, ArrowRightOutlined } from '@ant-design/icons';

import endpoint from '../utils/endpoint';
import handleError from '../utils/handleError';
import { getQueryVariable } from 'helpers/utils';

function ResetPassword() {
  const navigate = useNavigate();
  const token = getQueryVariable('token');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!token) {
      message.warning('Token is required to reset your password.');
      navigate('/forgot-password', { replace: true });
    }
  }, []);

  const onFinish = async values => {
    try {
      setLoading(true);
      const { password } = values;
      const res = await Axios.post(endpoint.resetPassword, { password, token });
      console.log(`${endpoint.resetPassword} response -> `, res.data);
      setLoading(false);
      message.success(
        'Thanks your password has been re-set. You can log in with it now!'
      );
      navigate('/login', { replace: true });
    } catch (error) {
      handleError(error, true);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-4">
        <h5>Enter your new password</h5>
      </div>
      <Form name="password-reset-request-form" onFinish={onFinish}>
        <Form.Item
          name="password"
          hasFeedback
          validateFirst
          rules={[
            {
              required: true,
              message: 'Please input your password!'
            },
            {
              min: 8,
              message: 'Password must be a minimum of 8 characters long!'
            }
          ]}
        >
          <Input.Password
            allowClear
            placeholder="Password"
            prefix={<LockOutlined />}
          />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={['password']}
          hasFeedback
          validateFirst
          rules={[
            {
              required: true,
              message: 'Please confirm your password!'
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  'The two passwords that you entered do not match!'
                );
              }
            })
          ]}
        >
          <Input.Password
            allowClear
            placeholder="Confirm Password"
            prefix={<LockOutlined />}
          />
        </Form.Item>

        <Row align="middle" justify="center" style={{ marginTop: 22 }}>
          <Button
            block
            type="primary"
            htmlType="submit"
            icon={<ArrowRightOutlined />}
            style={{ minWidth: 100 }}
            loading={loading}
          >
            Reset Password
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

export default ResetPassword;
