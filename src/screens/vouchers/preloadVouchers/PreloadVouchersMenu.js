import React from 'react';
import { Divider, Typography, Row, Col, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
const { Title } = Typography;

function PreloadVouchersMenu() {
  const navigate = useNavigate();
  const { currentMemberMenuSchema } = useSelector(state => state.currentData);
  // const data = useSelector(state => state.currentData);
  return (
    <>
      <Row className="mx-4">
        <Col xs={23} sm={23} md={9} lg={9} xl={9} xxl={8}>
          <Title level={3}>Pre-loaded Voucher Codes</Title>
        </Col>
        <Col
          xs={23}
          sm={23}
          md={15}
          lg={15}
          xl={15}
          xxl={16}
          style={{ textAlign: 'end' }}
        >
          <Space>
            {Object.entries(currentMemberMenuSchema).map((row, index) => {
              return index <= 5 ? (
                <Button
                  key={index}
                  className={
                    row[1].active ? 'btn-active-menu' : 'btn-inactive-menu'
                  }
                  onClick={() =>
                    navigate(
                      row[1].route ===
                        '/datamanager/bb_loyal2_vouchers_precodes/history'
                        ? '/datamanager/bb_loyal2_vouchers_precodes/'
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
            })}
          </Space>
        </Col>
      </Row>
      <Divider />
    </>
  );
}
export default PreloadVouchersMenu;
