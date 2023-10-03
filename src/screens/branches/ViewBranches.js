import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, Row, Col, Divider, message, Modal } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import endpoint from '../../utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { setMemberMenuData } from 'redux/slices/currentDataSlice';
// import { Link } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
// import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { ExclamationCircleFilled } from '@ant-design/icons';
const { Title, Text } = Typography;
const { confirm } = Modal;
const tdpadding = {
  paddingLeft: '0px',
  color: '#444444'
};
const tdright = { textAlign: 'right', color: '#444444' };
// const tdright = { textAlign: 'right', color: '#444444' };
function ViewBranches() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const _isMounted = useRef(false);
  let { id } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const initPageModule = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getDataBrancheSchemaEndpoint(`view/${id}`);
      console.log(ep, 'ep');
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      dispatch(setMemberMenuData({ currentMemberMenuSchema: schema.menu })); // store current member menu

      const memberRes = await Axios.get(
        endpoint.getModuleDataEndpoint(`bb_loyal2_branches/${id}`)
      );
      setMemberData(memberRes.data);
      console.log(memberRes, 'memberres');
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
  // let layoutFields = layoutData.options.fields;
  let layoutFields = layoutData.options.fields;
  const editUser = id => {
    navigate(`/datamanager/bb_loyal2_branches/edit/${id}`);
  };
  const showDeleteConfirm = id => {
    confirm({
      title: 'Delete selected items?',
      icon: <ExclamationCircleFilled />,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        onDelete(id);
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      }
    });
  };
  const onDelete = async id => {
    try {
      _isMounted.current && setLoadingSchema(true);

      const deleteMember = await Axios.delete(
        endpoint.getDataAddEndpoint(`bb_loyal2_branches/${id}`)
      );
      const user = deleteMember.data;
      if (user.error) return message.error(user.error);
      message.success('Deleted successful!');
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
      navigate('/datamanager/bb_loyal2_branches/list');
    }
  };
  return (
    <>
      <Row className="mx-4 mt-3">
        <Col span={24}>
          <Title level={3}>Branches</Title>
        </Col>
      </Row>
      <Divider />
      <Row className="mx-4" align="middle">
        <Col xs={23} sm={23} md={12} lg={12} xl={12} xxl={12}>
          <Title level={4}>Viewing branch/store record</Title>
        </Col>
        <Col
          xs={23}
          sm={23}
          md={12}
          lg={12}
          xl={12}
          xxl={12}
          style={{ textAlign: 'end' }}
        >
          {/* <Space>
            <Button
              className={!routeKey ? 'btn-active-menu' : 'btn-inactive-menu'}
              onClick={() => editUser(4)}
            >
              Edit
            </Button>
            <Button
              className={
                routeKey === 'csv' ? 'btn-active-menu' : 'btn-inactive-menu'
              }
              onClick={() => showDeleteConfirm(4)}
            >
              Delete
            </Button>
          </Space> */}
        </Col>
      </Row>

      <Row className="mx-4">
        <Col span={20}>
          <Table responsive style={{ marginTop: '60px', width: '100%' }}>
            <tbody style={tdpadding}>
              {layoutFields.name ? (
                <tr>
                  <td style={tdpadding}>
                    {' '}
                    <Text strong className="text-label">
                      {layoutFields.name}
                    </Text>
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData.name}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.ownerISbb_usersID ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      Code
                    </Text>
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData.ownerISbb_usersID}
                    </Text>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row className="mx-4 mt-7">
        <Col xs={10} lg={10}>
          <Button
            className="btn-active-command rounded-pill px-4 py-2"
            onClick={() => editUser(id)}
          >
            Edit
          </Button>
        </Col>
        <Col xs={10} lg={10} style={{ textAlign: 'end' }}>
          <Button
            variant="outline-primary"
            className="rounded-pill px-4 py-2"
            onClick={() => showDeleteConfirm(id)}
          >
            Delete
          </Button>
        </Col>
      </Row>
    </>
  );
}
export default ViewBranches;
