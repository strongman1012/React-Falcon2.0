import React from 'react';
import { Typography, Row, Col } from 'antd';
// import { PlusOutlined } from '@ant-design/icons';
// import { Outlet, useNavigate } from 'react-router-dom';
import { Tabs, Tab } from 'react-bootstrap';

import TabFirst from './TabFirst';
import TabSecond from './TabSecond';
import TabThird from './TabThird';
import TabForth from './TabForth';
const { Text } = Typography;

function TabGroups(props) {
  let { groups } = props;
  return (
    <>
      {/* <Row className="mx-4 mt-3">
        <Col span={24}>
          <Title level={4} className="mb-3">
            Groups/Tiers Settings
          </Title>
        </Col>
      </Row> */}
      <Row className="mx-4 mt-4">
        <Text className="text-label" strong>
          {' '}
          Automate based on
        </Text>
      </Row>
      <Row className="mx-4 mt-3">
        <Col span={24}>
          <Tabs defaultActiveKey="action" id="group_settings" fill>
            <Tab eventKey="action" title="Action" className="border-0 p-5">
              <TabFirst groups={groups} />
            </Tab>
            <Tab
              eventKey="member_number_code"
              title="Member number/code"
              className="border-0 p-5"
            >
              <TabSecond groups={groups} />
            </Tab>
            <Tab
              eventKey="points_balance"
              title="Points balance"
              className="border-0 p-5"
            >
              <TabThird groups={groups} />
            </Tab>
            <Tab
              eventKey="points_issued"
              title="Points issued"
              className="border-0 p-5"
            >
              <TabForth groups={groups} />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </>
  );
}
export default TabGroups;
