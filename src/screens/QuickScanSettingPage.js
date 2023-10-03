import React from 'react';
import { Typography, Row, Col } from 'antd';

import { Tabs, Tab, Card } from 'react-bootstrap';

import FirstSite from './quickScanSettings/firstSite';
import SecondSite from './quickScanSettings/secondSite';
import ThirdSite from './quickScanSettings/thirdSite';
const { Title, Paragraph } = Typography;

function QuickScanSettingPage() {
  return (
    <>
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row className="mx-4 mt-4">
            <Col span={24}>
              <Title level={3}>QuickScan, Tags and Barcodes</Title>
            </Col>
          </Row>
          <Row className="mt-4 mx-4">
            <Col>
              <Paragraph>
                This page gives you URLs and barcodes you can use to automate
                you member's interaction in-store.
              </Paragraph>
              <Paragraph>
                For more info see
                <a href="#"> this article </a>
              </Paragraph>
            </Col>
          </Row>

          <Row className="mx-4 mt-4">
            <Col span={22}>
              <Tabs
                defaultActiveKey="access"
                style={{ marginTop: '30px' }}
                id="uncontrolled-tab-example"
                justify
                className="mb-3"
              >
                <Tab
                  eventKey="access"
                  title="QuickScan Access"
                  className="border-0 p-0"
                >
                  <FirstSite />
                </Tab>
                <Tab
                  eventKey="setting"
                  title="QuickScan Settings"
                  className="border-0 "
                >
                  <SecondSite />
                </Tab>
                <Tab
                  eventKey="barcode"
                  title="View a member's QR/barcode"
                  className="border-0"
                >
                  <ThirdSite />
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
export default QuickScanSettingPage;
