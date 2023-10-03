import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Row, Button, Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useRef, useEffect } from 'react';
import { LockOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons';

import keys from 'utils/keys';
import endpoint from '../utils/endpoint';
import Flex from 'components/common/Flex';
import { checkRedirect } from 'helpers/utils';
import handleError from '../utils/handleError';
import { setCurrentUser } from 'redux/slices/authSlice';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const _isMounted = useRef(false);
  const settings = useSelector(state => state.settings);

  const [loading, setLoading] = useState(false);

  const onFinish = async values => {
    try {
      _isMounted.current && setLoading(true);
      const { username, password } = values;
      const loginRes = await axios.post(endpoint.login, { username, password });
      const user = loginRes.data;
      console.log(`${endpoint.login} response -> `, user);
      if (user.otp_challenge) {
        localStorage.setItem(keys.OTP_METHOD_LABEL, user.otp_method_label);
        return checkRedirect(user, navigate);
      }
      dispatch(setCurrentUser(user));
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoading(false);
    }
  };

  useEffect(() => {
    _isMounted.current = true;

    return () => {
      _isMounted.current = false;
    };
  }, []);

  const { auth_username_title } = settings;

  return (
    <>
      <Flex justifyContent="between" alignItems="center" className="mb-3">
        <h5>Log in</h5>
      </Flex>
      <Form name="login-form" onFinish={onFinish}>
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
        <Form.Item
          name="password"
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please input your Password!'
            }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Row align="middle" justify="center" style={{ marginTop: 22 }}>
          <Button
            block
            type="primary"
            htmlType="submit"
            icon={<LoginOutlined />}
            style={{ minWidth: 100 }}
            loading={loading}
          >
            Login
          </Button>
        </Row>
      </Form>

      <Row align="middle" justify="center" style={{ marginTop: 20 }}>
        <Button
          htmlType="button"
          type="link"
          style={{ padding: 0, fontWeight: 500, color: 'silver' }}
          disabled={loading}
          onClick={() => navigate('/forgot-password')}
        >
          Forgot Password?
        </Button>
      </Row>
    </>
  );
}

export default Login;
