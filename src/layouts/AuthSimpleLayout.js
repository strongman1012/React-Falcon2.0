import React from 'react';
import { Outlet } from 'react-router-dom';
import { Card, Col, Row } from 'react-bootstrap';

import Logo from 'components/common/Logo';
import Section from 'components/common/Section';

const AuthSimpleLayout = () => (
  <Section className="py-0">
    <Row className="flex-center min-vh-100 py-6">
      <Col sm={10} md={8} lg={6} xl={5} className="col-xxl-4">
        <Logo width={200} />
        <Card>
          <Card.Body className="p-4 p-sm-5">
            <Outlet />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Section>
);

export default AuthSimpleLayout;
