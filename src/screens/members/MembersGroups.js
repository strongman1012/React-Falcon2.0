import React from 'react';
import {
  Divider,
  Typography,
  Row,
  Col,
  Button,
  Select,
  InputNumber
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { Tabs, Tab } from 'react-bootstrap';

const { Title } = Typography;
const { Option } = Select;
const buttonStyle = {
  boxSizing: 'border-box',
  // 'width': '67px',
  height: '38px',
  background: '#ffffff',
  border: '0.5px solid #359dd9',
  borderRadius: '10px',
  margin: '2px'
};
const btnSaveStyle = {
  borderRadius: '15px',
  backgroundColor: 'white',
  borderColor: '#359dd9',
  color: '#359dd9',
  marginTop: '5px',
  width: '100px'
};
function MembersGroups() {
  const navigate = useNavigate();
  return (
    <>
      <Row>
        <Col xs={{ span: 24, offset: 0 }} lg={{ span: 8, offset: 2 }}>
          <Title level={3}>Groups/Tiers</Title>
        </Col>
        <Col xs={{ span: 24, offset: 0 }} lg={{ span: 12, offset: 2 }}>
          <Button
            style={buttonStyle}
            onClick={() => navigate('/members_groups/list')}
          >
            List
          </Button>
          <Button
            style={buttonStyle}
            onClick={() => navigate('/members_groups/add')}
            icon={<PlusOutlined />}
          >
            Add
          </Button>
          <Button
            style={buttonStyle}
            onClick={() => navigate('/members_groups/search')}
          >
            Search
          </Button>
          <Button
            style={buttonStyle}
            onClick={() => navigate('/members_groups/csv')}
          >
            Import/Export
          </Button>
        </Col>
      </Row>
      <Divider />
      <div className="py-2">
        <Outlet />
      </div>
      <Divider />
      <h4>Groups/Tiers Settings</h4>
      <br />
      <h6>Automate based on</h6>
      <Tabs defaultActiveKey="action" id="group_settings">
        <Tab
          eventKey="action"
          title="Action"
          className="border-bottom border-x p-5"
        >
          <Row className="mt-3">
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">Action</Row>
            </Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">Applied group</Row>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <Select placeholder="Select" style={{ width: '80%' }}>
                  <Option value="group1">group1</Option>
                </Select>
              </Row>
            </Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <Select placeholder="Select" style={{ width: '80%' }}>
                  <Option value="group1">group1</Option>
                </Select>
              </Row>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <Select placeholder="Select" style={{ width: '80%' }}>
                  <Option value="group1">group1</Option>
                </Select>
              </Row>
            </Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <Select placeholder="Select" style={{ width: '80%' }}>
                  <Option value="group1">group1</Option>
                </Select>
              </Row>
            </Col>
          </Row>
          <Row justify="end">
            <Button style={btnSaveStyle} className="mx-7">
              Save
            </Button>
          </Row>
        </Tab>
        <Tab
          eventKey="member_number_code"
          title="Member number/code"
          className="border-bottom border-x p-5"
        >
          <Row className="mt-3">
            <Col xs={{ span: 14, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">Code range</Row>
            </Col>
            <Col xs={{ span: 10, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">Group to apply</Row>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={{ span: 14, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <InputNumber />
                <span className="mx-3">to</span>
                <InputNumber />
              </Row>
            </Col>
            <Col xs={{ span: 10, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <Select placeholder="Select" style={{ width: '80%' }}>
                  <Option value="group1">group1</Option>
                </Select>
              </Row>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={{ span: 14, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <InputNumber />
                <span className="mx-3">to</span>
                <InputNumber />
              </Row>
            </Col>
            <Col xs={{ span: 10, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <Select placeholder="Select" style={{ width: '80%' }}>
                  <Option value="group1">group1</Option>
                </Select>
              </Row>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={{ span: 14, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <InputNumber />
                <span className="mx-3">to</span>
                <InputNumber />
              </Row>
            </Col>
            <Col xs={{ span: 10, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <Select placeholder="Select" style={{ width: '80%' }}>
                  <Option value="group1">group1</Option>
                </Select>
              </Row>
            </Col>
          </Row>
          <Row justify="end">
            <Button style={btnSaveStyle} className="mx-7">
              Save
            </Button>
          </Row>
        </Tab>
        <Tab
          eventKey="points_balance"
          title="Points balance"
          className="border-bottom border-x p-3"
        >
          <Row className="mt-3">
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">Maximum of points</Row>
            </Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">Applied group</Row>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <InputNumber />
              </Row>
            </Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <Select placeholder="Select" style={{ width: '80%' }}>
                  <Option value="group1">group1</Option>
                </Select>
              </Row>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <InputNumber />
              </Row>
            </Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <Select placeholder="Select" style={{ width: '80%' }}>
                  <Option value="group1">group1</Option>
                </Select>
              </Row>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <InputNumber />
              </Row>
            </Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <Select placeholder="Select" style={{ width: '80%' }}>
                  <Option value="group1">group1</Option>
                </Select>
              </Row>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <InputNumber />
              </Row>
            </Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <Select placeholder="Select" style={{ width: '80%' }}>
                  <Option value="group1">group1</Option>
                </Select>
              </Row>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <InputNumber />
              </Row>
            </Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <Select placeholder="Select" style={{ width: '80%' }}>
                  <Option value="group1">group1</Option>
                </Select>
              </Row>
            </Col>
          </Row>
          <Row justify="end">
            <Button style={btnSaveStyle} className="mx-7">
              Save
            </Button>
          </Row>
        </Tab>
        <Tab
          eventKey="points_issued"
          title="Points issued"
          className="border-bottom border-x p-3"
        >
          <Row className="mt-3">
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">Maximum of points</Row>
            </Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">Applied group</Row>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <InputNumber />
              </Row>
            </Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <Select placeholder="Select" style={{ width: '80%' }}>
                  <Option value="group1">group1</Option>
                </Select>
              </Row>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <InputNumber />
              </Row>
            </Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <Select placeholder="Select" style={{ width: '80%' }}>
                  <Option value="group1">group1</Option>
                </Select>
              </Row>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <InputNumber />
              </Row>
            </Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <Select placeholder="Select" style={{ width: '80%' }}>
                  <Option value="group1">group1</Option>
                </Select>
              </Row>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <InputNumber />
              </Row>
            </Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <Select placeholder="Select" style={{ width: '80%' }}>
                  <Option value="group1">group1</Option>
                </Select>
              </Row>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <InputNumber />
              </Row>
            </Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
              <Row justify="center">
                <Select placeholder="Select" style={{ width: '80%' }}>
                  <Option value="group1">group1</Option>
                </Select>
              </Row>
            </Col>
          </Row>
          <Row justify="end">
            <Button style={btnSaveStyle} className="mx-7">
              Save
            </Button>
          </Row>
        </Tab>
      </Tabs>
    </>
  );
}
export default MembersGroups;
