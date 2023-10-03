import React from 'react';
import { Row, Col, Typography, Input } from 'antd';
import { Tabs, Tab, Card, Button } from 'react-bootstrap';
const { Text, Title, Paragraph } = Typography;

function VerifyVoucher() {
  return (
    <>
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row className="mx-4 mt-3">
            <Col span={20}>
              <Title level={3} className="mb-5">
                Verify Voucher Code
              </Title>
            </Col>
          </Row>
          <Row className="mx-4 mt-3">
            <Col span={20}>
              <Tabs defaultActiveKey="issued" id="group_settings" fill>
                <Tab
                  eventKey="issued"
                  title="Scan or enter a code"
                  className="border-0 p-5"
                  aria-selected="true"
                >
                  <Row>
                    <Col>
                      <Paragraph>
                        Use this form to verify if a voucher code is valid, and
                        if so, redeem the voucher code so that it cannot be used
                        again.
                      </Paragraph>
                    </Col>
                  </Row>
                  <Row align="middle" className="mt-4">
                    <Col span={4}>
                      <Text strong>Voucher Code</Text>
                    </Col>
                    <Col span={10}>
                      <Input strong style={{ borderRadius: '10px' }} />
                    </Col>
                    <Col style={{ textAlign: 'end' }} span={10}>
                      <Button
                        variant="outline-primary"
                        className="rounded-pill py-2 px-4"
                        type="submit"
                      >
                        Reset code
                      </Button>
                    </Col>
                  </Row>
                  <Row align="middle" className="mt-5">
                    <Col style={{ textAlign: 'right' }}>
                      <Button
                        variant="outline-primary"
                        className="rounded-pill py-2 px-4"
                        type="submit"
                      >
                        Verify only
                      </Button>
                    </Col>
                    <Col className="mx-3" style={{ textAlign: 'right' }}>
                      <Button
                        variant="outline-primary"
                        className="rounded-pill py-2 px-4"
                        type="submit"
                      >
                        Verify and redeem
                      </Button>
                    </Col>
                  </Row>
                </Tab>
                <Tab
                  eventKey="active"
                  title="Find codes issued to a member"
                  className="border-0 p-5"
                >
                  <Row align="middle">
                    <Col span={17}>
                      <Input
                        strong
                        style={{ borderRadius: '10px' }}
                        placeholder="Member account lookup"
                      />
                    </Col>
                    <Col style={{ textAlign: 'end' }} span={7}>
                      <Button
                        variant="outline-primary"
                        className="rounded-pill py-2 px-4"
                        type="submit"
                      >
                        Find codes
                      </Button>
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
export default VerifyVoucher;
