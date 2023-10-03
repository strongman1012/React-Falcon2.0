import React from 'react';
import { Divider, Typography, Row, Col, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
const { Title } = Typography;

function TransactionMenu() {
  const navigate = useNavigate();
  const { currentTransactionMenuSchema } = useSelector(
    state => state.currentData
  );
  return (
    <>
      <Row>
        <Col xs={23} sm={23} md={8} lg={8} xl={8} xxl={8}>
          <Title level={3} style={{ marginLeft: '20px' }}>
            Transactions
          </Title>
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
            {Object.entries(currentTransactionMenuSchema).map((row, index) => {
              return index <= 5 ? (
                <Button
                  key={index}
                  // icon={row[0] == 'Add' ? <PlusOutlined /> : null}
                  // type={row[1].active ? "primary" : null}
                  className={
                    row[1].active ? 'btn-active-menu' : 'btn-inactive-menu'
                  }
                  onClick={() => navigate(row[1].route)}
                >
                  {row[0] == 'Add' ? (
                    <PlusOutlined style={{ marginTop: '-2px' }} />
                  ) : null}
                  {row[0]}
                </Button>
              ) : null;
            })}
          </Space>
        </Col>
      </Row>
      <Divider />
    </>
  );
}
export default TransactionMenu;
