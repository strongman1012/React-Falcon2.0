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
function ViewScanReason() {
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
      const ep = endpoint.getDataQuickScanReasonSchemaEndpoint(`view/${id}`);
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
        endpoint.appUsers(`/module/bb_loyal2_quickscan_reasons/${id}`)
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
  let layoutFields = layoutData.options.fields;

  const editUser = id => {
    console.log(id, 'aaaaaaaaaaaaaaaaaaaaa');
    navigate(`/datamanager/bb_loyal2_quickscan_reasons/edit/${id}`);
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
        endpoint.appUsers(`/module/bb_loyal2_quickscan_reasons/${id}`)
      );
      const user = deleteMember.data;
      if (user.error) return message.error(user.error);
      message.success('Deleted successful!');
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
      navigate('/QuickScan_reasons');
    }
  };
  return (
    <>
      <Row className="mx-4">
        <Col>
          <Title level={4} className="text-label">
            Viewing QuickScan reason
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
              {layoutFields.name ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.name}</td>
                  <td style={tdright}>{memberData ? memberData.name : ''}</td>
                </tr>
              ) : null}
              {/* {layoutFields.total_valueNUM ? (
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
              ) : null} */}
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
export default ViewScanReason;
