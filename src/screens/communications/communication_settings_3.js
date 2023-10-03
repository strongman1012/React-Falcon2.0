import React from 'react';
import { Typography, Row, Col, Checkbox } from 'antd';
// import { Tabs, Tab, Button, Card } from 'react-bootstrap';

const { Title, Text } = Typography;

function Communication_settings_3() {
  // const [radio_value, setRadio_value] = useState(1);
  // const onChange = e => {
  //   console.log('radio checked', e.target.value);

  //   setRadio_value(e.target.value);
  // };
  return (
    <>
      <Row justify="center">
        <Col span={15}>
          <Title level={4} style={{ textAlign: 'center' }}>
            Choose your output/communication method
          </Title>
        </Col>
      </Row>
      <Row align="middle" className="mt-3">
        <Col span={20}>
          <Row className="mt-4">
            <Col>
              <Text className="text-label" strong>
                Sending bulk email requires a <u> Sendgrid.com </u> or{' '}
                <u> Mandrill.com</u>&nbsp; account to be set up.
              </Text>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <Text className="text-label" strong>
                Mobile/text communication not available for this selection.
              </Text>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <Text className="text-label" strong>
                Send list to SendGrid - <u> requires integration </u>
              </Text>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <Text className="text-label" strong>
                Send list to MailChimp -<u> required integration </u>
              </Text>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <Text className="text-label" strong>
                Create PDFs (50 for 1 credit or 0.02 credits each)
              </Text>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <Text className="text-label" strong>
                Export List to CSV file
              </Text>
            </Col>
          </Row>
        </Col>
        <Col span={4}>
          {/* <Radio.Group
            style={{ width: '90%' }}
            value={radio_value}
            onChange={onChange}
          > */}
          <Row className="mt-4">
            <Col span={24} style={{ textAlign: 'end' }}>
              <Checkbox value={1} />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col span={24} style={{ textAlign: 'end' }}>
              <Checkbox value={2} />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col span={24} style={{ textAlign: 'end' }}>
              <Checkbox value={3} />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col span={24} style={{ textAlign: 'end' }}>
              <Checkbox value={4} />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col span={24} style={{ textAlign: 'end' }}>
              <Checkbox value={5} />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col span={24} style={{ textAlign: 'end' }}>
              <Checkbox value={6} />
            </Col>
          </Row>
          {/* </Radio.Group> */}
        </Col>
      </Row>
      <Row className="mt-6 mb-4">
        <Col span={1}>
          <Checkbox />
        </Col>
        <Col span={10}>
          <Text className="text-label" style={{ fontSize: '13px' }} strong>
            Please re-confirm our <u> Terms & Conditions </u>
          </Text>
        </Col>
      </Row>
    </>
  );
}
export default Communication_settings_3;
