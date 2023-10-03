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
import { setPointMenuData } from 'redux/slices/currentDataSlice';
// import { Link } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import { ExclamationCircleFilled } from '@ant-design/icons';
const { Title } = Typography;
const { confirm } = Modal;
const tdpadding = {
  paddingLeft: '0px',
  color: '#444444'
};
const tdright = { textAlign: 'right', color: '#444444' };
function SettingsView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const _isMounted = useRef(false);
  let { id } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [branches, setBranches] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const initPageModule = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getPointDataManagerSchemaEndpoint(`view/${id}`);
      console.log(ep, 'ep');
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      dispatch(setPointMenuData({ currentPointMenuSchema: schema.menu })); // store current point menu

      const memberRes = await Axios.get(
        endpoint.appUsers(`/module/bb_loyal2_points/${id}`)
      );
      setMemberData(memberRes.data);
      console.log(memberRes, 'memberres');
      const branchesList = await Axios.get(
        endpoint.getModuleDataEndpoint('bb_loyal2_branches')
      );
      setBranches(branchesList.data.list);

      const membersList = await Axios.get(
        endpoint.getDataManagerSchemaEndpoint('list')
      );
      setMemberList(membersList.data.layout.data);

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

  if (layoutFields.branchISbb_loyal2_branchesID && memberData) {
    let value = memberData.branchISbb_loyal2_branchesID;
    let index = branches.findIndex(val => {
      return value == val._id;
    });
    if (index === -1) value = '';
    else value = branches[index].name;
    memberData.branchISbb_loyal2_branchesID = value;
  }
  if (layoutFields.memberISbb_usersID && memberData) {
    let value = memberData.memberISbb_usersID;
    let index = memberList.findIndex(val => {
      return value == val._id;
    });
    if (index === -1) value = '';
    else
      value =
        memberList[index].last_name +
        ', ' +
        memberList[index].first_name +
        ' ' +
        (memberList[index].company_name === null
          ? ''
          : memberList[index].company_name);
    memberData.memberISbb_usersID = value;
  }

  const editUser = id => {
    navigate(`/datamanager/bb_loyal2_points/edit/${id}`);
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
        endpoint.appUsers(`/module/bb_loyal2_points/${id}`)
      );
      const user = deleteMember.data;
      if (user.error) return message.error(user.error);
      message.success('Deleted successful!');
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
      navigate('/datamanager/bb_loyal2_points/list');
    }
  };
  return (
    <>
      {/* <Row className="mx-4 mt-3">
        <Col span={24}>
          <Title level={3}>Points</Title>
        </Col>
      </Row>
      <Divider /> */}
      <Row className="mx-4">
        <Col>
          <Title level={4}>Viewing points</Title>
        </Col>
      </Row>
      <Row className="mx-4">
        <Col span={20}>
          <Table responsive style={{ marginTop: '60px', width: '100%' }}>
            <tbody style={tdpadding}>
              {layoutFields.memberISbb_usersID ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.memberISbb_usersID}</td>
                  <td style={tdright}>
                    {memberData ? memberData.memberISbb_usersID : ''}
                  </td>
                </tr>
              ) : null}
              {layoutFields.code ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.code}</td>
                  <td style={tdright}>{memberData ? memberData.code : ''}</td>
                </tr>
              ) : null}
              {layoutFields.transaction_date ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.transaction_date}</td>
                  <td style={tdright}>
                    {memberData ? memberData.transaction_date : ''}
                  </td>
                </tr>
              ) : null}
              {layoutFields.pointsNUM ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.pointsNUM}</td>
                  <td style={tdright}>
                    {memberData ? memberData.pointsNUM : ''}
                  </td>
                </tr>
              ) : null}
              {layoutFields.internal_notesISsmallplaintextbox ? (
                <tr>
                  <td style={tdpadding}>
                    {layoutFields.internal_notesISsmallplaintextbox}
                  </td>
                  <td style={tdright}>
                    {memberData
                      ? memberData.internal_notesISsmallplaintextbox
                      : ''}
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
      <Row className="mx-4 mt-5" span={20}>
        <Col span={10}>
          <Button
            className="btn-active-command rounded-pill px-4"
            onClick={() => editUser(id)}
          >
            Edit
          </Button>
        </Col>
        <Col span={10}>
          <Button
            variant="outline-primary"
            className="rounded-pill px-4"
            style={{ float: 'right' }}
            onClick={() => showDeleteConfirm(id)}
          >
            Delete
          </Button>
        </Col>
      </Row>
    </>
  );
}
export default SettingsView;
