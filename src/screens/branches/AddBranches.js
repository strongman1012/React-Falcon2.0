import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, Tooltip, Form, Input, Row, Col, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
// import { useParams } from 'react-router-dom';
import endpoint from '../../utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { setMemberMenuData } from 'redux/slices/currentDataSlice';
import { Button } from 'react-bootstrap';

const { Title, Text } = Typography;
const btnQuestion = {
  backgroundColor: '#359DD9',
  borderRadius: '50%',
  border: 'none',
  color: 'white',
  fontSize: '21px',
  float: 'right'
};
const inputBorderRadius = { borderRadius: '10px' };

function AddBranches() {
  const dispatch = useDispatch();
  const _isMounted = useRef(false);
  // let { routeKey } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const initPageModule = async () => {
    try {
      // default part
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getDataBrancheSchemaEndpoint('add');
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

  if (loadingSchema) {
    return <Loading style={{ marginTop: 150 }} msg="Loading Schema..." />;
  }
  if (!layoutData) return getErrorAlert({ onRetry: initPageModule });

  const onFinish = async values => {
    console.log('Success:', values);
    try {
      _isMounted.current && setLoadingSchema(true);
      const { name } = values;
      const addMember = await Axios.post(
        endpoint.getDataAddEndpoint('bb_loyal2_branches'),
        {
          name
        }
      );
      const user = addMember.data;
      if (user.error) return message.error(user.error);
      message.success('Added successful!');
      console.log(`${endpoint.appUsers} response -> `, user);
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
    }
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  return (
    <>
      <Row className="mx-4 mt-3">
        <Col span={24}>
          <Title level={4} className="mb-3">
            Add a new branch/store
          </Title>
        </Col>
      </Row>
      <Row className="mx-4 mt-3">
        <Col span={24}>
          <Form
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
          >
            <Row align="middle">
              <Col xs={4} lg={2}>
                {' '}
                <Text strong className="text-label">
                  Name
                </Text>
              </Col>
              <Col xs={18} lg={18}>
                <Form.Item
                  name="name"
                  className="m-0"
                  rules={[
                    {
                      required: true,
                      message: 'Please input Name!'
                    }
                  ]}
                >
                  <Input placeholder="Name" style={inputBorderRadius} />
                </Form.Item>
              </Col>
            </Row>

            <Row align="middle" className="mt-4">
              <Col xs={4} lg={2}>
                {' '}
                <Text strong className="text-label">
                  Code
                </Text>
              </Col>
              <Col xs={18} lg={18}>
                <Form.Item
                  name="code"
                  className="m-0"
                  rules={[
                    {
                      required: false,
                      message: 'Please input Code!'
                    }
                  ]}
                >
                  <Input placeholder="Code" style={inputBorderRadius} />
                </Form.Item>
              </Col>
              <Col sm={3} lg={1}>
                <Tooltip placement="right" title="Code" color="#359dd9">
                  <QuestionCircleOutlined
                    className="mt-1"
                    style={btnQuestion}
                  />
                </Tooltip>
              </Col>
            </Row>

            <Button
              className="btn-active-command rounded-pill mt-5 px-4 py-2"
              type="submit"
            >
              Add
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  );
}
export default AddBranches;
