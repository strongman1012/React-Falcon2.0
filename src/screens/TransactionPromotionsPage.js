import { useParams } from 'react-router-dom';
import React from 'react';
import { Row, Col } from 'antd';
import TransactionPromotionsAdd from './promotions/TransactionPromotionsAdd';
import TransactionPromotionsCSV from './promotions/TransactionPromotionsCSV';
import TransactionPromotionsList from './promotions/TransactionPromotionsList';
import TransactionPromotionsSearch from './promotions/TransactionPromotionsSearch';
import TransactionPromotionsSettings from './promotions/TransactionPromotionsSettings';
// import TransactionPromotionsHistory from './promotions/TransactionPromotionsHistory';
import TransactionPromotionsMenu from './promotions/TransactionPromotionsMenu';

import { Card } from 'react-bootstrap';
function PageComponent() {
  let { routeKey } = useParams();
  console.log(routeKey, 'this is routekey');
  if (!routeKey) {
    return (
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row>
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              <TransactionPromotionsMenu></TransactionPromotionsMenu>
              <TransactionPromotionsSettings></TransactionPromotionsSettings>
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
              <TransactionPromotionsMenu></TransactionPromotionsMenu>
              <TransactionPromotionsAdd></TransactionPromotionsAdd>
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
              <TransactionPromotionsMenu></TransactionPromotionsMenu>
              <TransactionPromotionsCSV></TransactionPromotionsCSV>
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
              <TransactionPromotionsMenu></TransactionPromotionsMenu>
              <TransactionPromotionsSettings></TransactionPromotionsSettings>
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
              <TransactionPromotionsMenu></TransactionPromotionsMenu>
              <TransactionPromotionsList></TransactionPromotionsList>
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
              <TransactionPromotionsMenu></TransactionPromotionsMenu>
              <TransactionPromotionsSearch></TransactionPromotionsSearch>
            </Col>
            {/* <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}></Col> */}
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default PageComponent;
