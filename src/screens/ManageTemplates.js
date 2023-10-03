import { useParams } from 'react-router-dom';
import React from 'react';
import { Row, Col } from 'antd';

import ListManageTemplates from './autoResponders/manageTemplates/ListManageTemplates';
import AddManageTemplates from './autoResponders/manageTemplates/AddManageTemplates';
import SearchManageTemplates from './autoResponders/manageTemplates/SearchManageTemplates';
import CsvManageTemplates from './autoResponders/manageTemplates/CsvManageTemplates';
import ManageTemplatesMenu from './autoResponders/manageTemplates/ManageTemplatesMenu';
import HistoryManageTemplates from './autoResponders/manageTemplates/HistoryManageTemplates';
import SettingsManageTemplates from './autoResponders/manageTemplates/SettingsManageTemplates';
import ViewManageTemplates from './autoResponders/manageTemplates/ViewManageTemplates';

import { Card } from 'react-bootstrap';
import UpdateManageTemplates from './autoResponders/manageTemplates/UpdateManageTemplates';
function ManageTemplates() {
  let { routeKey } = useParams();
  console.log(routeKey, 'this is routekey');
  if (!routeKey) {
    return (
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row>
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              <ManageTemplatesMenu></ManageTemplatesMenu>
            </Col>
            <Col span={24}>
              <HistoryManageTemplates></HistoryManageTemplates>
            </Col>
            {/* <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}></Col> */}
          </Row>
        </Card.Body>
      </Card>
    );
  } else if (routeKey == 'csv') {
    return (
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row>
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              <ManageTemplatesMenu></ManageTemplatesMenu>
              <CsvManageTemplates></CsvManageTemplates>
            </Col>
            {/* <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}></Col> */}
          </Row>
        </Card.Body>
      </Card>
    );
  } else if (routeKey == 'settings') {
    return (
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row>
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              <ManageTemplatesMenu></ManageTemplatesMenu>
              <SettingsManageTemplates></SettingsManageTemplates>
            </Col>
            {/* <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}></Col> */}
          </Row>
        </Card.Body>
      </Card>
    );
  } else if (routeKey == 'edit') {
    return (
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row>
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              {/* <ManageTemplatesMenu></ManageTemplatesMenu> */}
              <UpdateManageTemplates></UpdateManageTemplates>
            </Col>
            {/* <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}></Col> */}
          </Row>
        </Card.Body>
      </Card>
    );
  } else if (routeKey == 'view') {
    return (
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row>
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              {/* <ManageTemplatesMenu></ManageTemplatesMenu> */}
              <ViewManageTemplates></ViewManageTemplates>
            </Col>
            {/* <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}></Col> */}
          </Row>
        </Card.Body>
      </Card>
    );
  } else if (routeKey == 'add') {
    return (
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row>
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              <ManageTemplatesMenu></ManageTemplatesMenu>
              <AddManageTemplates></AddManageTemplates>
            </Col>
            {/* <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}></Col> */}
          </Row>
        </Card.Body>
      </Card>
    );
  } else if (routeKey == 'search') {
    return (
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row>
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              <ManageTemplatesMenu></ManageTemplatesMenu>
              <SearchManageTemplates></SearchManageTemplates>
            </Col>
            {/* <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}></Col> */}
          </Row>
        </Card.Body>
      </Card>
    );
  } else {
    return (
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row>
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              <ManageTemplatesMenu></ManageTemplatesMenu>
              <ListManageTemplates></ListManageTemplates>
            </Col>
            {/* <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}></Col> */}
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default ManageTemplates;
