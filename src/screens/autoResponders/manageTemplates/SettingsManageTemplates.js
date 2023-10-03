import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  Row,
  Col,
  Typography,
  Form,
  Input,
  Tooltip,
  Divider,
  Upload,
  List
} from 'antd';
import { Button, Badge, Modal } from 'react-bootstrap';
// import { useParams } from 'react-router-dom';
import VirtualList from 'rc-virtual-list';
import endpoint from '../../../utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { setMemberMenuData } from 'redux/slices/currentDataSlice';
import {
  QuestionCircleOutlined,
  EyeOutlined,
  DownOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const inputBorderRadius = { borderRadius: '10px' };
const ListStyle = {
  position: 'absolute',
  zIndex: 1000,
  // height: '500px',
  border: '1px solid #979696',
  padding: '10px',
  backgroundColor: 'white',
  width: '100%',
  cursor: 'pointer',
  borderRadius: '10px',
  boxShadow: '0px 8px 8px rgba(118, 116, 116, 0.2)'
};
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
const ContainerHeight = 400;
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
function SettingsManageTemplates() {
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = React.useState(false);
  const [selectShow, setSelectShow] = useState(true);
  const _isMounted = useRef(false);
  // let { routeKey } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const initPageModule = async () => {
    try {
      // default part
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getDataManageTemplateSchemaEndpoint('settings');
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      dispatch(setMemberMenuData({ currentMemberMenuSchema: schema.menu })); // store current member menu
      _isMounted.current && setLayoutData(layoutSchema);
      // end default part
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

  // const [prefix_num, setPrefix_num] = useState(1);
  // const [start_num, setStart_num] = useState(0);

  if (loadingSchema) {
    return <Loading style={{ marginTop: 150 }} msg="Loading Schema..." />;
  }
  if (!layoutData) return getErrorAlert({ onRetry: initPageModule });

  const handleChange = info => {
    console.log(info, 'image');
  };
  const onFinish = async values => {
    console.log('Success:', values);
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  // const onScroll = e => {
  //   if (
  //     e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
  //     ContainerHeight
  //   ) {
  //     appendData();
  //   }
  // };
  return (
    <>
      <Row className="mx-5">
        <Col span={20}>
          <Row className="mt-3">
            <Col span={1}>
              <Badge style={badgeStyle}>!</Badge>
            </Col>
            <Col span={23}>
              <Paragraph>
                Preview/test templates clicking on the preview icon next to each
                template name
              </Paragraph>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mx-5 mt-3">
        {/* <Button variant="primary" onClick={() => setModalShow(true)}>
          Launch demo modal
        </Button> */}
        <Col span={20}>
          <Input
            suffix={<DownOutlined />}
            style={inputBorderRadius}
            onClick={() => setSelectShow(!selectShow)}
          />
          <List style={ListStyle} hidden={selectShow}>
            <VirtualList
              data={data}
              height={ContainerHeight}
              itemHeight={47}
              itemKey="email"
              // onScroll={onScroll}
            >
              {item => (
                <List.Item>
                  <Text strong className="text-label">
                    {item}
                  </Text>
                  {
                    <EyeOutlined
                      justify="end"
                      onClick={() => setModalShow(true)}
                    />
                  }
                </List.Item>
              )}
            </VirtualList>
          </List>
        </Col>
      </Row>
      <Divider />
      <Row className="mx-5 mt-3">
        <Col span={20}>
          <Title level={4}>Email Template Header/Footer Settings</Title>
        </Col>
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
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Row className="mx-5 mt-3">
          <Col span={20}>
            <Paragraph>
              The following settings allow you to control the header and footer
              of all outgoing emails. All fields are optional, so you may choose
              to only have a header image for example.
            </Paragraph>
          </Col>
        </Row>
        <Row className="mx-5 mt-4" align="middle">
          <Col span={20}>
            <Row align="middle">
              <Col lg={12} xl={10}>
                <Text strong className="text-label">
                  Email Template Header Image (640px)
                </Text>
              </Col>
              <Col lg={12} xl={14}>
                <Upload
                  colorBorder="blue"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture"
                  onChange={handleChange}
                >
                  <Button variant="light" className="rounded-pill px-4 py-2">
                    Select Image
                  </Button>
                </Upload>
              </Col>
            </Row>
          </Col>
          <Col span={4} style={{ textAlign: 'end' }}>
            <Tooltip title="Email template" placement="right">
              <QuestionCircleOutlined style={ToolTip}>?</QuestionCircleOutlined>
            </Tooltip>
          </Col>
        </Row>
        <Row className="mx-5 mt-3" align="middle">
          <Col span={20}>
            <Text strong className="text-label">
              Email Template Header HTML
            </Text>
          </Col>
          <Col span={4} style={{ textAlign: 'end' }}>
            <Tooltip title="Email template" placement="right">
              <QuestionCircleOutlined style={ToolTip}>?</QuestionCircleOutlined>
            </Tooltip>
          </Col>
        </Row>
        <Row className="mx-5 mt-1">
          <Col span={20}>
            <Form.Item
              name="header1"
              rules={[{ required: true, message: 'Please input Header' }]}
            >
              <Input.TextArea style={inputBorderRadius} rows={3} />
            </Form.Item>
          </Col>
        </Row>
        <Row className="mx-5 mt-2" align="middle">
          <Col span={20}>
            <Row align="middle">
              <Col lg={12} xl={10}>
                <Text strong className="text-label">
                  Email Template Footer Image (640px)
                </Text>
              </Col>
              <Col lg={12} xl={14}>
                <Upload
                  colorBorder="blue"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture"
                  onChange={handleChange}
                >
                  <Button variant="light" className="rounded-pill px-4 py-2">
                    Select Image
                  </Button>
                </Upload>
              </Col>
            </Row>
          </Col>
          <Col span={4} style={{ textAlign: 'end' }}>
            <Tooltip title="Email template" placement="right">
              <QuestionCircleOutlined style={ToolTip}>?</QuestionCircleOutlined>
            </Tooltip>
          </Col>
        </Row>
        <Row className="mx-5 mt-3" align="middle">
          <Col span={20}>
            <Text strong className="text-label">
              Email Template Footer HTML
            </Text>
          </Col>
          <Col span={4} style={{ textAlign: 'end' }}>
            <Tooltip title="Email template" placement="right">
              <QuestionCircleOutlined style={ToolTip}>?</QuestionCircleOutlined>
            </Tooltip>
          </Col>
        </Row>
        <Row className="mx-5 mt-1">
          <Col span={20}>
            <Form.Item
              name="header2"
              rules={[{ required: true, message: 'Please input Header' }]}
            >
              <Input.TextArea style={inputBorderRadius} rows={3} />
            </Form.Item>
          </Col>
        </Row>
        <Row className="mx-5 mt-2" align="middle">
          <Col span={20}>
            <Text strong className="text-label">
              Email Template CSS
            </Text>
          </Col>
          <Col span={4} style={{ textAlign: 'end' }}>
            <Tooltip title="Email template" placement="right">
              <QuestionCircleOutlined style={ToolTip}>?</QuestionCircleOutlined>
            </Tooltip>
          </Col>
        </Row>
        <Row className="mx-5 mt-1">
          <Col span={20}>
            <Form.Item
              name="header3"
              rules={[{ required: true, message: 'Please input Header' }]}
            >
              <Input.TextArea style={inputBorderRadius} rows={3} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Row className="mx-5 mt-3 mb-3">
        <Button
          variant="outline-primary"
          className="rounded-pill px-4 py-2"
          type="submit"
        >
          Save
        </Button>
      </Row>
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="justify-content-center py-5">
          <Row className="mx-6">
            <Title level={4}>Template Preview</Title>
          </Row>
          <Row className="mx-6 mt-3">
            <Col span={24}>
              <Text strong className="text-label">
                Name: Account Update Email
              </Text>
            </Col>
            <Col span={24} className="mt-2">
              <Text strong className="text-label">
                Type: Standard Email Template
              </Text>
            </Col>
          </Row>
          <Row className="mx-5 mt-3">
            <Input
              className="px-3"
              placeholder="Your Loyalty Account Update"
              style={inputBorderRadius}
            />
          </Row>
          <Row className="mx-5 mt-3">
            <Input.TextArea
              className="p-3"
              rows={10}
              placeholder="Dear Johnathan,
              Here is an update on your account with our loyalty programme.
              Your points balance is 50. You can exchange your points for vouchers and each voucher you earn could mean discounts, free giveaways, competition entries and more!"
              style={inputBorderRadius}
            />
          </Row>
          <Row className="mx-6 mt-3">
            <Text strong className="text-label">
              Send a test email to
            </Text>
          </Row>
          <Row className="mx-5 mt-1">
            <Input
              className="px-3"
              placeholder="Marysmith@gmail.com"
              style={inputBorderRadius}
            />
          </Row>
          <Row className="mx-5 mt-5" justify="end">
            <Button className="btn-active-command rounded-pill px-4 py-2">
              Send
            </Button>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}
export default SettingsManageTemplates;
