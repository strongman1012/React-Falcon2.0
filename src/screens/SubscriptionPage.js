import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import endpoint from 'utils/endpoint';
import { useDispatch } from 'react-redux';
import { getErrorAlert } from 'helpers/utils';
import { setMemberMenuData } from 'redux/slices/currentDataSlice';
import { Typography, Row, Col, Input, Divider, Radio, DatePicker } from 'antd';
// import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tabs, Tab, Button, Card } from 'react-bootstrap';
const { Title, Text, Paragraph } = Typography;

const cardStyle = {
  backgroundColor: '#F8F8F8',
  borderRadius: '10px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
};
const inputStyle = {
  width: '100%',
  borderRadius: '10px'
};

function Subscription() {
  const dispatch = useDispatch();
  const _isMounted = useRef(false);
  // let { routeKey } = useParams();
  const [radioValue, setRadioValue] = useState(1);
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const initPageModule = async () => {
    try {
      // default part
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getDataManagerSchemaEndpoint('list');
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
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
  const changeRadio = e => {
    console.log('radio checked', e.target.value);
    setRadioValue(e.target.value);
  };

  if (loadingSchema) {
    return <Loading style={{ marginTop: 150 }} msg="Loading Schema..." />;
  }
  if (!layoutData) return getErrorAlert({ onRetry: initPageModule });
  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };
  return (
    <>
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row className="mt-3 mb-5" justify="center">
            <Col
              xs={23}
              sm={23}
              md={23}
              lg={23}
              xl={23}
              xxl={23}
              className={{ textAlign: 'center' }}
            >
              <Row className="mx-4">
                <Title level={3}>Subscription</Title>
              </Row>
              <Row justify="center">
                <Col span={24}>
                  <Card className="mt-5">
                    <Card.Body style={cardStyle}>
                      <Row className="mx-2" justify="center">
                        <Col span={24}>
                          <Tabs defaultActiveKey="manage" id="points" fill>
                            <Tab
                              eventKey="manage"
                              title="Manage your subscription"
                              className="border-0 p-4"
                            >
                              <Row>
                                <Paragraph>
                                  Your current subscription is the 'Free Plan'.
                                  Limits apply to this plan.{' '}
                                </Paragraph>
                              </Row>
                              <Row className="mt-3">
                                <Button
                                  variant="outline-primary"
                                  className="rounded-pill px-4 py-2"
                                >
                                  View plans and pricing
                                </Button>
                              </Row>
                              <Divider />
                              <Row className="mt-5">
                                <Title level={4}>
                                  Choose subscription plan
                                </Title>
                              </Row>
                              <Radio.Group
                                name="radio_group"
                                style={{ width: '100%' }}
                                value={radioValue}
                                onChange={changeRadio}
                              >
                                <Row>
                                  <Col span={8}>
                                    {' '}
                                    <Radio value={1} />
                                  </Col>
                                  <Col span={8}>
                                    {' '}
                                    <Radio value={2} />
                                  </Col>
                                  <Col span={8}>
                                    {' '}
                                    <Radio value={3} />
                                  </Col>
                                </Row>
                              </Radio.Group>
                              <Row className="mt-1">
                                <Col span={8}>
                                  <Row>
                                    <Col span={24}>
                                      <Text strong className="text-label">
                                        FREE
                                      </Text>
                                    </Col>
                                    <Col span={24}>
                                      <Text strong className="text-label">
                                        Free forever
                                      </Text>
                                    </Col>
                                    <Col span={24}>
                                      <Text strong className="text-label">
                                        <a href="#">
                                          <u>Limits apply</u>
                                        </a>
                                      </Text>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col span={8}>
                                  <Row>
                                    <Col span={24}>
                                      <Text strong className="text-label">
                                        SILVER
                                      </Text>
                                    </Col>
                                    <Col span={24}>
                                      <Text strong className="text-label">
                                        US$ 29.00
                                      </Text>
                                    </Col>
                                    <Col span={24}>
                                      <Text strong className="text-label">
                                        per month
                                      </Text>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col span={8}>
                                  <Row>
                                    <Col span={24}>
                                      <Text strong className="text-label">
                                        GOLD
                                      </Text>
                                    </Col>
                                    <Col span={24}>
                                      <Text strong className="text-label">
                                        US$ 49.00
                                      </Text>
                                    </Col>
                                    <Col span={24}>
                                      <Text strong className="text-label">
                                        per month
                                      </Text>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                              <Row className="mt-5">
                                <Button
                                  variant="outline-primary"
                                  className="rounded-pill px-4 py-2"
                                >
                                  Next
                                </Button>
                              </Row>
                            </Tab>
                            <Tab
                              eventKey="invoice"
                              title="Your invoices and orders"
                              className="border-0 p-4"
                            ></Tab>
                            <Tab
                              eventKey="details"
                              title="Update card details"
                              className="border-0 p-4"
                            >
                              <Row>
                                <Title level={4}>Your current card</Title>
                              </Row>
                              <Row className="mt-5" align="bottom">
                                <Col span={12}>
                                  <Text strong className="text-label">
                                    Card number
                                  </Text>
                                  <Input style={inputStyle} />
                                </Col>
                                <Col span={12} style={{ textAlign: 'end' }}>
                                  <Button
                                    variant="outline-primary"
                                    className="rounded-pill px-4 py-2"
                                  >
                                    Add new card
                                  </Button>
                                </Col>
                              </Row>
                              <Row className="mt-3">
                                <Text strong className="text-label">
                                  Expiry date
                                </Text>
                              </Row>
                              <Row className="mt-1">
                                <Col span={8}>
                                  <Row align="middle">
                                    <Col span={10}>
                                      <DatePicker
                                        onChange={onChange}
                                        placeholder="MM"
                                        style={inputStyle}
                                        picker="month"
                                      />
                                    </Col>
                                    <Col
                                      span={4}
                                      style={{ textAlign: 'center' }}
                                    >
                                      <Text strong className="text-label">
                                        /
                                      </Text>
                                    </Col>
                                    <Col span={10}>
                                      <DatePicker
                                        onChange={onChange}
                                        placeholder="YY"
                                        style={inputStyle}
                                        picker="year"
                                      />
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                              <Row className="mt-5">
                                <Paragraph>
                                  <Text strong className="text-label">
                                    Please wait for this page to fully re-load
                                  </Text>{' '}
                                  once you have submitted your card details.
                                </Paragraph>
                              </Row>
                            </Tab>
                          </Tabs>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
export default Subscription;
