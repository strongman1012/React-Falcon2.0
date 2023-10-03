import React from 'react';
// import Axios from 'axios';
import { useState } from 'react';
import { Typography, Row, Col } from 'antd';
// import { QuestionCircleOutlined } from '@ant-design/icons';
import { ProgressBar, Card, Button } from 'react-bootstrap';
import { FaStamp, FaKey, FaPaintBrush } from 'react-icons/fa';
import { AiOutlineGlobal } from 'react-icons/ai';
import { HiOutlineNewspaper } from 'react-icons/hi';
import { BiNotepad } from 'react-icons/bi';
import FirstSite from './microSite/FirstSite';
import SecondSite from './microSite/SecondSite';
import ThirdSite from './microSite/ThirdSite';
import ForthSite from './microSite/ForthSite';
import FifthSite from './microSite/FifthSite';
import SixthSite from './microSite/SixthSite';
import { LeftOutlined } from '@ant-design/icons';
const { Title } = Typography;

const cardStyle = {
  // backgroundColor: '#F8F8F8',
  borderRadius: '10px',
  border: '0 solid white',
  boxShadow: '0px 0px 0px 0px rgba(0, 0, 0, 1)'
};

const active_btn_style = {
  color: '#27bcfd',
  borderColor: '#27bcfd',
  backgroundColor: '#ffffff',
  borderRadius: '50%',
  width: '50px',
  height: '50px'
};
const inactive_btn_style = {
  color: '#979696',
  borderColor: '#979696',
  backgroundColor: '#ffffff',
  borderRadius: '50%',
  width: '50px',
  height: '50px'
};

function MicroSite() {
  const [step, setStep] = useState(0);
  const index1 = 1;
  const index2 = 2;
  const index3 = 3;
  const index4 = 4;
  const index5 = 5;

  return (
    <>
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row className="mt-3 mb-5" justify="center">
            <Col
              xs={23}
              sm={23}
              md={23}
              lg={23}
              xl={23}
              xxl={23}
              className={{ textAlign: 'center' }}
            >
              <Row className="mx-4">
                <Title level={3}>Set up your micro-site</Title>
              </Row>
              <Card className="mt-3" style={cardStyle}>
                <Card.Header className="mt-4" style={{ zIndex: 100 }}>
                  <Row>
                    <Col span={4} style={{ textAlign: 'center' }}>
                      <Button
                        style={active_btn_style}
                        onClick={() => setStep(0)}
                      >
                        <AiOutlineGlobal
                          style={{ scale: '2', marginBottom: '2px' }}
                        />
                      </Button>
                    </Col>
                    <Col span={4} style={{ textAlign: 'center' }}>
                      <Button
                        style={
                          index1 <= step ? active_btn_style : inactive_btn_style
                        }
                        onClick={() => setStep(1)}
                      >
                        <FaPaintBrush
                          style={{ scale: '2', marginBottom: '2px' }}
                        />
                      </Button>
                    </Col>
                    <Col span={4} style={{ textAlign: 'center' }}>
                      <Button
                        style={
                          index2 <= step ? active_btn_style : inactive_btn_style
                        }
                        onClick={() => setStep(2)}
                      >
                        <FaStamp
                          style={{ scale: '2', marginBottom: '2.6px' }}
                        />
                      </Button>
                    </Col>
                    <Col span={4} style={{ textAlign: 'center' }}>
                      <Button
                        style={
                          index3 <= step ? active_btn_style : inactive_btn_style
                        }
                        onClick={() => setStep(3)}
                      >
                        {' '}
                        <FaKey
                          style={{
                            scale: '2',
                            marginBottom: '2px',
                            marginLeft: '0.5px'
                          }}
                        />
                      </Button>
                    </Col>
                    <Col span={4} style={{ textAlign: 'center' }}>
                      <Button
                        style={
                          index4 <= step ? active_btn_style : inactive_btn_style
                        }
                        onClick={() => setStep(4)}
                      >
                        <HiOutlineNewspaper
                          style={{
                            scale: '2.5',
                            marginBottom: '1.5px',
                            marginLeft: '0.5px'
                          }}
                        />
                      </Button>
                    </Col>
                    <Col span={4} style={{ textAlign: 'center' }}>
                      <Button
                        style={
                          index5 <= step ? active_btn_style : inactive_btn_style
                        }
                        onClick={() => setStep(5)}
                      >
                        <BiNotepad
                          style={{ scale: '2.5', marginBottom: '3.3px' }}
                        />
                      </Button>
                    </Col>
                  </Row>
                </Card.Header>
                <Row justify="center">
                  <Col span={20}>
                    <ProgressBar
                      variant="info"
                      now={step * 20}
                      style={{ marginTop: '-42px', zIndex: -1, height: 3 }}
                    />
                  </Col>
                </Row>

                <Card.Body>
                  {step === 0 ? (
                    <FirstSite />
                  ) : step === 1 ? (
                    <SecondSite />
                  ) : step === 2 ? (
                    <ThirdSite />
                  ) : step === 3 ? (
                    <ForthSite />
                  ) : step === 4 ? (
                    <FifthSite />
                  ) : (
                    <SixthSite />
                  )}
                </Card.Body>
                <Card.Footer className="mt-5 mb-3">
                  <Row className="mx-4" justify="center">
                    <Col span={24}>
                      <Row align="middle">
                        <Col span={12}>
                          <Button
                            variant="link"
                            hidden={step === 0 ? true : false}
                            onClick={() => setStep(step - 1)}
                          >
                            <LeftOutlined />
                            Previous
                          </Button>
                        </Col>
                        <Col span={12} style={{ textAlign: 'end' }}>
                          <Button
                            variant="outline-primary"
                            className="rounded-pill px-4 py-2"
                            onClick={() => setStep(step + 1)}
                            hidden={step === 5 ? true : false}
                          >
                            Next
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
export default MicroSite;
