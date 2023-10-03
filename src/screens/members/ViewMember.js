import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, Row, Col } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import endpoint from '../../utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { setMemberMenuData } from 'redux/slices/currentDataSlice';
import { Link } from 'react-router-dom';
import { Table, Dropdown } from 'react-bootstrap';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
const { Title } = Typography;

const style = {
  float: 'right',
  fontSize: '12px',
  marginTop: '4px'
};
const doropdownMenu = {
  width: '250px'
};
const downstyle = {
  marginLeft: '5px',
  fontSize: '14px'
};
const downcolor = {
  color: '#359DD9',
  fontSize: '16px'
};
const tdpadding = {
  paddingLeft: '0px',
  color: '#444444'
};
const tdright = { textAlign: 'right', color: '#444444' };
function HistoryMember() {
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
      const ep = endpoint.getDataManagerSchemaEndpoint(`view/${id}`);
      console.log(ep, 'ep');
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      dispatch(setMemberMenuData({ currentMemberMenuSchema: schema.menu })); // store current member menu

      const memberRes = await Axios.get(endpoint.appUsers(`/app/users/${id}`));
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
  return (
    <>
      <Row className="mx-4">
        <Col span={10}>
          <Title level={4} style={{ color: '#444444' }}>
            Viewing member record
          </Title>
        </Col>
        <Col span={13} style={{ textAlign: 'end' }}>
          <Dropdown>
            <Dropdown.Toggle
              bsPrefix="toggle"
              as={Link}
              to="#!"
              className="pe-0 ps-2 nav-link"
            >
              <Title level={4} style={downcolor}>
                Select action <DownOutlined style={downstyle} />
              </Title>
            </Dropdown.Toggle>

            <Dropdown.Menu
              className="dropdown-caret dropdown-menu-card  dropdown-menu-end"
              style={doropdownMenu}
            >
              <div className="bg-white rounded-2 py-2 dark__bg-1000">
                {/* <Dropdown.Item>
                  <Title level={5}>
                    Account Lookup <RightOutlined style={style} />
                  </Title>
                </Dropdown.Item>               
                <Dropdown.Item>
                  <Title level={5}>
                    Send MEssages <RightOutlined style={style} />
                  </Title>
                </Dropdown.Item> */}
                <Dropdown.Item
                  onClick={() =>
                    navigate('/datamanager/bb_loyal2_members/edit/' + id)
                  }
                >
                  <Title level={5} style={{ color: '#444444' }}>
                    Edit <RightOutlined style={style} />
                  </Title>
                </Dropdown.Item>
                {/* <Dropdown.Item>
                  <Title level={5}>
                    Delete <RightOutlined style={style} />
                  </Title>
                </Dropdown.Item> */}
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row className="mx-4">
        <Col span={20}>
          <Table responsive style={{ marginTop: '60px', width: '100%' }}>
            <tbody style={tdpadding}>
              {layoutFields.first_name ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.first_name}</td>
                  <td style={tdright}>
                    {memberData ? memberData.first_name : ''}
                  </td>
                </tr>
              ) : null}
              {layoutFields.last_name ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.last_name}</td>
                  <td style={tdright}>
                    {memberData ? memberData.last_name : ''}
                  </td>
                </tr>
              ) : null}
              {layoutFields.email ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.email}</td>
                  <td style={tdright}>{memberData ? memberData.email : ''}</td>
                </tr>
              ) : null}
              {layoutFields.company_name ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.company_name}</td>
                  <td style={tdright}>
                    {memberData ? memberData.company_name : ''}
                  </td>
                </tr>
              ) : null}
              {layoutFields.cell ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.cell}</td>
                  <td style={tdright}>{memberData ? memberData.cell : ''}</td>
                </tr>
              ) : null}
              {layoutFields.street_state ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.street_state}</td>
                  <td style={tdright}>
                    {memberData ? memberData.street_state : ''}
                  </td>
                </tr>
              ) : null}
              {layoutFields.street_city ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.street_city}</td>
                  <td style={tdright}>
                    {memberData ? memberData.street_city : ''}
                  </td>
                </tr>
              ) : null}
              {layoutFields.street_address ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.street_address}</td>
                  <td style={tdright}>
                    {memberData ? memberData.street_address : ''}
                  </td>
                </tr>
              ) : null}
              {layoutFields.street_address2 ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.street_address2}</td>
                  <td style={tdright}>
                    {memberData ? memberData.street_address2 : ''}
                  </td>
                </tr>
              ) : null}
              {layoutFields.street_suburb ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.street_suburb}</td>
                  <td style={tdright}>
                    {memberData ? memberData.street_suburb : ''}
                  </td>
                </tr>
              ) : null}
              {layoutFields.street_zipcode ? (
                <tr>
                  <td style={tdpadding}>{layoutFields.street_zipcode}</td>
                  <td style={tdright}>
                    {memberData ? memberData.street_zipcode : ''}
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
export default HistoryMember;
