import React from 'react';
import {
  Typography,
  Row,
  Col,
  message,
  Tooltip,
  Switch,
  InputNumber,
  Input
} from 'antd';
import { Button } from 'react-bootstrap';
import { QuestionCircleOutlined, DownOutlined } from '@ant-design/icons';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
// import { useDispatch } from 'react-redux';
import endpoint from 'utils/endpoint';
// import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
const { Text, Paragraph } = Typography;
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
function SecondSite() {
  const [setting_show, setSetting_show] = useState(false);
  const [quickscan_points_per_scanNUM, set_quickscan_points_per_scanNUM] =
    useState('');
  const [quickscan_max_scans_per_dayNUM, set_quickscan_max_scans_per_dayNUM] =
    useState(0);
  const [quickscan_global_pointsYN, set_quickscan_global_pointsYN] =
    useState(false);
  const [quickscan_points_per_scan_list, set_quickscan_points_per_scan_list] =
    useState(false);
  const [quickscan_change_member_codeYN, set_quickscan_change_member_codeYN] =
    useState(false);
  const [
    quickscan_assist_member_passwordYN,
    set_quickscan_assist_member_passwordYN
  ] = useState(false);
  const [quickscan_apply_voucher_codesYN, set_quickscan_apply_voucher_codesYN] =
    useState(false);
  const [quickscan_hide_public_linkYN, set_quickscan_hide_public_linkYN] =
    useState(false);
  const [
    quickscan_manual_entry_new_windowYN,
    set_quickscan_manual_entry_new_windowYN
  ] = useState(false);
  const [quickscan_view_mode, set_quickscan_view_mode] = useState(false);

  const _isMounted = useRef(false);
  const [loadingSchema, setLoadingSchema] = useState(true);

  const initPageModule = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      const session_obj = JSON.parse(localStorage.getItem('session_obj'));
      const _id = session_obj._id;
      const get_data = await Axios.get(endpoint.appUsers(`/app/users/${_id}`));
      const user_data = get_data.data.user_data[0];
      set_quickscan_points_per_scanNUM(user_data.quickscan_points_per_scanNUM);
      set_quickscan_max_scans_per_dayNUM(
        user_data.quickscan_max_scans_per_dayNUM
      );
      set_quickscan_global_pointsYN(
        Number(user_data.quickscan_global_pointsYN)
      );
      set_quickscan_points_per_scan_list(
        Number(user_data.quickscan_points_per_scan_list)
      );
      set_quickscan_change_member_codeYN(
        Number(user_data.quickscan_change_member_codeYN)
      );
      set_quickscan_assist_member_passwordYN(
        Number(user_data.quickscan_assist_member_passwordYN)
      );
      set_quickscan_apply_voucher_codesYN(
        Number(user_data.quickscan_apply_voucher_codesYN)
      );
      set_quickscan_hide_public_linkYN(
        Number(user_data.quickscan_hide_public_linkYN)
      );
      set_quickscan_manual_entry_new_windowYN(
        Number(user_data.quickscan_manual_entry_new_windowYN)
      );
      set_quickscan_view_mode(Number(user_data.quickscan_view_mode));
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
        set_quickscan_global_pointsYN(checked);
        break;
      case 2:
        set_quickscan_points_per_scan_list(checked);
        break;
      case 3:
        set_quickscan_apply_voucher_codesYN(checked);
        break;
      case 4:
        set_quickscan_change_member_codeYN(checked);
        break;
      case 5:
        set_quickscan_assist_member_passwordYN(checked);
        break;
      case 6:
        set_quickscan_hide_public_linkYN(checked);
        break;
      case 7:
        console.log(checked);
        break;
      case 8:
        set_quickscan_manual_entry_new_windowYN(checked);
        break;
      default:
        set_quickscan_view_mode(checked);
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
          quickscan_points_per_scanNUM,
          quickscan_max_scans_per_dayNUM,
          quickscan_global_pointsYN,
          quickscan_points_per_scan_list,
          quickscan_apply_voucher_codesYN,
          quickscan_change_member_codeYN,
          quickscan_assist_member_passwordYN,
          quickscan_hide_public_linkYN,
          quickscan_manual_entry_new_windowYN,
          quickscan_view_mode
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

  const setting_click = () => {
    if (setting_show == false) {
      setSetting_show(true);
    }
    if (setting_show == true) {
      setSetting_show(false);
    }
  };
  return (
    <>
      <Row className="mt-5">
        <Col span={15}>
          <Text className="text-label" strong>
            Number of points to award per QuickScan
          </Text>
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
      <Row>
        <Col span={20}>
          <Input
            style={inputBorderRadius}
            defaultValue={quickscan_points_per_scanNUM}
            onChange={e => set_quickscan_points_per_scanNUM(e.target.value)}
          />
        </Col>
      </Row>
      <Row className="mt-5">
        <Col span={20}>
          <Button
            variant="outline-primary"
            className="rounded-pill px-4 py-2"
            onClick={() => setting_click()}
          >
            Advanced QuickScan points options{' '}
            <DownOutlined style={{ fontSize: '14px', marginLeft: '10px' }} />
          </Button>
        </Col>
        <Col span={4} style={{ textAlign: 'end' }} className="my-1">
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
      {setting_show == true && (
        <>
          <Row className="mt-4">
            <Col span={22}>
              <Paragraph
                // style={{ textAlign: 'justify' }}
                className="text-label"
              >
                Enter a single amount in points to have a single button <br />{' '}
                presented to the operator (ie<b>7</b>
                ). <br />
              </Paragraph>
              <Paragraph className="mt-4">
                Separate with commas if more than one amount/button is
                <br /> required(ie <b> 3,5,10,20 </b>). Use colons to label
                buttons(ie <br />
                <b> Eggs:3, Bacon:5, Toast:10, Ketchup:20</b>).
              </Paragraph>
              <Paragraph className="mt-4">
                For free-form points entry enter the word <b> free.</b>
              </Paragraph>
              <Paragraph className="mt-4">
                For a calculator enter the word <b> calc </b>.
              </Paragraph>
              <Paragraph className="mt-4">
                Add <b> min:amount </b> to the <b> calc </b> command to set a
                minimum
                <br />
                before points will be awarded using the calculators above (ie
                <br /> <b> calc min:10 </b>).
              </Paragraph>
              <Paragraph className="mt-4">
                For auto points allocation enter <b> auto: points </b> where
                points <br /> is the number of points(ie<b> auto:7</b>).
              </Paragraph>
            </Col>
          </Row>
        </>
      )}
      <Row className="mt-4">
        <Col span={22}>
          <Paragraph className="text-label">
            For more advanced functionality and flexibility you can also add{' '}
            <a href="#">non-transaction promotions </a> with an
            auto-allocate-on-event set as QuickScan.
          </Paragraph>
        </Col>
        <Col span={2} style={{ textAlign: 'end' }}>
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
      <Row align="middle">
        <Col span={18}>
          <Text className="text-label" strong>
            No. of QuickScans per mem/day :
          </Text>
        </Col>
        <Col style={{ textAlign: 'right' }} span={2}>
          <InputNumber
            defaultValue={quickscan_max_scans_per_dayNUM}
            style={{ width: '100%', borderRadius: '10px' }}
            onChange={e => set_quickscan_max_scans_per_dayNUM(e)}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col span={17}>
          <Text className="text-label" strong>
            For multi-branch: apply QuickScan points globally?
          </Text>
        </Col>
        <Col style={{ textAlign: 'end' }} span={3}>
          <Switch
            defaultChecked={quickscan_global_pointsYN}
            onChange={e => onChange(e, 1)}
          />
        </Col>
      </Row>

      <Row className="mt-3">
        <Col span={17}>
          <Text className="text-label" strong>
            Allow operator to list member vouchers?
          </Text>
        </Col>
        <Col style={{ textAlign: 'end' }} span={3}>
          <Switch
            defaultChecked={quickscan_points_per_scan_list}
            onChange={e => onChange(e, 2)}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col span={17}>
          <Text className="text-label" strong>
            Allow operator to assist selecting vouchers?
          </Text>
        </Col>
        <Col style={{ textAlign: 'end' }} span={3}>
          <Switch
            defaultChecked={quickscan_change_member_codeYN}
            onChange={e => onChange(e, 3)}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col span={17}>
          <Text className="text-label" strong>
            Allow operator to change member number/code?
          </Text>
        </Col>
        <Col style={{ textAlign: 'end' }} span={3}>
          <Switch
            defaultChecked={quickscan_assist_member_passwordYN}
            onChange={e => onChange(e, 4)}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col span={17}>
          <Text className="text-label" strong>
            Allow operator to assist member with password reset?
          </Text>
        </Col>
        <Col style={{ textAlign: 'end' }} span={3}>
          <Switch
            defaultChecked={quickscan_apply_voucher_codesYN}
            onChange={e => onChange(e, 5)}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col span={17}>
          <Text className="text-label" strong>
            Hide QuickScan link in public Micro-site menu?
          </Text>
        </Col>
        <Col style={{ textAlign: 'end' }} span={3}>
          <Switch
            defaultChecked={quickscan_hide_public_linkYN}
            onChange={e => onChange(e, 6)}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col span={17}>
          <Text className="text-label" strong>
            Require a PIN for each operator?
          </Text>
        </Col>
        <Col style={{ textAlign: 'end' }} span={3}>
          <Switch onChange={e => onChange(e, 7)} />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col span={17}>
          <Text className="text-label" strong>
            Open QuickScan lookups in a new tab?
          </Text>
        </Col>
        <Col style={{ textAlign: 'end' }} span={3}>
          <Switch
            defaultChecked={quickscan_manual_entry_new_windowYN}
            onChange={e => onChange(e, 8)}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col span={17}>
          <Text className="text-label" strong>
            Show QuickScan in Horizontal Mode?
          </Text>
        </Col>
        <Col style={{ textAlign: 'end' }} span={3}>
          <Switch
            defaultChecked={quickscan_view_mode}
            onChange={e => onChange(e, 9)}
          />
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <Button
            variant="outline-primary"
            className="rounded-pill px-4 py-2"
            onClick={() => onSubmit()}
          >
            Update settings
          </Button>
        </Col>
      </Row>
    </>
  );
}
export default SecondSite;
