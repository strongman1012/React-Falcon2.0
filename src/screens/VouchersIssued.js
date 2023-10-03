import { useParams } from 'react-router-dom';
import React from 'react';
import { Row, Col } from 'antd';

import ListIssuedVouchers from './vouchers/issuedVouchers/ListIssuedVouchers';
import AddIssuedVouchers from './vouchers/issuedVouchers/AddIssuedVouchers';
import SearchIssuedVouchers from './vouchers/issuedVouchers/SearchIssuedVouchers';
import CsvIssuedVouchers from './vouchers/issuedVouchers/CsvIssuedVouchers';
import IssuedVouchersMenu from './vouchers/issuedVouchers/IssuedVouchersMenu';
import HistoryIssuedVouchers from './vouchers/issuedVouchers/HistoryIssuedVouchers';
import SettingsIssuedVouchers from './vouchers/issuedVouchers/SettingsIssuedVouchers';
import ViewIssuedVouchers from './vouchers/issuedVouchers/ViewIssuedVouchers';

import { Card } from 'react-bootstrap';
import UpdateIssuedVouchers from './vouchers/issuedVouchers/UpdateIssuedVouchers';
function VouchersIssued() {
  let { routeKey } = useParams();
  console.log(routeKey, 'this is routekey');
  if (!routeKey) {
    return (
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row>
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              <IssuedVouchersMenu></IssuedVouchersMenu>
            </Col>
            <Col span={24}>
              <HistoryIssuedVouchers></HistoryIssuedVouchers>
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
              <IssuedVouchersMenu></IssuedVouchersMenu>
              <SettingsIssuedVouchers></SettingsIssuedVouchers>
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
              {/* <IssuedVouchersMenu></IssuedVouchersMenu> */}
              <UpdateIssuedVouchers></UpdateIssuedVouchers>
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
              <IssuedVouchersMenu></IssuedVouchersMenu>
              <CsvIssuedVouchers></CsvIssuedVouchers>
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
              {/* <IssuedVouchersMenu></IssuedVouchersMenu> */}
              <ViewIssuedVouchers></ViewIssuedVouchers>
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
              <IssuedVouchersMenu></IssuedVouchersMenu>
              <AddIssuedVouchers></AddIssuedVouchers>
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
              <IssuedVouchersMenu></IssuedVouchersMenu>
              <SearchIssuedVouchers></SearchIssuedVouchers>
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
              <IssuedVouchersMenu></IssuedVouchersMenu>
              <ListIssuedVouchers></ListIssuedVouchers>
            </Col>
            {/* <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}></Col> */}
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default VouchersIssued;
