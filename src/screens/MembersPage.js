import { useParams } from 'react-router-dom';
import React from 'react';
import { Row, Col } from 'antd';
import HistoryMember from './members/HistoryMember';
import SettingsMember from './members/SettingsMember';
import ListMember from './members/ListMember';
import AddMember from './members/AddMember';
import SearchMember from './members/SearchMember';
import CsvMember from './members/CsvMember';
import MemberMenu from './members/MemberMenu';
import NewMenu from './members/NewMenu';
import ViewMember from './members/ViewMember';
import UpdateMember from './members/UpdateMember';
import { Card } from 'react-bootstrap';
function PageComponent() {
  let { routeKey } = useParams();
  console.log(routeKey, 'this is routekey');
  if (routeKey == 'settings') {
    return (
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row>
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              <MemberMenu></MemberMenu>
              <SettingsMember></SettingsMember>
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
              <MemberMenu></MemberMenu>
              <ListMember></ListMember>
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
              <MemberMenu></MemberMenu>
              <AddMember></AddMember>
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
              <MemberMenu></MemberMenu>
              <SearchMember></SearchMember>
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
              <MemberMenu></MemberMenu>
              <CsvMember></CsvMember>
            </Col>
            {/* <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}></Col> */}
          </Row>
        </Card.Body>
      </Card>
    );
  } else if (!routeKey) {
    return (
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row>
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              <MemberMenu></MemberMenu>
            </Col>
            <Col span={24}>
              <HistoryMember></HistoryMember>
            </Col>

            {/* <Col xs={1} sm={1} md={1} lg={2} xl={1} xxl={1}></Col> */}
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
              <MemberMenu></MemberMenu>
              <ViewMember></ViewMember>
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
              {/* <MemberMenu></MemberMenu> */}
              <UpdateMember></UpdateMember>
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
              <MemberMenu></MemberMenu>
              <NewMenu></NewMenu>
            </Col>
            {/* <Col xs={1} sm={1} md={1} lg={2} xl={1} xxl={1}></Col> */}
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default PageComponent;
