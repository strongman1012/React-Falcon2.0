import React from 'react';
import { Typography, Row, Col, InputNumber } from 'antd';
import { Button, Form } from 'react-bootstrap';
const { Text } = Typography;

function TabForth(props) {
  const groups = props.groups;
  return (
    <>
      <Row className="mt-3">
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
          <Row justify="center">
            <Text className="text-label" strong>
              Maximum of points
            </Text>
          </Row>
        </Col>
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
          <Row justify="center">
            <Text className="text-label" strong>
              Applied group
            </Text>
          </Row>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
          <Row justify="center">
            <InputNumber style={{ borderRadius: '10px' }} />
          </Row>
        </Col>
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
          <Row justify="center">
            <Form.Select
              placeholder="Select"
              style={{ width: '80%', borderRadius: '10px' }}
            >
              <option key={'null'} value={null}></option>
              {groups.map((item, index) => {
                return (
                  <option key={index} value={item._id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Select>
          </Row>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
          <Row justify="center">
            <InputNumber style={{ borderRadius: '10px' }} />
          </Row>
        </Col>
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
          <Row justify="center">
            <Form.Select
              placeholder="Select"
              style={{ width: '80%', borderRadius: '10px' }}
            >
              <option key={'null'} value={null}></option>
              {groups.map((item, index) => {
                return (
                  <option key={index} value={item._id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Select>
          </Row>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
          <Row justify="center">
            <InputNumber style={{ borderRadius: '10px' }} />
          </Row>
        </Col>
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
          <Row justify="center">
            <Form.Select
              placeholder="Select"
              style={{ width: '80%', borderRadius: '10px' }}
            >
              <option key={'null'} value={null}></option>
              {groups.map((item, index) => {
                return (
                  <option key={index} value={item._id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Select>
          </Row>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
          <Row justify="center">
            <InputNumber style={{ borderRadius: '10px' }} />
          </Row>
        </Col>
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
          <Row justify="center">
            <Form.Select
              placeholder="Select"
              style={{ width: '80%', borderRadius: '10px' }}
            >
              <option key={'null'} value={null}></option>
              {groups.map((item, index) => {
                return (
                  <option key={index} value={item._id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Select>
          </Row>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
          <Row justify="center">
            <InputNumber style={{ borderRadius: '10px' }} />
          </Row>
        </Col>
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}>
          <Row justify="center">
            <Form.Select
              placeholder="Select"
              style={{ width: '80%', borderRadius: '10px' }}
            >
              <option key={'null'} value={null}></option>
              {groups.map((item, index) => {
                return (
                  <option key={index} value={item._id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Select>
          </Row>
        </Col>
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 1 }}></Col>
        <Col xs={{ span: 12, offset: 0 }} lg={{ span: 8, offset: 1 }}>
          <Row justify="end">
            <Button
              variant="outline-primary"
              className="rounded-pill mt-5 px-4 py-2"
            >
              Save
            </Button>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default TabForth;
