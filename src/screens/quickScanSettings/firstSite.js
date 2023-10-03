import React from 'react';
import {
  Typography,
  Row,
  Col,
  Switch,
  Input,
  message,
  Divider,
  Tooltip
} from 'antd';
import { Button, Badge } from 'react-bootstrap';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
// import { useDispatch } from 'react-redux';
import endpoint from 'utils/endpoint';
// import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
const { Title, Text, Paragraph } = Typography;
const tooltip_style = {
  color: 'black',
  padding: '14px 11px 45px 18px',
  width: '290px',
  height: '90px',
  fontSize: '10px',
  borderRadius: '10px',
  boxShadow: '0px 4px 4px rgba(217,217,217,0.66)'
};

const inputBorderRadius = {
  borderRadius: '10px',
  width: '100%'
};
function FirstSite() {
  const [quickscan_pwd, set_quickscan_pwd] = useState('');
  const [quickscan_user_loginsYN, set_quickscan_user_loginsYN] =
    useState(false);

  const _isMounted = useRef(false);
  const [loadingSchema, setLoadingSchema] = useState(true);

  const initPageModule = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      const session_obj = JSON.parse(localStorage.getItem('session_obj'));
      const _id = session_obj._id;
      const get_data = await Axios.get(endpoint.appUsers(`/app/users/${_id}`));
      const user_data = get_data.data.user_data[0];
      set_quickscan_pwd(user_data.quickscan_pwd);
      set_quickscan_user_loginsYN(Number(user_data.quickscan_user_loginsYN));
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
  const updatePassword = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      const session_obj = JSON.parse(localStorage.getItem('session_obj'));
      const _id = session_obj._id;
      const first_name = session_obj.first_name;
      const last_name = session_obj.last_name;
      const email = session_obj.email;
      const user_type = session_obj.code;
      const addMember = await Axios.patch(
        endpoint.appUsers(`/app/users/${_id}`),
        {
          first_name,
          last_name,
          email,
          user_type,
          quickscan_pwd
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
  const updateQuickScan = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      const session_obj = JSON.parse(localStorage.getItem('session_obj'));
      const _id = session_obj._id;
      const first_name = session_obj.first_name;
      const last_name = session_obj.last_name;
      const email = session_obj.email;
      const user_type = session_obj.code;
      const addMember = await Axios.patch(
        endpoint.appUsers(`/app/users/${_id}`),
        {
          first_name,
          last_name,
          email,
          user_type,
          quickscan_user_loginsYN
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
  return (
    <>
      <Row className="mt-5 mx-4">
        <Col>
          <Paragraph strong>
            Your QuickScan URL{' '}
            <a href="#"> https://63bff7ca241de.loyal2.com/?Scan</a>
          </Paragraph>
        </Col>
      </Row>
      <Divider />
      <Row className="mt-5">
        <Col span={15}>
          <Title level={4}>Enable QuickScan mode</Title>
        </Col>
        <Col span={9} style={{ textAlign: 'end' }} className="my-1">
          <Tooltip
            placement="bottom"
            color="white"
            overlayInnerStyle={tooltip_style}
            title="For the safest search we suggest that you start by selecting ALL the fields below to YES- this will ensure that you have the smallest chance of merging records that should not be merged."
          >
            <QuestionCircleOutlined
              style={{
                backgroundColor: '#359dd9',
                borderRadius: '50%',
                border: 'none',
                color: 'white',
                fontSize: '20px'
              }}
            />
          </Tooltip>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Text className="text-label " strong>
            Enter a special QuickScan Password
          </Text>
        </Col>
      </Row>
      <Row className="mt-1">
        <Col span={13}>
          <Input
            type="password"
            style={inputBorderRadius}
            className="my-1"
            defaultValue={quickscan_pwd}
            onChange={e => set_quickscan_pwd(e.target.value)}
          />
        </Col>
        <Col span={9} style={{ textAlign: 'right' }}>
          <Button
            variant="outline-primary"
            className="rounded-pill px-4 py-2"
            onClick={() => updatePassword()}
          >
            &nbsp;Update Password&nbsp;
          </Button>
        </Col>
      </Row>
      <Row className="mt-4" align="middle">
        <Col span={11}>
          <Text className="text-label" strong>
            Allow backoffice users to login to QuickScan
          </Text>
        </Col>
        <Col span={2} style={{ textAlign: 'right' }}>
          <Switch
            defaultChecked={quickscan_user_loginsYN}
            onChange={e => set_quickscan_user_loginsYN(e)}
          />
        </Col>
        <Col span={9} style={{ textAlign: 'right' }}>
          <Button
            variant="outline-primary"
            className="rounded-pill px-4 py-2"
            onClick={() => updateQuickScan()}
          >
            Update QuickScan
          </Button>
        </Col>
        <Col span={2} style={{ textAlign: 'end' }} className="my-2">
          <Tooltip
            placement="bottom"
            color="white"
            overlayInnerStyle={tooltip_style}
            title="For the safest search we suggest that you start by selecting ALL the fields below to YES- this will ensure that you have the smallest chance of merging records that should not be merged."
          >
            <QuestionCircleOutlined
              style={{
                backgroundColor: '#359dd9',
                borderRadius: '50%',
                border: 'none',
                color: 'white',
                fontSize: '20px'
              }}
            />
          </Tooltip>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Text className="text-label" strong>
            Quickscan mode is enabled
          </Text>
          &nbsp;&nbsp;
          <Badge
            style={{ backgroundColor: 'green' }}
            count="&nbsp;"
            size="small"
          ></Badge>
        </Col>
      </Row>
    </>
  );
}
export default FirstSite;
