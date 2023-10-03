import React from 'react';
import { Row, Col } from 'antd';
import { Tabs, Tab } from 'react-bootstrap';

function TabGroups() {
  return (
    <>
      <Row className="mx-4 mt-7">
        <Col span={20}>
          <Tabs defaultActiveKey="issued" id="group_settings" fill>
            <Tab
              eventKey="issued"
              title="Issued"
              className="border-0 p-5"
              aria-selected="true"
            >
              <Row className="mt-7" justify="center" span={20}>
                <Col>
                  <h1>1000</h1>
                </Col>
              </Row>
              <Row className="mt-7" justify="center" span={20}>
                <Col>
                  <h5>Total points issued on the system from the start</h5>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="active" title="Active" className="border-0 p-5">
              <Row className="mt-7" justify="center" span={20}>
                <Col>
                  <h1>1000</h1>
                </Col>
              </Row>
              <Row className="mt-7" justify="center" span={20}>
                <Col>
                  <h5>Total points issued on the system from the start</h5>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="expired" title="Expired" className="border-0 p-5">
              <Row className="mt-7" justify="center" span={20}>
                <Col>
                  <h1>1000</h1>
                </Col>
              </Row>
              <Row className="mt-7" justify="center" span={20}>
                <Col>
                  <h5>Total points issued on the system from the start</h5>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="used" title="Used" className="border-0 p-5">
              <Row className="mt-7" justify="center" span={20}>
                <Col>
                  <h1>1000</h1>
                </Col>
              </Row>
              <Row className="mt-7" justify="center" span={20}>
                <Col>
                  <h5>Total points issued on the system from the start</h5>
                </Col>
              </Row>
            </Tab>
            <Tab
              eventKey="next month"
              title="Next month"
              className="border-0 p-5"
            >
              <Row className="mt-7" justify="center" span={20}>
                <Col>
                  <h1>1000</h1>
                </Col>
              </Row>
              <Row className="mt-7" justify="center" span={20}>
                <Col>
                  <h5>Total points issued on the system from the start</h5>
                </Col>
              </Row>
            </Tab>
            <Tab
              eventKey="in 6 months"
              title="In 6 months"
              className="border-0 p-5"
            >
              <Row className="mt-7" justify="center" span={20}>
                <Col>
                  <h1>1000</h1>
                </Col>
              </Row>
              <Row className="mt-7" justify="center" span={20}>
                <Col>
                  <h5>Total points issued on the system from the start</h5>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </>
  );
}
export default TabGroups;
