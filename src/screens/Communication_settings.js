import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import { Typography, Row, Col, Steps } from 'antd';
import { Button, Card } from 'react-bootstrap';
import endpoint from '../utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import Communication_settings_1 from './communications/communication_settings_1';
import Communication_settings_2 from './communications/communication_settings_2';
import Communication_settings_3 from './communications/communication_settings_3';
const Step = Steps.Step;

const { Title } = Typography;
const cardStyle = {
  backgroundColor: '#F8F8F8',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
};
function Communication_settings() {
  const steps = [
    {
      title: 'First',
      content: 'First-content',
      status: 'process',
      status_va: 0
    },
    {
      title: 'Second',
      content: 'Second-content',
      status: 'process',
      status_va: 1
    },
    {
      title: 'Last',
      content: 'Last-content',
      status: 'process',
      status_va: 2
    }
  ];
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  // ///
  const _isMounted = useRef(false);
  const [loadingSchema, setLoadingSchema] = useState(true);
  // const [layoutData, setLayoutData] = useState(null);
  const [branches, setBranches] = useState([]);
  const [groups, setGroups] = useState([]);

  const initPageModule = async () => {
    try {
      // default part
      _isMounted.current && setLoadingSchema(true);

      const branchesList = await Axios.get(
        endpoint.getModuleDataEndpoint('bb_loyal2_branches')
      );
      setBranches(branchesList.data.list);
      const groupList = await Axios.get(
        endpoint.getModuleDataEndpoint('bb_loyal2_groups')
      );
      setGroups(groupList.data.list);
      // end default part
    } catch (error) {
      // handleError(error, true);
      getErrorAlert({ onRetry: initPageModule });
    } finally {
      console.log('finally');
      _isMounted.current && setLoadingSchema(false);
    }
  };
  useEffect(() => {
    _isMounted.current = true;
    if (current == 0) initPageModule();
    return () => {
      _isMounted.current = false;
    };
  }, []);

  ///
  // const prev = () => {
  //   setCurrent(current - 1);
  // };
  const onChange = value => {
    console.log('onChange:', value);
    setCurrent(value);
  };

  if (loadingSchema) {
    return <Loading style={{ marginTop: 150 }} msg="Loading Schema..." />;
  }
  return (
    <>
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row className="mt-4 mx-4">
            <Col>
              <Title level={3}>Communicate with your members</Title>
            </Col>
          </Row>
          <Card className="overflow-hidden z-index-1 card-main_layout p-0">
            <Card.Header style={cardStyle} className="pt-5 pb-5">
              <Row justify="center">
                <Col span={19}>
                  <Steps current={current} onChange={onChange}>
                    {steps.map(item => (
                      <Step
                        key={item.title}
                        status={item.status_va <= current ? 'process' : 'wait'}
                        className={
                          item.status_va < current
                            ? 'ant-steps-item-finish'
                            : ''
                        }
                      />
                    ))}
                  </Steps>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="p-0">
              <Row className="mx-4 mt-5">
                <Col span={24}>
                  {(current == 0 && (
                    <Communication_settings_1
                      groups={groups}
                      branches={branches}
                    />
                  )) ||
                    (current == 1 && <Communication_settings_2 />) ||
                    (current == 2 && <Communication_settings_3 />)}
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer style={cardStyle} className="pt-5 pb-5">
              <Row className="mx-4">
                <Col span={12}>
                  {current == 0 && (
                    <Button
                      variant="outline-primary"
                      className="rounded-pill px-4 py-2"
                    >
                      Clear
                    </Button>
                  )}
                </Col>
                <Col span={12}>
                  {/* {current < steps.length - 1 && ( */}
                  <Button
                    className="btn-active-command rounded-pill px-4 py-2"
                    onClick={() => next()}
                    style={{ float: 'right' }}
                  >
                    &nbsp;&nbsp; Next &nbsp;&nbsp;
                  </Button>
                  {/* )} */}
                </Col>
              </Row>
            </Card.Footer>
          </Card>
          {/* {current === steps.length - 1 && (
              <Button
                type="primary"
                onClick={() => message.success('Processing complete!')}
              >
                Done
              </Button>
            )} */}
          {/* {current > 0 && (
              <Button style={{ marginLeft: 8 }} onClick={() => prev()}>
                Previous
              </Button>
            )} */}
        </Card.Body>
      </Card>
    </>
  );
}
export default Communication_settings;
