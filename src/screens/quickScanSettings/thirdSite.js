import React from 'react';
import { Typography, Row, Col, Upload, Image, Input } from 'antd';
import { Button } from 'react-bootstrap';

const { Title, Text } = Typography;
const inputBorderRadius = {
  borderRadius: '10px',
  width: '100%'
};

function ThirdSite() {
  const handleChange = info => {
    console.log(info, 'uploading');
  };
  return (
    <>
      <Row className="mt-5">
        <Col>
          <Text className="text-label" strong>
            Select Number
          </Text>
        </Col>
      </Row>
      <Row className="mt-1">
        <Col span={16}>
          <Input style={inputBorderRadius} className="my-1" />
        </Col>
        <Col span={8} style={{ textAlign: 'end' }}>
          <Upload
            colorBorder="blue"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture"
            onChange={handleChange}
          >
            <Button
              variant="outline-primary"
              className="rounded-pill px-4 py-2"
            >
              View QR/barcode
            </Button>
          </Upload>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <Title level={4}>Marry Smith</Title>
        </Col>
      </Row>
      <Row className="mt-1">
        <Col>
          <Title level={5}>M00001</Title>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <Text className="text-label" strong>
            QuickScan URL
          </Text>
        </Col>
      </Row>
      <Row className="mt-1">
        <Col span={16}>
          <Input
            style={inputBorderRadius}
            placeholder="https://nocompany.loyal2.com/?Scan&code=M00001"
            className="my-1"
          />
        </Col>
        <Col span={8} style={{ textAlign: 'end' }}>
          <Upload
            colorBorder="blue"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture"
            onChange={handleChange}
          >
            <Button
              variant="outline-primary"
              className="rounded-pill px-4 py-2"
            >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Use&nbsp;
              URL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </Button>
          </Upload>
        </Col>
      </Row>
      <Row className=" mt-5">
        <Col span={9} style={{ textAlign: 'center' }}>
          <Text className="text-label" strong>
            QuickScan URL QR code
          </Text>
        </Col>
      </Row>
      <Row className=" mt-4">
        <Col span={9} style={{ textAlign: 'center' }}>
          <Image width={200} height={200} src="/img/QR_1.svg" />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col span={9} style={{ textAlign: 'center' }}>
          <Text style={{ color: '#359DD9' }} strong>
            Print QR code
          </Text>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col span={9} style={{ textAlign: 'center' }}>
          <Text style={{ color: '#359DD9' }} strong>
            Print member card
          </Text>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <Title level={4}>Scan member code without the QuickScan URL</Title>
        </Col>
      </Row>
      <Row className=" mt-5">
        <Col span={9} style={{ textAlign: 'center' }}>
          <Text className="text-label" strong>
            QR code
          </Text>
        </Col>
        <Col span={12} style={{ textAlign: 'center' }}>
          <Text className="text-label" strong>
            2D barcode
          </Text>
        </Col>
      </Row>
      <Row className=" mt-4">
        <Col span={9} style={{ textAlign: 'center' }}>
          <Image width={200} height={200} src="/img/QR_2.svg" />
        </Col>
        <Col span={12} style={{ textAlign: 'center' }}>
          <Image width={200} height={200} src="/img/QR_3.svg" />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col span={9} style={{ textAlign: 'center' }}>
          <Text style={{ color: '#359DD9' }} strong>
            Print QR code
          </Text>
        </Col>
        <Col span={12} style={{ textAlign: 'center' }}>
          <Text style={{ color: '#359DD9' }} strong>
            Print QR code
          </Text>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col span={9} style={{ textAlign: 'center' }}>
          <Text style={{ color: '#359DD9' }} strong>
            Print member card
          </Text>
        </Col>
        <Col span={12} style={{ textAlign: 'center' }}>
          <Text style={{ color: '#359DD9' }} strong>
            Print member card
          </Text>
        </Col>
      </Row>
    </>
  );
}
export default ThirdSite;
