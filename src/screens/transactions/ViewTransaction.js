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
import { setTransactionMenuData } from 'redux/slices/currentDataSlice';
import { Table, Button } from 'react-bootstrap';
import { ExclamationCircleFilled } from '@ant-design/icons';
const { Title } = Typography;
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
  const [memberIDList, setMemberIDList] = useState([]);

  const initPageModule = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getDataTransactionSchemaEndpoint(`view/${id}`);
      console.log(ep, 'ep');
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      dispatch(
        setTransactionMenuData({ currentTransactionMenuSchema: schema.menu })
      ); // store current member menu

      const memberRes = await Axios.get(
        endpoint.appUsers(`/module/bb_loyal2_transactions/${id}`)
      );
      setMemberData(memberRes.data);
      const branchesList = await Axios.get(
        endpoint.getModuleDataEndpoint('bb_loyal2_branches')
      );
      setBranches(branchesList.data.list);
      const membersIDList = await Axios.get(
        endpoint.getDataManagerSchemaEndpoint('list')
      );
      setMemberIDList(membersIDList.data.layout.data);
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
    let index = memberIDList.findIndex(val => {
      return value == val._id;
    });
    if (index === -1) value = '';
    else {
      let Company_name = memberIDList[index].company_name
        ? memberIDList[index].company_name
        : '';
      value =
        memberIDList[index].last_name +
        memberIDList[index].first_name +
        Company_name;
      memberData.memberISbb_usersID = value;
    }
  }

  const editUser = id => {
    navigate(`/datamanager/bb_loyal2_transactions/edit/${id}`);
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
        endpoint.appUsers(`/module/bb_loyal2_transactions/${id}`)
      );
      const user = deleteMember.data;
      if (user.error) return message.error(user.error);
      message.success('Deleted successful!');
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
      navigate('/datamanager/bb_loyal2_transactions/list');
    }
  };
  return (
    <>
      <Row className="mx-4">
        <Col>
          <Title level={4} className="text-label">
            Viewing transactions
          </Title>
        </Col>
      </Row>
      <Row className="mx-4">
        <Col span={20}>
          <Table responsive style={{ marginTop: '60px', width: '100%' }}>
            <tbody style={tdpadding}>
              {/* {layoutFields.ownerISbb_usersID ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.ownerISbb_usersID}</td>
                  <td style={tdright}>
                    {memberData ? memberData.ownerISbb_usersID : ''}
                  </td>
                </tr>
              ) : null} */}
              {layoutFields.memberISbb_usersID ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.memberISbb_usersID}</td>
                  <td style={tdright}>
                    {memberData ? memberData.memberISbb_usersID : ''}
                  </td>
                </tr>
              ) : null}
              {layoutFields.total_valueNUM ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.total_valueNUM}</td>
                  <td style={tdright}>
                    {memberData ? memberData.total_valueNUM : ''}
                  </td>
                </tr>
              ) : null}
              {layoutFields.transaction_ref ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.transaction_ref}</td>
                  <td style={tdright}>
                    {memberData ? memberData.transaction_ref : ''}
                  </td>
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
              {layoutFields.code ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.code}</td>
                  <td style={tdright}>{memberData ? memberData.code : ''}</td>
                </tr>
              ) : null}
              {layoutFields.qtyNUM ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.qtyNUM}</td>
                  <td style={tdright}>{memberData ? memberData.qtyNUM : ''}</td>
                </tr>
              ) : null}
              {layoutFields.sku_code ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.sku_code}</td>
                  <td style={tdright}>
                    {memberData ? memberData.sku_code : ''}
                  </td>
                </tr>
              ) : null}
              {layoutFields.notes ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.notes}</td>
                  <td style={tdright}>{memberData ? memberData.notes : ''}</td>
                </tr>
              ) : null}
              {layoutFields.ex_tax_amountNUM ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.ex_tax_amountNUM}</td>
                  <td style={tdright}>
                    {memberData ? memberData.ex_tax_amountNUM : ''}
                  </td>
                </tr>
              ) : null}
              {layoutFields.tax_amountNUM ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.tax_amountNUM}</td>
                  <td style={tdright}>
                    {memberData ? memberData.tax_amountNUM : ''}
                  </td>
                </tr>
              ) : null}
              {layoutFields.tax_type ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.tax_type}</td>
                  <td style={tdright}>
                    {memberData ? memberData.tax_type : ''}
                  </td>
                </tr>
              ) : null}
              {layoutFields.grand_totalNUM ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.grand_totalNUM}</td>
                  <td style={tdright}>
                    {memberData ? memberData.grand_totalNUM : ''}
                  </td>
                </tr>
              ) : null}
              {layoutFields.unit_priceNUM ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.unit_priceNUM}</td>
                  <td style={tdright}>
                    {memberData ? memberData.unit_priceNUM : ''}
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
            className="btn-active-command rounded-pill px-4 py-2"
            onClick={() => editUser(id)}
          >
            Edit
          </Button>
        </Col>
        <Col span={10}>
          <Button
            variant="outline-primary"
            className="rounded-pill px-4 py-2"
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
export default ViewManageUsers;
