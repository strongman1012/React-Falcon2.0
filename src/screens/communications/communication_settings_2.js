import React from 'react';
import { Typography, Row, Col } from 'antd';

const { Title, Paragraph } = Typography;

function Communication_settings_2() {
  return (
    <>
      <Row justify="center">
        <Col span={10}>
          <Title level={4} style={{ textAlign: 'center' }}>
            Review your filter results
          </Title>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col span={24}>
          <Paragraph className="text-label">
            1 of your 1 members matched this query
          </Paragraph>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col span={24}>
          <Paragraph className="text-label">
            1 members have email addresses and have not opted-out of email
            communication
          </Paragraph>
        </Col>
      </Row>
      <Row className="mt-2 mb-7">
        <Col span={24}>
          <Paragraph className="text-label">
            1 members have not opted-out of postal/print communication
          </Paragraph>
        </Col>
      </Row>
    </>
  );
}
export default Communication_settings_2;
