import React from 'react';
import Axios from 'axios';
import {
  Row,
  Col,
  Switch,
  Form,
  Input,
  InputNumber,
  Typography,
  Tooltip,
  message
} from 'antd';
import {
  Button,
  Badge,
  Form as BootstrapForm,
  Collapse
} from 'react-bootstrap';
import { QuestionCircleOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
// import { useDispatch } from 'react-redux';
import endpoint from 'utils/endpoint';
// import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';

const { Title, Paragraph, Text } = Typography;
const badgeStyle = {
  backgroundColor: '#359DD9',
  borderRadius: '50%'
};
const ToolTip = {
  background: 'rgb(53, 157, 217)',
  borderRadius: '50px',
  color: 'white',
  scale: '1.5'
  // marginLeft: '39em'
};
const inputNumberStyle = { borderRadius: '10px', width: '100%' };
const inputBorderRadius = { borderRadius: '10px' };

const data = [
  'Test',
  'Account Update Email',
  'Account Update Text/SMS',
  'Birthday Email',
  'Birthday Text/SMS',
  'Member Password Reset Link',
  'New Member Welcome Email',
  'New Member Welcome Text/SMS',
  'Order Processed Email',
  'Refer A Friend Email',
  'Sales Upload Approved',
  'Sales Upload Declined',
  'Sample PDF Template',
  'Subscription Added',
  'Subscription Expired',
  'Subscription Expiring',
  'Voucher Expiry Warning',
  'Voucher Issued Email',
  'Voucher Issued Text/SMS',
  'Voucher Request Confirmation',
  'Wish List/Registry Invite Email'
];

function EmailAuto() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const _isMounted = useRef(false);
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [
    ar_new_member_email_templateISbb_loyal2_templatesID,
    set_ar_new_member_email_templateISbb_loyal2_templatesID
  ] = useState(null);
  const [
    ar_new_member_email_send_on_first_transactionYN,
    set_ar_new_member_email_send_on_first_transactionYN
  ] = useState(false);
  const [
    ar_new_member_email_suppress_if_backoffice_addYN,
    set_ar_new_member_email_suppress_if_backoffice_addYN
  ] = useState(false);
  const [
    ar_birthday_email_templateISbb_loyal2_templatesID,
    set_ar_birthday_email_templateISbb_loyal2_templatesID
  ] = useState(0);
  const [
    ar_voucher_expiry_warningISbb_loyal2_templatesID,
    set_ar_voucher_expiry_warningISbb_loyal2_templatesID
  ] = useState(0);
  const [
    ar_member_password_reset_linkISbb_loyal2_templatesID,
    set_ar_member_password_reset_linkISbb_loyal2_templatesID
  ] = useState(0);
  const [
    ar_voucher_issued_email_templateISbb_loyal2_templatesID,
    set_ar_voucher_issued_email_templateISbb_loyal2_templatesID
  ] = useState(0);
  const [
    ar_voucher_request_confirmationISbb_loyal2_templatesID,
    set_ar_voucher_request_confirmationISbb_loyal2_templatesID
  ] = useState(0);
  const [
    ar_refer_a_friend_email_templateISbb_loyal2_templatesID,
    set_ar_refer_a_friend_email_templateISbb_loyal2_templatesID
  ] = useState(0);
  const [
    ar_sales_upload_approvedISbb_loyal2_templatesID,
    set_ar_sales_upload_approvedISbb_loyal2_templatesID
  ] = useState(0);
  const [
    ar_sales_upload_declinedISbb_loyal2_templatesID,
    set_ar_sales_upload_declinedISbb_loyal2_templatesID
  ] = useState(0);
  const initPageModule = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      const session_obj = JSON.parse(localStorage.getItem('session_obj'));
      const _id = session_obj._id;
      const get_data = await Axios.get(endpoint.appUsers(`/app/users/${_id}`));
      const user_data = get_data.data.user_data[0];
      set_ar_new_member_email_templateISbb_loyal2_templatesID(
        user_data.ar_new_member_email_templateISbb_loyal2_templatesID
      );
      set_ar_new_member_email_send_on_first_transactionYN(
        Number(user_data.ar_new_member_email_send_on_first_transactionYN)
      );
      set_ar_new_member_email_suppress_if_backoffice_addYN(
        Number(user_data.ar_new_member_email_suppress_if_backoffice_addYN)
      );
      set_ar_birthday_email_templateISbb_loyal2_templatesID(
        user_data.ar_birthday_email_templateISbb_loyal2_templatesID
      );
      set_ar_voucher_expiry_warningISbb_loyal2_templatesID(
        user_data.ar_voucher_expiry_warningISbb_loyal2_templatesID
      );
      set_ar_member_password_reset_linkISbb_loyal2_templatesID(
        user_data.ar_member_password_reset_linkISbb_loyal2_templatesID
      );
      set_ar_voucher_issued_email_templateISbb_loyal2_templatesID(
        user_data.ar_voucher_issued_email_templateISbb_loyal2_templatesID
      );
      set_ar_voucher_request_confirmationISbb_loyal2_templatesID(
        user_data.ar_voucher_request_confirmationISbb_loyal2_templatesID
      );
      set_ar_refer_a_friend_email_templateISbb_loyal2_templatesID(
        user_data.ar_refer_a_friend_email_templateISbb_loyal2_templatesID
      );
      set_ar_sales_upload_approvedISbb_loyal2_templatesID(
        user_data.ar_sales_upload_approvedISbb_loyal2_templatesID
      );
      set_ar_sales_upload_declinedISbb_loyal2_templatesID(
        user_data.ar_sales_upload_declinedISbb_loyal2_templatesID
      );
      form.setFieldsValue({
        ar_birthday_email_template_send_days_beforeNUM:
          user_data.ar_birthday_email_template_send_days_beforeNUM,
        ar_voucher_expiry_warning_send_days_beforeNUM:
          user_data.ar_voucher_expiry_warning_send_days_beforeNUM,
        ar_voucher_expiry_warning_voucher_code_prefix:
          user_data.ar_voucher_expiry_warning_voucher_code_prefix
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
  const onFinish = async values => {
    try {
      _isMounted.current && setLoadingSchema(true);
      const {
        ar_birthday_email_template_send_days_beforeNUM,
        ar_voucher_expiry_warning_send_days_beforeNUM,
        ar_voucher_expiry_warning_voucher_code_prefix
      } = values;
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
          ar_birthday_email_template_send_days_beforeNUM,
          ar_voucher_expiry_warning_send_days_beforeNUM,
          ar_voucher_expiry_warning_voucher_code_prefix,
          ar_new_member_email_templateISbb_loyal2_templatesID,
          ar_new_member_email_send_on_first_transactionYN,
          ar_new_member_email_suppress_if_backoffice_addYN,
          ar_birthday_email_templateISbb_loyal2_templatesID,
          ar_voucher_expiry_warningISbb_loyal2_templatesID,
          ar_member_password_reset_linkISbb_loyal2_templatesID,
          ar_voucher_issued_email_templateISbb_loyal2_templatesID,
          ar_voucher_request_confirmationISbb_loyal2_templatesID,
          ar_refer_a_friend_email_templateISbb_loyal2_templatesID,
          ar_sales_upload_approvedISbb_loyal2_templatesID,
          ar_sales_upload_declinedISbb_loyal2_templatesID
        }
      );
      const user = addMember.data;
      if (user.error) return message.error(user.error);
      message.success('Updated successful!');
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
    }
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const onChangeTransaction = checked => {
    console.log(`switch to ${checked}`);
    set_ar_new_member_email_send_on_first_transactionYN(checked);
  };
  const onChangeBackoffice = checked => {
    console.log(`switch to ${checked}`);
    set_ar_new_member_email_suppress_if_backoffice_addYN(checked);
  };
  return (
    <>
      <Row align="top">
        <Col span={1}>
          <Badge style={badgeStyle}>!</Badge>
        </Col>
        <Col span={19}>
          <Paragraph className="text-label">
            To increase the chance of your emails being delivered please see{' '}
            <u style={{ color: '#359DD9' }}>this article</u> for tips and
            guidelines.
          </Paragraph>
        </Col>
      </Row>
      <Row className="mt-3" align="top">
        <Col span={1}>
          <Badge style={badgeStyle}>!</Badge>
        </Col>
        <Col span={19}>
          <Paragraph className="text-label">
            To disable a specific autoresponder clear the field below and it
            will not send, even if the switch above is set to 'yes'. The fields
            below allow you to link <u>your own personal templates</u> to these
            autoresponders, and making the message sent each time personal to
            your loyaly program.
          </Paragraph>
        </Col>
      </Row>
      <Row className="mt-4">
        <Title level={4}>New Member Autoresponder</Title>
      </Row>
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
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Row className="mt-1">
          <Col span={20}>
            <BootstrapForm.Select
              style={inputBorderRadius}
              defaultValue={ar_new_member_email_templateISbb_loyal2_templatesID}
              onChange={e =>
                set_ar_new_member_email_templateISbb_loyal2_templatesID(
                  e.target.value
                )
              }
            >
              {data.map((item, index) => {
                return (
                  <option key={index} value={index}>
                    {item}
                  </option>
                );
              })}
            </BootstrapForm.Select>
          </Col>
        </Row>
        <Row align="middle" className="mt-5">
          <Col span={16}>
            <Paragraph className="text-label m-0">
              Only send New Member welcome email after first transaction
            </Paragraph>
          </Col>
          <Col span={4} style={{ textAlign: 'end' }}>
            <Switch
              defaultChecked={ar_new_member_email_send_on_first_transactionYN}
              onChange={onChangeTransaction}
            />
          </Col>
          <Col span={4} style={{ textAlign: 'end' }}>
            <Tooltip title="Import data from CSV/Excel file" placement="right">
              <QuestionCircleOutlined style={ToolTip}>?</QuestionCircleOutlined>
            </Tooltip>
          </Col>
        </Row>
        <Row align="middle" className="mt-3">
          <Col span={16}>
            <Paragraph className="text-label m-0">
              Suppress if added/imported via the backoffice
            </Paragraph>
          </Col>
          <Col span={4} style={{ textAlign: 'end' }}>
            <Switch
              defaultChecked={ar_new_member_email_suppress_if_backoffice_addYN}
              onChange={onChangeBackoffice}
            />
          </Col>
          <Col span={4} style={{ textAlign: 'end' }}>
            <Tooltip title="Import data from CSV/Excel file" placement="right">
              <QuestionCircleOutlined style={ToolTip}>?</QuestionCircleOutlined>
            </Tooltip>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col span={20} style={{ textAlign: 'end' }}>
            <Button
              className="rounded-pill px-4 py-2"
              variant="outline-primary"
              onClick={() => navigate('/autoresponders')}
            >
              Send manually
            </Button>
          </Col>
        </Row>
        <Row className="mt-3">
          <Title level={4}>Birthday Autoresponder</Title>
        </Row>
        <Row>
          <Col span={20}>
            <BootstrapForm.Select
              style={inputBorderRadius}
              defaultValue={ar_birthday_email_templateISbb_loyal2_templatesID}
              onChange={e =>
                set_ar_birthday_email_templateISbb_loyal2_templatesID(
                  e.target.value
                )
              }
            >
              {data.map((item, index) => {
                return (
                  <option key={index} value={index}>
                    {item}
                  </option>
                );
              })}
            </BootstrapForm.Select>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col span={20}>
            <Row align="middle" gutter={[16, 16]}>
              <Col lg={3} xl={2}>
                <Text className="text-label">Send</Text>
              </Col>
              <Col lg={6} xl={6}>
                <Form.Item
                  name="ar_birthday_email_template_send_days_beforeNUM"
                  className="m-0"
                  rules={[{ required: true, message: 'Please input send' }]}
                >
                  <InputNumber style={inputNumberStyle} />
                </Form.Item>
              </Col>
              <Col lg={8} xl={9}>
                <Text className="days before">days before</Text>
              </Col>
              <Col lg={7} xl={7} style={{ textAlign: 'end' }}>
                <Button
                  className="rounded-pill px-4 py-2"
                  variant="outline-primary"
                  onClick={() => navigate('/autoresponders')}
                >
                  Send manually
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col span={20}>
            <Button
              variant="outline-primary"
              onClick={() => setOpen(!open)}
              className="rounded-pill px-4 py-2 border-0"
            >
              Show more templates
              {<DownOutlined style={{ marginLeft: '10px' }} />}
            </Button>
          </Col>
        </Row>
        <Row className="mt-5">
          <Collapse in={open} className="px-0 mx-0">
            <div className="border rounded border-0 w-100 px-0 mx-0">
              <Row>
                <Title level={4}>Voucher Expiry Reminder</Title>
              </Row>
              <Row>
                <Col span={20}>
                  <BootstrapForm.Select
                    style={inputBorderRadius}
                    defaultValue={
                      ar_voucher_expiry_warningISbb_loyal2_templatesID
                    }
                    onChange={e =>
                      set_ar_voucher_expiry_warningISbb_loyal2_templatesID(
                        e.target.value
                      )
                    }
                  >
                    {data.map((item, index) => {
                      return (
                        <option key={index} value={index}>
                          {item}
                        </option>
                      );
                    })}
                  </BootstrapForm.Select>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col span={20}>
                  <Row align="middle" gutter={[16, 16]}>
                    <Col lg={3} xl={2}>
                      <Text className="text-label">Send</Text>
                    </Col>
                    <Col lg={6} xl={6}>
                      <Form.Item
                        name="ar_voucher_expiry_warning_send_days_beforeNUM"
                        className="m-0"
                      >
                        <InputNumber style={inputNumberStyle} />
                      </Form.Item>
                    </Col>
                    <Col lg={8} xl={9}>
                      <Text className="days before">days before</Text>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col span={15}>
                  <Row align="middle">
                    <Col lg={20} xl={18} xxl={16}>
                      {' '}
                      <Paragraph className="text-label m-0">
                        Only send reminders for vouchers with code starting with
                      </Paragraph>
                    </Col>
                    <Col lg={4} xl={6} xxl={8}>
                      <Form.Item
                        name="ar_voucher_expiry_warning_voucher_code_prefix"
                        className="m-0"
                        rules={[
                          { required: false, message: 'Please input send' }
                        ]}
                      >
                        <Input style={inputBorderRadius} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className="mt-5">
                <Title level={4}>Subscription Expiring Autoresponder</Title>
              </Row>
              <Row>
                <Col span={20}>
                  <BootstrapForm.Select style={inputBorderRadius}>
                    {data.map((item, index) => {
                      return (
                        <option key={index} value={index}>
                          {item}
                        </option>
                      );
                    })}
                  </BootstrapForm.Select>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col span={20}>
                  <Row align="middle" gutter={[16, 16]}>
                    <Col lg={3} xl={2}>
                      <Text className="text-label">Send</Text>
                    </Col>
                    <Col lg={6} xl={6}>
                      <Form.Item name="send3" className="m-0">
                        <InputNumber style={inputNumberStyle} />
                      </Form.Item>
                    </Col>
                    <Col lg={8} xl={9}>
                      <Text className="days before">days before</Text>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className="mt-5">
                <Title level={4}>New Subscription Autoresponder</Title>
              </Row>
              <Row>
                <Col span={20}>
                  <BootstrapForm.Select style={inputBorderRadius}>
                    {data.map((item, index) => {
                      return (
                        <option key={index} value={index}>
                          {item}
                        </option>
                      );
                    })}
                  </BootstrapForm.Select>
                </Col>
              </Row>

              <Row className="mt-5">
                <Title level={4}>Member Password Set/Reset</Title>
              </Row>
              <Row>
                <Col span={20}>
                  <BootstrapForm.Select
                    style={inputBorderRadius}
                    defaultValue={
                      ar_member_password_reset_linkISbb_loyal2_templatesID
                    }
                    onChange={e =>
                      set_ar_member_password_reset_linkISbb_loyal2_templatesID(
                        e.target.value
                      )
                    }
                  >
                    {data.map((item, index) => {
                      return (
                        <option key={index} value={index}>
                          {item}
                        </option>
                      );
                    })}
                  </BootstrapForm.Select>
                </Col>
              </Row>

              <Row className="mt-5">
                <Title level={4}>Voucher Issued Autoresponder</Title>
              </Row>
              <Row>
                <Col span={20}>
                  <BootstrapForm.Select
                    style={inputBorderRadius}
                    defaultValue={
                      ar_voucher_issued_email_templateISbb_loyal2_templatesID
                    }
                    onChange={e =>
                      set_ar_voucher_issued_email_templateISbb_loyal2_templatesID(
                        e.target.value
                      )
                    }
                  >
                    {data.map((item, index) => {
                      return (
                        <option key={index} value={index}>
                          {item}
                        </option>
                      );
                    })}
                  </BootstrapForm.Select>
                </Col>
              </Row>

              <Row className="mt-5">
                <Title level={4}>Voucher Request Confirmation</Title>
              </Row>
              <Row>
                <Col span={20}>
                  <BootstrapForm.Select
                    style={inputBorderRadius}
                    defaultValue={
                      ar_voucher_request_confirmationISbb_loyal2_templatesID
                    }
                    onChange={e =>
                      set_ar_voucher_request_confirmationISbb_loyal2_templatesID(
                        e.target.value
                      )
                    }
                  >
                    {data.map((item, index) => {
                      return (
                        <option key={index} value={index}>
                          {item}
                        </option>
                      );
                    })}
                  </BootstrapForm.Select>
                </Col>
              </Row>

              <Row className="mt-5">
                <Title level={4}>Subscription Expired Autoresponder</Title>
              </Row>
              <Row>
                <Col span={20}>
                  <BootstrapForm.Select style={inputBorderRadius}>
                    {data.map((item, index) => {
                      return (
                        <option key={index} value={index}>
                          {item}
                        </option>
                      );
                    })}
                  </BootstrapForm.Select>
                </Col>
              </Row>

              <Row className="mt-5">
                <Title level={4}>Refer A Friend Autoresponder</Title>
              </Row>
              <Row>
                <Col span={20}>
                  <BootstrapForm.Select
                    style={inputBorderRadius}
                    defaultValue={
                      ar_refer_a_friend_email_templateISbb_loyal2_templatesID
                    }
                    onChange={e =>
                      set_ar_refer_a_friend_email_templateISbb_loyal2_templatesID(
                        e.target.value
                      )
                    }
                  >
                    {data.map((item, index) => {
                      return (
                        <option key={index} value={index}>
                          {item}
                        </option>
                      );
                    })}
                  </BootstrapForm.Select>
                </Col>
              </Row>

              <Row className="mt-5">
                <Title level={4}>Sales Upload Approved</Title>
              </Row>
              <Row>
                <Col span={20}>
                  <BootstrapForm.Select
                    style={inputBorderRadius}
                    defaultValue={
                      ar_sales_upload_approvedISbb_loyal2_templatesID
                    }
                    onChange={e =>
                      set_ar_sales_upload_approvedISbb_loyal2_templatesID(
                        e.target.value
                      )
                    }
                  >
                    {data.map((item, index) => {
                      return (
                        <option key={index} value={index}>
                          {item}
                        </option>
                      );
                    })}
                  </BootstrapForm.Select>
                </Col>
              </Row>

              <Row className="mt-5">
                <Title level={4}>Sales Upload Declined</Title>
              </Row>
              <Row>
                <Col span={20}>
                  <BootstrapForm.Select
                    style={inputBorderRadius}
                    defaultValue={
                      ar_sales_upload_declinedISbb_loyal2_templatesID
                    }
                    onChange={e =>
                      set_ar_sales_upload_declinedISbb_loyal2_templatesID(
                        e.target.value
                      )
                    }
                  >
                    {data.map((item, index) => {
                      return (
                        <option key={index} value={index}>
                          {item}
                        </option>
                      );
                    })}
                  </BootstrapForm.Select>
                </Col>
              </Row>
              <Row className="mt-5">
                <Col span={20}>
                  <Button
                    className="rounded-pill px-4 py-2"
                    variant="outline-primary"
                    type="submit"
                  >
                    Save
                  </Button>
                </Col>
              </Row>
            </div>
          </Collapse>
        </Row>
      </Form>
    </>
  );
}
export default EmailAuto;
