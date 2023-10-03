import React from 'react';
import { Row, Col, Switch, Typography, message } from 'antd';
import { Button, Form } from 'react-bootstrap';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
// import { useDispatch } from 'react-redux';
import endpoint from 'utils/endpoint';
// import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
const { Paragraph } = Typography;
const time_array = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23
];
function ControlAuto() {
  const [autoresponders_onYN, set_autoresponders_onYN] = useState(0);
  const [ar_enforce_optoutYN, set_ar_enforce_optoutYN] = useState(0);
  const [
    ar_bcc_autoresponders_to_ownerYN,
    set_ar_bcc_autoresponders_to_ownerYN
  ] = useState(0);
  const [ar_delay_send_hourNUM, set_ar_delay_send_hourNUM] = useState(null);
  // const dispatch = useDispatch();
  const _isMounted = useRef(false);
  // let { routeKey } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);

  const initPageModule = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      const session_obj = JSON.parse(localStorage.getItem('session_obj'));
      const _id = session_obj._id;
      const get_data = await Axios.get(endpoint.appUsers(`/app/users/${_id}`));
      const user_data = get_data.data.user_data[0];
      set_autoresponders_onYN(Number(user_data.autoresponders_onYN));
      set_ar_enforce_optoutYN(Number(user_data.ar_enforce_optoutYN));
      set_ar_bcc_autoresponders_to_ownerYN(
        Number(user_data.ar_bcc_autoresponders_to_ownerYN)
      );
      set_ar_delay_send_hourNUM(parseInt(user_data.ar_delay_send_hourNUM));
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

  const onChangeAutoresponders = checked => {
    console.log(`switch to ${checked}`);
    set_autoresponders_onYN(checked);
  };
  const onChangeEmails = checked => {
    console.log(`switch to ${checked}`);
    set_ar_enforce_optoutYN(checked);
  };
  const onChangeMembers = checked => {
    console.log(`switch to ${checked}`);
    set_ar_bcc_autoresponders_to_ownerYN(checked);
  };
  const onSubmit = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      const session_obj = JSON.parse(localStorage.getItem('session_obj'));
      const _id = session_obj._id;
      const first_name = session_obj.first_name;
      const last_name = session_obj.last_name;
      const email = session_obj.email;
      const user_type = session_obj.code;
      console.log(ar_delay_send_hourNUM);
      const addMember = await Axios.patch(
        endpoint.appUsers(`/app/users/${_id}`),
        {
          first_name,
          last_name,
          email,
          user_type,
          autoresponders_onYN,
          ar_enforce_optoutYN,
          ar_bcc_autoresponders_to_ownerYN,
          ar_delay_send_hourNUM
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
      <Row>
        <Col span={20}>
          <Row align="middle">
            <Col span={18}>
              <Paragraph className="text-label m-0">
                Turn autoresponders on
              </Paragraph>
            </Col>
            <Col span={6} style={{ textAlign: 'center' }}>
              <Switch
                defaultChecked={autoresponders_onYN}
                onChange={onChangeAutoresponders}
              />
            </Col>
          </Row>
          <Row align="middle" className="mt-3">
            <Col span={18}>
              <Paragraph className="text-label m-0">
                BCC autoresponder emails
              </Paragraph>
            </Col>
            <Col span={6} style={{ textAlign: 'center' }}>
              <Switch
                defaultChecked={ar_enforce_optoutYN}
                onChange={onChangeEmails}
              />
            </Col>
          </Row>
          <Row align="middle" className="mt-3">
            <Col span={18}>
              <Paragraph className="text-label m-0">
                Disable autoresponder messages to opt-out members
              </Paragraph>
            </Col>
            <Col span={6} style={{ textAlign: 'center' }}>
              <Switch
                defaultChecked={ar_bcc_autoresponders_to_ownerYN}
                onChange={onChangeMembers}
              />
            </Col>
          </Row>
          <Row align="middle" className="mt-3">
            <Col span={18}>
              <Paragraph className="text-label m-0">
                Delay 'new member' outgoing autoresponder messages and send
                daily at
              </Paragraph>
            </Col>
            <Col span={6} style={{ textAlign: 'center' }}>
              <Form.Select
                style={{ borderRadius: '10px' }}
                defaultValue={ar_delay_send_hourNUM}
                onChange={e => set_ar_delay_send_hourNUM(e.target.value)}
              >
                <option value>Do not delay</option>
                {time_array.map(val => {
                  return (
                    <option key={val} value={val}>
                      {val + ':00'}
                    </option>
                  );
                })}
              </Form.Select>
            </Col>
          </Row>
          <Row className="mt-5">
            <Button
              className="rounded-pill px-4 py-2"
              variant="outline-primary"
              onClick={() => onSubmit()}
            >
              Save
            </Button>
          </Row>
        </Col>
      </Row>
    </>
  );
}
export default ControlAuto;
