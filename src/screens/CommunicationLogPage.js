import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, DatePicker, Input, Row, Col, Switch, Divider } from 'antd';
import { Button, Card, Form, Modal } from 'react-bootstrap';
// import { useParams } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import endpoint from 'utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { EyeOutlined } from '@ant-design/icons';
import { FaRetweet } from 'react-icons/fa';
import { setMemberMenuData } from 'redux/slices/currentDataSlice';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTableFooter from 'components/common/advance-table/AdvanceTableFooter';
// import ActionButton from 'components/common/RefreshButton';

const { Title, Text } = Typography;
const inputStyle = {
  borderRadius: '10px',
  width: '100%'
};
const data = [
  'Test',
  'Account Update Email',
  'Account Update Text/SMS',
  'Birthday Email',
  'Birthday Text/SMS',
  'Member Password Reset Link',
  'New Member Welcome Email',
  'New Member Welcome Text/SMS',
  'Order Processed Email',
  'Refer A Friend Email',
  'Sales Upload Approved',
  'Sales Upload Declined',
  'Sample PDF Template',
  'Subscription Added',
  'Subscription Expired',
  'Subscription Expiring',
  'Voucher Expiry Warning',
  'Voucher Issued Email',
  'Voucher Issued Text/SMS',
  'Voucher Request Confirmation',
  'Wish List/Registry Invite Email'
];

function CommunicationLogPage() {
  const dispatch = useDispatch();
  const _isMounted = useRef(false);
  // let { routeKey } = useParams();
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [modalShow, setModalShow] = React.useState(false);
  const [columns, setColumns] = useState([]);
  const [layoutData, setLayoutData] = useState(null);
  const [memberLists, setMemeberLists] = useState([]);
  const [resultsPerPage, SetresultsPerPage] = useState(999);
  const initPageModule = async () => {
    try {
      // default part
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getDataManagerSchemaEndpoint('list');
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log(schema, 'aaaaaaaaaaaaaaaaaa');
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      dispatch(setMemberMenuData({ currentMemberMenuSchema: schema.menu })); // store current member menu
      _isMounted.current && setLayoutData(layoutSchema);
      setMemeberLists(layoutSchema.data);
      // end default part
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

  useEffect(() => {
    console.log(layoutData, 'this is layoutdata------');
    if (layoutData) {
      console.log(layoutData.options.columns);
      let objectData = layoutData.options.columns;
      SetresultsPerPage(
        layoutData.options.pagination.results_per_page
          ? layoutData.options.pagination.results_per_page
          : 999
      );
      let tempArray = [
        {
          accessor: 'row',
          Header: 'Row',
          Cell: rowData => {
            return <>{rowData.row.index + 1}</>;
          }
        }
      ];
      for (const key in objectData) {
        let tempElement = {};
        tempElement.accessor = key;
        tempElement.Header = objectData[key];
        tempElement.Cell = function (rowData) {
          //  const { code } = rowData.row.original;
          const value = rowData.row.original[key];
          const divTag = <div style={{ cursor: 'pointer' }}>{value}</div>;
          return divTag;
        };
        tempArray.push(tempElement);
      }
      let statusBtn = {
        id: 'status',
        Header: 'Status',
        Cell: () => {
          return <>sent</>;
        }
      };
      tempArray.push(statusBtn);
      let viewBtn = {
        id: 'view',
        Header: '',
        Cell: () => {
          return (
            <>
              <EyeOutlined style={{ scale: '1.2', cursor: 'pointer' }} />
            </>
          );
        }
      };
      tempArray.push(viewBtn);
      let resendBtn = {
        id: 'resend',
        Header: '',
        Cell: () => {
          return (
            <>
              <FaRetweet
                style={{ scale: '1.2', cursor: 'pointer' }}
                onClick={() => setModalShow(true)}
              />
            </>
          );
        }
      };
      tempArray.push(resendBtn);

      setColumns(tempArray);
    }
  }, [layoutData]);

  if (loadingSchema) {
    return <Loading style={{ marginTop: 150 }} msg="Loading Schema..." />;
  }
  if (!layoutData) return getErrorAlert({ onRetry: initPageModule });

  const onChange = checked => {
    console.log(`switch to ${checked}`);
  };
  return (
    <>
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row className="my-3">
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              <Row className="mx-4 mt-3">
                <Col span={24}>
                  <Title level={3} className="mb-3">
                    Communication Log
                  </Title>
                </Col>
              </Row>
              <Row className="mx-4 mt-5">
                <Col xs={24} md={24} lg={23}>
                  <Text strong className="text-label">
                    Template sent
                  </Text>
                  <Form.Select className="mx-0 mt-1" style={inputStyle}>
                    {data.map((item, index) => {
                      return (
                        <option key={index} value={index}>
                          {item}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Col>
              </Row>
              <Row className="mx-4 mt-3">
                <Col xs={24} md={24} lg={23}>
                  <Text strong className="text-label">
                    Sent to member
                  </Text>
                  <Input
                    className="mt-1"
                    suffix={<SearchOutlined />}
                    style={inputStyle}
                  />
                </Col>
              </Row>
              <Row className="mx-4 mt-5" align="middle">
                <Col xs={24} md={24} lg={5} xl={4}>
                  <Text className="text-label" strong>
                    Sent between
                  </Text>
                </Col>
                <Col xs={10} md={7} lg={3} xl={3}>
                  <DatePicker placeholder="from" style={inputStyle} />
                </Col>
                <Col
                  xs={4}
                  md={4}
                  lg={2}
                  xl={2}
                  style={{ textAlign: 'center' }}
                >
                  <Text strong className="text-label">
                    and
                  </Text>
                </Col>
                <Col xs={10} md={7} lg={3} xl={3}>
                  <DatePicker placeholder="to" style={inputStyle} />
                </Col>
                <Col xs={10} md={4} lg={6} xl={8} style={{ textAlign: 'end' }}>
                  <Text strong className="text-label">
                    Only show failed messages
                  </Text>
                </Col>
                <Col xs={10} md={4} lg={2} xl={3} style={{ textAlign: 'end' }}>
                  <Switch onChange={onChange} />
                </Col>
              </Row>
              <Row className="mx-4 mt-5">
                <Button
                  variant="outline-primary"
                  className="rounded-pill px-4 py-2"
                >
                  Search
                </Button>
              </Row>
              <Divider />
              <AdvanceTableWrapper
                columns={columns}
                data={memberLists}
                sortable
                // pagination
                // selection
                perPage={resultsPerPage}
              >
                <AdvanceTable
                  table
                  headerClassName="bg-200 text-900 text-nowrap align-middle"
                  rowClassName="align-middle white-space-nowrap"
                  tableProps={{
                    bordered: true,
                    striped: true,
                    className: 'fs--1 mb-0 overflow-hidden'
                  }}
                />
                <div className="mt-3">
                  <AdvanceTableFooter
                    rowCount={memberLists.length}
                    table
                    rowInfo
                    navButtons
                    // rowsPerPageSelection
                  />
                </div>
              </AdvanceTableWrapper>
              <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
              >
                <Modal.Body className="justify-content-center py-5">
                  <Row className="mx-6">
                    <Title level={4}>Recipient email</Title>
                  </Row>
                  <Row className="mx-5 mt-3">
                    <Input
                      className="px-3"
                      placeholder="Marysmith@gmail.com"
                      style={inputStyle}
                    />
                  </Row>
                  <Row className="mx-5 mt-3">
                    <Input.TextArea
                      className="p-3"
                      rows={10}
                      placeholder="Dear Johnathan,
              Happy Birthday, we hope your day is wonderful.
              Keep up to date with your points and rewards it.
              https://63bbffedkeit.loyal2.com
              All the best,
              From your rewards Team
              Terms & conditions apply - full details on the website
             "
                      style={inputStyle}
                    />
                  </Row>
                  <Row className="mx-5 mt-5" justify="end">
                    <Button className="btn-active-command rounded-pill px-4 py-2">
                      Re-send
                    </Button>
                  </Row>
                </Modal.Body>
              </Modal>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
export default CommunicationLogPage;
