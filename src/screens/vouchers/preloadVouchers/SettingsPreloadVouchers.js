import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col, Typography, Input } from 'antd';
import { Button } from 'react-bootstrap';
// import { useParams } from 'react-router-dom';
import endpoint from '../../../utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { setMemberMenuData } from 'redux/slices/currentDataSlice';
import VoucherList from 'components/custom/VoucherList';
const { Title, Text, Paragraph } = Typography;

function SettingsPreloadVouchers() {
  const dispatch = useDispatch();
  const _isMounted = useRef(false);
  // let { routeKey } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const [filterVoucherStr, setFilterVoucherStr] = useState('');
  const [voucherList, setVoucherList] = useState([]);
  const initPageModule = async () => {
    try {
      // default part
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getDataPreloadVoucherSchemaEndpoint('settings');
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      dispatch(setMemberMenuData({ currentMemberMenuSchema: schema.menu })); // store current member menu
      const vouchersList = await Axios.get(
        endpoint.getDataAllVoucherSchemaEndpoint('list')
      );
      setVoucherList(vouchersList.data.layout.data);
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

  return (
    <>
      <Row className="mx-4 mt-5">
        <Col span={22}>
          {' '}
          <Paragraph>
            {''}
            <Text strong className="text-label">
              Note:{' '}
            </Text>
            These pre-loaded voucher codes are NOT active codes. They only
            become active when a voucher is issued, in which case the voucher
            gets it's next code from this list rather than generating a new
            random code. These codes are normally only needed/ used then the
            voucher codes are used in a 3rd party system which needs to know the
            codes before they are issued.
          </Paragraph>
        </Col>
      </Row>
      <Row className="mx-4 mt-5">
        <Title level={4}>
          Create up to 100 unique voucher codes for the specified voucher
        </Title>
      </Row>

      <Row className="mx-4 my-5">
        <Col span={22}>
          <Row align="middle" gutter={[24, 24]}>
            <Col md={5} lg={5} xl={4}>
              <Text strong className="text-label">
                Auto-generate
              </Text>
            </Col>
            <Col md={4} lg={4} xl={4}>
              <Input style={{ borderRadius: '10px' }} />
            </Col>
            <Col md={4} lg={4} xl={3}>
              <Text strong className="text-label">
                codes for
              </Text>
            </Col>
            <Col md={5} lg={5} xl={6}>
              <Input
                style={{ borderRadius: '10px' }}
                type="text"
                className="mt-1"
                value={filterVoucherStr}
                onChange={e => setFilterVoucherStr(e.target.value)}
              />
              <VoucherList
                items={voucherList}
                filter={filterVoucherStr}
                onCancel={() => {
                  // set_voucherISbb_loyal2_vouchersID(null);
                  setFilterVoucherStr('');
                }}
                onItemClick={(id, name) => {
                  // set_voucherISbb_loyal2_vouchersID(id);
                  setFilterVoucherStr(name);
                }}
              ></VoucherList>
            </Col>
            <Col md={6} lg={6} xl={7} style={{ textAlign: 'end' }}>
              <Button
                variant="outline-primary"
                className="rounded-pill px-4 py-2"
                onClick={() => updateSetting()}
              >
                Generate Code
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
export default SettingsPreloadVouchers;
