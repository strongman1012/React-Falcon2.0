import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { Typography, Row, Col } from 'antd';
import { getColor, rgbaColor } from 'helpers/utils';
import { chartJsDefaultTooltip } from 'helpers/chartjs-utils';
import { Line } from 'react-chartjs-2';
import { Card } from 'react-bootstrap';
import endpoint from 'utils/endpoint';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { getErrorAlert } from 'helpers/utils';

import { setTransactionMenuData } from 'redux/slices/currentDataSlice';

const { Title } = Typography;

const chat_hidden = {
  position: 'absolute',
  width: '130px',
  height: '27px',
  top: '50px',
  marginLeft: '50%',
  transform: 'translate(-60px, 0)',
  backgroundColor: 'white',
  zIndex: '1'
};
function HistoryTransaction() {
  const dispatch = useDispatch();
  const _isMounted = useRef(false);
  // let { routeKey } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  let [labels, setLables] = useState([]);
  let [data_member, setData_member] = useState([]);
  const initPageModule = async () => {
    try {
      let getlabels = [];
      let getdata_member = [];
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getDataTransactionSchemaEndpoint('');
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      dispatch(
        setTransactionMenuData({ currentTransactionMenuSchema: schema.menu })
      ); // store current member menu

      for (let i = Object.values(layoutSchema.data).length; i > 0; i--) {
        getlabels.push(Object.values(layoutSchema.data)[i - 1].title);
        getdata_member.push(Object.values(layoutSchema.data)[i - 1].value);
      }
      setLables(getlabels);
      setData_member(getdata_member);
      _isMounted.current && setLayoutData(layoutSchema);
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

  if (loadingSchema) {
    return <Loading style={{ marginTop: 150 }} msg="Loading Schema..." />;
  }
  if (!layoutData) return getErrorAlert({ onRetry: initPageModule });

  const data = {
    labels: labels,
    datasets: [
      {
        type: 'line',
        label: '',
        borderColor: getColor('primary'),
        borderWidth: 2,
        fill: false,
        data: data_member,
        tension: 0.3
      }
    ]
  };

  const options = {
    plugins: {
      tooltip: chartJsDefaultTooltip()
    },
    scales: {
      x: {
        grid: {
          color: rgbaColor(getColor('black'), 0.1)
        }
      },
      y: {
        grid: {
          color: rgbaColor(getColor('black'), 0.1),
          drawBorder: true
        }
      }
    }
  };

  return (
    <>
      <Row className="mx-4">
        <Col span={22}>
          <Title level={4}>Sales history</Title>
        </Col>
      </Row>
      <Row className="mx-4 my-3" justify="center">
        <Col xs={22} sm={22} md={22} lg={22} xl={22} xxl={22}>
          <Card style={{ width: '100%' }}>
            <Card.Body>
              <Card.Title as="h6">Sales Total Per Month</Card.Title>
              <Line data={data} options={options} height={500} width={1618} />
            </Card.Body>
            <div className="chat_hidden" style={chat_hidden}></div>
          </Card>
        </Col>
      </Row>
    </>
  );
}
export default HistoryTransaction;
