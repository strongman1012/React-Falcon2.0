import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import endpoint from 'utils/endpoint';
import { useDispatch } from 'react-redux';
import { getErrorAlert } from 'helpers/utils';
import { setMemberMenuData } from 'redux/slices/currentDataSlice';
import { Typography, Row, Col, Switch, DatePicker, Input, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tabs, Form, Tab, Button, Card } from 'react-bootstrap';
const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

const cardStyle = {
  backgroundColor: '#F8F8F8',
  borderRadius: '10px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
};
const datapicker = {
  borderRadius: '10px',
  width: '100%'
};
function MemberSubscription() {
  const dispatch = useDispatch();
  const _isMounted = useRef(false);
  // let { routeKey } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const [groups, setGroups] = useState([]);
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
      const groupsList = await Axios.get(
        endpoint.getModuleDataEndpoint('bb_loyal2_groups')
      );
      setGroups(groupsList.data.list);
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
  const dateChange = (date, dateString) => {
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
              style={{ textAlign: 'center' }}
            >
              <Row className="mx-4" justify="start">
                <Title level={3}>Membership & Subscriptions</Title>
              </Row>
              <Row className="mx-4 mt-5" justify="start">
                <Col
                  sm={23}
                  lg={23}
                  xl={22}
                  xxl={22}
                  style={{ textAlign: 'start' }}
                >
                  <Paragraph>
                    By default members have access to your program without
                    subscribing. Use the settings below in combination with the
                    subscription dates for each member to restrict membership if
                    required.
                  </Paragraph>
                </Col>
              </Row>
              <Card className="mt-5">
                <Card.Body style={cardStyle}>
                  <Row className="mx-2">
                    <Col xl={22}>
                      <Row gutter={[16, 16]} align="middle">
                        <Col xxl={8} xl={10} lg={12}>
                          <Title level={4} className="m-0">
                            Subscription required for access
                          </Title>
                        </Col>
                        <Col xxl={14} xl={12} lg={10}>
                          <Switch onChange={onChange} />
                        </Col>
                        <Col xxl={2} xl={2} lg={2} style={{ textAlign: 'end' }}>
                          <Tooltip
                            placement="bottom"
                            title="Valid member subscription dates will be required for each member to earn points and access micro-site or widget."
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
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="mt-5">
                <Card.Body style={cardStyle}>
                  <Row className="mx-2">
                    <Col span={22}>
                      <Tabs defaultActiveKey="message" id="points" fill>
                        <Tab
                          eventKey="message"
                          title="Subscription Expired Message"
                          className="border-0 py-4"
                        >
                          <TextArea rows={4} style={{ borderRadius: '10px' }} />
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
                                Update settings
                              </Button>
                            </Col>
                          </Row>
                        </Tab>
                        <Tab
                          eventKey="event"
                          title="Subscription Events Log"
                          className="border-0 py-4"
                        >
                          <Row align="middle">
                            <Col xl={7} xxl={5}>
                              <Text strong className="text-label">
                                Show log entries between
                              </Text>
                            </Col>
                            <Col span={5} xxl={4}>
                              <DatePicker
                                style={datapicker}
                                onChange={() => dateChange()}
                                placeholder="from"
                              />
                            </Col>

                            <Col
                              span={2}
                              xxl={2}
                              style={{ textAlign: 'center' }}
                            >
                              <Text strong className="text-label">
                                and
                              </Text>
                            </Col>
                            <Col span={5} xxl={4}>
                              <DatePicker
                                style={datapicker}
                                onChange={() => dateChange()}
                                placeholder="to"
                              />
                            </Col>
                            <Col span={5} xxl={9} style={{ textAlign: 'end' }}>
                              <Button
                                variant="outline-primary"
                                className="rounded-pill px-4 py-2"
                              >
                                View log
                              </Button>
                            </Col>
                          </Row>
                          <Row className="mt-5">
                            <Input
                              placeholder="Free text search"
                              style={datapicker}
                            />
                          </Row>
                          <Row className="mt-5" align="middle">
                            <Col xl={7} xxl={5}>
                              <Text strong className="text-label">
                                Group
                              </Text>
                            </Col>
                            <Col xl={5} xxl={6}>
                              <Form.Select
                                placeholder="Select"
                                style={{ borderRadius: '10px' }}
                              >
                                <option key={'null'} value={null}></option>
                                {groups.map((item, index) => {
                                  return (
                                    <option key={index} value={item._id}>
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </Form.Select>
                            </Col>
                            <Col xl={12} xxl={13} style={{ textAlign: 'end' }}>
                              <Button
                                variant="outline-primary"
                                className="rounded-pill px-4 py-2"
                              >
                                View report
                              </Button>
                            </Col>
                          </Row>
                        </Tab>
                      </Tabs>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
export default MemberSubscription;
