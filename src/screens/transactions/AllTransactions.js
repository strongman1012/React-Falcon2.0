import React from 'react';
import { Divider, Typography, Row, Col, Space, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
const { Title } = Typography;
const buttonStyle = {
  boxSizing: 'border-box',
  height: '38px',
  background: '#ffffff',
  border: '0.5px solid #359dd9',
  borderRadius: '10px'
};
function AllTransactions() {
  const navigate = useNavigate();
  return (
    <>
      <Row>
        <Col xs={{ span: 8, offset: 0 }} lg={{ span: 9, offset: 1 }}>
          <Title level={3}>Transactions</Title>
        </Col>
        <Col xs={{ span: 16, offset: 0 }} lg={{ span: 12, offset: 2 }}>
          <Space size={3}>
            <Button
              style={buttonStyle}
              onClick={() => navigate('/transactions/history')}
            >
              History
            </Button>
            <Button
              style={buttonStyle}
              onClick={() => navigate('/transactions/list')}
            >
              List
            </Button>
            <Button
              style={buttonStyle}
              onClick={() => navigate('/transactions/add')}
              icon={<PlusOutlined />}
            >
              Add
            </Button>
            <Button
              style={buttonStyle}
              onClick={() => navigate('/transactions/search')}
            >
              Search
            </Button>
            <Button
              style={buttonStyle}
              onClick={() => navigate('/transactions/import')}
            >
              Import/Export
            </Button>
          </Space>
        </Col>
      </Row>
      <Divider />
      <div className="py-2">
        <Outlet />
      </div>
    </>
  );
}
export default AllTransactions;
