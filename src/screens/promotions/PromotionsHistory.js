import React from 'react';
import { useDispatch } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
import Axios from 'axios';
import { Typography, Row, Col } from 'antd';
import { getErrorAlert } from 'helpers/utils';
import { getColor, rgbaColor } from 'helpers/utils';
import { chartJsDefaultTooltip } from 'helpers/chartjs-utils';
import { Line } from 'react-chartjs-2';
import { Card } from 'react-bootstrap';
import endpoint from '../../utils/endpoint';
import Loading from '../../components/loading';
import handleError from 'utils/handleError';
import { setPromotionsMenuData } from 'redux/slices/currentDataSlice';

function PromotionsHistory() {
  const { Title } = Typography;
  const chat_hidden = {
    position: 'absolute',
    width: '50%',
    height: '50px',
    right: '100px',
    backgroundColor: 'white',
    zIndex: '1'
  };
  const dispatch = useDispatch();
  const _isMounted = useRef(false);
  // let { routeKey } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  let [labels, setLables] = useState([]);
  let [data_promotions, setData_promotions] = useState([]);
  const initPageModule = async () => {
    try {
      let getlabels = [];
      let getdata_promotions = [];
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getPromotionsDataManagerSchemaEndpoint('');
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      dispatch(
        setPromotionsMenuData({ currentPromotionsMenuSchema: schema.menu })
      ); // store current promotions menu

      for (let i = Object.values(layoutSchema.data).length; i > 0; i--) {
        getlabels.push(Object.values(layoutSchema.data)[i - 1].title);
        getdata_promotions.push(Object.values(layoutSchema.data)[i - 1].value);
      }
      setLables(getlabels);
      setData_promotions(getdata_promotions);
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
        label: ' ',
        borderColor: getColor('primary'),
        borderWidth: 2,
        fill: false,
        data: data_promotions,
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
          <Title level={4}>Promotions Per Month</Title>
        </Col>
      </Row>

      <Row className="mx-4 my-3" justify="center">
        <Col xs={22} sm={22} md={22} lg={22} xl={22} xxl={22}>
          <Card style={{ width: '100%' }}>
            <Card.Body>
              <Line data={data} options={options} height={500} width={1618} />
            </Card.Body>
          </Card>
        </Col>
        <div className="chat_hidden" style={chat_hidden}></div>
      </Row>
    </>
  );
}
export default PromotionsHistory;
