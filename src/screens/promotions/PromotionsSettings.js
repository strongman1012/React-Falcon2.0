import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  Row,
  Col,
  Typography,
  Input,
  InputNumber,
  DatePicker
  // Form
} from 'antd';
import { Button, Collapse, Form as BootStrapForm } from 'react-bootstrap';
import endpoint from '../../utils/endpoint';
import { getErrorAlert } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
import { setPromotionsMenuData } from 'redux/slices/currentDataSlice';
import { UpOutlined } from '@ant-design/icons';

const { Text, Title, Paragraph } = Typography;
const inputStyle = {
  borderRadius: '10px',
  width: '100%'
};
function PromotionsSettings() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const _isMounted = useRef(false);
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [layoutData, setLayoutData] = useState(null);
  const [branches, setBranches] = useState([]);
  const [groups, setGroups] = useState([]);
  const initPageModule = async () => {
    try {
      // default part
      _isMounted.current && setLoadingSchema(true);
      const ep = endpoint.getPromotionsDataManagerSchemaEndpoint('settings');
      const moduleSchemaRes = await Axios.get(ep);
      let schema = moduleSchemaRes.data;
      console.log('menuSchema:->', schema);
      let layoutSchema = schema.layout;
      console.log(schema.menu, ' schema.menu schema.menu schema.menu');
      dispatch(
        setPromotionsMenuData({ currentPromotionsMenuSchema: schema.menu })
      ); // store current Promotions menu
      const branchesList = await Axios.get(
        endpoint.getModuleDataEndpoint('bb_loyal2_branches')
      );
      setBranches(branchesList.data.list);
      const groupsList = await Axios.get(
        endpoint.getModuleDataEndpoint('bb_loyal2_groups')
      );
      setGroups(groupsList.data.list);
      _isMounted.current && setLayoutData(layoutSchema);
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
  // const onChange = value => {
  //   console.log('changed', value);
  // };

  const updateSetting = () => {
    console.log('updated');
  };

  if (loadingSchema) {
    return <Loading style={{ marginTop: 150 }} msg="Loading Schema..." />;
  }
  if (!layoutData) return getErrorAlert({ onRetry: initPageModule });

  return (
    <>
      <Row className="mx-4">
        <Col span={22}>
          <Paragraph style={{ lineHeight: 2 }} className="text-label">
            Non-transactional promotions are once-off coded promotions which you
            offer to your members - whereby they log into your Micro-site and
            enter the code you have specified for the promotion, or scan the QR
            code for that promotion with their mobile phones, and gain a certain
            number of points for doing so.
          </Paragraph>
        </Col>
      </Row>
      <Row className="mx-4 pt-6">
        <Col>
          <Title level={4}>Basic Non-Transactional Promotion Setup</Title>
        </Col>
      </Row>
      <Row className="mx-4 mt-5" align="middle">
        <Col span={22}>
          <Row gutter={[16, 16]} align="middle">
            <Col span={3}>
              <Text strong className="text-label">
                Code
              </Text>
            </Col>
            <Col span={6}>
              <Input style={inputStyle} />
            </Col>

            <Col span={3}>
              <Text strong className="text-label">
                Points
              </Text>
            </Col>
            <Col span={6}>
              <InputNumber style={inputStyle} />
            </Col>
            <Col span={6} style={{ textAlign: 'end' }}>
              <Button
                className="rounded-pill py-2 px-4"
                variant="outline-primary"
                onClick={() => updateSetting()}
              >
                Update
              </Button>
            </Col>
          </Row>
          <Row className="pt-6">
            <Col span={24}>
              <Paragraph style={{ lineHeight: 2 }} className="text-label">
                Each time your members transact and the data is entered into the
                transactions table the transaction engine works out how many
                points they should get and awards the points automatically.
              </Paragraph>
            </Col>
          </Row>
          <Row className="pt-6">
            <Col>
              <Title level={4}>Basic Transactional Promotion Setup</Title>
            </Col>
          </Row>
          <Row className="mt-5" align="middle">
            <Col span={24}>
              <Row gutter={[16, 16]} align="middle">
                <Col span={6}>
                  <Text strong className="text-label">
                    Percent of spend
                  </Text>
                </Col>
                <Col span={4}>
                  <InputNumber style={inputStyle} />
                </Col>

                <Col span={7} style={{ textAlign: 'center' }}>
                  <Text strong className="text-label">
                    pts per 1.00 spent
                  </Text>
                </Col>

                <Col span={7} textAlign="end">
                  <Button
                    style={{ float: 'right' }}
                    className="rounded-pill py-2 px-4"
                    variant="outline-primary"
                    // onClick={() => updateSetting()}
                  >
                    Update
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="pt-6">
            <Col>
              <Title level={4}>Max. points to award per transaction</Title>
            </Col>
          </Row>
          <Row className="mt-5" align="middle">
            <Col span={24}>
              <Row gutter={[16, 16]} align="middle">
                <Col span={13}>
                  <Text style={{ lineHeight: 2 }} className="text-label">
                    For any single transaction - set the max. points to Leave
                    blank for no maximum
                  </Text>
                </Col>
                <Col span={4}>
                  <InputNumber style={inputStyle} />
                </Col>
                <Col span={7} textAlign="end">
                  <Button
                    style={{ float: 'right' }}
                    className="rounded-pill py-2 px-4"
                    variant="outline-primary"
                    // onClick={() => updateSetting()}
                  >
                    Update
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          {/* <Row className="mt-5" align="middle">
            <Col span={24}>
              <Row>
                <Col span={7}>
                  <Button
                    className="rounded-pill py-2 px-4"
                    variant="outline-primary"
                    // onClick={() => updateSetting()}
                  >
                    Update
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row> */}
          <Row className="mt-5">
            <Col span={24}>
              <Button
                strong
                onClick={() => setOpen(!open)}
                aria-controls="example-collapse-text"
                aria-expanded={open}
                variant="outline-primary"
                className="myb-3 text-label rounded-pill py-2"
                style={{ cursor: 'pointer' }}
              >
                Advanced Settings
                <UpOutlined
                  style={{ marginLeft: '10px', marginTop: '0px' }}
                  rotate={open ? 0 : 180}
                />
              </Button>

              <Collapse in={open}>
                <Row className="mt-5" gutter={[16, 16]}>
                  {/* <Form> */}
                  <Col span={24}>
                    <Row align="middle">
                      <Col span={5}>
                        <Text className="text-label" strong>
                          Name
                        </Text>
                      </Col>
                      <Col span={19}>
                        {/* <Form.Item> */}
                        <Input
                          style={{
                            borderRadius: '10px',
                            width: '100%'
                          }}
                        />
                        {/* </Form.Item> */}
                      </Col>
                    </Row>
                    <Row className="mt-3" align="middle">
                      <Col span={5}>
                        <Text strong className="text-label">
                          Percent of spent
                        </Text>
                      </Col>
                      <Col span={6}>
                        <Input style={{ borderRadius: '10px' }} />
                      </Col>
                      <Col span={1}></Col>
                      <Col span={5}>
                        <Text strong className="text-label">
                          Fixed points value
                        </Text>
                      </Col>
                      <Col span={7}>
                        <Input style={{ borderRadius: '10px' }} />
                      </Col>
                    </Row>
                    <Row className="mt-3" align="middle">
                      <Col span={5}>
                        <Text strong className="text-label">
                          Code
                        </Text>
                      </Col>

                      <Col span={6}>
                        <Input style={{ borderRadius: '10px' }} />
                      </Col>
                    </Row>

                    <Row className="mt-3" align="middle">
                      <Col span={5}>
                        <Text strong className="text-label">
                          Group
                        </Text>
                      </Col>
                      <Col span={6}>
                        <BootStrapForm.Select style={{ borderRadius: '10px' }}>
                          <option key={'null'} value={null}></option>
                          {groups.map((item, index) => {
                            return (
                              <option key={index} value={item._id}>
                                {item.name}
                              </option>
                            );
                          })}
                        </BootStrapForm.Select>
                      </Col>
                      <Col span={1}></Col>
                      <Col span={5}>
                        <Text strong className="text-label">
                          Date From
                        </Text>
                      </Col>
                      <Col span={3}>
                        <DatePicker style={{ borderRadius: '10px' }} />
                      </Col>
                      <Col span={1} style={{ textAlign: 'center' }}>
                        <Text strong className="text-label">
                          to
                        </Text>
                      </Col>
                      <Col span={3} style={{ textAlign: 'right' }}>
                        <DatePicker style={{ borderRadius: '10px' }} />
                      </Col>
                    </Row>
                    <Row className="mt-3" align="middle">
                      <Col span={5}>
                        <Text strong className="text-label">
                          Branch
                        </Text>
                      </Col>
                      <Col span={6}>
                        <BootStrapForm.Select style={{ borderRadius: '10px' }}>
                          <option key={'null'} value={null}></option>
                          {branches.map((item, index) => {
                            return (
                              <option key={index} value={item._id}>
                                {item.name}
                              </option>
                            );
                          })}
                        </BootStrapForm.Select>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col span={24} style={{ textAlign: 'end' }}>
                        <Button
                          bv
                          className="rounded-pill px-4 py-2"
                          lavel="Get sample CSV"
                          variant="outline-primary"
                          style={{ textAlign: 'end', float: 'right' }}
                        >
                          Add
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                  {/* </Form> */}
                </Row>
              </Collapse>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
export default PromotionsSettings;
