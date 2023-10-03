import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
// import { Row, Col, InputNumber, Typography, Tooltip } from 'antd';
// import { Button } from 'react-bootstrap';
// import { QuestionCircleOutlined } from '@ant-design/icons';
// import { useParams } from 'react-router-dom';
import endpoint from '../../utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { setMemberMenuData } from 'redux/slices/currentDataSlice';
import TabGroups from './TabGroups';
// const { Text } = Typography;
// const settingStyle = {
//   marginTop: '82px',
//   fontFamilly: 'Inter',
//   fontSize: '16px',
//   fontStyle: 'normal',
//   fontWeight: '400',
//   color: '#000000',
//   letterSpacing: '-0.019em'
// };
function SettingsGroups() {
  const dispatch = useDispatch();
  const _isMounted = useRef(false);
  // let { routeKey } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const [groups, setGroups] = useState([]);
  const initPageModule = async () => {
    try {
      // default part
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getDataManagerGroupSchemaEndpoint('settings');
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      dispatch(setMemberMenuData({ currentMemberMenuSchema: schema.menu })); // store current member menu
      const groupsList = await Axios.get(
        endpoint.getModuleDataEndpoint('bb_loyal2_groups')
      );
      setGroups(groupsList.data.list);
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

  // // const [prefix_num, setPrefix_num] = useState(1);
  // // const [start_num, setStart_num] = useState(0);
  // const updateSetting = () => {
  //   console.log('updated');
  // };

  if (loadingSchema) {
    return <Loading style={{ marginTop: 150 }} msg="Loading Schema..." />;
  }
  if (!layoutData) return getErrorAlert({ onRetry: initPageModule });

  return (
    <>
      {/* <Row style={settingStyle}>
        <Col span={5} style={{ textAlign: 'end' }}>
          <Text strong className="py-1" style={{ color: '#444444' }}>
            Membership Number Prefix
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

        <Col span={6} style={{ textAlign: 'end' }}>
          <Text strong className="py-1" style={{ color: '#444444' }}>
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
        <Col span={12}></Col>
        <Col span={7} style={{ textAlign: 'end' }}>
          <Button
            variant="outline-primary"
            className="rounded-pill me-1 mb-1"
            style={{ padding: '8px 20px' }}
            onClick={() => updateSetting()}
          >
            Update settings
          </Button>
        </Col>
      </Row> */}
      <TabGroups groups={groups} />
    </>
  );
}
export default SettingsGroups;
