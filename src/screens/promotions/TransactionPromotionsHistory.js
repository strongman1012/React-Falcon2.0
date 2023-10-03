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
import { setTransactionPromotionsMenuData } from 'redux/slices/currentDataSlice';

function TransactionPromotionsHistory() {
  const { Title } = Typography;
  const chat_hidden = {
    position: 'absolute',
    width: '130px',
    height: '27px',
    top: '150px',
    marginLeft: '50%',
    transform: 'translate(-30px, 0)',
    backgroundColor: 'white',
    zIndex: '1'
  };
  const dispatch = useDispatch();
  const _isMounted = useRef(false);
  // let { routeKey } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  let [labels, setLables] = useState([]);
  let [data_transaction_promotions, setData_transaction_promotions] = useState(
    []
  );
  const initPageModule = async () => {
    try {
      let getlabels = [];
      let getdata_transaction_promotions = [];
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getPromotionsDataManagerSchemaEndpoint('');
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      dispatch(
        setTransactionPromotionsMenuData({
          currentTransactionPromotionsMenuSchema: schema.menu
        })
      ); // store current transactionpromotions menu

      for (let i = Object.values(layoutSchema.data).length; i > 0; i--) {
        getlabels.push(Object.values(layoutSchema.data)[i - 1].title);
        getdata_transaction_promotions.push(
          Object.values(layoutSchema.data)[i - 1].value
        );
      }
      setLables(getlabels);
      setData_transaction_promotions(getdata_transaction_promotions);
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
        data: data_transaction_promotions,
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
      <Row>
        <Col offset={2}>
          <Title level={4} style={{ color: '#444444' }}>
            Promotions Awarded Per Month
          </Title>
        </Col>
      </Row>

      <Row>
        <Col offset={2} xs={22} sm={22} md={22} lg={22} xl={22} xxl={22}>
          <Card style={{ width: '100%', position: 'relative' }}>
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
export default TransactionPromotionsHistory;
