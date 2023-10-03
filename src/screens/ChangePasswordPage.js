import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, Row, Col, Input } from 'antd';
import { Card, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
// import { useParams } from 'react-router-dom';
import endpoint from '../utils/endpoint';
import { setCurrentData } from 'redux/slices/currentDataSlice';
import { getErrorAlert, setReduxCurrentSchemaData } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
// import { setMemberMenuData } from 'redux/slices/currentDataSlice';
// import { SearchOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;
const inputBorderRadius = {
  borderRadius: '10px'
};

function ChangePassword() {
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
                <Title level={3}>Change your password</Title>
              </Row>
              <Row className="mx-4 mt-3">
                <Title level={4}>
                  Use this form to set a new password for your account
                </Title>
              </Row>
              <Row className="mx-4 mt-5">
                <Col span={20}>
                  <Text strong className="text-label">
                    New password
                  </Text>
                  <Input style={inputBorderRadius} className="mt-1" />
                </Col>
              </Row>
              <Row className="mx-4 mt-2">
                <Col span={20}>
                  <Text strong className="text-label">
                    Confirm new password
                  </Text>
                  <Input style={inputBorderRadius} className="mt-1" />
                </Col>
              </Row>
              <Row className="mx-4 mt-5">
                <Button
                  variant="outline-primary"
                  className="rounded-pill px-4 py-2"
                >
                  Change password
                </Button>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
export default ChangePassword;
