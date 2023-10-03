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

function TabThird(props) {
  const groups = props.groups;

  const [group_automate_pts_range01NUM, set_group_automate_pts_range01NUM] =
    useState(null);
  const [
    group_automate_pts_range01ISbb_loyal2_groupsID,
    set_group_automate_pts_range01ISbb_loyal2_groupsID
  ] = useState(null);
  const [group_automate_pts_range02NUM, set_group_automate_pts_range02NUM] =
    useState(null);
  const [
    group_automate_pts_range02ISbb_loyal2_groupsID,
    set_group_automate_pts_range02ISbb_loyal2_groupsID
  ] = useState(null);
  const [group_automate_pts_range03NUM, set_group_automate_pts_range03NUM] =
    useState(null);
  const [
    group_automate_pts_range03ISbb_loyal2_groupsID,
    set_group_automate_pts_range03ISbb_loyal2_groupsID
  ] = useState(null);
  const [group_automate_pts_range04NUM, set_group_automate_pts_range04NUM] =
    useState(null);
  const [
    group_automate_pts_range04ISbb_loyal2_groupsID,
    set_group_automate_pts_range04ISbb_loyal2_groupsID
  ] = useState(null);
  const [group_automate_pts_range05NUM, set_group_automate_pts_range05NUM] =
    useState(null);
  const [
    group_automate_pts_range05ISbb_loyal2_groupsID,
    set_group_automate_pts_range05ISbb_loyal2_groupsID
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
      set_group_automate_pts_range01NUM(
        user_data.group_automate_pts_range01NUM
      );
      set_group_automate_pts_range01ISbb_loyal2_groupsID(
        user_data.group_automate_pts_range01ISbb_loyal2_groupsID
      );
      set_group_automate_pts_range02NUM(
        user_data.group_automate_pts_range02NUM
      );
      set_group_automate_pts_range02ISbb_loyal2_groupsID(
        user_data.group_automate_pts_range02ISbb_loyal2_groupsID
      );
      set_group_automate_pts_range03NUM(
        user_data.group_automate_pts_range03NUM
      );
      set_group_automate_pts_range03ISbb_loyal2_groupsID(
        user_data.group_automate_pts_range03ISbb_loyal2_groupsID
      );
      set_group_automate_pts_range04NUM(
        user_data.group_automate_pts_range04NUM
      );
      set_group_automate_pts_range04ISbb_loyal2_groupsID(
        user_data.group_automate_pts_range04ISbb_loyal2_groupsID
      );
      set_group_automate_pts_range05NUM(
        user_data.group_automate_pts_range05NUM
      );
      set_group_automate_pts_range05ISbb_loyal2_groupsID(
        user_data.group_automate_pts_range05ISbb_loyal2_groupsID
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
          group_automate_pts_range01NUM,
          group_automate_pts_range01ISbb_loyal2_groupsID,
          group_automate_pts_range02NUM,
          group_automate_pts_range02ISbb_loyal2_groupsID,
          group_automate_pts_range03NUM,
          group_automate_pts_range03ISbb_loyal2_groupsID,
          group_automate_pts_range04NUM,
          group_automate_pts_range04ISbb_loyal2_groupsID,
          group_automate_pts_range05NUM,
          group_automate_pts_range05ISbb_loyal2_groupsID
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
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
          <Row justify="center">
            <Text className="text-label" strong>
              Maximum of points
            </Text>
          </Row>
        </Col>
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
          <Row justify="center">
            <Text className="text-label" strong>
              Applied group
            </Text>
          </Row>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
          <Row justify="center">
            <InputNumber
              defaultValue={group_automate_pts_range01NUM}
              onChange={e => set_group_automate_pts_range01NUM(e)}
              style={{ borderRadius: '10px' }}
            />
          </Row>
        </Col>
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
          <Row justify="center">
            <Form.Select
              defaultValue={group_automate_pts_range01ISbb_loyal2_groupsID}
              onChange={e =>
                set_group_automate_pts_range01ISbb_loyal2_groupsID(
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
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
          <Row justify="center">
            <InputNumber
              defaultValue={group_automate_pts_range02NUM}
              onChange={e => set_group_automate_pts_range02NUM(e)}
              style={{ borderRadius: '10px' }}
            />
          </Row>
        </Col>
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
          <Row justify="center">
            <Form.Select
              defaultValue={group_automate_pts_range02ISbb_loyal2_groupsID}
              onChange={e =>
                set_group_automate_pts_range02ISbb_loyal2_groupsID(
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
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
          <Row justify="center">
            <InputNumber
              defaultValue={group_automate_pts_range03NUM}
              onChange={e => set_group_automate_pts_range03NUM(e)}
              style={{ borderRadius: '10px' }}
            />
          </Row>
        </Col>
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
          <Row justify="center">
            <Form.Select
              defaultValue={group_automate_pts_range03ISbb_loyal2_groupsID}
              onChange={e =>
                set_group_automate_pts_range03ISbb_loyal2_groupsID(
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
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
          <Row justify="center">
            <InputNumber
              defaultValue={group_automate_pts_range04NUM}
              onChange={e => set_group_automate_pts_range04NUM(e)}
              style={{ borderRadius: '10px' }}
            />
          </Row>
        </Col>
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
          <Row justify="center">
            <Form.Select
              defaultValue={group_automate_pts_range04ISbb_loyal2_groupsID}
              onChange={e =>
                set_group_automate_pts_range04ISbb_loyal2_groupsID(
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
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
          <Row justify="center">
            <InputNumber
              defaultValue={group_automate_pts_range05NUM}
              onChange={e => set_group_automate_pts_range05NUM(e)}
              style={{ borderRadius: '10px' }}
            />
          </Row>
        </Col>
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
          <Row justify="center">
            <Form.Select
              defaultValue={group_automate_pts_range05ISbb_loyal2_groupsID}
              onChange={e =>
                set_group_automate_pts_range05ISbb_loyal2_groupsID(
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
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}></Col>
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 8, offset: 1 }}>
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

export default TabThird;
