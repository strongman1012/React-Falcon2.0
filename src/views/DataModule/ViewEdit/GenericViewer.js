import React from 'react';
import { Col, Row } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

import { getCols } from 'helpers/utils';
import {
  FieldTitle,
  FieldValue,
  getGridUtils,
  getReadableValue,
  ListItem
} from '../HelperElements';

const GenericViewer = props => {
  const { columns, maxColsNUM, data, gridStyles = {}, refreshView } = props;
  const screens = useBreakpoint();
  const isProfilePage = window.location.pathname.includes('/profile');

  return (
    <Row gutter={24} style={{ padding: '0 12px' }}>
      {columns
        .filter(x => !x.hidden)
        .map((column, index) => {
          const cols = getCols(column.cols, maxColsNUM);
          const sectionTitleSuffixKey = data?.__addPropertyWithSectionTitle;
          if (sectionTitleSuffixKey) {
            const [fieldName, valueKey] = sectionTitleSuffixKey.split('@');
            if (fieldName === column.field && data[valueKey]) {
              // console.log({ title: column.section_title })
              column = {
                ...column,
                section_title: `${column.section_title} | ${data[valueKey]}`
              };
            }
          }

          const {
            SECTION_ELEMENT,
            SEPARATOR_ELEMENTS_BEFORE,
            SEPARATOR_ELEMENTS_AFTER,
            BEFORE_ELEMENT,
            AFTER_ELEMENT
          } = getGridUtils(column, maxColsNUM, columns, index, { gridStyles });

          const { label, field, rows, label_hidden } = column;
          let styles = {};

          if (screens?.xs === false && isProfilePage) {
            if (field === 'email' || field === 'cell') {
              styles['marginTop'] = -70;
            }
          }

          return (
            <React.Fragment key={field}>
              {SEPARATOR_ELEMENTS_BEFORE}
              {SECTION_ELEMENT}
              {BEFORE_ELEMENT}
              <Col xs={24} sm={cols} md={cols} style={styles}>
                <ListItem>
                  {!label_hidden && <FieldTitle>{label}</FieldTitle>}
                  <FieldValue rows={rows} field={field}>
                    {getReadableValue(data, column, false, '', { refreshView })}
                  </FieldValue>
                </ListItem>
              </Col>
              {AFTER_ELEMENT}
              {SEPARATOR_ELEMENTS_AFTER}
            </React.Fragment>
          );
        })}
    </Row>
  );
};

export default GenericViewer;
