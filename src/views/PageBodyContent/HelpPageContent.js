import axios from 'axios';
import styled from 'styled-components';
import HubspotForm from 'react-hubspot-form';
import React, { useEffect, useState } from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse, Empty, Row, Spin, Tabs } from 'antd';

import keys from 'utils/keys';
import endpoint from 'utils/endpoint';
import { isEmpty } from 'helpers/utils';
import handleError from 'utils/handleError';

function HelpPageContent(props) {
  const { endpoint: endpoint_suffix } = props;
  const _isMounted = React.useRef(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    _isMounted.current = true;
    getData();
    return () => {
      _isMounted.current = false;
    };
  }, []);

  const getData = async () => {
    try {
      _isMounted.current && setLoading(true);
      const response = await axios.get(
        endpoint.getEndpointWithSuffix(endpoint_suffix)
      );
      const resData = response.data || {};
      console.log('Help response:->', resData);
      _isMounted.current && setData(resData);
      const { categories, content } = resData;
      if (isEmpty(content) && !isEmpty(categories)) {
        const defaultFirst = localStorage.getItem(keys.DEFAULT_HELP_TAB) || '';
        const exists = categories.find(x => x.name === defaultFirst);
        if (defaultFirst && exists) {
          localStorage.removeItem(keys.DEFAULT_HELP_TAB);
          _isMounted.current && setActiveTab(exists._id);
        } else {
          const firstCategory = categories[0];
          _isMounted.current && setActiveTab(firstCategory._id);
        }
      }
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoading(false);
    }
  };

  const getFAQs = () => {
    if (loading) {
      return (
        <Row justify="center" className="w-100 mt-3">
          <Spin />
        </Row>
      );
    }

    if (isEmpty(data)) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

    const { categories, content } = data;

    return (
      <>
        <h3 className="mt-4 mb-0">FAQs</h3>
        <Tabs activeKey={activeTab} onTabClick={key => setActiveTab(key)}>
          {categories.map(category => {
            return (
              <Tabs.TabPane tab={category.name} key={category._id}>
                <TabContent
                  category={category}
                  endpoint_suffix={endpoint_suffix}
                />
              </Tabs.TabPane>
            );
          })}
        </Tabs>
        {isEmpty(activeTab) && <CollapseContent content={content} />}
      </>
    );
  };

  return (
    <div>
      <>
        <h3 className="mb-2">System Assistance</h3>
        <p className="mb-1">
          For immediate system help please contact your Partnership Manager
          otherwise, complete the form below and we will be in touch as soon as
          possible.
        </p>
        <p>Before doing so however you may find the following FAQs helpful.</p>
      </>

      {getFAQs()}

      <h3 className={`mb-2`}>Contact Us</h3>
      <p className="mb-3">
        If you couldn’t find what you were looking for in the FAQs above, please
        fill in the form below and one of our Customer Success team members will
        be in touch as soon as possible.
      </p>
      <HubspotForm
        portalId="8797867"
        formId="20850341-9134-4078-8bc9-c56e39d8209c"
        loading={
          <Row justify="center" className="w-100 mt-3">
            <Spin />
          </Row>
        }
      />
    </div>
  );
}

export default HelpPageContent;

const CollapseContent = ({ content }) => {
  if (isEmpty(content)) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return (
    <Collapse
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
      destroyInactivePanel
      defaultActiveKey={content.length === 1 ? [content[0]._id] : []}
    >
      {content.map(item => {
        return (
          <Collapse.Panel
            header={
              <PanelHeader>
                <h5 style={{ margin: 0 }}>{item.name}</h5>
                {item.summaryIShtmltext && (
                  <div
                    dangerouslySetInnerHTML={{ __html: item.summaryIShtmltext }}
                  />
                )}
              </PanelHeader>
            }
            key={item._id}
          >
            <div dangerouslySetInnerHTML={{ __html: item.contentIShtmltext }} />
          </Collapse.Panel>
        );
      })}
    </Collapse>
  );
};

const PanelHeader = styled.div`
  p {
    margin: 0 !important;
    padding: 0 !important;
  }
`;

function TabContent(props) {
  const { category, endpoint_suffix } = props;
  const _isMounted = React.useRef(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    _isMounted.current = true;
    getData();
    return () => {
      _isMounted.current = false;
    };
  }, []);

  const getData = async () => {
    try {
      _isMounted.current && setLoading(true);
      const endpoint = endpoint.getEndpointWithSuffix(
        endpoint_suffix + `?cat_id=${category._id}`
      );
      const response = await axios.get(endpoint);
      console.log(
        `Help -> ${category.title} Category response:`,
        response.data
      );
      _isMounted.current && setData(response.data);
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setLoading(false);
    }
  };

  if (loading)
    return (
      <Row justify="center" className="w-100 mt-3">
        <Spin />
      </Row>
    );

  if (isEmpty(data)) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  const { content } = data;

  return <CollapseContent content={content} />;
}
