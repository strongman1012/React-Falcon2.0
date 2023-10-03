import React from 'react';
import Axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, Row, Col } from 'antd';
import { Card } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
// import { useParams } from 'react-router-dom';
import endpoint from '../utils/endpoint';
import { setCurrentData } from 'redux/slices/currentDataSlice';
import { getErrorAlert, setReduxCurrentSchemaData } from 'helpers/utils';
import Loading from 'components/loading';
import handleError from 'utils/handleError';
// import { setMemberMenuData } from 'redux/slices/currentDataSlice';
// import { SearchOutlined } from '@ant-design/icons';
const { Title, Paragraph } = Typography;
// const inputBorderRadius = {
//   borderRadius: '10px'
// };
// const badgeStyle = {
//   backgroundColor: '#359DD9',
//   borderRadius: '50%'
// };

function ReferUsAndEarn() {
  // let { routeKey } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const _isMounted = useRef(false);
  const [moduleSchema, setModuleSchema] = useState(null);
  const [loadingSchema, setLoadingSchema] = useState(true);

  const initPageModule = async () => {
    try {
      _isMounted.current && setLoadingSchema(true);
      dispatch(setCurrentData({ currentModuleSchemaLoading: true }));
      const ep = endpoint.getPageSchemaEndpoint('dashboard');
      const moduleSchemaRes = await Axios.get(ep);
      const schema = moduleSchemaRes.data;
      console.log('Page Schema:->', schema);
      setReduxCurrentSchemaData(schema);
      _isMounted.current && setModuleSchema(schema);
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoadingSchema(false);
    }
  };

  useEffect(() => {
    if (_isMounted.current) {
      initPageModule();
    }
  }, [location.pathname]);

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
  if (!moduleSchema) return getErrorAlert({ onRetry: initPageModule });

  return (
    <>
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row className="my-3">
            <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23}>
              <Row className="mx-4">
                <Title level={3}>Refer us and earn commission</Title>
              </Row>
              <Row className="mx-4 mt-3">
                <Col span={20}>
                  <Title level={4}>
                    Earn 5% of all income we get from your referrals each month!
                  </Title>
                </Col>
              </Row>
              <Row className="mx-4 mt-3">
                <Col span={20}>
                  <Paragraph>
                    Our referer program is open to all, and offers you 5%
                    commission on all revenue generated through accounts you
                    refer directly to us.
                  </Paragraph>
                </Col>
              </Row>
              <Row className="mx-4 mt-4">
                <Col span={20}>
                  <Paragraph>
                    The system is really simple: you promote your unique link
                    (below) - and when anyone clicks through we will assign the
                    new sign-up to your account as a referral. We pay commission
                    from your second paying referee onwards (to stop people from
                    claiming commission on their own accounts :-). When your
                    accrued commission is more than $50 we will pay to your
                    nominated bank account (bank charges will be deducted from
                    your fee). We pay commissions once per month.
                  </Paragraph>
                </Col>
              </Row>
              <Row className="mx-4 mt-4">
                <Col span={20}>
                  <Paragraph>
                    Your referer URL{' '}
                    <a
                      href="https://secure.loyal2.com/?Refer=RH2UFKZZQG9"
                      target="_blank"
                      style={{ color: '#359DD9' }}
                      rel="noreferrer"
                    >
                      <u>https://secure.loyal2.com/?Refer=RH2UFKZZQG9</u>
                    </a>
                  </Paragraph>
                </Col>
              </Row>
              <Row className="mx-4 mt-4">
                <Col span={20}>
                  <Paragraph>
                    Promote this link everywhere you can (your website, email
                    signatures, social media etc) and we will email you each
                    time somebody signs up.
                  </Paragraph>
                </Col>
              </Row>
              {/* <Row className="mx-4 mt-4">
                <Col span={20}>
                  <Row align="middle">
                    <Col span={15}>
                      <Text strong className="text-label">
                        Specify Amount To Top Up
                      </Text>
                    </Col>
                    <Col span={9}>
                      <Form.Select
                        placeholder="Select"
                        style={inputBorderRadius}
                      >
                        <option value="0">Select</option>
                        <option value="1">select1</option>
                        <option value="2">select2</option>
                      </Form.Select>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mx-4 mt-4">
                <Col span={20}>
                  <Paragraph>
                    Please wait for the next page to finish loading once you
                    have submitted your card details.
                  </Paragraph>
                </Col>
              </Row>
              <Row className="mx-4 mt-4">
                <Col span={1}>
                  <Badge style={badgeStyle}>!</Badge>
                </Col>
                <Col span={19}>
                  <Paragraph>
                    Remember that we also have an official{' '}
                    <Text style={{ color: '#359DD9' }}>
                      <u>'agency referral program'</u>
                    </Text>{' '}
                    which offers 40% commission and a whitelabel version of our
                    system. It has a setup fee and monthly costs, so it is for
                    companies that plan to do a lot of business on our platform.
                    If you are interested please{' '}
                    <Text style={{ color: '#359DD9' }}>
                      <u>contact us</u>
                    </Text>{' '}
                    for more info.
                  </Paragraph>
                </Col>
              </Row> */}
              <Row className="mx-4 mt-3">
                <Col span={20}>
                  <Title level={4}>Your Referrals & Commission Payouts</Title>
                </Col>
              </Row>
              <Row className="mx-4 mt-3">
                <Col span={20}>
                  <Paragraph>You have not refered anyone yet.</Paragraph>
                </Col>
                <Col span={20}>
                  <Paragraph>
                    Your list of referees and commission payouts earned will be
                    listed here when you do.
                  </Paragraph>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
export default ReferUsAndEarn;
