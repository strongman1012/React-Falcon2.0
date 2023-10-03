import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  Typography,
  Form,
  Input,
  Row,
  Col,
  message,
  InputNumber,
  DatePicker
} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import endpoint from '../../utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { setPointMenuData } from 'redux/slices/currentDataSlice';
import { Button, Form as BootstrapForm } from 'react-bootstrap';
import moment from 'moment';
import ListItems from 'components/custom/ListItems';
const { Title, Text } = Typography;

function SettingsUpdate() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const _isMounted = useRef(false);
  let { routeKey, id } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const dateFormat = 'YYYY-MM-DD HH:mm:ss';
  const [branch_val, setBranch_val] = useState('');
  const [branches, setBranches] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const selectchange = e => {
    console.log('selectchange', e.target.value);
    setBranch_val(e.target.value);
  };
  const [memberISbb_usersID, set_memberISbb_usersID] = useState(null);
  const [filterMemberStr, setFilterMemberStr] = useState('');
  const initPageModule = async () => {
    try {
      // default part
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getPointDataManagerSchemaEndpoint(
        `${routeKey}/${id}`
      );
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      _isMounted.current &&
        setBranch_val(layoutSchema.data[0][0].branchISbb_loyal2_branchesID);
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      dispatch(setPointMenuData({ currentPointMenuSchema: schema.menu })); // store current point menu

      const branchesList = await Axios.get(
        endpoint.getModuleDataEndpoint('bb_loyal2_branches')
      );
      setBranches(branchesList.data.list);
      const membersList = await Axios.get(
        endpoint.getDataManagerSchemaEndpoint('list')
      );
      setMemberList(membersList.data.layout.data);
      set_memberISbb_usersID(layoutSchema.data[0][0].memberISbb_usersID);

      let value = layoutSchema.data[0][0].memberISbb_usersID;
      let index = membersList.data.layout.data.findIndex(val => {
        return value == val._id;
      });
      if (index === -1) value = '';
      else
        value =
          membersList.data.layout.data[index].last_name +
          ', ' +
          membersList.data.layout.data[index].first_name +
          ' ' +
          (membersList.data.layout.data[index].company_name === null
            ? ''
            : membersList.data.layout.data[index].company_name);
      setFilterMemberStr(value);
      const FieldsData = layoutSchema.data;
      form.setFieldsValue({
        ownerISbb_usersID: FieldsData[0][0].ownerISbb_usersID,
        memberISbb_usersID: FieldsData[0][0].memberISbb_usersID,
        pointsNUM: FieldsData[0][0].pointsNUM,
        code: FieldsData[0][0].code,
        _id: FieldsData[0][0]._id
      });

      _isMounted.current && setLayoutData(layoutSchema);
      // end default part
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
    }
  };
  // let FieldsData = layoutData.data;
  // useEffect(() => {
  //   if (layoutData.data!==null)
  //     setBranch_val(layoutData.data[0][0].branchISbb_loyal2_branchesID);
  // }, [layoutData.data]);
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
      const { _id, ownerISbb_usersID, pointsNUM, code } = values;
      const transaction_date = values['transaction_date'].format(
        'YYYY-MM-DD HH:mm:ss'
      );
      const branchISbb_loyal2_branchesID = branch_val;
      const updateMember = await Axios.patch(
        endpoint.appUsers(`/module/bb_loyal2_points/${_id}`),
        {
          _id,
          ownerISbb_usersID,
          memberISbb_usersID,
          code,
          transaction_date,
          internal_notesISsmallplaintextbox: 12,
          pointsNUM,
          branchISbb_loyal2_branchesID
        }
      );
      const user = updateMember.data;
      console.log(user, 'userusfjdlksjfdlksjlk');
      if (user.error) return message.error(user.error);
      message.success('Updated successful!');
      navigate('/datamanager/bb_loyal2_points/list');
      // initPageModule();
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
    }
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  // setBranch_val(FieldsData[0][0].branchISbb_loyal2_branchesID)
  let FieldsData = layoutData.data;

  // console.log(FieldsData[0][0].branchISbb_loyal2_branchesID, 'FieldData');
  const selectedStartDate = moment(
    FieldsData[0][0].transaction_date,
    dateFormat
  );

  const initValues = {
    transaction_date: selectedStartDate
  };

  // console.log("transaction_date",FieldsData[0][0].transaction_date)

  return (
    <>
      <Form
        name="basic"
        labelCol={{
          span: 0
        }}
        wrapperCol={{
          span: 24
        }}
        initialValues={initValues}
        // initialValues={{
        //   remember: true
        // }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={form}
        autoComplete="off"
      >
        <Form.Item name="_id" hidden="hidden">
          <Input />
        </Form.Item>
        <Form.Item name="ownerISbb_usersID" hidden="hidden">
          <Input />
        </Form.Item>
        <Row className="mx-4">
          <Col>
            <Title
              strong
              className="my-6"
              level={4}
              style={{ color: '#444444' }}
            >
              Update this points record
            </Title>
          </Col>
        </Row>
        <Row className="mx-4">
          <Col span={20}>
            <Text strong style={{ color: '#444444' }}>
              Member*
            </Text>
            <Input
              style={{ borderRadius: '10px' }}
              type="text"
              className="mt-1"
              value={filterMemberStr}
              onChange={e => setFilterMemberStr(e.target.value)}
            />
            <ListItems
              items={memberList}
              filter={filterMemberStr}
              onCancel={() => {
                set_memberISbb_usersID(null);
                setFilterMemberStr('');
              }}
              onItemClick={(id, name) => {
                set_memberISbb_usersID(id);
                setFilterMemberStr(name);
              }}
            ></ListItems>
          </Col>
        </Row>
        <Row className="my-7 mx-4">
          <Col span={9}>
            <Text strong style={{ color: '#444444' }}>
              Points*
            </Text>
            <Form.Item
              name="pointsNUM"
              rules={[
                {
                  required: true,
                  message: 'Please input Owner!'
                }
              ]}
            >
              <InputNumber style={{ width: '100%', borderRadius: '10px' }} />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col span={9}>
            <Text strong style={{ color: '#444444' }}>
              Code
            </Text>
            <Form.Item
              name="code"
              rules={[
                {
                  required: true,
                  message: 'Please input Owner!'
                }
              ]}
            >
              <Input type="text" style={{ borderRadius: '10px' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row className="my-5 mx-4">
          <Col xs={23} sm={23} md={4} lg={7} xl={7} xxl={7}>
            <Form.Item name={'transaction_date'}>
              <DatePicker
                value={selectedStartDate}
                style={{
                  width: '100%',
                  borderRadius: '10px',
                  color: '#444444'
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={23} sm={23} md={4} lg={3} xl={3} xxl={3}>
            <Text
              strong
              className="me-2 my-1"
              style={{ float: 'right', color: '#444444' }}
            >
              Branch
            </Text>
          </Col>
          <Col xs={23} sm={23} md={4} lg={8} xl={8} xxl={8}>
            <BootstrapForm.Select
              defaultValue={FieldsData[0][0].branchISbb_loyal2_branchesID}
              name="branch"
              onChange={e => selectchange(e)}
              style={{ width: '100%', borderRadius: '10px' }}
              // onChange={handleChange}
            >
              <option key={'null'} value={null}></option>
              {branches.map((item, index) => {
                return (
                  <option key={index} value={item._id}>
                    {item.name}
                  </option>
                );
              })}
            </BootstrapForm.Select>
          </Col>
          <Col className="mx-3">
            <Button
              variant="outline-primary"
              className="rounded-pill py-2 px-4"
              type="submit"
            >
              Update
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
export default SettingsUpdate;
