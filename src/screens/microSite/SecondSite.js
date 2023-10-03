import React from 'react';
import { Typography, Row, Col, Tooltip, Upload, Input, message } from 'antd';
import { Button, Card } from 'react-bootstrap';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
// import { useDispatch } from 'react-redux';
import endpoint from 'utils/endpoint';
// import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
const { Title, Text } = Typography;
const { TextArea } = Input;
const cardStyle = {
  // backgroundColor: '#F8F8F8',
  borderRadius: '10px',
  border: '0 solid white',
  boxShadow: '0px 0px 0px 0px rgba(0, 0, 0, 1)'
};
const cardStyle1 = {
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
// const getBase64FromUrl = async (url) => {
//   const data = await fetch(url);
//   const blob = await data.blob();
//   return new Promise((resolve) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(blob);
//     reader.onloadend = () => {
//       const base64data = reader.result;
//       resolve(base64data);
//     }
//   });
// }
const base64 =
  'iVBORw0KGgoAAAANSUhEUgAAADcAAAA5CAYAAACS0bM2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALDSURBVGhD7Zg9ixUxFIb9MTZWCxZWgo2NhYWNhYKCNoqCVhaClaKwnSJY+sG2q2grYuuqtbv2d+29/oDR53ojx/Bm7uQkV8ySFx7uZeYkmXdyciYzhw4f2RgOKt1cq3RzrdLNtUo31yrdXKuszdyVazeG7Zevhw87n4Yvu3tDEP85xjliVNtaVDV34uSpxUV/n8+XVlaLWNocPXZc9llCNXMPHz/JMhWLtvSh+vZSbI47btOuVPRVaxaLzJ0+c7ZotlKiT/pWY+bgNsfdXYexIPounUGXOZWKu3tfh+1Xb4bZ/rflkemiDW13Pn5eHvktxlDjT8Vl7tGvhR/r1u07f87z35rkoi3z+Y/FcX5tu6vXby6OWzFWOJ9LtjnKvUrH8xcv/xXH7I6tG/qJ0474WCXpmW2O9FGKzXnAsBJjqvhVZJtLFRGbXl5UWiLGVPGryDKXGpy1U1rZgD5SBYmxVZsxssylUrLGrAXoS+nZiy0ZP0aWubhUB9WYNYsSY6vYMbLMqW0WKaliS1A30fPMyzKnNJvty9gSUhmiYsfIMhcevrFUbAncsFieDOlrLvAvqmXqceN5kGeZU3tKxGcDFe+BvpQ8e8wsc2yxUrr3YFO2ySH1jEOe7V2WOdZWqqigks8EtE3JuwPKMgc2NfnPGuFdLohK9/T51nDuwiXZ3kLM3fubsjpaedd0tjkI+z82tLymcFetwSCOqfbw9t37ZdS4GEu1n4LLnF0bGORVBeKUHdvsqnc3pZJK7DIHdqZCmWYGSVWYclGrNDbzU3Cbi1PR87VqTPTtKSIWtzmIDfLlmKoXUG0sKdUwBkXmIDZopeItSrWMQbG5AGssfotWcRYr2pYUD0U1cwGKCVVzyi4+xNGm1mxZqpsDLpRHgzpnUZ/3arIWc/8L3VyrdHOt0s21SjfXKt1cq3RzrXKAzW0MPwGjBV0KV+vM+QAAAABJRU5ErkJggg==';
function SecondSite() {
  const _isMounted = useRef(false);
  // let { routeKey } = useParams();
  const [logoList, set_logoList] = useState([]);
  const [backgroundList, set_backgroundList] = useState([]);
  const [brandList, set_brandList] = useState([]);
  const [logoISfile, set_logoISfile] = useState({});
  const [background_imageISfile, set_background_imageISfile] = useState([]);
  const [brand_imageISfile, set_brand_imageISfile] = useState([]);
  const [background_color, set_background_color] = useState('#000000');
  const [page_color, set_page_color] = useState('#000000');
  const [font_color, set_font_color] = useState('#000000');
  const [brand_name, set_brand_name] = useState('');
  const [programme_url, set_programme_url] = useState('');
  const [personal_url, set_personal_url] = useState('');
  const [brand_txtISsmallplaintextbox, set_brand_txtISsmallplaintextbox] =
    useState('');

  const [loadingSchema, setLoadingSchema] = useState(true);

  const initPageModule = async () => {
    try {
      const session_obj = JSON.parse(localStorage.getItem('session_obj'));
      const _id = session_obj._id;
      const get_data = await Axios.get(endpoint.appUsers(`/app/users/${_id}`));
      const user_data = get_data.data.user_data[0];
      set_logoList([
        {
          uid: '-1',
          status: 'done',
          url: 'https://newloyal2.phpbucket.net/' + user_data.logoISfile
        }
      ]);
      set_backgroundList([
        {
          uid: '-2',
          status: 'done',
          url:
            'https://newloyal2.phpbucket.net/' +
            user_data.background_imageISfile
        }
      ]);
      set_brandList([
        {
          uid: '-3',
          status: 'done',
          url: 'https://newloyal2.phpbucket.net/' + user_data.brand_imageISfile
        }
      ]);
      set_logoISfile({
        name: 'logo.png',
        size: 800,
        type: 'image/png',
        data: base64
      });

      set_background_imageISfile([
        {
          name: 'background.png',
          size: 800,
          type: 'image/png',
          data: base64
        }
      ]);
      set_brand_imageISfile([
        {
          name: 'brand.png',
          size: 800,
          type: 'image/png',
          data: base64
        }
      ]);
      set_background_color({ data: user_data.backgroundColor });
      set_page_color(user_data.page_color);
      set_font_color(user_data.font_color);
      set_brand_name(user_data.brand_name);
      set_programme_url(user_data.programme_url);
      set_personal_url(user_data.personal_url);
      set_brand_txtISsmallplaintextbox(user_data.brand_txtISsmallplaintextbox);

      _isMounted.current && setLoadingSchema(true);
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

  const handleChange = async (info, cond) => {
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
    console.log(data, 'aaaaaaaaa');
    if (cond === 1) {
      set_logoISfile(data);
      set_logoList(info.fileList);
    } else if (cond === 2) {
      set_background_imageISfile([data]);
      set_backgroundList(info.fileList);
    } else {
      set_brand_imageISfile([data]);
      set_brandList(info.fileList);
    }
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
          logoISfile,
          background_imageISfile,
          brand_imageISfile,
          background_color,
          page_color,
          font_color,
          brand_name,
          programme_url,
          personal_url,
          brand_txtISsmallplaintextbox
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
  // const onFinishFailed = errorInfo => {
  //   console.log('Failed:', errorInfo);
  // };
  return (
    <>
      <Row className="mx-4 mt-5">
        <Col span={24} style={{ textAlign: 'center' }}>
          <Title level={3}>Design your Microsite</Title>
        </Col>
      </Row>
      <Row className="mx-4 mt-5">
        <Col span={24}>
          <Card style={cardStyle1}>
            <Card.Body className="p-4">
              <Row className="mt-3">
                <Title level={4}>Your Logo and Micro-site Design </Title>
              </Row>
              <Row align="middle" className="mt-3">
                <Col span={15}>
                  <Text strong className="text-label">
                    Logo{' '}
                  </Text>
                </Col>
                <Col span={7} style={{ textAlign: 'end' }}>
                  <Upload
                    colorBorder="blue"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture"
                    fileList={logoList}
                    onChange={e => handleChange(e, 1)}
                  >
                    {logoList.length >= 1 ? null : (
                      <Button
                        variant="light"
                        className="rounded-pill px-4 py-2"
                      >
                        Select Image
                      </Button>
                    )}
                  </Upload>
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
              <Row align="middle" className="mt-3">
                <Col span={15}>
                  <Text strong className="text-label">
                    Micro-site background image{' '}
                  </Text>
                </Col>
                <Col span={7} style={{ textAlign: 'end' }}>
                  <Upload
                    colorBorder="blue"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture"
                    fileList={backgroundList}
                    onChange={e => handleChange(e, 2)}
                  >
                    {backgroundList.length >= 1 ? null : (
                      <Button
                        variant="light"
                        className="rounded-pill px-4 py-2"
                      >
                        Select Image
                      </Button>
                    )}
                  </Upload>
                </Col>
              </Row>
              <Row align="middle" className="mt-3">
                <Col span={15}>
                  <Text strong className="text-label">
                    Micro-site background color{' '}
                  </Text>
                </Col>
                <Col span={7} style={{ textAlign: 'end' }}>
                  <Input
                    type="color"
                    style={inputStyle}
                    value={background_color}
                    onChange={e => set_background_color(e.target.value)}
                  />
                </Col>
              </Row>
              <Row align="middle" className="mt-3">
                <Col span={15}>
                  <Text strong className="text-label">
                    Micro-site page color{' '}
                  </Text>
                </Col>
                <Col span={7} style={{ textAlign: 'end' }}>
                  <Input
                    type="color"
                    style={inputStyle}
                    value={page_color}
                    onChange={e => set_page_color(e.target.value)}
                  />
                </Col>
              </Row>
              <Row align="middle" className="mt-3">
                <Col span={15}>
                  <Text strong className="text-label">
                    Micro-site font color{' '}
                  </Text>
                </Col>
                <Col span={7} style={{ textAlign: 'end' }}>
                  <Input
                    type="color"
                    style={inputStyle}
                    value={font_color}
                    onChange={e => set_font_color(e.target.value)}
                  />
                </Col>
              </Row>
              <Row className="mt-5 mb-3">
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

      <Row className="mx-4 mt-4">
        <Col span={24}>
          <Card style={cardStyle}>
            <Card.Body className="p-4">
              <Row className="mt-3">
                <Title level={4}>Your Branding</Title>
              </Row>
              {/* <Form
                name="basic"
                labelCol={{
                  span: 0
                }}
                wrapperCol={{
                  span: 24
                }}
                initialValues={{
                  remember: true
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              > */}
              <Row align="middle" className="mt-3">
                <Col span={10}>
                  <Text strong className="text-label">
                    Program/Brand Name
                  </Text>
                </Col>
                <Col span={12}>
                  {/* <Form.Item
                      name="name"
                      className="m-0"
                      rules={[
                        {
                          required: true,
                          message: 'Please input Name!'
                        }
                      ]}
                    > */}
                  <Input
                    style={inputStyle}
                    value={brand_name}
                    onChange={e => set_brand_name(e.target.value)}
                  />
                  {/* </Form.Item> */}
                </Col>
              </Row>
              <Row align="middle" className="mt-3">
                <Col span={10}>
                  <Text strong className="text-label">
                    Program E-mail Address
                  </Text>
                </Col>
                <Col span={12}>
                  {/* <Form.Item
                      name="name"
                      className="m-0"
                      rules={[
                        {
                          required: true,
                          message: 'Please input Name!'
                        }
                      ]}
                    > */}
                  <Input
                    value={programme_url}
                    onChange={e => set_programme_url(e.target.value)}
                    style={inputStyle}
                  />
                  {/* </Form.Item> */}
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
              <Row align="middle" className="mt-3">
                <Col span={10}>
                  <Text strong className="text-label">
                    Micro-site Web-address
                  </Text>
                </Col>
                <Col span={12}>
                  <Row align="middle" gutter={[8, 8]}>
                    <Col span={6} style={{ textAlign: 'end' }}>
                      <Text strong className="text-label">
                        https://
                      </Text>
                    </Col>
                    <Col span={12}>
                      {/* <Form.Item
                          name="name"
                          className="m-0"
                          rules={[
                            {
                              required: true,
                              message: 'Please input Name!'
                            }
                          ]}
                        > */}
                      <Input
                        style={inputStyle}
                        value={personal_url}
                        onChange={e => set_personal_url(e.target.value)}
                      />
                      {/* </Form.Item> */}
                    </Col>
                    <Col span={6}>
                      <Text strong className="text-label">
                        .loyal2.com
                      </Text>
                    </Col>
                  </Row>
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
              <Row className="mt-4">
                <Text strong className="text-label">
                  Program social media description
                </Text>
              </Row>
              <Row className="mt-2">
                <Col span={22}>
                  {/* <Form.Item
                      name="name"
                      className="m-0"
                      rules={[
                        {
                          required: true,
                          message: 'Please input Name!'
                        }
                      ]}
                    > */}
                  <TextArea
                    rows={3}
                    style={inputStyle}
                    value={brand_txtISsmallplaintextbox}
                    onChange={e =>
                      set_brand_txtISsmallplaintextbox(e.target.value)
                    }
                    placeholder="Description used when your members post/like/share to social media sites like Facebook or Twitter"
                  />
                  {/* </Form.Item> */}
                </Col>
              </Row>
              <Row align="middle" className="mt-5">
                <Col span={10}>
                  <Text strong className="text-label">
                    Program social media image
                  </Text>
                </Col>
                <Col span={5} style={{ textAlign: 'end' }}>
                  <Text>Upload Logo</Text>
                </Col>
                <Col span={7} style={{ textAlign: 'end' }}>
                  <Upload
                    colorBorder="blue"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture"
                    fileList={brandList}
                    onChange={e => handleChange(e, 3)}
                  >
                    {brandList.length >= 1 ? null : (
                      <Button
                        variant="light"
                        className="rounded-pill px-4 py-2"
                      >
                        Select Image
                      </Button>
                    )}
                  </Upload>
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
              {/* </Form> */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
export default SecondSite;
