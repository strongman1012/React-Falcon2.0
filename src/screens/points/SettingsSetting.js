import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col, Tooltip, Switch, Typography } from 'antd';
import { Button } from 'react-bootstrap';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import endpoint from '../../utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { setPointMenuData } from 'redux/slices/currentDataSlice';
const { Text } = Typography;

const settingStyle = {
  marginTop: '82px',
  fontFamilly: 'Inter',
  fontSize: '16px',
  fontStyle: 'normal',
  fontWeight: '400',
  color: '#000000',
  letterSpacing: '-0.019em'
};
function SettingsSetting() {
  const dispatch = useDispatch();
  const _isMounted = useRef(false);
  let { routeKey } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const initPageModule = async () => {
    try {
      // default part
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getPointDataManagerSchemaEndpoint(
        routeKey.replace('/', '')
      );
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      dispatch(setPointMenuData({ currentPointMenuSchema: schema.menu })); // store current point menu
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
  // const onChange = value => {
  //   console.log('changed', value);
  // };

  const updateSetting = () => {
    console.log('updated');
  };

  if (loadingSchema) {
    return <Loading style={{ marginTop: 150 }} msg="Loading Schema..." />;
  }
  if (!layoutData) return getErrorAlert({ onRetry: initPageModule });

  return (
    <>
      <Row className="mx-4 py-3" style={settingStyle} lg={20} xl={20} xxl={20}>
        <Col
          className=" my-2 me-3"
          xs={23}
          sm={23}
          md={10}
          lg={8}
          xl={8}
          xxl={8}
        >
          <Text strong style={{ color: '#444444' }}>
            {' '}
            For multi-branch:apply points globally{' '}
          </Text>
        </Col>
        <Col className="my-2" xs={23} sm={23} md={4} lg={4} xl={4} xxl={4}>
          <Switch
            defaultChecked
            style={{
              scale: '1.3',
              backgroundColor: '#359DD9'
            }}
          />
        </Col>
        <Col
          style={{ textAlign: 'end' }}
          xs={23}
          sm={23}
          md={6}
          lg={9}
          xl={9}
          xxl={9}
        >
          <Button
            className="rounded-pill py-2 px-4"
            variant="outline-primary"
            onClick={() => updateSetting()}
          >
            Update settings
          </Button>
        </Col>
        <Col
          xs={23}
          sm={23}
          md={2}
          lg={2}
          xl={2}
          xxl={2}
          style={{ textAlign: 'end' }}
          className="my-1"
        >
          <Tooltip
            placement="right"
            color="#359dd9"
            title="Membership Number Starting Point"
          >
            <QuestionCircleOutlined
              style={{
                backgroundColor: '#359DD9',
                borderRadius: '50%',
                border: 'none',
                color: 'white',
                fontSize: '21px',
                textAlign: 'end'
              }}
            />
          </Tooltip>
        </Col>
      </Row>
    </>
  );
}
export default SettingsSetting;
