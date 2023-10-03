import React from 'react';
import { Typography, Row, Col } from 'antd';
import { Button, Badge, Card } from 'react-bootstrap';

const { Title, Text, Paragraph } = Typography;
const cardStyle = {
  backgroundColor: '#F8F8F8',
  borderRadius: '10px',
  border: '0 solid white',
  boxShadow: '0px 0px 0px 0px rgba(0, 0, 0, 1)'
};
const badgeStyle = {
  backgroundColor: '#359DD9',
  borderRadius: '50%'
};
function FirstSite() {
  return (
    <>
      <Row className="mx-4 mt-5">
        <Paragraph>
          Your members can access your loyalty program though this micro-site.
          If you are not a Silver or Gold subscriber your members will simply be
          able to register and log into your micro-site so that they can make
          use of mobile promotions.
        </Paragraph>
      </Row>
      <Row className="mx-4 mt-5">
        <Col span={24} style={{ textAlign: 'center' }}>
          <Title level={3}>Micro-site URL</Title>
        </Col>
      </Row>
      <Row className="mx-4 mt-5">
        <Col span={24}>
          <Card style={cardStyle}>
            <Card.Body className="p-4">
              <Row className="mt-3">
                <Title level={4}>Your program's micro-site URL</Title>
              </Row>
              <Row align="middle" className="mt-2">
                <Col span={10}>
                  <Text>
                    <a
                      href="https://63bff7ca241de.loyal2.com"
                      target="_blank"
                      style={{ color: '#359DD9' }}
                      rel="noreferrer"
                    >
                      <u>https://63bff7ca241de.loyal2.com</u>
                    </a>
                  </Text>
                </Col>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <Button
                    variant="outline-primary"
                    className="btn-active-command rounded-pill px-4 py-2"
                  >
                    View micro-site
                  </Button>
                </Col>
                <Col span={6}>
                  <Button
                    variant="outline-primary"
                    className="rounded-pill px-4 py-2"
                  >
                    Change URL
                  </Button>
                </Col>
              </Row>
              <Row align="bottom" className="mt-3">
                <Col span={1}>
                  <Badge style={badgeStyle}>!</Badge>
                </Col>
                <Col span={23}>
                  <Text>
                    You can also use your own domain if you are a Gold
                    subscriber.
                  </Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
export default FirstSite;
