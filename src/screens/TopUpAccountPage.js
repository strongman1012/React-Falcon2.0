import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, Row, Col } from 'antd';
import { Card, Button, Form } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
// import { useParams } from 'react-router-dom';
import endpoint from '../utils/endpoint';
import { setCurrentData } from 'redux/slices/currentDataSlice';
import { getErrorAlert, setReduxCurrentSchemaData } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
// import { setMemberMenuData } from 'redux/slices/currentDataSlice';
// import { SearchOutlined } from '@ant-design/icons';
const { Title, Text, Paragraph } = Typography;
const inputBorderRadius = {
  borderRadius: '10px'
};

function TopUpAccount() {
  // let { routeKey } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const _isMounted = useRef(false);
  const [moduleSchema, setModuleSchema] = useState(null);
  const [loadingSchema, setLoadingSchema] = useState(true);

  const initPageModule = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      dispatch(setCurrentData({ currentModuleSchemaLoading: true }));
      const ep = endpoint.getPageSchemaEndpoint('dashboard');
      const moduleSchemaRes = await Axios.get(ep);
      const schema = moduleSchemaRes.data;
      console.log('Page Schema:->', schema);
      setReduxCurrentSchemaData(schema);
      _isMounted.current && setModuleSchema(schema);
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
    }
  };

  useEffect(() => {
    if (_isMounted.current) {
      initPageModule();
    }
  }, [location.pathname]);

  useEffect(() => {
    _isMounted.current = true;
    initPageModule();
    return () => {
      _isMounted.current = false;
    };
  }, []);

  if (loadingSchema) {
    return <Loading style={{ marginTop: 150 }} msg="Loading Schema..." />;
  }
  if (!moduleSchema) return getErrorAlert({ onRetry: initPageModule });

  return (
    <>
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row className="my-3">
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              <Row className="mx-4">
                <Title level={3}>Top up your account</Title>
              </Row>
              <Row className="mx-4 mt-5">
                <Col span={20}>
                  <Paragraph>
                    If you are on our free plan, these credits are required for
                    the system to send outgoing messages (email or mobile) to
                    your members. For paid plans these credits are only required
                    for mobile messaging.
                  </Paragraph>
                </Col>
              </Row>
              <Row className="mx-4 mt-5">
                <Col span={20}>
                  <Title level={4}>
                    Your current balance is{' '}
                    <Text style={{ fontSize: '20px', color: '#359DD9' }}>
                      0.00
                    </Text>{' '}
                    credits.
                  </Title>
                </Col>
              </Row>
              <Row className="mx-4 mt-4">
                <Col span={20}>
                  <Row align="middle">
                    <Col span={15}>
                      <Text strong className="text-label">
                        Specify Amount To Top Up
                      </Text>
                    </Col>
                    <Col span={9}>
                      <Form.Select
                        placeholder="Select"
                        style={inputBorderRadius}
                      >
                        <option value="0">Select</option>
                        <option value="1">select1</option>
                        <option value="2">select2</option>
                      </Form.Select>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mx-4 mt-4">
                <Col span={20}>
                  <Paragraph>
                    Please wait for the next page to finish loading once you
                    have submitted your card details.
                  </Paragraph>
                </Col>
              </Row>
              <Row className="mx-4 mt-5">
                <Button
                  variant="outline-primary"
                  className="rounded-pill px-4 py-2"
                >
                  Pay with card
                </Button>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
export default TopUpAccount;
