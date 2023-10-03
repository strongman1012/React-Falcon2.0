import React from 'react';
import { Typography, Row, Col, Switch, message } from 'antd';
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

function ForthSite() {
  const [member_access_allowedYN, set_member_access_allowedYN] =
    useState(false);
  const [members_can_register_directlyYN, set_members_can_register_directlyYN] =
    useState(false);
  const [members_can_update_detailsYN, set_members_can_update_detailsYN] =
    useState(false);
  const [
    members_qrISLIST_QuickScanQR_PlainQR_PlainBarcode,
    set_members_qrISLIST_QuickScanQR_PlainQR_PlainBarcode
  ] = useState(false);
  const [
    member_hide_points_balance_on_home_pageYN,
    set_member_hide_points_balance_on_home_pageYN
  ] = useState(false);
  const [members_can_see_statementsYN, set_members_can_see_statementsYN] =
    useState(false);
  const [members_can_claim_vouchersYN, set_members_can_claim_vouchersYN] =
    useState(false);
  const [members_can_view_vouchersYN, set_members_can_view_vouchersYN] =
    useState(false);
  const [member_group_visibleYN, set_member_group_visibleYN] = useState(false);
  const _isMounted = useRef(false);
  const [loadingSchema, setLoadingSchema] = useState(true);

  const initPageModule = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      const session_obj = JSON.parse(localStorage.getItem('session_obj'));
      const _id = session_obj._id;
      const get_data = await Axios.get(endpoint.appUsers(`/app/users/${_id}`));
      const user_data = get_data.data.user_data[0];
      set_member_access_allowedYN(Number(user_data.member_access_allowedYN));
      set_members_can_register_directlyYN(
        Number(user_data.members_can_register_directlyYN)
      );
      set_members_can_update_detailsYN(
        Number(user_data.members_can_update_detailsYN)
      );
      set_members_qrISLIST_QuickScanQR_PlainQR_PlainBarcode(
        Number(user_data.members_qrISLIST_QuickScanQR_PlainQR_PlainBarcode)
      );
      set_member_hide_points_balance_on_home_pageYN(
        Number(user_data.member_hide_points_balance_on_home_pageYN)
      );
      set_members_can_see_statementsYN(
        Number(user_data.members_can_see_statementsYN)
      );
      set_members_can_claim_vouchersYN(
        Number(user_data.members_can_claim_vouchersYN)
      );
      set_members_can_view_vouchersYN(
        Number(user_data.members_can_view_vouchersYN)
      );
      set_member_group_visibleYN(Number(user_data.member_group_visibleYN));
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
        set_member_access_allowedYN(checked);
        break;
      case 2:
        set_members_can_register_directlyYN(checked);
        break;
      case 3:
        set_members_can_update_detailsYN(checked);
        break;
      case 4:
        set_members_qrISLIST_QuickScanQR_PlainQR_PlainBarcode(checked);
        break;
      case 5:
        set_member_hide_points_balance_on_home_pageYN(checked);
        break;
      case 6:
        set_members_can_see_statementsYN(checked);
        break;
      case 7:
        set_members_can_claim_vouchersYN(checked);
        break;
      case 8:
        set_members_can_view_vouchersYN(checked);
        break;
      default:
        set_member_group_visibleYN(checked);
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
          member_access_allowedYN,
          members_can_register_directlyYN,
          members_can_update_detailsYN,
          members_qrISLIST_QuickScanQR_PlainQR_PlainBarcode,
          member_hide_points_balance_on_home_pageYN,
          members_can_see_statementsYN,
          members_can_claim_vouchersYN,
          members_can_view_vouchersYN,
          member_group_visibleYN
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
          <Title level={3}>Lets set your micro-site permissions</Title>
        </Col>
      </Row>
      <Row className="mx-4 mt-5">
        <Col span={24}>
          <Card style={cardStyle}>
            <Card.Body className="p-4">
              <Row className="mt-3">
                <Title level={4}>Micro-site Permissions </Title>
              </Row>
              <Row className="mt-3" align="middle">
                <Col span={20}>
                  <Text>Allow members online access?</Text>
                </Col>
                <Col span={4} style={{ textAlign: 'end' }}>
                  <Switch
                    defaultChecked={member_access_allowedYN}
                    onChange={e => onChange(e, 1)}
                  />
                </Col>
              </Row>
              <Row className="mt-3" align="middle">
                <Col span={20}>
                  <Text>Can members register themselves online?</Text>
                </Col>
                <Col span={4} style={{ textAlign: 'end' }}>
                  <Switch
                    defaultChecked={members_can_register_directlyYN}
                    onChange={e => onChange(e, 2)}
                  />
                </Col>
              </Row>
              <Row className="mt-3" align="middle">
                <Col span={20}>
                  <Text>Can members update their profile?</Text>
                </Col>
                <Col span={4} style={{ textAlign: 'end' }}>
                  <Switch
                    defaultChecked={members_can_update_detailsYN}
                    onChange={e => onChange(e, 3)}
                  />
                </Col>
              </Row>
              <Row className="mt-3" align="middle">
                <Col span={20}>
                  <Text>Display member QR/bar-code on their home page?</Text>
                </Col>
                <Col span={4} style={{ textAlign: 'end' }}>
                  <Switch
                    defaultChecked={
                      members_qrISLIST_QuickScanQR_PlainQR_PlainBarcode
                    }
                    onChange={e => onChange(e, 4)}
                  />
                </Col>
              </Row>
              <Row className="mt-3" align="middle">
                <Col span={20}>
                  <Text>Hide member points balance on home page?</Text>
                </Col>
                <Col span={4} style={{ textAlign: 'end' }}>
                  <Switch
                    defaultChecked={member_hide_points_balance_on_home_pageYN}
                    onChange={e => onChange(e, 5)}
                  />
                </Col>
              </Row>
              <Row className="mt-3" align="middle">
                <Col span={20}>
                  <Text>Can members see detailed points statements?</Text>
                </Col>
                <Col span={4} style={{ textAlign: 'end' }}>
                  <Switch
                    defaultChecked={members_can_see_statementsYN}
                    onChange={e => onChange(e, 6)}
                  />
                </Col>
              </Row>
              <Row className="mt-3" align="middle">
                <Col span={20}>
                  <Text>Can members select vouchers?</Text>
                </Col>
                <Col span={4} style={{ textAlign: 'end' }}>
                  <Switch
                    defaultChecked={members_can_claim_vouchersYN}
                    onChange={e => onChange(e, 7)}
                  />
                </Col>
              </Row>
              <Row className="mt-3" align="middle">
                <Col span={20}>
                  <Text>Can members view their vouchers?</Text>
                </Col>
                <Col span={4} style={{ textAlign: 'end' }}>
                  <Switch
                    defaultChecked={members_can_view_vouchersYN}
                    onChange={e => onChange(e, 8)}
                  />
                </Col>
              </Row>
              <Row className="mt-3" align="middle">
                <Col span={20}>
                  <Text>Can members view their Group/Tier?</Text>
                </Col>
                <Col span={4} style={{ textAlign: 'end' }}>
                  <Switch
                    defaultChecked={member_group_visibleYN}
                    onChange={e => onChange(e, 9)}
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
export default ForthSite;
