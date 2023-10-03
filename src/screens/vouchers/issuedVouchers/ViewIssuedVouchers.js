import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, Row, Col, Divider, message, Modal } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import endpoint from '../../../utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { setMemberMenuData } from 'redux/slices/currentDataSlice';
// import { Link } from 'react-router-dom';
import { Button, Dropdown, ButtonGroup, Table } from 'react-bootstrap';
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
function ViewIssuedVouchers() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const _isMounted = useRef(false);
  let { id } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [branches, setBranches] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [voucherList, setVoucherList] = useState([]);
  const initPageModule = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getDataIssuedVoucherSchemaEndpoint(`view/${id}`);
      console.log(ep, 'ep');
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      dispatch(setMemberMenuData({ currentMemberMenuSchema: schema.menu })); // store current member menu
      const branchesList = await Axios.get(
        endpoint.getModuleDataEndpoint('bb_loyal2_branches')
      );
      setBranches(branchesList.data.list);
      const membersList = await Axios.get(
        endpoint.getDataManagerSchemaEndpoint('list')
      );
      setMemberList(membersList.data.layout.data);
      const vouchersList = await Axios.get(
        endpoint.getDataAllVoucherSchemaEndpoint('list')
      );
      setVoucherList(vouchersList.data.layout.data);
      const memberRes = await Axios.get(
        endpoint.getModuleDataEndpoint(`bb_loyal2_vouchers_issued/${id}`)
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

  if (layoutFields.branchISbb_loyal2_branchesID && memberData) {
    let value = memberData.branchISbb_loyal2_branchesID;
    let index = branches.findIndex(val => {
      return value == val._id;
    });
    if (index === -1) value = '';
    else value = branches[index].name;
    memberData.branch_name = value;
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
    memberData.member_name = value;
  }
  if (layoutFields.voucherISbb_loyal2_vouchersID && memberData) {
    let value = memberData.voucherISbb_loyal2_vouchersID;
    let index = voucherList.findIndex(val => {
      return value == val._id;
    });
    if (index === -1) value = '';
    else value = voucherList[index].name;
    memberData.voucher_name = value;
  }

  const editUser = id => {
    navigate(`/datamanager/bb_loyal2_vouchers_issued/edit/${id}`);
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
        endpoint.getDataAddEndpoint(`bb_loyal2_vouchers_issued/${id}`)
      );
      const user = deleteMember.data;
      if (user.error) return message.error(user.error);
      message.success('Deleted successful!');
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
      navigate('/datamanager/bb_loyal2_vouchers_issued/list');
    }
  };
  return (
    <>
      <Row className="mx-4 mt-3">
        <Col span={24}>
          <Title level={3}>Vouchers Issued</Title>
        </Col>
      </Row>
      <Divider />
      <Row className="mx-4" align="middle">
        <Col span={10}>
          <Title level={4}>Viewing voucher issued record</Title>
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
                  Verify code
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
              {layoutFields.voucherISbb_loyal2_vouchersID ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.voucherISbb_loyal2_vouchersID}
                    </Text>
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData ? memberData.voucher_name : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.ownerISbb_usersID ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      Qty
                    </Text>
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData ? memberData.ownerISbb_usersID : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.memberISbb_usersID ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.memberISbb_usersID}
                    </Text>
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData ? memberData.member_name : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.transaction_date ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.transaction_date}
                    </Text>
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData ? memberData.transaction_date : ''}
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
              {layoutFields.points_usedNUM ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.points_usedNUM}
                    </Text>
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData ? memberData.points_usedNUM : ''}
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
                      {memberData ? memberData.branch_name : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}

              <tr>
                <td style={tdpadding}>
                  <Text strong className="text-label">
                    Voucher Code/s
                  </Text>
                </td>
                <td style={tdright}>
                  {' '}
                  <Row align="middle">
                    <Col
                      sm={20}
                      lg={20}
                      xl={20}
                      xxl={20}
                      style={{ textAlign: 'end' }}
                    >
                      <Text strong className="text-label">
                        VQ29AMPZSGB Valid for use
                      </Text>
                    </Col>
                    <Col sm={4} lg={4} xl={4} xxl={4}>
                      <Button variant="light" className="px-0">
                        <img
                          alt="printer"
                          style={{ width: '50px' }}
                          src="/img/printer.PNG"
                        />
                      </Button>
                    </Col>
                  </Row>
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
}
export default ViewIssuedVouchers;
