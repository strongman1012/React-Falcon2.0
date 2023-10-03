import React from 'react';
import { Row, Col, Tooltip, Typography } from 'antd';
import { Tabs, Tab, Card } from 'react-bootstrap';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { Text } = Typography;

function TabGroups() {
  return (
    <>
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row className="mx-4 mt-7">
            <Col span={20}>
              <Tabs defaultActiveKey="issued" id="group_settings" fill>
                <Tab
                  eventKey="issued"
                  title="Waiting to be approved"
                  className="border-0 p-5"
                  aria-selected="true"
                >
                  <Row className="mt-5" justify="center" span={20}>
                    <Col className="mx-3">
                      <Tooltip
                        placement="right"
                        color="#359dd9"
                        title="Sales Approval"
                        className="mb-1"
                      >
                        <ExclamationCircleOutlined
                          style={{
                            backgroundColor: '#359DD9',
                            borderRadius: '50%',
                            border: 'none',
                            color: 'white',
                            fontSize: '21px',
                            textAlign: 'end'
                          }}
                        />
                      </Tooltip>
                    </Col>
                    <Col>
                      <Text strong>
                        There are no sales waiting to be approved at this time.
                      </Text>
                    </Col>
                  </Row>
                </Tab>
                <Tab
                  eventKey="active"
                  title="Processed Sales"
                  className="border-0 p-5"
                >
                  <Row className="mt-5" justify="center" span={20}>
                    <Col className="mx-3">
                      <Tooltip
                        placement="right"
                        color="#359dd9"
                        title="Sales Approval"
                        className="mb-1"
                      >
                        <ExclamationCircleOutlined
                          style={{
                            backgroundColor: '#359DD9',
                            borderRadius: '50%',
                            border: 'none',
                            color: 'white',
                            fontSize: '21px',
                            textAlign: 'end'
                          }}
                        />
                      </Tooltip>
                    </Col>
                    <Col>
                      <Text strong>
                        There are no sales waiting to be approved at this time.
                      </Text>
                    </Col>
                  </Row>
                </Tab>
                <Tab
                  eventKey="expired"
                  title="Pending Sales"
                  className="border-0 p-5"
                >
                  <Row className="mt-5" justify="center" span={20}>
                    <Col className="mx-3">
                      <Tooltip
                        placement="right"
                        color="#359dd9"
                        title="Sales Approval"
                        className="mb-1"
                      >
                        <ExclamationCircleOutlined
                          style={{
                            backgroundColor: '#359DD9',
                            borderRadius: '50%',
                            border: 'none',
                            color: 'white',
                            fontSize: '21px',
                            textAlign: 'end'
                          }}
                        />
                      </Tooltip>
                    </Col>
                    <Col>
                      <Text strong>
                        There are no sales waiting to be approved at this time.
                      </Text>
                    </Col>
                  </Row>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
export default TabGroups;
