import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, Row, Col, message, Modal } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import endpoint from '../../utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { setPromotionsMenuData } from 'redux/slices/currentDataSlice';
import { Table, Dropdown, ButtonGroup } from 'react-bootstrap';
import { ExclamationCircleFilled } from '@ant-design/icons';
const { Title, Text } = Typography;
const { confirm } = Modal;
const tdpadding = {
  paddingLeft: '0px',
  color: '#444444'
};
const tdright = { textAlign: 'right', color: '#444444' };
function ViewManageUsers() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const _isMounted = useRef(false);
  let { id } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [branches, setBranches] = useState([]);
  const [groups, setGroups] = useState([]);
  const eventList = [
    { id: '1', name: 'On Member Signup' },
    { id: '2', name: 'On Member Birthday' },
    { id: '5', name: 'Every Month on the 1st' },
    { id: '7', name: 'On QuickScan' },
    { id: '8', name: 'On Member First Login' },
    { id: '9', name: 'On QuickScan (Button)' }
  ];
  const initPageModule = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getPromotionsDataManagerSchemaEndpoint(`view/${id}`);
      console.log(ep, 'ep');
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      dispatch(
        setPromotionsMenuData({ currentPromotionsMenuSchema: schema.menu })
      ); // store current member menu

      const memberRes = await Axios.get(
        endpoint.appUsers(`/module/bb_loyal2_promotions/${id}`)
      );
      setMemberData(memberRes.data);
      const branchesList = await Axios.get(
        endpoint.getModuleDataEndpoint('bb_loyal2_branches')
      );
      setBranches(branchesList.data.list);
      const groupList = await Axios.get(
        endpoint.getModuleDataEndpoint('bb_loyal2_groups')
      );
      setGroups(groupList.data.list);
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
  let layoutFields = layoutData.options.fields;

  if (layoutFields.eventISbb_loyal2_eventsID && memberData) {
    let value = memberData.eventISbb_loyal2_eventsID;
    let index = eventList.findIndex(val => {
      return value == val.id;
    });
    if (index === -1) value = '';
    else value = eventList[index].name;
    memberData.eventName = value;
  }

  if (layoutFields.groupISbb_loyal2_groupsID && memberData) {
    let value = memberData.groupISbb_loyal2_groupsID;
    let index = groups.findIndex(val => {
      return value == val._id;
    });
    if (index === -1) value = '';
    else value = groups[index].name;
    memberData.groupISbb_loyal2_groupsID = value;
  }

  if (layoutFields.branchISbb_loyal2_branchesID && memberData) {
    let value = memberData.branchISbb_loyal2_branchesID;
    let index = branches.findIndex(val => {
      return value == val._id;
    });
    if (index === -1) value = '';
    else value = branches[index].name;
    memberData.branchISbb_loyal2_branchesID = value;
  }

  const editUser = id => {
    navigate(`/datamanager/bb_loyal2_promotions/edit/${id}`);
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
        endpoint.appUsers(`/module/bb_loyal2_promotions/${id}`)
      );
      const user = deleteMember.data;
      if (user.error) return message.error(user.error);
      message.success('Deleted successful!');
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
      navigate('/datamanager/bb_loyal2_promotions/list');
    }
  };
  return (
    <>
      <Row className="mx-4" align="middle">
        <Col span={14}>
          <Title level={4}>Viewing non-transactional promotion record</Title>
        </Col>
        <Col span={10} style={{ textAlign: 'end' }}>
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle
              id="dropdown-custom-1"
              variant="outline-primary"
              className="rounded-pill px-4 py-2"
            >
              Select action
            </Dropdown.Toggle>
            <Dropdown.Menu className="super-colors">
              <Dropdown.Item>
                <Text strong className="text-label">
                  Print QR Code
                </Text>
              </Dropdown.Item>

              <Dropdown.Item onClick={() => editUser(id)}>
                <Text strong className="text-label">
                  Edit
                </Text>
              </Dropdown.Item>
              <Dropdown.Item onClick={() => showDeleteConfirm(id)}>
                <Text strong className="text-label">
                  Delete
                </Text>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row className="mx-4">
        <Col span={20}>
          <Table responsive style={{ marginTop: '60px', width: '100%' }}>
            <tbody style={tdpadding}>
              {layoutFields.name ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.name}</td>
                  <td style={tdright}>{memberData ? memberData.name : ''}</td>
                </tr>
              ) : null}
              {layoutFields.points_to_awardNUM ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.points_to_awardNUM}</td>
                  <td style={tdright}>
                    {memberData ? memberData.points_to_awardNUM : ''}
                  </td>
                </tr>
              ) : null}
              {layoutFields.code ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.code}</td>
                  <td style={tdright}>{memberData ? memberData.code : ''}</td>
                </tr>
              ) : null}
              {layoutFields.groupISbb_loyal2_groupsID ? (
                <tr>
                  <td style={tdpadding}>
                    {layoutFields.groupISbb_loyal2_groupsID}
                  </td>
                  <td style={tdright}>
                    {memberData ? memberData.groupISbb_loyal2_groupsID : ''}
                  </td>
                </tr>
              ) : null}
              {layoutFields.date_from ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.date_from}</td>
                  <td style={tdright}>
                    {memberData ? memberData.date_from : ''}
                  </td>
                </tr>
              ) : null}
              {layoutFields.date_to ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.date_to}</td>
                  <td style={tdright}>
                    {memberData ? memberData.date_to : ''}
                  </td>
                </tr>
              ) : null}
              {layoutFields.eventISbb_loyal2_eventsID ? (
                <tr>
                  <td style={tdpadding}>
                    {layoutFields.eventISbb_loyal2_eventsID}
                  </td>
                  <td style={tdright}>
                    {memberData ? memberData.eventName : ''}
                  </td>
                </tr>
              ) : null}
              {layoutFields.quickscan_function ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.quickscan_function}</td>
                  <td style={tdright}>
                    {memberData ? memberData.quickscan_function : ''}
                  </td>
                </tr>
              ) : null}
              {layoutFields.branchISbb_loyal2_branchesID ? (
                <tr>
                  <td style={tdpadding}>
                    {layoutFields.branchISbb_loyal2_branchesID}
                  </td>
                  <td style={tdright}>
                    {memberData ? memberData.branchISbb_loyal2_branchesID : ''}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
}
export default ViewManageUsers;
