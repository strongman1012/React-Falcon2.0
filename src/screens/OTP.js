import React from 'react';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LockOutlined } from '@ant-design/icons';
import { Row, Button, Form, Input, message } from 'antd';

import keys from 'utils/keys';
import endpoint from '../utils/endpoint';
import handleError from '../utils/handleError';
import { setCurrentUser } from 'redux/slices/authSlice';

function OTP() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async values => {
    try {
      setLoading(true);
      const res = await Axios.post(endpoint.otp, values);
      const user = res.data;
      if (user.error) return message.error(user.error);
      message.success('Verification successful!');
      console.log(`${endpoint.otp} response -> `, user);
      // Same as Login
      dispatch(setCurrentUser(user));
    } catch (error) {
      handleError(error, true);
    } finally {
      setLoading(false);
    }
  };

  const LABEL = localStorage.getItem(keys.OTP_METHOD_LABEL) || 'Email';

  return (
    <>
      <div className="text-center mb-4">
        <h5>One Time Pin Authentication</h5>
        <small className="mt-3 fw-semi-bold">
          A One Time Pin has been sent to you via {LABEL}.
        </small>
        <br />
        <small>Please enter it below to continue:</small>
      </div>
      <Form name="otp-form" onFinish={onFinish}>
        <Form.Item
          name="pin"
          hasFeedback
          rules={[
            { whitespace: true, required: true, message: `Pin is required!` }
          ]}
        >
          <Input prefix={<LockOutlined />} placeholder="Pin" />
        </Form.Item>

        <Row align="middle" justify="center" style={{ marginTop: 22 }}>
          <Button
            block
            type="primary"
            htmlType="submit"
            style={{ minWidth: 100 }}
            loading={loading}
          >
            Verify
          </Button>
        </Row>

        <Row align="middle" justify="center" style={{ marginTop: 20 }}>
          <Button
            htmlType="button"
            type="link"
            style={{ padding: 0, fontWeight: 500, color: 'silver' }}
            disabled={loading}
            onClick={() => navigate('/login', { replace: true })}
          >
            Back To Login
          </Button>
        </Row>
      </Form>
    </>
  );
}

export default OTP;
