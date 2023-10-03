import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import endpoint from 'utils/endpoint';
import { useDispatch } from 'react-redux';
import { getErrorAlert } from 'helpers/utils';
import { setMemberMenuData } from 'redux/slices/currentDataSlice';
import { Typography, Row, Col, Switch, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tabs, Tab, Button, Card } from 'react-bootstrap';

const { Title, Text } = Typography;

const cardStyle = {
  backgroundColor: '#F8F8F8',
  borderRadius: '10px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
};
function MembersDatacleaner() {
  const dispatch = useDispatch();
  const _isMounted = useRef(false);
  // let { routeKey } = useParams();
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

  if (loadingSchema) {
    return <Loading style={{ marginTop: 150 }} msg="Loading Schema..." />;
  }
  if (!layoutData) return getErrorAlert({ onRetry: initPageModule });

  const onChange = checked => {
    console.log(`switch to ${checked}`);
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
              style={{ textAlign: 'center' }}
            >
              <Row className="mx-4">
                <Col span={23} style={{ textAlign: 'start' }}>
                  <Title level={3}>Data Cleaner</Title>
                </Col>
              </Row>
              <div
                style={{
                  float: 'right',
                  top: '118px',
                  position: 'absolute',
                  right: '-16px'
                }}
              >
                <Tooltip
                  placement="bottom"
                  title="For the safest search we suggest that you start by selecting ALL the fields below to YES - this will ensure that you have the smallest chance of merging records that should not be merged."
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
              </div>
              <Row className="mt-5" justify="center">
                <Col span={23} style={{ textAlign: 'center' }}>
                  <Card>
                    <Card.Body style={cardStyle}>
                      <Tabs
                        defaultActiveKey="home"
                        id="uncontrolled-tab-example"
                        fill
                      >
                        <Tab
                          eventKey="home"
                          title="Find Duplicates"
                          className="border-0 p-4"
                        >
                          <Row className="mt-3">
                            <Text strong className="text-label">
                              Find memberes where the following fields are
                              duplicated
                            </Text>
                          </Row>
                          <Row
                            gutter={[36, 24]}
                            align="middle"
                            className="mt-4"
                          >
                            <Col xl={8} xxl={8}>
                              <Text strong className="text-label">
                                First and Last Name
                              </Text>
                            </Col>
                            <Col xl={4} xxl={4} style={{ textAlign: 'end' }}>
                              <Switch onChange={onChange} />
                            </Col>
                            <Col xl={8} xxl={8}>
                              <Text strong className="text-label">
                                Mobile Number
                              </Text>
                            </Col>
                            <Col xl={4} xxl={4} style={{ textAlign: 'end' }}>
                              <Switch onChange={onChange} />
                            </Col>
                          </Row>
                          <Row
                            gutter={[36, 24]}
                            align="middle"
                            className="mt-4"
                          >
                            <Col xl={8} xxl={8}>
                              <Text strong className="text-label">
                                Email
                              </Text>
                            </Col>
                            <Col xl={4} xxl={4} style={{ textAlign: 'end' }}>
                              <Switch onChange={onChange} />
                            </Col>
                            <Col xl={8} xxl={8}>
                              <Text strong className="text-label">
                                Member Number
                              </Text>
                            </Col>
                            <Col xl={4} xxl={4} style={{ textAlign: 'end' }}>
                              <Switch onChange={onChange} />
                            </Col>
                          </Row>
                          <Row className="mt-5" justify="end">
                            <Button
                              variant="outline-primary"
                              className="rounded-pill px-4 py-2"
                            >
                              Find Duplicates
                            </Button>
                          </Row>
                        </Tab>
                        <Tab
                          eventKey="profile"
                          title="Delete Data"
                          className="border-0 p-4"
                        >
                          <Row className="mt-3">
                            <Text strong className="text-label">
                              Find old/document/stale members and delete their
                              accounts
                            </Text>
                          </Row>
                          <Row
                            gutter={[36, 24]}
                            align="middle"
                            className="mt-4"
                          >
                            <Col xl={8} xxl={8}>
                              <Text strong className="text-label">
                                First and Last are empty
                              </Text>
                            </Col>
                            <Col xl={4} xxl={4} style={{ textAlign: 'end' }}>
                              <Switch onChange={onChange} />
                            </Col>
                            <Col xl={8} xxl={8}>
                              <Text strong className="text-label">
                                Mobile Number is empty
                              </Text>
                            </Col>
                            <Col xl={4} xxl={4} style={{ textAlign: 'end' }}>
                              <Switch onChange={onChange} />
                            </Col>
                          </Row>
                          <Row
                            gutter={[36, 24]}
                            align="middle"
                            className="mt-4"
                          >
                            <Col xl={8} xxl={8}>
                              <Text strong className="text-label">
                                Email is empty
                              </Text>
                            </Col>
                            <Col xl={4} xxl={4} style={{ textAlign: 'end' }}>
                              <Switch onChange={onChange} />
                            </Col>
                            <Col xl={8} xxl={8}>
                              <Text strong className="text-label">
                                Member Number is empty
                              </Text>
                            </Col>
                            <Col xl={4} xxl={4} style={{ textAlign: 'end' }}>
                              <Switch onChange={onChange} />
                            </Col>
                          </Row>
                          <Row className="mt-5">
                            <Col span={12}>
                              <Button
                                variant="outline-primary"
                                className="rounded-pill px-4 py-2"
                              >
                                Back to members
                              </Button>
                            </Col>
                            <Col span={12} style={{ textAlign: 'end' }}>
                              <Button className="btn-active-command rounded-pill px-4 py-2">
                                Find member
                              </Button>
                            </Col>
                          </Row>
                        </Tab>
                      </Tabs>
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
export default MembersDatacleaner;
