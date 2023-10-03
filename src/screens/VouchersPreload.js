import { useParams } from 'react-router-dom';
import React from 'react';
import { Row, Col } from 'antd';

import ListPreloadVouchers from './vouchers/preloadVouchers/ListPreloadVouchers';
import AddPreloadVouchers from './vouchers/preloadVouchers/AddPreloadVouchers';
import SearchPreloadVouchers from './vouchers/preloadVouchers/SearchPreloadVouchers';
import CsvPreloadVouchers from './vouchers/preloadVouchers/CsvPreloadVouchers';
import PreloadVouchersMenu from './vouchers/preloadVouchers/PreloadVouchersMenu';
import HistoryPreloadVouchers from './vouchers/preloadVouchers/HistoryPreloadVouchers';
import SettingsPreloadVouchers from './vouchers/preloadVouchers/SettingsPreloadVouchers';
import ViewPreloadVouchers from './vouchers/preloadVouchers/ViewPreloadVouchers';
import UpdatePreloadVouchers from './vouchers/preloadVouchers/UpdatePreloadVouchers';
import { Card } from 'react-bootstrap';
function VouchersPreload() {
  let { routeKey } = useParams();
  console.log(routeKey, 'this is routekey');
  if (!routeKey) {
    return (
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row>
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              <PreloadVouchersMenu></PreloadVouchersMenu>
            </Col>
            <Col span={24}>
              <HistoryPreloadVouchers></HistoryPreloadVouchers>
            </Col>
            {/* <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}></Col> */}
          </Row>
        </Card.Body>
      </Card>
    );
  } else if (routeKey == 'settings') {
    return (
      <Card className="z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row>
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              <PreloadVouchersMenu></PreloadVouchersMenu>
              <SettingsPreloadVouchers></SettingsPreloadVouchers>
            </Col>
            {/* <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}></Col> */}
          </Row>
        </Card.Body>
      </Card>
    );
  } else if (routeKey == 'edit') {
    return (
      <Card className="z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row>
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              {/* <PreloadVouchersMenu></PreloadVouchersMenu> */}
              <UpdatePreloadVouchers></UpdatePreloadVouchers>
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
              <PreloadVouchersMenu></PreloadVouchersMenu>
              <CsvPreloadVouchers></CsvPreloadVouchers>
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
              {/* <PreloadVouchersMenu></PreloadVouchersMenu> */}
              <ViewPreloadVouchers></ViewPreloadVouchers>
            </Col>
            {/* <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}></Col> */}
          </Row>
        </Card.Body>
      </Card>
    );
  } else if (routeKey == 'add') {
    return (
      <Card className=" z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row>
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              <PreloadVouchersMenu></PreloadVouchersMenu>
              <AddPreloadVouchers></AddPreloadVouchers>
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
              <PreloadVouchersMenu></PreloadVouchersMenu>
              <SearchPreloadVouchers></SearchPreloadVouchers>
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
              <PreloadVouchersMenu></PreloadVouchersMenu>
              <ListPreloadVouchers></ListPreloadVouchers>
            </Col>
            {/* <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}></Col> */}
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default VouchersPreload;
