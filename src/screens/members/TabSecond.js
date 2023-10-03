import React from 'react';
import { Typography, Row, Col, InputNumber, message } from 'antd';
import { Button, Form } from 'react-bootstrap';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
// import { useDispatch } from 'react-redux';
import endpoint from 'utils/endpoint';
// import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
const { Text } = Typography;

function TabSecond(props) {
  const groups = props.groups;

  const [group_automate_code_range01, set_group_automate_code_range01] =
    useState(null);
  const [group_automate_code_range01b, set_group_automate_code_range01b] =
    useState(null);
  const [
    group_automate_code_range01ISbb_loyal2_groupsID,
    set_group_automate_code_range01ISbb_loyal2_groupsID
  ] = useState(null);
  const [group_automate_code_range02, set_group_automate_code_range02] =
    useState(null);
  const [group_automate_code_range02b, set_group_automate_code_range02b] =
    useState(null);
  const [
    group_automate_code_range02ISbb_loyal2_groupsID,
    set_group_automate_code_range02ISbb_loyal2_groupsID
  ] = useState(null);
  const [group_automate_code_range03, set_group_automate_code_range03] =
    useState(null);
  const [group_automate_code_range03b, set_group_automate_code_range03b] =
    useState(null);
  const [
    group_automate_code_range03ISbb_loyal2_groupsID,
    set_group_automate_code_range03ISbb_loyal2_groupsID
  ] = useState(null);

  const _isMounted = useRef(false);
  const [loadingSchema, setLoadingSchema] = useState(true);

  const initPageModule = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      const session_obj = JSON.parse(localStorage.getItem('session_obj'));
      const _id = session_obj._id;
      const get_data = await Axios.get(endpoint.appUsers(`/app/users/${_id}`));
      const user_data = get_data.data.user_data[0];
      set_group_automate_code_range01(user_data.group_automate_code_range01);
      set_group_automate_code_range01b(user_data.group_automate_code_range01b);
      set_group_automate_code_range01ISbb_loyal2_groupsID(
        user_data.group_automate_code_range01ISbb_loyal2_groupsID
      );
      set_group_automate_code_range02(user_data.group_automate_code_range02);
      set_group_automate_code_range02b(user_data.group_automate_code_range02b);
      set_group_automate_code_range02ISbb_loyal2_groupsID(
        user_data.group_automate_code_range02ISbb_loyal2_groupsID
      );
      set_group_automate_code_range03(user_data.group_automate_code_range03);
      set_group_automate_code_range03b(user_data.group_automate_code_range03b);
      set_group_automate_code_range03ISbb_loyal2_groupsID(
        user_data.group_automate_code_range03ISbb_loyal2_groupsID
      );
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
          group_automate_code_range01,
          group_automate_code_range01b,
          group_automate_code_range01ISbb_loyal2_groupsID,
          group_automate_code_range02,
          group_automate_code_range02b,
          group_automate_code_range02ISbb_loyal2_groupsID,
          group_automate_code_range03,
          group_automate_code_range03b,
          group_automate_code_range03ISbb_loyal2_groupsID
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
      <Row className="mt-3">
        <Col
          xs={{ span: 20 }}
          sm={{ span: 17 }}
          md={{ span: 12, offset: 1 }}
          lg={{ span: 12, offset: 1 }}
          xl={{ span: 9, offset: 1 }}
        >
          <Row justify="center">
            <Text className="text-label" strong>
              Code range
            </Text>
          </Row>
        </Col>
        <Col
          xs={{ span: 4 }}
          sm={{ span: 7 }}
          md={{ span: 6, offset: 1 }}
          lg={{ span: 6, offset: 1 }}
          xl={{ span: 9, offset: 1 }}
        >
          <Row justify="center">
            <Text className="text-label" strong>
              Group to apply
            </Text>
          </Row>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col
          xs={20}
          sm={17}
          md={{ span: 12, offset: 1 }}
          lg={{ span: 12, offset: 1 }}
          xl={{ span: 9, offset: 1 }}
        >
          <Row justify="center">
            <InputNumber
              defaultValue={group_automate_code_range01}
              onChange={e => set_group_automate_code_range01(e)}
              style={{ borderRadius: '10px' }}
            />
            <span className="mx-3">to</span>
            <InputNumber
              defaultValue={group_automate_code_range01b}
              onChange={e => set_group_automate_code_range01b(e)}
              style={{ borderRadius: '10px' }}
            />
          </Row>
        </Col>
        <Col
          xs={4}
          sm={7}
          md={{ span: 6, offset: 1 }}
          lg={{ span: 6, offset: 1 }}
          xl={{ span: 9, offset: 1 }}
        >
          <Row justify="center">
            <Form.Select
              defaultValue={group_automate_code_range01ISbb_loyal2_groupsID}
              onChange={e =>
                set_group_automate_code_range01ISbb_loyal2_groupsID(
                  e.target.value
                )
              }
              placeholder="Select"
              style={{ width: '80%', borderRadius: '10px' }}
            >
              <option key={'null'} value={null}></option>
              {groups.map((item, index) => {
                return (
                  <option key={index} value={item._id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Select>
          </Row>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col
          xs={20}
          sm={17}
          md={{ span: 12, offset: 1 }}
          lg={{ span: 12, offset: 1 }}
          xl={{ span: 9, offset: 1 }}
        >
          <Row justify="center">
            <InputNumber
              defaultValue={group_automate_code_range02}
              onChange={e => set_group_automate_code_range02(e)}
              style={{ borderRadius: '10px' }}
            />
            <span className="mx-3">to</span>
            <InputNumber
              defaultValue={group_automate_code_range02b}
              onChange={e => set_group_automate_code_range02b(e)}
              style={{ borderRadius: '10px' }}
            />
          </Row>
        </Col>
        <Col
          xs={4}
          sm={7}
          md={{ span: 6, offset: 1 }}
          lg={{ span: 6, offset: 1 }}
          xl={{ span: 9, offset: 1 }}
        >
          <Row justify="center">
            <Form.Select
              defaultValue={group_automate_code_range02ISbb_loyal2_groupsID}
              onChange={e =>
                set_group_automate_code_range02ISbb_loyal2_groupsID(
                  e.target.value
                )
              }
              placeholder="Select"
              style={{ width: '80%', borderRadius: '10px' }}
            >
              <option key={'null'} value={null}></option>
              {groups.map((item, index) => {
                return (
                  <option key={index} value={item._id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Select>
          </Row>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col
          xs={20}
          sm={17}
          md={{ span: 12, offset: 1 }}
          lg={{ span: 12, offset: 1 }}
          xl={{ span: 9, offset: 1 }}
        >
          <Row justify="center">
            <InputNumber
              defaultValue={group_automate_code_range03}
              onChange={e => set_group_automate_code_range03(e)}
              style={{ borderRadius: '10px' }}
            />
            <span className="mx-3">to</span>
            <InputNumber
              defaultValue={group_automate_code_range03b}
              onChange={e => set_group_automate_code_range03b(e)}
              style={{ borderRadius: '10px' }}
            />
          </Row>
        </Col>
        <Col
          xs={4}
          sm={7}
          md={{ span: 6, offset: 1 }}
          lg={{ span: 6, offset: 1 }}
          xl={{ span: 9, offset: 1 }}
        >
          <Row justify="center">
            <Form.Select
              defaultValue={group_automate_code_range03ISbb_loyal2_groupsID}
              onChange={e =>
                set_group_automate_code_range03ISbb_loyal2_groupsID(
                  e.target.value
                )
              }
              placeholder="Select"
              style={{ width: '80%', borderRadius: '10px' }}
            >
              <option key={'null'} value={null}></option>
              {groups.map((item, index) => {
                return (
                  <option key={index} value={item._id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Select>
          </Row>
        </Col>
        <Col
          xs={{ span: 12, offset: 0 }}
          sm={{ span: 12, offset: 1 }}
          md={{ span: 12, offset: 1 }}
          lg={{ span: 9, offset: 1 }}
        ></Col>
        <Col
          xs={{ span: 12, offset: 0 }}
          sm={{ span: 6, offset: 1 }}
          md={{ span: 6, offset: 1 }}
          lg={{ span: 8, offset: 1 }}
        >
          <Row justify="end">
            <Button
              variant="outline-primary"
              className="rounded-pill mt-5 px-4 py-2"
              onClick={() => onSubmit()}
            >
              Save
            </Button>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default TabSecond;
