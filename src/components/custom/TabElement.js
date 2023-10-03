import React from 'react';
import styled from 'styled-components';
import { Badge, Col, Modal, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import vars from 'utils/vars';
import { isEmpty } from 'helpers/utils';
import { setThemeData } from 'redux/slices/themeSlice';
import { setCurrentData } from 'redux/slices/currentDataSlice';

function TabElement(props) {
  const dispatch = useDispatch();

  const {
    activeTemplate,
    onSelect,
    disabled = false,
    resetQueryParams,
    isChild = false
  } = props;
  let { available_templates: temp_templates } = props;

  const { editFormSaved } = useSelector(state => state.currentData);
  const { currentModuleSchema } = useSelector(state => state.currentData);

  let { template } = currentModuleSchema;
  if (!isEmpty(template.children)) {
    template = template.children[0];
  }
  const isTabView = template?.tabYN === true;

  const available_templates = temp_templates.filter(x => !!x.tabYN);
  if (!isTabView || available_templates.length <= 1) return null;

  return (
    <Row style={{ flexWrap: 'nowrap' }}>
      <Col flex={1} gutter={[10, 0]}>
        {isChild && <hr style={{ margin: '2px 0 0 0' }} />}
        <ul
          className="nav nav-tabs"
          style={{
            borderBottom: 'none',
            pointerEvents: disabled ? 'none' : 'auto',
            opacity: disabled ? 0.5 : 1
          }}
        >
          {available_templates.map(template => {
            const {
              id,
              title,
              title_html,
              show_title_countYN,
              title_countNUM
            } = template;
            const active =
              id === activeTemplate?.id ||
              id === activeTemplate.parentISbb_apps_modules_templatesID;
            let elID = `dynamic-${isChild ? 'child' : 'parent'}-tab-${id}`;

            return (
              <li key={id} className="nav-item" id={elID}>
                <TabItem
                  className={`nav-link ${active ? 'active bg-white' : ''}`}
                  style={
                    active
                      ? { fontWeight: 'bold', color: vars.PRIMARY_COLOR }
                      : {}
                  }
                  onClick={e => {
                    e.preventDefault();
                    if (!editFormSaved) {
                      return Modal.confirm({
                        title: 'Changes not saved!',
                        icon: <ExclamationCircleOutlined />,
                        content:
                          'Click ‘OK’ to go back and save your changes or cancel to leave this page without saving.',
                        okText: 'OK',
                        cancelText: 'Cancel',
                        onCancel: () => {
                          dispatch(setCurrentData({ editFormSaved: true }));
                          return false;
                        }
                      });
                    }
                    resetQueryParams && resetQueryParams();

                    if (
                      template.name === 'default_data_module_view' &&
                      template?.title
                    ) {
                      dispatch(setThemeData({ currentTitle: template?.title }));
                    }
                    if (!isEmpty(template.children)) {
                      onSelect(template.children[0]);
                    } else {
                      onSelect(template);
                    }
                  }}
                >
                  <span
                    dangerouslySetInnerHTML={{ __html: title_html || title }}
                  />{' '}
                  {show_title_countYN === true ? (
                    <Badge
                      className="ml-1"
                      count={Number(title_countNUM)}
                      style={{ backgroundColor: vars.PRIMARY_COLOR }}
                    />
                  ) : (
                    ''
                  )}
                </TabItem>
              </li>
            );
          })}
        </ul>
      </Col>
    </Row>
  );
}

export default TabElement;

const TabItem = styled.a`
  border-color: transparent !important;
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
  user-select: none;
  transition: all 0.3s ease-in-out;
  &:hover {
    border-color: transparent !important;
    background-color: gray !important;
    color: #fff !important;
  }
`;
