import React from 'react';
import { useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';

const Footer = () => {
  const { name, version } = useSelector(state => state.settings);
  const { footerShow } = useSelector(state => state.theme);

  if (!footerShow) return null;
  return (
    <footer className="footer">
      <Row className="justify-content-between text-center fs--1 mt-4 mb-3">
        <Col sm="auto">
          <p className="mb-0 text-600">
            {name} &copy; {new Date().getFullYear()}
          </p>
        </Col>
        <Col sm="auto">
          <p className="mb-0 text-600">v{version}</p>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
