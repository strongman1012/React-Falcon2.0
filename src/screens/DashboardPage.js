import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, Row, Col, Input } from 'antd';
import { Card, Button, Tabs, Tab } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
// import { useParams } from 'react-router-dom';
import endpoint from '../utils/endpoint';
import { setCurrentData } from 'redux/slices/currentDataSlice';
import { getErrorAlert, setReduxCurrentSchemaData } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
// import { setMemberMenuData } from 'redux/slices/currentDataSlice';
import { SearchOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;
const inputBorderRadius = {
  borderRadius: '10px'
};
const cardStyle_1 = {
  backgroundColor: '#F8F8F8',
  borderRadius: '10px',
  height: '145px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
};
const cardStyle_2 = {
  backgroundColor: '#F8F8F8',
  borderRadius: '10px',
  height: '190px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
};
function DashboardPage() {
  // let { routeKey } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const _isMounted = useRef(false);
  const [moduleSchema, setModuleSchema] = useState(null);
  const [loadingSchema, setLoadingSchema] = useState(true);

  const initPageModule = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      dispatch(setCurrentData({ currentModuleSchemaLoading: true }));
      const ep = endpoint.getPageSchemaEndpoint('dashboard');
      const moduleSchemaRes = await Axios.get(ep);
      const schema = moduleSchemaRes.data;
      console.log('Page Schema:->', schema);
      setReduxCurrentSchemaData(schema);
      const session = await Axios.get(endpoint.session);
      localStorage.setItem('session_id', session.data._id);
      localStorage.setItem('session_obj', JSON.stringify(session.data));
      _isMounted.current && setModuleSchema(schema);
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
    }
  };

  useEffect(() => {
    if (_isMounted.current) {
      initPageModule();
    }
  }, [location.pathname]);

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
  if (!moduleSchema) return getErrorAlert({ onRetry: initPageModule });

  return (
    <>
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row className="my-3">
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              <Row className="mx-4">
                <Title level={3}>Your Loyalty Dashboard</Title>
              </Row>
              <Row className="mx-4 mt-5">
                <Col span={24}>
                  <Row gutter={[16, 16]} align="middle">
                    <Col span={12}>
                      <Input
                        placeholder="Code, name, email, mobile"
                        style={inputBorderRadius}
                        suffix={<SearchOutlined />}
                      />
                    </Col>
                    <Col span={12}>
                      <Button className="btn-active-command rounded-pill px-4 py-2">
                        Add new member
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mx-4 mt-5">
                <Col span={24}>
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Card>
                        <Card.Body style={cardStyle_1}>
                          <Row className="m-2">
                            <Text strong className="text-label">
                              Total membership
                            </Text>
                          </Row>
                          <Row className="mx-2 mt-3">
                            <Title level={4}>10</Title>
                          </Row>
                          <Row className="mx-2">
                            <Button
                              variant="link"
                              className="p-0"
                              style={{ color: '#359dd9' }}
                            >
                              Add member
                            </Button>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card>
                        <Card.Body style={cardStyle_1}>
                          <Row className="m-2">
                            <Text strong className="text-label">
                              Interactions per member
                            </Text>
                          </Row>
                          <Row className="mx-2 mt-3">
                            <Title level={4}>10</Title>
                          </Row>
                          <Row className="mx-2">
                            <Button
                              variant="link"
                              className="p-0"
                              style={{ color: '#359dd9' }}
                            >
                              Manage transaction
                            </Button>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card>
                        <Card.Body style={cardStyle_1}>
                          <Row className="m-2">
                            <Text strong className="text-label">
                              Average sale value
                            </Text>
                          </Row>
                          <Row className="mx-2 mt-3">
                            <Title level={4}>10</Title>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mx-4 mt-3">
                <Col span={24}>
                  <Row gutter={[16, 16]}>
                    <Col span={16}>
                      <Card>
                        <Card.Body style={cardStyle_2}>
                          <Row className="m-2">
                            <Text strong className="text-label">
                              Points
                            </Text>
                          </Row>
                          {/* <Row className="mt-3" justify="center"> */}
                          <Tabs defaultActiveKey="issued" id="points" fill>
                            <Tab
                              eventKey="issued"
                              title="Issued"
                              className="border-0 p-4"
                            >
                              <Row justify="center">
                                <Title level={4}>10</Title>
                              </Row>
                            </Tab>
                            <Tab
                              eventKey="active"
                              title="Active"
                              className="border-0 p-4"
                            >
                              <Row justify="center">
                                <Title level={4}>10</Title>
                              </Row>
                            </Tab>
                            <Tab
                              eventKey="expired"
                              title="Expired"
                              className="border-0 p-4"
                            >
                              <Row justify="center">
                                <Title level={4}>10</Title>
                              </Row>
                            </Tab>
                            <Tab
                              eventKey="used"
                              title="Used"
                              className="border-0 p-4"
                            >
                              <Row justify="center">
                                <Title level={4}>10</Title>
                              </Row>
                            </Tab>
                          </Tabs>
                          {/* </Row> */}
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card>
                        <Card.Body style={cardStyle_2}>
                          <Row className="m-2">
                            <Text strong className="text-label">
                              Expiring points
                            </Text>
                          </Row>
                          {/* <Row className="mx-2 mt-3"> */}
                          <Tabs defaultActiveKey="next_month" id="points" fill>
                            <Tab
                              eventKey="next_month"
                              title="Next Month"
                              className="border-0 p-4"
                            >
                              <Row justify="center">
                                <Title level={4}></Title>
                              </Row>
                            </Tab>
                            <Tab
                              eventKey="6month"
                              title="In 6 months"
                              className="border-0 p-4"
                            >
                              <Row justify="center">
                                <Title level={4}></Title>
                              </Row>
                            </Tab>
                          </Tabs>
                          {/* </Row> */}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mx-4 mt-5">
                <Col span={24}>
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Card>
                        <Card.Body style={cardStyle_2}>
                          <Row className="mx-2 mt-2">
                            <Text strong className="text-label">
                              Communication credit balance
                            </Text>
                          </Row>
                          <Row className="mx-2">
                            <Title
                              level={4}
                              style={{ position: 'absolute', top: '90px' }}
                            >
                              0.00
                            </Title>
                          </Row>
                          <Row
                            className="mx-2"
                            style={{ position: 'absolute', bottom: '13px' }}
                          >
                            <Button
                              variant="link"
                              className="p-0"
                              style={{ color: '#359dd9' }}
                            >
                              Top-up credits
                            </Button>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card>
                        <Card.Body style={cardStyle_2}>
                          <Row className="mx-2 mt-2">
                            <Text strong className="text-label">
                              Communication
                            </Text>
                          </Row>
                          <Row
                            className="mx-2 mt-1"
                            style={{ height: '100px' }}
                          >
                            <Col span={24}>
                              <Row align="middle">
                                <Col span={16}>
                                  <Text style={{ fontSize: '14px' }}>
                                    Autoresponders
                                  </Text>
                                </Col>
                                <Col span={8}>
                                  <Title
                                    className="m-0"
                                    level={4}
                                    style={{
                                      textAlign: 'end',
                                      fontSize: '18px'
                                    }}
                                  >
                                    1000
                                  </Title>
                                </Col>
                              </Row>
                            </Col>
                            <Col span={24}>
                              <Row align="middle">
                                <Col span={16}>
                                  <Text style={{ fontSize: '14px' }}>
                                    Emails
                                  </Text>
                                </Col>
                                <Col span={8}>
                                  <Title
                                    className="m-0"
                                    level={4}
                                    style={{
                                      textAlign: 'end',
                                      fontSize: '18px'
                                    }}
                                  >
                                    1000
                                  </Title>
                                </Col>
                              </Row>
                            </Col>
                            <Col span={24}>
                              <Row align="middle">
                                <Col span={16}>
                                  <Text style={{ fontSize: '14px' }}>
                                    Texts/SMS
                                  </Text>
                                </Col>
                                <Col span={8}>
                                  <Title
                                    className="m-0"
                                    level={4}
                                    style={{
                                      textAlign: 'end',
                                      fontSize: '18px'
                                    }}
                                  >
                                    1000
                                  </Title>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="mx-2">
                            <Button
                              variant="link"
                              className="p-0"
                              style={{ color: '#359dd9' }}
                            >
                              Manage
                            </Button>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card>
                        <Card.Body style={cardStyle_2}>
                          <Row className="mx-2 mt-2">
                            <Text strong className="text-label">
                              Other services
                            </Text>
                          </Row>
                          <Row
                            className="mx-2 mt-1"
                            style={{ height: '100px' }}
                          >
                            <Col span={24}>
                              <Text style={{ fontSize: '14px' }}>
                                Promotions
                              </Text>
                            </Col>
                            <Col span={24}>
                              <Text style={{ fontSize: '14px' }}>
                                Micro-site
                              </Text>
                            </Col>
                            <Col span={24}>
                              <Text style={{ fontSize: '14px' }}>Vouchers</Text>
                            </Col>
                          </Row>
                          <Row className="mx-2">
                            <Button
                              variant="link"
                              className="p-0"
                              style={{ color: '#359dd9' }}
                            >
                              Manage
                            </Button>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
export default DashboardPage;
