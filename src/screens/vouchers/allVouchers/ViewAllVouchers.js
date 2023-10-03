import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, Row, Col, Divider, message, Modal, Image } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import endpoint from '../../../utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { setMemberMenuData } from 'redux/slices/currentDataSlice';
// import { Link } from 'react-router-dom';
import { Dropdown, ButtonGroup, Table } from 'react-bootstrap';
// import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { ExclamationCircleFilled } from '@ant-design/icons';

const { Title, Text } = Typography;
const { confirm } = Modal;
const tdpadding = {
  paddingLeft: '0px',
  color: '#444444'
};
const tdright = { textAlign: 'right', color: '#444444' };
const eventList = [
  { id: '1', name: 'Every Month on the 1st' },
  { id: '2', name: 'On Member Birthday' },
  { id: '3', name: 'On Member First Login' },
  { id: '4', name: 'On Member Points=Points Required' },
  { id: '5', name: 'On Member Points=Voucher Value' },
  { id: '6', name: 'On Member Signup' },
  { id: '7', name: 'On Member SignUp Anniversary' }
];
// const tdright = { textAlign: 'right', color: '#444444' };
function ViewAllVouchers() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const _isMounted = useRef(false);
  let { id } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [branches, setBranches] = useState([]);
  const [groups, setGroups] = useState([]);
  const initPageModule = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getDataAllVoucherSchemaEndpoint(`view/${id}`);
      console.log(ep, 'ep');
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      dispatch(setMemberMenuData({ currentMemberMenuSchema: schema.menu })); // store current member menu

      const memberRes = await Axios.get(
        endpoint.getModuleDataEndpoint(`bb_loyal2_vouchers/${id}`)
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
  // let layoutFields = layoutData.options.fields;

  let layoutFields = layoutData.options.fields;

  if (layoutFields.eventISbb_loyal2_eventsID && memberData) {
    let value = memberData.eventISbb_loyal2_eventsID;
    let index = eventList.findIndex(val => {
      return value == val.id;
    });
    if (index === -1) value = '';
    else value = eventList[index].name;
    memberData.eventISbb_loyal2_eventsID = value;
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
    navigate(`/datamanager/bb_loyal2_vouchers/edit/${id}`);
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
        endpoint.getDataAddEndpoint(`bb_loyal2_vouchers/${id}`)
      );
      const user = deleteMember.data;
      if (user.error) return message.error(user.error);
      message.success('Deleted successful!');
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
      navigate('/datamanager/bb_loyal2_vouchers/list');
    }
  };
  return (
    <>
      <Row className="mx-4 mt-3">
        <Col span={24}>
          <Title level={3}>Vouchers</Title>
        </Col>
      </Row>
      <Divider />
      <Row className="mx-4" align="middle">
        <Col span={10}>
          <Title level={4}>Viewing voucher</Title>
        </Col>
        <Col span={13} style={{ textAlign: 'end' }}>
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
                  Preview
                </Text>
              </Dropdown.Item>
              <Dropdown.Item>
                <Text strong className="text-label">
                  Issue voucher
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
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.name}
                    </Text>
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData ? memberData.name : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.points_requiredNUM ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.points_requiredNUM}
                    </Text>
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData ? memberData.points_requiredNUM : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.code ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.code}
                    </Text>
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData ? memberData.code : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}

              {layoutFields.available_for_self_selectionYN ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.available_for_self_selectionYN}
                    </Text>{' '}
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData
                        ? memberData.available_for_self_selectionYN
                        : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.trigger_on_total_points_earnedNUM ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.trigger_on_total_points_earnedNUM}
                    </Text>{' '}
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData
                        ? memberData.trigger_on_total_points_earnedNUM
                        : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.limited_to_per_memberNUM ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.limited_to_per_memberNUM}
                    </Text>{' '}
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData ? memberData.limited_to_per_memberNUM : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.optional_email_templateISbb_loyal2_templatesID ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {
                        layoutFields.optional_email_templateISbb_loyal2_templatesID
                      }
                    </Text>{' '}
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData
                        ? memberData.optional_email_templateISbb_loyal2_templatesID
                        : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.points_earned_in_monthsNUM ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.points_earned_in_monthsNUM}
                    </Text>{' '}
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData ? memberData.points_earned_in_monthsNUM : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.voucher_detailsISsmallplaintextbox ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.voucher_detailsISsmallplaintextbox}
                    </Text>{' '}
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData
                        ? memberData.voucher_detailsISsmallplaintextbox
                        : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.email_instructionsISsmallplaintextbox ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.email_instructionsISsmallplaintextbox}
                    </Text>{' '}
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData
                        ? memberData.email_instructionsISsmallplaintextbox
                        : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.email_instructionsISsmallplaintextbox ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.email_instructionsISsmallplaintextbox}
                    </Text>{' '}
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData
                        ? memberData.email_instructionsISsmallplaintextbox
                        : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.eventISbb_loyal2_eventsID ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.eventISbb_loyal2_eventsID}
                    </Text>{' '}
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData ? memberData.eventISbb_loyal2_eventsID : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.expires_after_daysNUM ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.expires_after_daysNUM}
                    </Text>{' '}
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData ? memberData.expires_after_daysNUM : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.can_be_redeemed_for_pointsNUM ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.can_be_redeemed_for_pointsNUM}
                    </Text>{' '}
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData
                        ? memberData.can_be_redeemed_for_pointsNUM
                        : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.valueNUM ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.valueNUM}
                    </Text>{' '}
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData ? memberData.valueNUM : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.value_type ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.value_type}
                    </Text>{' '}
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData ? memberData.value_type : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.min_valueNUM ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.min_valueNUM}
                    </Text>{' '}
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData ? memberData.min_valueNUM : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.sku_code ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.sku_code}
                    </Text>{' '}
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData ? memberData.sku_code : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.date_from ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.date_from}
                    </Text>{' '}
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData ? memberData.date_from : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.date_to ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.date_to}
                    </Text>{' '}
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData ? memberData.date_to : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.groupISbb_loyal2_groupsID ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.groupISbb_loyal2_groupsID}
                    </Text>{' '}
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData ? memberData.groupISbb_loyal2_groupsID : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.branchISbb_loyal2_branchesID ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.branchISbb_loyal2_branchesID}
                    </Text>{' '}
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData
                        ? memberData.branchISbb_loyal2_branchesID
                        : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.imageISfile ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.imageISfile}
                    </Text>
                  </td>
                  <td style={tdright}>
                    {memberData ? (
                      <Image.PreviewGroup
                        preview={{
                          onChange: (current, prev) =>
                            console.log(
                              `current index: ${current}, prev index: ${prev}`
                            )
                        }}
                      >
                        {memberData.imageISfile ? (
                          <Image
                            width={150}
                            src={memberData.imageISfile.thumbnail}
                          />
                        ) : null}
                      </Image.PreviewGroup>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </Table>
        </Col>
      </Row>
      {/* 
      <Row className="mx-4 mt-4" align="middle" justify="start">
        <Col span={11}>
          <Text strong className="text-label">
            {layoutFields.points_requiredNUM}
          </Text>
        </Col>
        <Col span={10} className="px-5">
          <Text strong className="text-label">
            {memberData.points_requiredNUM}
          </Text>
        </Col>
      </Row>
      <Row className="mx-4 mt-4" align="middle" justify="start">
        <Col span={11}>
          <Text strong className="text-label">
            {layoutFields.code}
          </Text>
        </Col>
        <Col span={10} className="px-5">
          <Text strong className="text-label">
            {memberData.code}
          </Text>
        </Col>
      </Row>
      <Row className="mx-4 mt-4" align="middle" justify="start">
        <Col span={11}>
          <Text strong className="text-label">
            {layoutFields.imageISfile}
          </Text>
        </Col>
        <Col span={10}>
          <Image.PreviewGroup
            preview={{
              onChange: (current, prev) =>
                console.log(`current index: ${current}, prev index: ${prev}`)
            }}
          >
            <Image width={150} src="/img/coffee.png" />
          </Image.PreviewGroup>
        </Col>
      </Row>
      <Row className="mx-4 mt-4" align="middle" justify="start">
        <Col span={11}>
          <Text strong className="text-label">
            {layoutFields.available_for_self_selectionYN}
          </Text>
        </Col>
        <Col span={10} className="px-5">
          <Text strong className="text-label">
            {memberData.available_for_self_selectionYN}
          </Text>
        </Col>
      </Row> */}
    </>
  );
}
export default ViewAllVouchers;
