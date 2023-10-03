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
// const tdright = { textAlign: 'right', color: '#444444' };
function ViewManageTemplates() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const _isMounted = useRef(false);
  let { id } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [branches, setBranches] = useState([]);
  const initPageModule = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getDataManageTemplateSchemaEndpoint(`view/${id}`);
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
      const memberRes = await Axios.get(
        endpoint.getModuleDataEndpoint(`bb_loyal2_templates/${id}`)
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
    console.log(value, 'vvvvv');
    let index = branches.findIndex(val => {
      return value == val._id;
    });
    if (index === -1) value = '';
    else value = branches[index].name;
    console.log(value, 'value');
    memberData.branch_name = value;
  }
  const editUser = id => {
    navigate(`/datamanager/bb_loyal2_templates/edit/${id}`);
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
        endpoint.getDataAddEndpoint(`bb_loyal2_templates/${id}`)
      );
      const user = deleteMember.data;
      if (user.error) return message.error(user.error);
      message.success('Deleted successful!');
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
      navigate('/datamanager/bb_loyal2_templates/list');
    }
  };
  return (
    <>
      <Row className="mx-4 mt-3">
        <Col span={24}>
          <Title level={3}>Template Manager</Title>
        </Col>
      </Row>
      <Divider />
      <Row className="mx-4" align="middle">
        <Col span={10}>
          <Title level={4}>Viewing custom template</Title>
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
                  Test template
                </Text>
              </Dropdown.Item>
              <Dropdown.Item>
                <Text strong className="text-label">
                  Send to member
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
              {layoutFields.typeISbb_loyal2_templates_typesID ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.typeISbb_loyal2_templates_typesID}
                    </Text>
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData
                        ? memberData.typeISbb_loyal2_templates_typesID
                        : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
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
              {layoutFields.message_templateISsmallplaintextbox ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.message_templateISsmallplaintextbox}
                    </Text>
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData
                        ? memberData.message_templateISsmallplaintextbox
                        : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
              {layoutFields.branchISbb_loyal2_branchesID ? (
                <tr>
                  <td style={tdpadding}>
                    <Text strong className="text-label">
                      {layoutFields.branchISbb_loyal2_branchesID}
                    </Text>
                  </td>
                  <td style={tdright}>
                    <Text strong className="text-label">
                      {memberData ? memberData.branch_name : ''}
                    </Text>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </Table>
        </Col>
      </Row>
      {/* <Row className="mx-4 mt-7" align="middle" justify="start">
        <Col span={11}>
          <Text strong className="text-label">
            {layoutFields.voucherISbb_loyal2_vouchersID}
          </Text>
        </Col>
        <Col span={10}>
          <Text strong className="text-label">
            {memberData.voucherISbb_loyal2_vouchersID}
          </Text>
        </Col>
      </Row>
      <Row className="mx-4 mt-4" align="middle" justify="start">
        <Col span={11}>
          <Text strong className="text-label">
            {layoutFields.ownerISbb_usersID}
          </Text>
        </Col>
        <Col span={10}>
          <Text strong className="text-label">
            {memberData.ownerISbb_usersID}
          </Text>
        </Col>
      </Row>
      <Row className="mx-4 mt-4" align="middle" justify="start">
        <Col span={11}>
          <Text strong className="text-label">
            Transaction Date
          </Text>
        </Col>
        <Col span={10}>
          <Text strong className="text-label">
            31-01-2023
          </Text>
        </Col>
      </Row>
      <Row className="mx-4 mt-4" align="middle" justify="start">
        <Col span={11}>
          <Text strong className="text-label">
            Code
          </Text>
        </Col>
        <Col span={10}>
          <Text strong className="text-label">
            R0003
          </Text>
        </Col>
      </Row>
      <Row className="mx-4 mt-4" align="middle" justify="start">
        <Col span={11}>
          <Text strong className="text-label">
            Points Used
          </Text>
        </Col>
        <Col span={10}>
          <Text strong className="text-label"></Text>
        </Col>
      </Row>
      <Row className="mx-4 mt-4" align="middle" justify="start">
        <Col span={11}>
          <Text strong className="text-label">
            Branch
          </Text>
        </Col>
        <Col span={10}>
          <Text strong className="text-label"></Text>
        </Col>
      </Row>
      <Row className="mx-4 mt-4" align="middle" justify="start">
        <Col span={11}>
          <Text strong className="text-label">
            Voucher Value
          </Text>
        </Col>
        <Col span={10}>
          <Text strong className="text-label">
            0.00
          </Text>
        </Col>
      </Row>
      <Row className="mx-4 mt-4" align="middle" justify="start">
        <Col span={11}>
          <Text strong className="text-label">
            Voucher Code/s
          </Text>
        </Col>
        <Col span={10}>
          <Row align="middle">
            <Col sm={20} lg={18} xl={16} xxl={9}>
              <Text strong className="text-label">
                VQ29AMPZSGB Valid for use
              </Text>
            </Col>
            <Col sm={4} lg={6} xl={8} xxl={15}>
              <Button variant="light" className="px-0">
                <img
                  alt="printer"
                  style={{ width: '50px' }}
                  src="/img/printer.PNG"
                />
              </Button>
            </Col>
          </Row>
        </Col>
      </Row> */}
    </>
  );
}
export default ViewManageTemplates;
