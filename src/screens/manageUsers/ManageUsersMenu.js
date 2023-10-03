import React from 'react';
import { Divider, Typography, Row, Col, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
const { Title } = Typography;

function ManageUsersMenu() {
  const navigate = useNavigate();
  const { routeKey } = useParams();
  // const { currentMemberMenuSchema } = useSelector(state => state.currentData);
  // const data = useSelector(state => state.currentData);
  return (
    <>
      <Row className="mx-4">
        <Col xs={23} sm={23} md={8} lg={8} xl={8} xxl={8}>
          <Title level={3}>Users</Title>
        </Col>
        <Col
          xs={23}
          sm={23}
          md={16}
          lg={16}
          xl={16}
          xxl={16}
          style={{ textAlign: 'end' }}
        >
          <Space>
            {/* {Object.entries(currentMemberMenuSchema).map((row, index) => {
              return index <= 5 ? (
                <Button
                  key={index}
                  className={
                    row[1].active ? 'btn-active-menu' : 'btn-inactive-menu'
                  }
                  onClick={() =>
                    navigate(
                      row[1].route === '/app/users/'
                        ? '/manage_users'
                        : row[1].route
                    )
                  }
                >
                  {row[0] === 'Add' ? (
                    <PlusOutlined style={{ marginBottom: '3px' }} />
                  ) : null}{' '}
                  {row[0]}
                </Button>
              ) : null;
            })} */}
            <Button
              className={!routeKey ? 'btn-active-menu' : 'btn-inactive-menu'}
              onClick={() => navigate('/manage_users')}
            >
              History
            </Button>
            <Button
              className={
                routeKey === 'settings'
                  ? 'btn-active-menu'
                  : 'btn-inactive-menu'
              }
              onClick={() => navigate('/manage_users/settings')}
            >
              Settings
            </Button>
            <Button
              className={
                routeKey === 'list' ? 'btn-active-menu' : 'btn-inactive-menu'
              }
              onClick={() => navigate('/manage_users/list')}
            >
              List
            </Button>
            <Button
              className={
                routeKey === 'add' ? 'btn-active-menu' : 'btn-inactive-menu'
              }
              onClick={() => navigate('/manage_users/add')}
            >
              {<PlusOutlined style={{ marginBottom: '3px' }} />}Add
            </Button>
            <Button
              className={
                routeKey === 'search' ? 'btn-active-menu' : 'btn-inactive-menu'
              }
              onClick={() => navigate('/manage_users/search')}
            >
              Search
            </Button>
            <Button
              className={
                routeKey === 'csv' ? 'btn-active-menu' : 'btn-inactive-menu'
              }
              onClick={() => navigate('/manage_users/csv')}
            >
              Import/Export
            </Button>
          </Space>
        </Col>
      </Row>
      <Divider />
    </>
  );
}
export default ManageUsersMenu;
