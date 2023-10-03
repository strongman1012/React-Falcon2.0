import { useParams } from 'react-router-dom';
import React from 'react';
import { Row, Col } from 'antd';

import ListManageUsers from './manageUsers/ListManageUsers';
import AddManageUsers from './manageUsers/AddManageUsers';
import SearchManageUsers from './manageUsers/SearchManageUsers';
import CsvManageUsers from './manageUsers/CsvManageUsers';
import ManageUsersMenu from './manageUsers/ManageUsersMenu';
import HistoryManageUsers from './manageUsers/HistoryManageUsers';
import SettingsManageUsers from './manageUsers/SettingsManageUsers';
import ViewManageUsers from './manageUsers/ViewManageUsers';
import UpdateManageUsers from './manageUsers/UpdateManageUsers';
// import TabGroups from './manageUsers/TabGroups';

import { Card } from 'react-bootstrap';
function ManageUsersPage() {
  let { routeKey } = useParams();
  if (!routeKey) {
    return (
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row>
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              <ManageUsersMenu></ManageUsersMenu>
            </Col>
            <Col span={24}>
              <HistoryManageUsers></HistoryManageUsers>
            </Col>
            {/* <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}></Col> */}
          </Row>
        </Card.Body>
      </Card>
    );
  } else if (routeKey == 'list') {
    return (
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row>
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              <ManageUsersMenu></ManageUsersMenu>
              <ListManageUsers></ListManageUsers>
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
              {/* <ManageUsersMenu></ManageUsersMenu> */}
              <ViewManageUsers></ViewManageUsers>
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
              <ManageUsersMenu></ManageUsersMenu>
              <AddManageUsers></AddManageUsers>
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
              <ManageUsersMenu></ManageUsersMenu>
              <SearchManageUsers></SearchManageUsers>
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
              {/* <ManageUsersMenu></ManageUsersMenu> */}
              <UpdateManageUsers></UpdateManageUsers>
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
              <ManageUsersMenu></ManageUsersMenu>
              <SettingsManageUsers></SettingsManageUsers>
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
              <ManageUsersMenu></ManageUsersMenu>
              <CsvManageUsers></CsvManageUsers>
            </Col>
            {/* <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}></Col> */}
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default ManageUsersPage;
