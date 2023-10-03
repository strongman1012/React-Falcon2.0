import React from 'react';
// import Axios from 'axios';
// import { useState, useEffect, useRef } from 'react';
// import { useDispatch } from 'react-redux';
import { Typography, Row, Col } from 'antd';
// import { QuestionCircleOutlined } from '@ant-design/icons';
import { Card } from 'react-bootstrap';
// import { useParams } from 'react-router-dom';
// import endpoint from '../../utils/endpoint';
// import { getErrorAlert } from 'helpers/utils';
// import Loading from 'components/loading';
// import handleError from 'utils/handleError';
// import { setPointMenuData } from 'redux/slices/currentDataSlice';
import TabGroups from './TabGroups';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const { Title, Paragraph } = Typography;

function SalesApproval() {
  return (
    <>
      <Card className="overflow-hidden z-index-1 card-main_layout">
        <Card.Body className="p-0">
          <Row className="mx-4 mt-3">
            <Col span={20}>
              <Title level={3} className="mb-4">
                Sales Approval
              </Title>
            </Col>
          </Row>
          <Row className="mx-4">
            <Col span={20}>
              <Paragraph strong className="mb-3">
                Approve sales uploaded by your members via your micro-site. This
                feature requires a silver or gold membership, but you are free
                to try it out for 30 days.
              </Paragraph>
            </Col>
          </Row>
          <TabGroups />
        </Card.Body>
      </Card>
    </>
  );
}
export default SalesApproval;
