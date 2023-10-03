import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col, Typography, Switch } from 'antd';
import { Button } from 'react-bootstrap';
// import { useParams } from 'react-router-dom';
import endpoint from '../../../utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { setMemberMenuData } from 'redux/slices/currentDataSlice';
const { Title, Text } = Typography;

function SettingsIssuedVouchers() {
  const dispatch = useDispatch();
  const _isMounted = useRef(false);
  // let { routeKey } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const initPageModule = async () => {
    try {
      // default part
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getDataIssuedVoucherSchemaEndpoint('settings');
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      dispatch(setMemberMenuData({ currentMemberMenuSchema: schema.menu })); // store current member menu
      _isMounted.current && setLayoutData(layoutSchema);
      // end default part
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
    }
  };

  useEffect(() => {
    _isMounted.current = true;
    initPageModule();
    return () => {
      _isMounted.current = false;
    };
  }, []);

  // const [prefix_num, setPrefix_num] = useState(1);
  // const [start_num, setStart_num] = useState(0);
  const updateSetting = () => {
    console.log('updated');
  };

  if (loadingSchema) {
    return <Loading style={{ marginTop: 150 }} msg="Loading Schema..." />;
  }
  if (!layoutData) return getErrorAlert({ onRetry: initPageModule });
  const onChange = checked => {
    console.log(`switch to ${checked}`);
  };
  return (
    <>
      <Row className="mx-4 mt-5">
        <Title level={4}>Vouchers Issued Settings</Title>
      </Row>

      <Row className="mx-4 mt-5">
        <Col span={20}>
          <Row align="middle">
            <Col md={12} lg={12} xl={11}>
              <Text strong className="text-label">
                For multi-branch: apply points globally
              </Text>
            </Col>
            <Col md={4} lg={4} xl={3}>
              {/* <Skeleton.Avatar active="false" size="default" shape="circle" /> */}
              <Switch onChange={onChange} />
            </Col>
            <Col md={8} lg={8} xl={10} style={{ textAlign: 'end' }}>
              <Button
                variant="outline-primary"
                className="rounded-pill px-4 py-2"
                onClick={() => updateSetting()}
              >
                Update settings
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
export default SettingsIssuedVouchers;
