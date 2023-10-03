import React from 'react';
import { Row, Col } from 'antd';
import { useParams } from 'react-router-dom';
import { Card } from 'react-bootstrap';

import ListScanReason from './quickScanReasons/ListScanReason';
import ViewScanReason from './quickScanReasons/ViewScanReason';
import CsvScanReason from './quickScanReasons/CsvScanReason';
import SearchScanReason from './quickScanReasons/SearchScanReason';
import MenuScanReason from './quickScanReasons/MenuScanReason';
import AddScanReason from './quickScanReasons/AddScanReason';
import UpdateScanReason from './quickScanReasons/UpdateScanReason';
import SettingsScanReason from './quickScanReasons/SettingsScanReason';
import HistoryScanReason from './quickScanReasons/HistoryScanReason';
function QuickScanReasonPage() {
  let { routeKey } = useParams();
  console.log(routeKey, 'this is routeKey');
  if (!routeKey) {
    return (
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row>
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              <MenuScanReason></MenuScanReason>
            </Col>
            <Col span={24}>
              <HistoryScanReason></HistoryScanReason>
            </Col>
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
              <MenuScanReason></MenuScanReason>
              <SettingsScanReason></SettingsScanReason>
            </Col>
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
              {/* <MenuScanReason></MenuScanReason> */}
              <UpdateScanReason></UpdateScanReason>
            </Col>
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
              <MenuScanReason></MenuScanReason>
              <AddScanReason></AddScanReason>
            </Col>
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
              <MenuScanReason></MenuScanReason>
              <SearchScanReason></SearchScanReason>
            </Col>
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
              <MenuScanReason></MenuScanReason>
              <CsvScanReason></CsvScanReason>
            </Col>
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
              <MenuScanReason></MenuScanReason>
              <ViewScanReason></ViewScanReason>
            </Col>
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
              <MenuScanReason></MenuScanReason>
              <ListScanReason></ListScanReason>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default QuickScanReasonPage;
