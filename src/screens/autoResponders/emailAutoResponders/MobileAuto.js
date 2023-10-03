import React from 'react';
import { Row, Col, Typography } from 'antd';
const { Paragraph } = Typography;
function MobileAuto() {
  return (
    <>
      <Row>
        <Col span={20}>
          <Paragraph className="text-label">
            Mobile Autoresponders are currently not enabled on your account.{' '}
            <u>(Find out more)</u>
          </Paragraph>
        </Col>
      </Row>
    </>
  );
}
export default MobileAuto;
