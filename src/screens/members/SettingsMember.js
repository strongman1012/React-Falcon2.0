import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col, InputNumber, Tooltip, Typography } from 'antd';
import { Button } from 'react-bootstrap';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import endpoint from '../../utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { setMemberMenuData } from 'redux/slices/currentDataSlice';
const { Text } = Typography;
function SettingsMember() {
  const dispatch = useDispatch();
  const _isMounted = useRef(false);
  let { routeKey } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const initPageModule = async () => {
    try {
      // default part
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getDataManagerSchemaEndpoint(
        routeKey.replace('/', '')
      );
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
  const onChange = value => {
    console.log('changed', value);
  };

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
      <Row className="mx-4 mt-5" align="middle">
        <Col span={6}>
          <Text className="text-label" strong>
            {' '}
            Membership Number Prefix
          </Text>
        </Col>

        <Col span={4}>
          <InputNumber
            min={0}
            defaultValue={0}
            onChange={onChange}
            style={{ borderRadius: '10px', marginRight: '10px' }}
          />
          <Tooltip
            placement="right"
            color="#359dd9"
            title=" Membership Number Prefix"
          >
            <QuestionCircleOutlined
              style={{
                backgroundColor: '#359DD9',
                borderRadius: '50%',
                border: 'none',
                color: 'white',
                fontSize: '21px'
              }}
            />
          </Tooltip>
        </Col>

        <Col span={8} style={{ textAlign: 'end' }}>
          <Text className="text-label" strong>
            Membership Number Starting Point
          </Text>
        </Col>
        <Col span={4} style={{ textAlign: 'end' }}>
          <InputNumber
            min={0}
            defaultValue={0}
            onChange={onChange}
            style={{ borderRadius: '10px', marginRight: '10px' }}
          />
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
                fontSize: '21px'
              }}
            />
          </Tooltip>
        </Col>
      </Row>
      <br />
      <br />
      <br />
      <Row>
        <Col span={15}></Col>
        <Col span={7} style={{ textAlign: 'end' }}>
          <Button
            variant="outline-primary"
            className="rounded-pill py-2 px-4"
            onClick={() => updateSetting()}
          >
            Update settings
          </Button>
        </Col>
      </Row>
    </>
  );
}
export default SettingsMember;
