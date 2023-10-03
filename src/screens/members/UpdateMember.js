import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import endpoint from '../../utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { setMemberMenuData } from 'redux/slices/currentDataSlice';
import { useNavigate } from 'react-router-dom';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
const { confirm } = Modal;
import {
  Form,
  Input,
  Col,
  Tooltip,
  // DatePicker,
  // Radio,
  // Switch,
  // Select,
  Divider,
  Typography,
  Row,
  message
} from 'antd';
import { Button } from 'react-bootstrap';
// import { NavLink } from 'react-router-dom';
// const { TextArea } = Input;
// const { Option } = Select;
const { Title } = Typography;
const inputStyle = { width: '93%' };
const inputBorderRadius = { borderRadius: '10px' };
// const twoInputStyle = {
//   display: 'inline-block',
//   width: '45%'
//   // marginTop: '-15px'
// };
// const dateStyle = { width: '100%', borderRadius: '15px' };
const inputQuestion = {
  display: 'inline-block',
  width: '93%',
  // marginTop: '-15px',
  borderRadius: '15px'
};

const btnQuestion = {
  backgroundColor: '#359DD9',
  borderRadius: '50%',
  border: 'none',
  color: 'white',
  fontSize: '21px'
};
function UpdateMember() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  let { routeKey, id } = useParams();
  const _isMounted = useRef(false);
  // let { routeKey } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);

  const initPageModule = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getDataManagerSchemaEndpoint(`${routeKey}/${id}`);
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      dispatch(setMemberMenuData({ currentMemberMenuSchema: schema.menu })); // store current member menu
      console.log(layoutSchema.options.fields, 'this is fields');
      _isMounted.current && setLayoutData(layoutSchema);
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
  }, [onFinish]);
  if (loadingSchema) {
    return <Loading style={{ marginTop: 150 }} msg="Loading Schema..." />;
  }
  if (!layoutData) return getErrorAlert({ onRetry: initPageModule });

  const onFinish = async values => {
    console.log('Success:', values);
    try {
      _isMounted.current && setLoadingSchema(true);
      const {
        _id,
        first_name,
        last_name,
        email,
        company_name,
        cell,
        street_address,
        street_address2,
        street_suburb,
        street_city,
        street_zipcode,
        street_state
      } = values;

      const updateMember = await Axios.patch(
        endpoint.appUsers(`/app/users/${_id}`),
        {
          _id,
          first_name,
          last_name,
          email,
          company_name,
          user_type: 3,
          cell,
          street_address,
          street_address2,
          street_suburb,
          street_city,
          street_zipcode,
          street_state
        }
      );
      const user = updateMember.data;
      if (user.error) return message.error(user.error);
      message.success('Updated successful!');
      initPageModule();
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
    }
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const onDelete = async id => {
    try {
      _isMounted.current && setLoadingSchema(true);

      const deleteMember = await Axios.delete(
        endpoint.appUsers(`/app/users/${id}`)
      );
      const user = deleteMember.data;
      if (user.error) return message.error(user.error);
      message.success('Deleted successful!');
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
      navigate('/datamanager/bb_loyal2_members/list');
    }
  };
  const showDeleteConfirm = id => {
    confirm({
      title: 'Delete selected items?',
      icon: <ExclamationCircleFilled />,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        onDelete(id);
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      }
    });
  };

  let layoutFields = layoutData.options.fields;
  let FieldsData = layoutData.data;
  form.setFieldsValue({
    first_name: FieldsData[0].first_name,
    last_name: FieldsData[0].last_name,
    email: FieldsData[0].email,
    company_name: FieldsData[0].company_name,
    _id: FieldsData[0]._id,
    cell: FieldsData[0].cell,
    street_address: FieldsData[0].street_address,
    street_address2: FieldsData[0].street_address2,
    street_suburb: FieldsData[0].street_suburb,
    street_city: FieldsData[0].street_city,
    street_zipcode: FieldsData[0].street_zipcode,
    street_state: FieldsData[0].street_state
  });
  return (
    <>
      <Title level={3} className="mx-4">
        Members
      </Title>
      <Divider />
      <Form
        name="Add"
        labelCol={{
          span: 1
        }}
        wrapperCol={{
          span: 23
        }}
        style={{
          maxWidth: 550
        }}
        initialValues={{
          remember: true
        }}
        form={form}
        onFinish={onFinish}
        onFinishFaied={onFinishFailed}
        autoComplete="off"
      >
        <Row className="mx-4">
          <Col>
            <Title level={4} className="d-flex justify-content-center mb-4">
              Update this member record
            </Title>

            <Form.Item name="_id" style={inputStyle} hidden="hidden">
              <Input />
            </Form.Item>
            {layoutFields.first_name ? (
              <Form.Item
                name="first_name"
                rules={[
                  {
                    required: true,
                    message: 'Please input your First name!'
                  }
                ]}
                style={inputStyle}
              >
                <Input
                  placeholder={layoutFields.first_name}
                  style={inputBorderRadius}
                />
              </Form.Item>
            ) : null}

            {layoutFields.last_name ? (
              <Form.Item
                name="last_name"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Last name!'
                  }
                ]}
                style={inputStyle}
              >
                <Input
                  placeholder={layoutFields.last_name}
                  style={inputBorderRadius}
                />
              </Form.Item>
            ) : null}

            {layoutFields.company_name ? (
              <>
                <Form.Item
                  name="company_name"
                  rules={[
                    {
                      required: false,
                      message: 'Please input your Company name!'
                    }
                  ]}
                  style={inputQuestion}
                >
                  <Input
                    placeholder={layoutFields.company_name}
                    style={inputBorderRadius}
                  />
                </Form.Item>
                <Tooltip placement="right" title="Company name" color="#359dd9">
                  <QuestionCircleOutlined style={btnQuestion} />
                </Tooltip>
              </>
            ) : null}
            {layoutFields.email ? (
              <>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      type: 'email',
                      required: true,
                      message: 'Please input your Email!'
                    }
                  ]}
                  style={inputQuestion}
                >
                  <Input
                    type="email"
                    placeholder={layoutFields.email}
                    style={inputBorderRadius}
                  />
                </Form.Item>
                <Tooltip placement="right" title="Email" color="#359dd9">
                  <QuestionCircleOutlined style={btnQuestion} />
                </Tooltip>
              </>
            ) : null}
            {layoutFields.country ? (
              <Form.Item
                name="country"
                rules={[
                  {
                    required: false,
                    message: 'Please input your Country!'
                  }
                ]}
                style={inputStyle}
              >
                <Input
                  placeholder={layoutFields.country}
                  style={inputBorderRadius}
                />
              </Form.Item>
            ) : null}
            {layoutFields.cell ? (
              <>
                <Form.Item
                  name="cell"
                  rules={[
                    {
                      required: false,
                      message: 'Please input your Mobile!'
                    }
                  ]}
                  style={inputQuestion}
                >
                  <Input
                    placeholder={layoutFields.cell}
                    style={inputBorderRadius}
                  />
                </Form.Item>
                <Tooltip placement="right" title="Mobile" color="#359dd9">
                  <QuestionCircleOutlined style={btnQuestion} />
                </Tooltip>
              </>
            ) : null}

            {/* <Form.Item
              name="birth"
              rules={[
                { required: false, message: 'Please input your Date of Birth' }
              ]}
              style={twoInputStyle}
            >
              <DatePicker style={dateStyle} placeholder="Input Date of Birth" />
            </Form.Item> */}
            {layoutFields.street_state ? (
              <Form.Item
                name="street_state"
                rules={[
                  {
                    required: false,
                    message: 'Please input State!'
                  }
                ]}
                style={inputStyle}
              >
                <Input
                  placeholder={layoutFields.street_state}
                  style={inputBorderRadius}
                />
              </Form.Item>
            ) : null}

            {layoutFields.street_city ? (
              <Form.Item
                name="street_city"
                rules={[
                  {
                    required: false,
                    message: 'Please input City!'
                  }
                ]}
                style={inputStyle}
              >
                <Input
                  placeholder={layoutFields.street_city}
                  style={inputBorderRadius}
                />
              </Form.Item>
            ) : null}

            {layoutFields.street_address ? (
              <Form.Item
                name="street_address"
                rules={[
                  {
                    required: false,
                    message: 'Please input your Address 1'
                  }
                ]}
                style={inputQuestion}
              >
                <Input
                  placeholder={layoutFields.street_address}
                  style={inputBorderRadius}
                />
              </Form.Item>
            ) : null}
            {layoutFields.street_address2 ? (
              <Form.Item
                name="street_address2"
                rules={[
                  {
                    required: false,
                    message: 'Please input your Address 2'
                  }
                ]}
                style={inputQuestion}
              >
                <Input
                  placeholder={layoutFields.street_address2}
                  style={inputBorderRadius}
                />
              </Form.Item>
            ) : null}
            {layoutFields.street_suburb ? (
              <Form.Item
                name="street_suburb"
                rules={[
                  {
                    required: false,
                    message: 'Please input your Address 3'
                  }
                ]}
                style={inputQuestion}
              >
                <Input
                  placeholder={layoutFields.street_suburb}
                  style={inputBorderRadius}
                />
              </Form.Item>
            ) : null}
            {layoutFields.street_zipcode ? (
              <Form.Item
                name="street_zipcode"
                rules={[
                  {
                    required: false,
                    message: 'Please input your Zip/Post Code'
                  }
                ]}
                style={inputQuestion}
              >
                <Input
                  placeholder={layoutFields.street_zipcode}
                  style={inputBorderRadius}
                />
              </Form.Item>
            ) : null}
            {/* <Form.Item
              name="code"
              rules={[{ required: false, message: 'Please input code' }]}
              style={twoInputStyle}
            >
              <Input placeholder="Code" style={inputBorderRadius} />
            </Form.Item>

            <Form.Item
              name="code"
              rules={[{ required: false, message: 'Please input code' }]}
              style={twoInputStyle}
            >
              <Input placeholder="Code" style={inputBorderRadius} />
            </Form.Item>
            <Tooltip placement="right" title="Code" color="#359dd9">
              <QuestionCircleOutlined style={btnQuestion} />
            </Tooltip>
            <Form.Item
              name="subscription_date_from"
              rules={[
                {
                  required: false,
                  message: 'Please input Subscription date from'
                }
              ]}
              style={twoInputStyle}
            >
              <DatePicker
                style={dateStyle}
                placeholder="Subscription date from"
              />
            </Form.Item>
            <Form.Item
              name="subscription_date_to"
              rules={[
                {
                  required: false,
                  message: 'Please input Subscription date to'
                }
              ]}
              style={twoInputStyle}
            >
              <DatePicker
                style={dateStyle}
                placeholder="Subscription date to"
              />
            </Form.Item>
            <Tooltip placement="right" title="Subscription" color="#359dd9">
              <QuestionCircleOutlined style={btnQuestion} />
            </Tooltip>
            <p
              style={{ display: 'inline-block', marginTop: '5px' }}
              className="mx-4"
            >
              <strong>Group</strong>
            </p>
            <Form.Item
              name="group"
              style={{
                display: 'inline-block',
                width: '200px'
              }}
            >
              <Select placeholder="No groups/tiers added yet.">
                <Option value="group1"></Option>
                <Option value="group2"></Option>
                <Option value="group3"></Option>
              </Select>
            </Form.Item>
            <span className="mx-4">
              <NavLink to="/datamanager/bb_loyal2_members/edit/1">
                Manage
              </NavLink>
            </span>
            <br />
            <p
              style={{ display: 'inline-block', marginTop: '5px' }}
              className="mx-4"
            >
              <strong>Branch</strong>
            </p>
            <Form.Item
              name="branch"
              style={{
                display: 'inline-block',
                width: '200px'
              }}
            >
              <Select placeholder="Select options.">
                <Option value="branch1"></Option>
                <Option value="branch2"></Option>
                <Option value="branch3"></Option>
              </Select>
            </Form.Item>
            <br />

            <span>Email communications</span>
            <Radio style={{ float: 'right' }} value="radio1" />
            <br />
            <br />
            <span>Mobile communications</span>
            <Radio style={{ float: 'right' }} value="radio1" />
            <br />
            <br />
            <span>Postal communications</span>
            <Radio style={{ float: 'right' }} value="radio1" /> 
            <br />
            <br />
            <span>Sign up date</span>
            <span className="mx-5">{date_value}</span>
            <CalendarOutlined style={{ marginTop: '-3px' }} />

            <Form.Item
              style={{
                display: 'inline-block',
                marginTop: '-7px',
                float: 'right'
              }}
            >
              <Switch />
            </Form.Item>
            <span style={{ float: 'right', marginRight: '10px' }}>
              Suspended
            </span>
            */}
          </Col>
        </Row>
        <Row className="mt-2 mx-4">
          <Col span={6}>
            <Button
              className="btn-active-command rounded-pill px-4 py-2"
              type="submit"
            >
              Save
            </Button>
          </Col>
          <Col span={15} style={{ textAlign: 'end' }}>
            <Button
              variant="outline-primary"
              className="rounded-pill mt-2 px-4 py-2"
              onClick={() => showDeleteConfirm(FieldsData[0]._id)}
            >
              Delete
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default UpdateMember;
