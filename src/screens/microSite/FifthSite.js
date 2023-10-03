import React from 'react';
import { Typography, Row, Col, Switch, InputNumber, message } from 'antd';
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

function FifthSite() {
  const [
    enable_field_birthday_min_ageNUM,
    set_enable_field_birthday_min_ageNUM
  ] = useState(0);
  const [enable_field_mobileYN, set_enable_field_mobileYN] = useState(false);
  const [enable_field_telephoneYN, set_enable_field_telephoneYN] =
    useState(false);
  const [enable_field_birthdayYN, set_enable_field_birthdayYN] =
    useState(false);
  const [enable_field_addressYN, set_enable_field_addressYN] = useState(false);
  const [disable_mem_number_entryYN, set_disable_mem_number_entryYN] =
    useState(false);
  const [member_hide_optout_optionsYN, set_member_hide_optout_optionsYN] =
    useState(false);
  const [member_hide_password_entryYN, set_member_hide_password_entryYN] =
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
      set_enable_field_birthday_min_ageNUM(
        user_data.enable_field_birthday_min_ageNUM
      );
      set_enable_field_mobileYN(Number(user_data.enable_field_mobileYN));
      set_enable_field_telephoneYN(Number(user_data.enable_field_telephoneYN));
      set_enable_field_birthdayYN(Number(user_data.enable_field_birthdayYN));
      set_enable_field_addressYN(Number(user_data.enable_field_addressYN));
      set_disable_mem_number_entryYN(
        Number(user_data.disable_mem_number_entryYN)
      );
      set_member_hide_optout_optionsYN(
        Number(user_data.member_hide_optout_optionsYN)
      );
      set_member_hide_password_entryYN(
        Number(user_data.member_hide_password_entryYN)
      );
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

  const onChange = (checked, cond) => {
    console.log(`switch to ${checked}`);
    switch (cond) {
      case 1:
        set_enable_field_mobileYN(checked);
        break;
      case 2:
        set_enable_field_telephoneYN(checked);
        break;
      case 3:
        set_enable_field_birthdayYN(checked);
        break;
      case 4:
        set_enable_field_addressYN(checked);
        break;
      case 5:
        set_disable_mem_number_entryYN(checked);
        break;
      case 6:
        set_member_hide_optout_optionsYN(checked);
        break;
      default:
        set_member_hide_password_entryYN(checked);
        break;
    }
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
      const addMember = await Axios.patch(
        endpoint.appUsers(`/app/users/${_id}`),
        {
          first_name,
          last_name,
          email,
          user_type,
          enable_field_birthday_min_ageNUM,
          enable_field_mobileYN,
          enable_field_telephoneYN,
          enable_field_birthdayYN,
          enable_field_addressYN,
          disable_mem_number_entryYN,
          member_hide_optout_optionsYN,
          member_hide_password_entryYN
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
      <Row className="mx-4 mt-5">
        <Col span={24} style={{ textAlign: 'center' }}>
          <Title level={3}>Let’s set your micro-site required fields</Title>
        </Col>
      </Row>
      <Row className="mx-4 mt-5">
        <Col span={24}>
          <Card style={cardStyle}>
            <Card.Body className="p-4">
              <Row className="mt-3">
                <Title level={4}>Micro-site Required Fields </Title>
              </Row>

              <Row className="mt-3" align="middle">
                <Col xxl={22} xl={22} lg={20}>
                  <Text>
                    Require 'mobile number' entry in member signup form?
                  </Text>
                </Col>
                <Col xxl={2} xl={2} lg={4} style={{ textAlign: 'end' }}>
                  <Switch
                    defaultChecked={enable_field_mobileYN}
                    onChange={e => onChange(e, 1)}
                  />
                </Col>
              </Row>
              <Row className="mt-3" align="middle">
                <Col xxl={22} xl={22} lg={20}>
                  <Text>Require 'telephone' entry in member signup form?</Text>
                </Col>
                <Col xxl={2} xl={2} lg={4} style={{ textAlign: 'end' }}>
                  <Switch
                    defaultChecked={enable_field_telephoneYN}
                    onChange={e => onChange(e, 2)}
                  />
                </Col>
              </Row>
              {/* <Row className="mt-3" align="middle">
                <Col xxl={22} xl={22} lg={20}>
                  <Text>
                    Require 'date of birth' entry in member signup form?
                  </Text>
                </Col>
                <Col xxl={2} xl={2} lg={4} style={{ textAlign: 'end' }}>
                  <Switch defaultChecked={} onChange={e => onChange(e, 2)} />
                </Col>
              </Row> */}
              <Row className="mt-3" align="middle">
                <Col span={15}>
                  <Text>
                    Require 'date of birth' entry in member signup form?
                  </Text>
                </Col>
                <Col xxl={7} xl={7} lg={5} style={{ textAlign: 'end' }}>
                  <InputNumber
                    style={{ borderRadius: '10px' }}
                    value={enable_field_birthday_min_ageNUM}
                    onChange={e => set_enable_field_birthday_min_ageNUM(e)}
                  />
                </Col>
                <Col xxl={2} xl={2} lg={4} style={{ textAlign: 'end' }}>
                  <Switch
                    defaultChecked={enable_field_birthdayYN}
                    onChange={e => onChange(e, 3)}
                  />
                </Col>
              </Row>
              <Row className="mt-3" align="middle">
                <Col xxl={22} xl={22} lg={20}>
                  <Text>Require 'address' entry in member signup form</Text>
                </Col>
                <Col xxl={2} xl={2} lg={4} style={{ textAlign: 'end' }}>
                  <Switch
                    defaultChecked={enable_field_addressYN}
                    onChange={e => onChange(e, 4)}
                  />
                </Col>
              </Row>
              <Row className="mt-3" align="middle">
                <Col xxl={22} xl={22} lg={20}>
                  <Text>
                    Disable 'card-number' entry in member signup form?
                  </Text>
                </Col>
                <Col xxl={2} xl={2} lg={4} style={{ textAlign: 'end' }}>
                  <Switch
                    defaultChecked={disable_mem_number_entryYN}
                    onChange={e => onChange(e, 5)}
                  />
                </Col>
              </Row>
              <Row className="mt-3" align="middle">
                <Col xxl={22} xl={22} lg={20}>
                  <Text>
                    Hide member opt-out options when editing their profile?
                  </Text>
                </Col>
                <Col xxl={2} xl={2} lg={4} style={{ textAlign: 'end' }}>
                  <Switch
                    defaultChecked={member_hide_optout_optionsYN}
                    onChange={e => onChange(e, 6)}
                  />
                </Col>
              </Row>
              <Row className="mt-3" align="middle">
                <Col xxl={22} xl={22} lg={20}>
                  <Text>Hide password entry in the sign-up form?</Text>
                </Col>
                <Col xxl={2} xl={2} lg={4} style={{ textAlign: 'end' }}>
                  <Switch
                    defaultChecked={member_hide_password_entryYN}
                    onChange={e => onChange(e, 7)}
                  />
                </Col>
              </Row>
              <Row className="mt-5 mb-3">
                <Button
                  variant="outline-primary"
                  className="btn-active-command rounded-pill px-4 py-2"
                  onClick={() => onSubmit()}
                >
                  Save
                </Button>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
export default FifthSite;
