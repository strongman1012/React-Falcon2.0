import { React, useState } from 'react';
import { Row, Col, Typography, Tooltip, Input, Upload, Radio } from 'antd';
import { UpOutlined } from '@ant-design/icons';
import { Card, Modal, Button, Collapse, Form } from 'react-bootstrap';
import {
  QuestionCircleOutlined,
  VerticalAlignBottomOutlined
} from '@ant-design/icons';
import {} from 'antd';

const { Text, Title, Paragraph } = Typography;
function PromoteLoyalty() {
  const [modalShow, setModalShow] = useState(false);
  const modalStyle = {
    height: '700px',
    border: 'gray 2px solid'
  };
  const [open, setOpen] = useState(false);
  const ToolTip = {
    background: 'rgb(53, 157, 217)',
    borderRadius: '50px',
    color: 'white',
    scale: '1.5'
    // marginLeft: '39em'
  };
  const cardStyle_1 = {
    backgroundColor: '#F8F8F8',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
  };
  const cardStyleCollapse = {
    width: '100%'
  };
  return (
    <>
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row className="mx-4 mt-3">
            <Col span={20}>
              <Title level={3} className="mb-5">
                Promote your loyalty program
              </Title>
            </Col>
          </Row>
          <Row className="mx-4 mt-4">
            <Col span={20}>
              <Row>
                <Col>
                  <Title level={4} className="mb-4">
                    Printable Promotion Material
                  </Title>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Paragraph>
                    Printable templates for your loyalty program promotion. Each
                    of these templates takes your program name and logo from
                    your account.
                  </Paragraph>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col
                  span={12}
                  align="center"
                  style={{
                    borderRight: '0.3px solid #ABABAB',
                    borderTop: '0.3px solid #ABABAB'
                  }}
                >
                  <Row style={{ float: 'right' }} className="mt-3">
                    <Col>
                      <VerticalAlignBottomOutlined className="mx-4" />
                    </Col>
                  </Row>

                  <Row align="center" className="mt-5">
                    <Col>
                      <Text strong className="text-label">
                        A4 sheet of 3x sign-up forms
                      </Text>
                    </Col>
                  </Row>
                  <Row align="center" className="mt-4">
                    <Card className="overflow-hidden z-index-1 card-main_layout">
                      <Card.Body className="p-0" style={cardStyle_1}>
                        <Row gutter={[8, 8]}>
                          <Col>
                            <img
                              src="/img/item1.png"
                              onClick={() => setModalShow(true)}
                            />
                          </Col>
                          <Col>
                            <img
                              src="/img/item1.png"
                              onClick={() => setModalShow(true)}
                            />
                          </Col>
                          <Col>
                            <img
                              src="/img/item1.png"
                              onClick={() => setModalShow(true)}
                            />
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Row>
                </Col>
                <Col
                  span={12}
                  align="center"
                  style={{ borderTop: '0.3px solid #ABABAB' }}
                >
                  <Row style={{ float: 'right' }} className="mt-3">
                    <Col>
                      <VerticalAlignBottomOutlined className="mx-4" />
                    </Col>
                  </Row>

                  <Row align="center" className="mt-5">
                    <Col>
                      <Text strong className="text-label">
                        A4 sheet of 9x promotion cards
                      </Text>
                    </Col>
                  </Row>
                  <Row align="center" className="mt-4">
                    <Card className="overflow-hidden z-index-1 card-main_layout">
                      <Card.Body className="p-0" style={cardStyle_1}>
                        <Row gutter={[5, 5]}>
                          <Col>
                            <img
                              src="/img/item2.png"
                              onClick={() => setModalShow(true)}
                            />
                          </Col>
                          <Col>
                            <img
                              src="/img/item2.png"
                              onClick={() => setModalShow(true)}
                            />
                          </Col>
                          <Col>
                            <img
                              src="/img/item2.png"
                              onClick={() => setModalShow(true)}
                            />
                          </Col>
                        </Row>
                        <Row gutter={[5, 5]} className="mt-1">
                          <Col>
                            <img
                              src="/img/item2.png"
                              onClick={() => setModalShow(true)}
                            />
                          </Col>
                          <Col>
                            <img
                              src="/img/item2.png"
                              onClick={() => setModalShow(true)}
                            />
                          </Col>
                          <Col>
                            <img
                              src="/img/item2.png"
                              onClick={() => setModalShow(true)}
                            />
                          </Col>
                        </Row>
                        <Row gutter={[5, 5]} className="mt-1">
                          <Col>
                            <img
                              src="/img/item2.png"
                              onClick={() => setModalShow(true)}
                            />
                          </Col>
                          <Col>
                            <img
                              src="/img/item2.png"
                              onClick={() => setModalShow(true)}
                            />
                          </Col>
                          <Col>
                            <img
                              src="/img/item2.png"
                              onClick={() => setModalShow(true)}
                            />
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col
                  span={12}
                  style={{ height: '80px', borderRight: '0.3px solid #ABABAB' }}
                ></Col>
              </Row>
              <Row>
                <Col
                  span={12}
                  align="center"
                  style={{
                    borderRight: '0.3px solid #ABABAB',
                    borderTop: '0.3px solid #ABABAB'
                  }}
                >
                  <Row style={{ float: 'right' }} className="mt-3">
                    <Col>
                      <VerticalAlignBottomOutlined className="mx-4" />
                    </Col>
                  </Row>

                  <Row align="center" className="mt-6">
                    <Col>
                      <Text strong className="text-label">
                        A4 sheet of 2x web promotion mini-posters
                      </Text>
                    </Col>
                  </Row>
                  <Row align="center" className="mt-4">
                    <Card className="overflow-hidden z-index-1 card-main_layout">
                      <Card.Body className="p-0" style={cardStyle_1}>
                        <Row gutter={[8, 8]}>
                          <Col>
                            <img
                              src="/img/item3.png"
                              onClick={() => setModalShow(true)}
                            />
                          </Col>
                          <Col>
                            <img
                              src="/img/item3.png"
                              onClick={() => setModalShow(true)}
                            />
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Row>
                </Col>
                <Col
                  span={12}
                  align="center"
                  style={{ borderTop: '0.3px solid #ABABAB' }}
                >
                  <Row style={{ float: 'right' }} className="mt-3">
                    <Col>
                      <VerticalAlignBottomOutlined className="mx-4" />
                    </Col>
                  </Row>

                  <Row align="center" className="mt-6">
                    <Col>
                      <Text strong className="text-label">
                        A4 sheet/s of personalised membership cards
                      </Text>
                    </Col>
                  </Row>
                  <Row align="center" className="mt-4">
                    <Card className="overflow-hidden z-index-1 card-main_layout">
                      <Card.Body className="p-0" style={cardStyle_1}>
                        <Row gutter={[5, 5]}>
                          <Col>
                            <img
                              src="/img/item2.png"
                              onClick={() => setModalShow(true)}
                            />
                          </Col>
                          <Col>
                            <img
                              src="/img/item2.png"
                              onClick={() => setModalShow(true)}
                            />
                          </Col>
                          <Col>
                            <img
                              src="/img/item2.png"
                              onClick={() => setModalShow(true)}
                            />
                          </Col>
                        </Row>
                        <Row gutter={[5, 5]} className="mt-1">
                          <Col>
                            <img
                              src="/img/item2.png"
                              onClick={() => setModalShow(true)}
                            />
                          </Col>
                          <Col>
                            <img
                              src="/img/item2.png"
                              onClick={() => setModalShow(true)}
                            />
                          </Col>
                          <Col>
                            <img
                              src="/img/item2.png"
                              onClick={() => setModalShow(true)}
                            />
                          </Col>
                        </Row>
                        <Row gutter={[5, 5]} className="mt-1">
                          <Col>
                            <img
                              src="/img/item2.png"
                              onClick={() => setModalShow(true)}
                            />
                          </Col>
                          <Col>
                            <img
                              src="/img/item2.png"
                              onClick={() => setModalShow(true)}
                            />
                          </Col>
                          <Col>
                            <img
                              src="/img/item2.png"
                              onClick={() => setModalShow(true)}
                            />
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col
                  span={12}
                  style={{ height: '50px', borderRight: '0.3px solid #ABABAB' }}
                >
                  <Form.Select
                    style={{
                      borderRadius: '10px',
                      width: '150px',
                      textAlign: 'center',
                      margin: 'auto',
                      marginTop: '30px'
                    }}
                  >
                    <option>12345</option>
                    <option>12345</option>
                    <option>12345</option>
                    <option>12345</option>
                    <option>12345</option>
                  </Form.Select>
                </Col>
              </Row>
              <Row>
                <Col
                  span={12}
                  style={{ borderRight: '0.3px solid #ABABAB' }}
                ></Col>
                <Col span={12}>
                  <Card className="overflow-hidden z-index-1 card-main_layout">
                    <Card.Body className="p-0" style={cardStyleCollapse}>
                      <Col span={24}>
                        <Text
                          strong
                          onClick={() => setOpen(!open)}
                          aria-controls="example-collapse-text"
                          aria-expanded={open}
                          variant="falcon-primary"
                          className="myb-3 text-label"
                          style={{ cursor: 'pointer' }}
                        >
                          Show settings
                          <UpOutlined
                            style={{ marginLeft: '10px' }}
                            rotate={open ? 0 : 180}
                          />
                        </Text>

                        <Collapse in={open}>
                          <Row className="mt-5">
                            <Col span={24}>
                              <Row align="middle">
                                <Col span={12}>
                                  <Text className="text-label" strong>
                                    QR/barcode type
                                  </Text>
                                </Col>
                                <Col span={12}>
                                  <Form.Select
                                    style={{
                                      borderRadius: '10px',
                                      width: '100%'
                                    }}
                                  >
                                    <option>12345</option>
                                    <option>12345</option>
                                    <option>12345</option>
                                    <option>12345</option>
                                  </Form.Select>
                                </Col>
                              </Row>
                              <Row className="mt-3" align="middle">
                                <Col span={12}>
                                  <Text strong className="text-label">
                                    2D barcode prefix
                                  </Text>
                                </Col>
                                <Col span={12}>
                                  <Input style={{ borderRadius: '10px' }} />
                                </Col>
                              </Row>
                              <Row className="mt-3" align="middle">
                                <Col span={20}>
                                  <Text className="text-label" strong>
                                    Print a card of specific member
                                  </Text>
                                </Col>
                                <Col span={4}>
                                  <Tooltip
                                    title="Import data from CSV/Excel file"
                                    placement="right"
                                  >
                                    <QuestionCircleOutlined
                                      style={ToolTip}
                                    ></QuestionCircleOutlined>
                                  </Tooltip>
                                </Col>
                              </Row>
                              <Row className="mt-3">
                                <Col span={24}>
                                  <Input style={{ borderRadius: '10px' }} />
                                </Col>
                              </Row>
                              <Row className="mt-3">
                                <Col span={24}>
                                  <Text strong className="text-label">
                                    or for a range of members with codes between
                                  </Text>
                                </Col>
                              </Row>
                              <Row className="mt-3" align="middle">
                                <Col span={10}>
                                  <Input style={{ borderRadius: '10px' }} />
                                </Col>
                                <Col span={4} style={{ textAlign: 'center' }}>
                                  <Text strong className="text-label">
                                    and
                                  </Text>
                                </Col>
                                <Col span={10}>
                                  <Input
                                    style={{ borderRadius: '10px' }}
                                    className="text-label"
                                  />
                                </Col>
                              </Row>
                              <Row className="mt-3" align="middle">
                                <Col
                                // xs={12}
                                // sm={12}
                                // md={11}
                                // lg={11}
                                // xl={11}
                                // xxl={11}
                                >
                                  <Text strong className="text-label">
                                    Print all member cards
                                  </Text>
                                </Col>
                                <Col
                                  xs={12}
                                  sm={12}
                                  md={2}
                                  lg={2}
                                  xl={2}
                                  xxl={2}
                                  style={{ textAlign: 'center' }}
                                >
                                  <Radio></Radio>
                                </Col>
                                <Col
                                  xs={12}
                                  sm={12}
                                  md={11}
                                  lg={11}
                                  xl={10}
                                  xxl={15}
                                  style={{ textAlign: 'end' }}
                                >
                                  <Upload
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    listType="picture"
                                  >
                                    <Button
                                      bv
                                      className="rounded-pill px-4 py-2"
                                      lavel="Get sample CSV"
                                      variant="outline-primary"
                                      // style={{ textAlign: 'end', float: 'right' }}
                                    >
                                      Get CSV
                                    </Button>
                                  </Upload>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Collapse>
                      </Col>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="p-1">
          <Row style={modalStyle}>
            <Col>
              <Row>
                <Col align="center">
                  <h3>Please upload a logo or enter a brand name</h3>
                </Col>
              </Row>
              <Row align="center" className="mt-10">
                <Col>
                  <h3>Max dfdfdf</h3>
                </Col>
              </Row>
              <Row align="center" className="mt-3">
                <Col>
                  <h3>M00001</h3>
                </Col>
              </Row>
              <Row align="center" className="mt-3">
                <Col>
                  <Text strong className="text-label">
                    63bff7ca241de.loyal2.com
                  </Text>
                </Col>
              </Row>
              <Row align="center" className="mt-5">
                <Col>
                  <img src="/img/item4.png" />
                </Col>
              </Row>
              <Row align="center" className="mt-1">
                <Col>
                  <Text strong className="text-label">
                    QR ckit
                  </Text>
                </Col>
              </Row>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}
export default PromoteLoyalty;
