import React from 'react';
// import Axios from 'axios';
// import { useEffect, useRef } from 'react';
// import { useState, useEffect, useRef } from 'react';
// import { useDispatch } from 'react-redux';
import {
  Row,
  Col,
  Typography,
  Input,
  InputNumber,
  DatePicker,
  Form
} from 'antd';
import { Button, Form as BootstrapForm } from 'react-bootstrap';

// import { useParams } from 'react-router-dom';
// import endpoint from '../../utils/endpoint';
// import { getErrorAlert } from 'helpers/utils';
// import Loading from 'components/loading';
// import handleError from 'utils/handleError';
// import { setPromotionsMenuData } from 'redux/slices/currentDataSlice';
const { Text, Title } = Typography;
const inputStyle = {
  borderRadius: '10px',
  width: '100%'
};
// const twoInputStyle = {
//   display: 'inline-block',
//   width: '45%'
//   // marginTop: '-15px'
// };
// const dateStyle = { width: '100%', borderRadius: '15px' };
function TransactionPromotionsAdd() {
  // const dispatch = useDispatch();
  // const _isMounted = useRef(false);
  // let { routeKey } = useParams();
  // const [loadingSchema, setLoadingSchema] = useState(true);
  // const [layoutData, setLayoutData] = useState(null);
  // const initPageModule = async () => {
  //   try {
  // default part
  // _isMounted.current && setLoadingSchema(true);
  // const ep =
  // endpoint.getTransactionPromotionsDataManagerSchemaEndpoint('settings');
  // const moduleSchemaRes = await Axios.get(ep);
  // let schema = moduleSchemaRes.data;
  // console.log('menuSchema:->', schema);
  // let layoutSchema = schema.layout;
  // console.log(schema.menu, ' schema.menu schema.menu schema.menu');
  // dispatch(
  //   setPromotionsMenuData({ currentPromotionsMenuSchema: schema.menu })
  // ); // store current Promotions menu
  // _isMounted.current && setLayoutData(layoutSchema);
  // // end default part
  //   } catch (error) {
  //     handleError(error, true);
  //   } finally {
  //     // _isMounted.current && setLoadingSchema(false);
  //   }
  // };

  // useEffect(() => {
  //   _isMounted.current = true;
  //   initPageModule();
  //   return () => {
  //     _isMounted.current = false;
  //   };
  // }, []);
  // const onChange = value => {
  //   console.log('changed', value);
  // };

  // if (loadingSchema) {
  //   return <Loading style={{ marginTop: 150 }} msg="Loading Schema..." />;
  // }
  // if (!layoutData) return getErrorAlert({ onRetry: initPageModule });

  return (
    <>
      <Row className="mx-4">
        <Col span={20}>
          <Form
            name="Add"
            labelCol={{
              span: 1
            }}
            wrapperCol={{
              span: 23
            }}
            initialValues={{
              remember: true
            }}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Title level={4} className="mb-4">
              Add a new transactional promotion record
            </Title>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your Name!'
                    }
                  ]}
                  style={inputStyle}
                >
                  <Text strong className="text-label">
                    Name
                  </Text>
                  <Input
                    className="mt-1"
                    placeholder="Name"
                    style={inputStyle}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item
                  name="Percent Of Spend"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your Percent Of Spend!'
                    }
                  ]}
                  style={inputStyle}
                >
                  <Text strong className="text-label">
                    Percent Of Spend
                  </Text>

                  <Input
                    className="mt-1"
                    placeholder="Percent Of Spend"
                    style={inputStyle}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <>
                  <Form.Item
                    name="Fixed Points Value"
                    rules={[
                      {
                        required: false,
                        message: 'Please input your Fixed Points Value!'
                      }
                    ]}
                    style={inputStyle}
                  >
                    <Text strong className="text-label">
                      Fixed Points Value
                    </Text>

                    <Input
                      className="mt-1"
                      placeholder="Fixed Points Value"
                      style={inputStyle}
                    />
                  </Form.Item>
                </>
              </Col>
            </Row>
            <Row justify="middle">
              <Col span={12}>
                <Form.Item
                  name="Category"
                  rules={[
                    {
                      required: false,
                      message: 'Please input Category!'
                    }
                  ]}
                  style={inputStyle}
                >
                  <Row align="middle">
                    <Col span={6}>
                      <Text strong className="text-label">
                        Category
                      </Text>
                    </Col>
                    <Col span={18}>
                      <BootstrapForm.Select
                        placeholder="Category"
                        style={inputStyle}
                      >
                        <option>123456</option>
                        <option>123456</option>
                        <option>123456</option>
                        <option>123456</option>
                        <option>123456</option>
                      </BootstrapForm.Select>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Code"
                  rules={[
                    {
                      required: false,
                      message: 'Please input your code'
                    }
                  ]}
                  style={inputStyle}
                >
                  <Row align="middle">
                    <Col span={6}>
                      <Text strong className="text-label">
                        Code
                      </Text>
                    </Col>
                    <Col span={18}>
                      <InputNumber
                        className="mt-1"
                        style={{ borderRadius: '10px', width: '100%' }}
                        placeholder="Code"
                      />
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
            </Row>
            <Row justify="middle">
              <Col span={12}>
                <Form.Item
                  name="Group"
                  rules={[
                    {
                      required: false,
                      message: 'Please input Group!'
                    }
                  ]}
                  style={inputStyle}
                >
                  <Row align="middle">
                    <Col span={6}>
                      <Text strong className="text-label">
                        Group
                      </Text>
                    </Col>
                    <Col span={18}>
                      <BootstrapForm.Select
                        placeholder="Group"
                        style={inputStyle}
                      >
                        <option>123456</option>
                        <option>123456</option>
                        <option>123456</option>
                        <option>123456</option>
                        <option>123456</option>
                      </BootstrapForm.Select>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Date From"
                  rules={[
                    {
                      required: false,
                      message: 'Please input your Date From'
                    }
                  ]}
                  style={inputStyle}
                >
                  <Row align="middle">
                    <Col span={6}>
                      <Text strong className="text-label">
                        Date From
                      </Text>
                    </Col>
                    <Col span={8}>
                      <DatePicker
                        className="mt-1"
                        style={{ borderRadius: '10px', width: '100%' }}
                        placeholder="Date From"
                      />
                    </Col>
                    <Col span={2} style={{ textAlign: 'center' }}>
                      <Text strong className="text-label">
                        to
                      </Text>
                    </Col>
                    <Col span={8}>
                      <DatePicker
                        className="mt-1"
                        style={{ borderRadius: '10px', width: '100%' }}
                        placeholder="to"
                      />
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item
                  name="Branch"
                  rules={[
                    {
                      required: false,
                      message: 'Please input Branch!'
                    }
                  ]}
                  style={inputStyle}
                >
                  <Row align="middle">
                    <Col span={6}>
                      <Text strong className="text-label">
                        Branch
                      </Text>
                    </Col>
                    <Col span={18}>
                      <BootstrapForm.Select
                        placeholder="Branch"
                        style={inputStyle}
                      >
                        <option>123456</option>
                        <option>123456</option>
                        <option>123456</option>
                        <option>123456</option>
                        <option>123456</option>
                      </BootstrapForm.Select>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Button
                  style={{ float: 'right' }}
                  className="rounded-pill py-2 px-4"
                  variant="outline-primary"
                  //   onClick={() => updateSetting()}
                >
                  Add
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </>
  );
}
export default TransactionPromotionsAdd;
