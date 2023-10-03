import React from 'react';
// import Axios from 'axios';
import { Row, Col, Typography } from 'antd';
import { Button, Form, Card } from 'react-bootstrap';

const { Title, Text } = Typography;

function AutoResponder() {
  return (
    <>
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row className="my-3">
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              <Row className="mx-4 mt-3">
                <Title level={3}>Autoresponders</Title>
              </Row>
              <Row className="mx-4 mt-3">
                <Title level={4}>Send an Autoresponder Manually</Title>
              </Row>
              <Row className="mx-4 mt-3">
                <Text strong className="text-label">
                  Autoresponder Message to send
                </Text>
              </Row>
              <Row className="mx-4 mt-1">
                <Col span={20}>
                  <Form.Select style={{ borderRadius: '10px' }}>
                    <option value="0">select</option>
                    <option value="1">select1</option>
                    <option value="2">select2</option>
                  </Form.Select>
                </Col>
              </Row>
              <Row className="mx-4 mt-3">
                <Text strong className="text-label">
                  Member to send it to
                </Text>
              </Row>
              <Row className="mx-4 mt-1">
                <Col span={20}>
                  <Form.Select style={{ borderRadius: '10px' }}>
                    <option value="0">select</option>
                    <option value="1">select1</option>
                    <option value="2">select2</option>
                  </Form.Select>
                </Col>
              </Row>
              <Row className="mx-4 mt-5">
                <Col span={20} style={{ textAlign: 'end' }}>
                  <Button
                    variant="outline-primary"
                    className="rounded-pill px-4 py-2"
                  >
                    Send
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
export default AutoResponder;
