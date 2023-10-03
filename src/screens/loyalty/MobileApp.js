import React from 'react';
import { Row, Col, Typography, Switch, Tooltip } from 'antd';
import { Tabs, Tab, Card, Button } from 'react-bootstrap';
const { Title, Paragraph } = Typography;
import { QuestionCircleOutlined } from '@ant-design/icons';

function MobileApp() {
  const tooltip_style = {
    color: 'black',
    padding: '19px 16px 11px 24px',
    width: '280px',
    height: '55px',
    fontSize: '10px',
    borderRadius: '10px'
  };
  return (
    <>
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row className="mx-4 mt-5">
            <Col span={20}>
              <Tabs defaultActiveKey="issued" id="group_settings" fill>
                <Tab
                  eventKey="issued"
                  title="The Loyale2 Mobile App"
                  className="border-0 p-5"
                  aria-selected="true"
                >
                  <Row className="mt-4" align="middle">
                    <Col span={11}>
                      <Title level={4} className="m-0 p-0">
                        Desable the Mobile App
                      </Title>
                    </Col>
                    <Col span={5}>
                      <Switch />
                    </Col>
                    <Col span={4}>
                      <Button
                        variant="outline-primary"
                        className="rounded-pill py-2 px-4"
                        type="submit"
                      >
                        Update
                      </Button>
                    </Col>
                    <Col span={4} style={{ textAlign: 'end' }}>
                      <Tooltip
                        placement="bottom"
                        color="white"
                        overlayInnerStyle={tooltip_style}
                        title="If you'd rather not have your program listed in our Mobile App select the following option"
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
                  <Row className="mt-6">
                    <Col>
                      <Title level={4}>
                        The Loyal2 Mobile App is available for Apple and Android
                      </Title>
                    </Col>
                  </Row>
                  <Row className="mt-5">
                    <Col>
                      <Title level={4}>For your customers</Title>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col>
                      <Paragraph style={{ lineHeight: '2.5rem' }}>
                        The app provides access to see and store their Loyalty
                        Account information in an offline digital wallet. It
                        stores points balances, membership QR codes for
                        QuickScan and any avialable vouchers.
                      </Paragraph>
                    </Col>
                  </Row>
                  <Row className="mt-5">
                    <Col>
                      <Title level={4}>For you</Title>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col>
                      <Paragraph style={{ lineHeight: '2.5rem' }}>
                        The app provides a scanning facility for{' '}
                        <u>QuickScan</u> which reads QR coded membership numbers
                        and NFC tags allowing you to run a cardless loyalty
                        program for in-store scanning.
                      </Paragraph>
                    </Col>
                  </Row>
                </Tab>
                <Tab
                  eventKey="active"
                  title="Mobile App Status"
                  className="border-0 p-5"
                >
                  <Row className="mt-2">
                    <Col>
                      <Title level={4}>Mobile App Status</Title>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col>
                      <Paragraph className="mt-3">
                        You program is not currently listed and visible in the
                        Loyal2 App.
                      </Paragraph>
                      <Paragraph className="mt-3">
                        The App is only available for programs that are on a
                        <u>paid subscription</u>.
                      </Paragraph>
                      <Paragraph className="mt-3">
                        You need to <u>upload a logo</u> for your program in
                        order to get listed in the App.
                      </Paragraph>
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
export default MobileApp;
