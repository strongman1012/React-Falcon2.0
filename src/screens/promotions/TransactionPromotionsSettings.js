import React from 'react';
// import Axios from 'axios';
// import { useEffect, useRef } from 'react';
// import { useState, useEffect, useRef } from 'react';
// import { useDispatch } from 'react-redux';
import { Row, Col, Typography, InputNumber } from 'antd';
import { Button } from 'react-bootstrap';
// import { useParams } from 'react-router-dom';
// import endpoint from '../../utils/endpoint';
// import { getErrorAlert } from 'helpers/utils';
// import Loading from 'components/loading';
// import handleError from 'utils/handleError';
// import { setPromotionsMenuData } from 'redux/slices/currentDataSlice';
const { Text, Title, Paragraph } = Typography;

const inputStyle = {
  borderRadius: '10px',
  width: '100%'
};
function TransactionPromotionsSearch() {
  // const dispatch = useDispatch();
  // const _isMounted = useRef(false);
  // let { routeKey } = useParams();
  // const [loadingSchema, setLoadingSchema] = useState(true);
  // const [layoutData, setLayoutData] = useState(null);
  // const initPageModule = async () => {
  //   try {
  // default part
  // _isMounted.current && setLoadingSchema(true);
  // const ep =
  // endpoint.getTransactionPromotionsDataManagerSchemaEndpoint('settings');
  // const moduleSchemaRes = await Axios.get(ep);
  // let schema = moduleSchemaRes.data;
  // console.log('menuSchema:->', schema);
  // let layoutSchema = schema.layout;
  // console.log(schema.menu, ' schema.menu schema.menu schema.menu');
  // dispatch(
  //   setPromotionsMenuData({ currentPromotionsMenuSchema: schema.menu })
  // ); // store current Promotions menu
  // _isMounted.current && setLayoutData(layoutSchema);
  // // end default part
  //   } catch (error) {
  //     handleError(error, true);
  //   } finally {
  //     // _isMounted.current && setLoadingSchema(false);
  //   }
  // };

  // useEffect(() => {
  //   _isMounted.current = true;
  //   initPageModule();
  //   return () => {
  //     _isMounted.current = false;
  //   };
  // }, []);
  // const onChange = value => {
  //   console.log('changed', value);
  // };

  // if (loadingSchema) {
  //   return <Loading style={{ marginTop: 150 }} msg="Loading Schema..." />;
  // }
  // if (!layoutData) return getErrorAlert({ onRetry: initPageModule });

  return (
    <>
      <Row className="mx-4">
        <Col span={22}>
          <Paragraph strong className="text-label">
            Each time your members transact and the data is entered into the
            transactions table the transaction engine works out how many points
            they should get and awards the points automatically.
          </Paragraph>
        </Col>
      </Row>
      <Row className="mx-4 pt-6">
        <Col>
          <Title level={4}>Basic Transactional Promotion Setup</Title>
        </Col>
      </Row>
      <Row className="mx-4 mt-5" align="middle">
        <Col span={22}>
          <Row gutter={[16, 16]} align="middle">
            <Col span={5}>
              <Text strong className="text-label">
                Percent of spend
              </Text>
            </Col>
            <Col span={4}>
              <InputNumber style={inputStyle} />
            </Col>

            <Col span={7} style={{ textAlign: 'center' }}>
              <Text strong className="text-label">
                pts per 1.00 spent
              </Text>
            </Col>

            <Col span={7}>
              <Button
                style={{ float: 'right' }}
                className="rounded-pill py-2 px-4"
                variant="outline-primary"
                // onClick={() => updateSetting()}
              >
                Update
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mx-4 pt-6">
        <Col>
          <Title level={4}>Max. points to award per transaction</Title>
        </Col>
      </Row>
      <Row className="mx-4 mt-5" align="middle">
        <Col span={22}>
          <Row gutter={[16, 16]} align="middle">
            <Col span={12}>
              <Text strong className="text-label">
                For any single transaction - set the max. points to Leave blank
                for no maximum
              </Text>
            </Col>
            <Col span={4}>
              <InputNumber style={inputStyle} />
            </Col>
            <Col span={7}>
              <Button
                style={{ float: 'right' }}
                className="rounded-pill py-2 px-4"
                variant="outline-primary"
                // onClick={() => updateSetting()}
              >
                Update
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
export default TransactionPromotionsSearch;
