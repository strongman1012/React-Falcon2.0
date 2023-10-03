import React from 'react';
import {
  Typography,
  Row,
  Col,
  Tooltip,
  Upload,
  InputNumber,
  Input,
  message
} from 'antd';
import { Button, Card, Carousel } from 'react-bootstrap';
import { QuestionCircleOutlined } from '@ant-design/icons';
// import { AiOutlineCoffee } from 'react-icons/ai';
import { ImPhone, ImHome, ImCart } from 'react-icons/im';
import VoucherList from 'components/custom/VoucherList';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
// import { useDispatch } from 'react-redux';
import endpoint from 'utils/endpoint';
// import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
const { Title, Text } = Typography;
const cardStyle = {
  // backgroundColor: '#F8F8F8',
  borderRadius: '10px',
  border: '0 solid white',
  boxShadow: '0px 0px 0px 0px rgba(0, 0, 0, 1)'
};
const inputStyle = {
  width: '100%',
  borderRadius: '10px'
};
const getBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
const base64 =
  'iVBORw0KGgoAAAANSUhEUgAAADcAAAA5CAYAAACS0bM2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALDSURBVGhD7Zg9ixUxFIb9MTZWCxZWgo2NhYWNhYKCNoqCVhaClaKwnSJY+sG2q2grYuuqtbv2d+29/oDR53ojx/Bm7uQkV8ySFx7uZeYkmXdyciYzhw4f2RgOKt1cq3RzrdLNtUo31yrdXKuszdyVazeG7Zevhw87n4Yvu3tDEP85xjliVNtaVDV34uSpxUV/n8+XVlaLWNocPXZc9llCNXMPHz/JMhWLtvSh+vZSbI47btOuVPRVaxaLzJ0+c7ZotlKiT/pWY+bgNsfdXYexIPounUGXOZWKu3tfh+1Xb4bZ/rflkemiDW13Pn5eHvktxlDjT8Vl7tGvhR/r1u07f87z35rkoi3z+Y/FcX5tu6vXby6OWzFWOJ9LtjnKvUrH8xcv/xXH7I6tG/qJ0474WCXpmW2O9FGKzXnAsBJjqvhVZJtLFRGbXl5UWiLGVPGryDKXGpy1U1rZgD5SBYmxVZsxssylUrLGrAXoS+nZiy0ZP0aWubhUB9WYNYsSY6vYMbLMqW0WKaliS1A30fPMyzKnNJvty9gSUhmiYsfIMhcevrFUbAncsFieDOlrLvAvqmXqceN5kGeZU3tKxGcDFe+BvpQ8e8wsc2yxUrr3YFO2ySH1jEOe7V2WOdZWqqigks8EtE3JuwPKMgc2NfnPGuFdLohK9/T51nDuwiXZ3kLM3fubsjpaedd0tjkI+z82tLymcFetwSCOqfbw9t37ZdS4GEu1n4LLnF0bGORVBeKUHdvsqnc3pZJK7DIHdqZCmWYGSVWYclGrNDbzU3Cbi1PR87VqTPTtKSIWtzmIDfLlmKoXUG0sKdUwBkXmIDZopeItSrWMQbG5AGssfotWcRYr2pYUD0U1cwGKCVVzyi4+xNGm1mxZqpsDLpRHgzpnUZ/3arIWc/8L3VyrdHOt0s21SjfXKt1cq3RzrXKAzW0MPwGjBV0KV+vM+QAAAABJRU5ErkJggg==';

function ThirdSite() {
  // const []
  const [
    stamp_voucherISbb_loyal2_vouchersID,
    set_voucherISbb_loyal2_vouchersID
  ] = useState(null);
  const [voucherList, setVoucherList] = useState([]);
  const [filterVoucherStr, setFilterVoucherStr] = useState('');
  const [points_per_stampNUM, set_points_per_stampNUM] = useState(0);
  const [stamps_per_gridNUM, set_stamps_per_gridNUM] = useState(0);
  const [free_stamps_per_gridNUM, set_free_stamps_per_gridNUM] = useState(0);
  const [stampList, set_stampList] = useState([]);
  const [stamp_imageISfile, set_stamp_imageISfile] = useState({});

  const _isMounted = useRef(false);
  const [loadingSchema, setLoadingSchema] = useState(true);

  const initPageModule = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      const session_obj = JSON.parse(localStorage.getItem('session_obj'));
      const _id = session_obj._id;
      const get_data = await Axios.get(endpoint.appUsers(`/app/users/${_id}`));
      const user_data = get_data.data.user_data[0];
      set_stampList([
        {
          uid: '-1',
          status: 'done',
          url: 'https://newloyal2.phpbucket.net/' + user_data.stamp_imageISfile
        }
      ]);
      set_stamp_imageISfile({
        name: 'stamp.png',
        size: 800,
        type: 'image/png',
        data: base64
      });
      set_points_per_stampNUM(user_data.points_per_stampNUM);
      set_stamps_per_gridNUM(user_data.stamps_per_gridNUM);
      set_free_stamps_per_gridNUM(user_data.free_stamps_per_gridNUM);
      const vouchersList = await Axios.get(
        endpoint.getDataAllVoucherSchemaEndpoint('list')
      );
      setVoucherList(vouchersList.data.layout.data);
      let value = user_data.stamp_voucherISbb_loyal2_vouchersID;
      let index = vouchersList.data.layout.data.findIndex(val => {
        return value == val._id;
      });
      if (index === -1) value = '';
      else value = vouchersList.data.layout.data[index].name;
      setFilterVoucherStr(value);
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
  // if (!layoutData) return getErrorAlert({ onRetry: initPageModule });

  const handleChange = async info => {
    let data = {};
    if (info.file.originFileObj) {
      const base64_img = await getBase64(info.file.originFileObj);
      const base64_array = base64_img.split(',');
      data = {
        name: info.file.name,
        type: info.file.type,
        size: info.file.size,
        data: base64_array[1]
      };
    }
    set_stamp_imageISfile(data);
    set_stampList(info.fileList);
  };
  const onSubmit = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      const session_obj = JSON.parse(localStorage.getItem('session_obj'));
      const _id = session_obj._id;
      const first_name = session_obj.first_name;
      const last_name = session_obj.last_name;
      const email = session_obj.email;
      const user_type = session_obj.code;
      const addMember = await Axios.patch(
        endpoint.appUsers(`/app/users/${_id}`),
        {
          first_name,
          last_name,
          email,
          user_type,
          stamp_voucherISbb_loyal2_vouchersID,
          points_per_stampNUM,
          stamps_per_gridNUM,
          free_stamps_per_gridNUM,
          stamp_imageISfile
        }
      );
      const user = addMember.data;
      if (user.error) return message.error(user.error);
      message.success('Updated successful!');
      initPageModule();
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
    }
  };
  return (
    <>
      <Row className="mx-4 mt-5">
        <Col span={24} style={{ textAlign: 'center' }}>
          <Title level={3}>Virtual Stamp for card</Title>
        </Col>
      </Row>
      <Row className="mx-4 mt-5">
        <Col span={24}>
          <Card style={cardStyle}>
            <Card.Body className="p-4">
              <Row className="mt-3">
                <Title level={4}>Virtual 'Rubber Stamp' Display </Title>
              </Row>
              <Row className="mt-3" align="middle">
                <Col span={22}>
                  <Text>
                    If you would like your member points to display as a grid of
                    'rubber stamps'
                  </Text>
                </Col>
                <Col span={2} style={{ textAlign: 'end' }}>
                  <Tooltip
                    placement="bottom"
                    title="300px х 150px tall. It is used in various places but most notably as the header of your micro-site."
                  >
                    <QuestionCircleOutlined
                      style={{
                        backgroundColor: '#359dd9',
                        borderRadius: '50%',
                        border: 'none',
                        color: 'white',
                        fontSize: '20px'
                      }}
                    />
                  </Tooltip>
                </Col>
              </Row>
              <Row className="mt-5" align="middle">
                <Col xxl={8} xl={12} lg={14}>
                  <Text strong className="text-label">
                    Points required per stamp: eg 1 (required)
                  </Text>
                </Col>
                <Col xxl={8} xl={6} lg={4}>
                  <Tooltip
                    placement="bottom"
                    title="300px х 150px tall. It is used in various places but most notably as the header of your micro-site."
                  >
                    <QuestionCircleOutlined
                      style={{
                        backgroundColor: '#359dd9',
                        borderRadius: '50%',
                        border: 'none',
                        color: 'white',
                        fontSize: '20px'
                      }}
                    />
                  </Tooltip>
                </Col>
                <Col xxl={8} xl={6} lg={6} style={{ textAlign: 'end' }}>
                  <InputNumber
                    value={points_per_stampNUM}
                    style={{ borderRadius: '10px' }}
                    onChange={e => set_points_per_stampNUM(e)}
                  />
                </Col>
              </Row>
              <Row className="mt-3" align="middle">
                <Col xxl={8} xl={12} lg={14}>
                  <Text strong className="text-label">
                    Stamps per grid: eg 4, 8, 12 or 16 (required)
                  </Text>
                </Col>
                <Col xxl={8} xl={6} lg={4}>
                  <Tooltip
                    placement="bottom"
                    title="300px х 150px tall. It is used in various places but most notably as the header of your micro-site."
                  >
                    <QuestionCircleOutlined
                      style={{
                        backgroundColor: '#359dd9',
                        borderRadius: '50%',
                        border: 'none',
                        color: 'white',
                        fontSize: '20px'
                      }}
                    />
                  </Tooltip>
                </Col>
                <Col xxl={8} xl={6} lg={6} style={{ textAlign: 'end' }}>
                  <InputNumber
                    style={{ borderRadius: '10px' }}
                    value={stamps_per_gridNUM}
                    onChange={e => set_stamps_per_gridNUM(e)}
                  />
                </Col>
              </Row>
              <Row className="mt-3" align="middle">
                <Col xxl={8} xl={12} lg={14}>
                  <Text strong className="text-label">
                    Free stamps per grid: eg 1 (optional)
                  </Text>
                </Col>
                <Col xxl={8} xl={6} lg={4}>
                  <Tooltip
                    placement="bottom"
                    title="300px х 150px tall. It is used in various places but most notably as the header of your micro-site."
                  >
                    <QuestionCircleOutlined
                      style={{
                        backgroundColor: '#359dd9',
                        borderRadius: '50%',
                        border: 'none',
                        color: 'white',
                        fontSize: '20px'
                      }}
                    />
                  </Tooltip>
                </Col>
                <Col xxl={8} xl={6} lg={6} style={{ textAlign: 'end' }}>
                  <InputNumber
                    style={{ borderRadius: '10px' }}
                    value={free_stamps_per_gridNUM}
                    onChange={e => set_free_stamps_per_gridNUM(e)}
                  />
                </Col>
              </Row>
              <Row className="mt-5" align="middle">
                <Col xxl={9} xl={14} lg={18}>
                  <Text strong className="text-label">
                    Voucher to issue when grid is complete: (required)
                  </Text>
                </Col>
                <Col xxl={15} xl={10} lg={6}>
                  <Tooltip
                    placement="bottom"
                    title="300px х 150px tall. It is used in various places but most notably as the header of your micro-site."
                  >
                    <QuestionCircleOutlined
                      style={{
                        backgroundColor: '#359dd9',
                        borderRadius: '50%',
                        border: 'none',
                        color: 'white',
                        fontSize: '20px'
                      }}
                    />
                  </Tooltip>
                </Col>
              </Row>
              <Row className="mt-2">
                <Input
                  style={inputStyle}
                  type="text"
                  value={filterVoucherStr}
                  onChange={e => setFilterVoucherStr(e.target.value)}
                />
                <VoucherList
                  items={voucherList}
                  filter={filterVoucherStr}
                  onCancel={() => {
                    set_voucherISbb_loyal2_vouchersID(null);
                    setFilterVoucherStr('');
                  }}
                  onItemClick={(id, name) => {
                    set_voucherISbb_loyal2_vouchersID(id);
                    setFilterVoucherStr(name);
                  }}
                ></VoucherList>
              </Row>
              <Row className="mt-5">
                <Col span={12}>
                  <Row align="middle">
                    <Col span={12}>
                      <Text strong className="text-label">
                        Upload Stamp Image
                      </Text>
                    </Col>
                    <Col span={12}>
                      <Tooltip
                        placement="bottom"
                        title="300px х 150px tall. It is used in various places but most notably as the header of your micro-site."
                      >
                        <QuestionCircleOutlined
                          style={{
                            backgroundColor: '#359dd9',
                            borderRadius: '50%',
                            border: 'none',
                            color: 'white',
                            fontSize: '20px'
                          }}
                        />
                      </Tooltip>
                    </Col>
                  </Row>
                  <Row className="mt-3" align="middle">
                    <Col span={12}>
                      <Upload
                        colorBorder="blue"
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        listType="picture"
                        fileList={stampList}
                        onChange={handleChange}
                      >
                        {stampList.length >= 1 ? null : (
                          <Button
                            variant="light"
                            className="rounded-pill px-4 py-2"
                          >
                            Select Image
                          </Button>
                        )}
                      </Upload>
                    </Col>
                    {/* <Col span={12}>
                      <AiOutlineCoffee style={{ scale: '2' }} />
                    </Col> */}
                  </Row>
                </Col>
                <Col span={12} style={{ textAlign: 'center' }}>
                  <Text strong className="text-label">
                    Or use standard image
                  </Text>
                  <Row className="mt-3" align="middle">
                    <Col span={24}>
                      <Carousel
                        indicators={false}
                        variant="dark"
                        style={{ height: '70px' }}
                      >
                        <Carousel.Item style={{ marginTop: '22px' }}>
                          <Row style={{ height: '55px' }}>
                            <Col span={8} style={{ textAlign: 'end' }}>
                              <ImHome style={{ scale: '2' }} />
                            </Col>
                            <Col span={8} style={{ textAlign: 'center' }}>
                              <ImPhone style={{ scale: '2' }} />
                            </Col>
                            <Col span={8} style={{ textAlign: 'start' }}>
                              <ImCart style={{ scale: '2' }} />
                            </Col>
                          </Row>
                        </Carousel.Item>
                        <Carousel.Item style={{ marginTop: '22px' }}>
                          <Row style={{ height: '60px' }}>
                            <Col span={8} style={{ textAlign: 'end' }}>
                              <ImPhone style={{ scale: '2' }} />
                            </Col>
                            <Col span={8} style={{ textAlign: 'center' }}>
                              <ImHome style={{ scale: '2' }} />
                            </Col>
                            <Col span={8} style={{ textAlign: 'start' }}>
                              <ImCart style={{ scale: '2' }} />
                            </Col>
                          </Row>
                        </Carousel.Item>
                        <Carousel.Item style={{ marginTop: '22px' }}>
                          <Row style={{ height: '60px' }}>
                            <Col span={8} style={{ textAlign: 'end' }}>
                              <ImPhone style={{ scale: '2' }} />
                            </Col>
                            <Col span={8} style={{ textAlign: 'center' }}>
                              <ImHome style={{ scale: '2' }} />
                            </Col>
                            <Col span={8} style={{ textAlign: 'start' }}>
                              <ImPhone style={{ scale: '2' }} />
                            </Col>
                          </Row>
                        </Carousel.Item>
                      </Carousel>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="my-5 mb-3">
                <Button
                  variant="outline-primary"
                  className="btn-active-command rounded-pill px-4 py-2"
                  onClick={() => onSubmit()}
                >
                  Save
                </Button>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
export default ThirdSite;
