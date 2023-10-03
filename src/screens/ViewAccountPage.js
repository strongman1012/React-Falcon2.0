import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, Row, Col } from 'antd';
import { Card, Button, Table } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
// import { useParams } from 'react-router-dom';
import endpoint from '../utils/endpoint';
import { setCurrentData } from 'redux/slices/currentDataSlice';
import { getErrorAlert, setReduxCurrentSchemaData } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
// import { setMemberMenuData } from 'redux/slices/currentDataSlice';
// import { SearchOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;
const tdpadding = {
  paddingLeft: '0px',
  color: '#444444'
};
const tdright = { textAlign: 'right', color: '#444444' };
const cardStyle_1 = {
  backgroundColor: '#F8F8F8',
  borderRadius: '10px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
};
const cardStyle_2 = {
  backgroundColor: '#F8F8F8',
  borderRadius: '10px',
  height: '244px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
};
function ViewAccount() {
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
                <Col span={24}>
                  <Row gutter={[16, 16]} align="middle">
                    <Col span={12}>
                      <Title level={3}>Your Account</Title>
                    </Col>
                    <Col span={12} style={{ textAlign: 'end' }}>
                      <Button
                        variant="outline-primary"
                        className="rounded-pill px-4 py-2"
                      >
                        Add Staff Member
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className="mx-4 mt-6">
                <Col span={24}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Card>
                        <Card.Body style={cardStyle_2}>
                          <Row className="m-2">
                            <Text strong className="text-label">
                              Your subscription
                            </Text>
                          </Row>
                          <Row
                            className="mx-2"
                            style={{ height: '90px' }}
                            align="middle"
                          >
                            <Col span={24}>
                              <Text
                                strong
                                className="text-label"
                                style={{ fontSize: '18px' }}
                              >
                                Free
                              </Text>
                            </Col>
                          </Row>
                          <Row className="mx-2">
                            <Text
                              strong
                              className="text-label"
                              style={{ fontSize: '14px' }}
                            >
                              Limits apply to this plan.
                            </Text>
                          </Row>
                          <Row className="mx-2">
                            <Button
                              variant="link"
                              className="p-0"
                              style={{ fontSize: '14px', color: '#359dd9' }}
                            >
                              Manage Subscription
                            </Button>
                          </Row>
                          <Row className="mx-2">
                            <Button
                              variant="link"
                              className="p-0"
                              style={{ fontSize: '14px', color: '#359dd9' }}
                            >
                              Plans
                            </Button>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card>
                        <Card.Body style={cardStyle_2}>
                          <Row className="m-2">
                            <Text strong className="text-label">
                              Account balance
                            </Text>
                          </Row>
                          <Row
                            className="mx-2"
                            style={{ height: '90px' }}
                            align="middle"
                          >
                            <Col span={24}>
                              <Text
                                strong
                                className="text-label"
                                style={{ fontSize: '18px' }}
                              >
                                0.00
                              </Text>
                            </Col>
                          </Row>
                          <Row className="mx-2">
                            <Text
                              strong
                              className="text-label"
                              style={{ fontSize: '14px' }}
                            >
                              These credits are used for pay-as-you-go services.
                            </Text>
                          </Row>
                          <Row className="mx-2">
                            <Button
                              variant="link"
                              className="p-0"
                              style={{ fontSize: '14px', color: '#359dd9' }}
                            >
                              Top up account
                            </Button>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mx-4 mt-7">
                <Title level={3}>About you</Title>
              </Row>
              <Row className="mx-4 mt-3 mb-5">
                <Col span={24}>
                  <Card>
                    <Card.Body className="py-4" style={cardStyle_1}>
                      <Row className="mx-2">
                        <Col span={23}>
                          <Table responsive style={{ width: '100%' }}>
                            <tbody style={tdpadding}>
                              <tr>
                                <td style={tdpadding}>First Name</td>
                                <td style={tdright}>John</td>
                              </tr>
                              <tr>
                                <td style={tdpadding}>Last Name</td>
                                <td style={tdright}>Doe</td>
                              </tr>
                              <tr>
                                <td style={tdpadding}>Email</td>
                                <td style={tdright}>john@doe.com</td>
                              </tr>
                              <tr>
                                <td style={tdpadding}>Mobile/Telephone</td>
                                <td style={tdright}>Apple</td>
                              </tr>
                              <tr>
                                <td style={tdpadding}>Company Name</td>
                                <td style={tdright}></td>
                              </tr>
                              <tr>
                                <td style={tdpadding}>Vat Number</td>
                                <td style={tdright}></td>
                              </tr>
                              <tr>
                                <td style={tdpadding}>Email updates</td>
                                <td style={tdright}></td>
                              </tr>
                              <tr>
                                <td style={tdpadding}>Time zone</td>
                                <td style={tdright}></td>
                              </tr>
                              <tr>
                                <td style={tdpadding}>Billing Address</td>
                                <td style={tdright}></td>
                              </tr>
                              <tr>
                                <td style={tdpadding}>City</td>
                                <td style={tdright}></td>
                              </tr>
                              <tr>
                                <td style={tdpadding}>Postal/Zip Code</td>
                                <td style={tdright}></td>
                              </tr>
                              <tr>
                                <td style={tdpadding}>
                                  State/Country/Province
                                </td>
                                <td style={tdright}></td>
                              </tr>
                              <tr>
                                <td style={tdpadding}>Country</td>
                                <td style={tdright}></td>
                              </tr>
                            </tbody>
                          </Table>
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
export default ViewAccount;
