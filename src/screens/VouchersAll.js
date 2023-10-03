import { useParams } from 'react-router-dom';
import React from 'react';
import { Row, Col } from 'antd';

import ListAllVouchers from './vouchers/allVouchers/ListAllVouchers';
import AddAllVouchers from './vouchers/allVouchers/AddAllVouchers';
import SearchAllVouchers from './vouchers/allVouchers/SearchAllVouchers';
import CsvAllVouchers from './vouchers/allVouchers/CsvAllVouchers';
import AllVouchersMenu from './vouchers/allVouchers/AllVouchersMenu';
import HistoryAllVouchers from './vouchers/allVouchers/HistoryAllVouchers';
import SettingsAllVouchers from './vouchers/allVouchers/SettingsAllVouchers';
import ViewAllVouchers from './vouchers/allVouchers/ViewAllVouchers';
// import TabGroups from './vouchers/allVouchers/TabGroups';

import { Card } from 'react-bootstrap';
import UpdateAllVouchers from './vouchers/allVouchers/UpdateAllVouchers';
function VouchersAll() {
  let { routeKey } = useParams();
  console.log(routeKey, 'this is routekey');
  if (!routeKey) {
    return (
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row>
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              <AllVouchersMenu></AllVouchersMenu>
            </Col>
            <Col span={24}>
              <HistoryAllVouchers></HistoryAllVouchers>
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
              <AllVouchersMenu></AllVouchersMenu>
              <SettingsAllVouchers></SettingsAllVouchers>
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
              <AllVouchersMenu></AllVouchersMenu>
              <CsvAllVouchers></CsvAllVouchers>
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
              {/* <AllVouchersMenu></AllVouchersMenu> */}
              <ViewAllVouchers></ViewAllVouchers>
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
              <AllVouchersMenu></AllVouchersMenu>
              <AddAllVouchers></AddAllVouchers>
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
              <AllVouchersMenu></AllVouchersMenu>
              <ListAllVouchers></ListAllVouchers>
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
              {/* <AllVouchersMenu></AllVouchersMenu> */}
              <UpdateAllVouchers></UpdateAllVouchers>
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
              <AllVouchersMenu></AllVouchersMenu>
              <SearchAllVouchers></SearchAllVouchers>
            </Col>
            {/* <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}></Col> */}
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default VouchersAll;
