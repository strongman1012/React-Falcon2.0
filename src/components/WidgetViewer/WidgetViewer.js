import React from 'react';
import { Col, Row } from 'antd';
import { Container } from 'react-bootstrap';

import WidgetItem from './WidgetItem';
import { getCols } from 'helpers/utils';

function WidgetViewer(props) {
  const { content_layout, widgets = [], widgets_cols } = props;
  if (content_layout?.type !== 'widgets') return null;

  const maxColsNUM = widgets_cols ?? 3;

  const renderItem = (widget, key = '', overrideCols) => {
    const cols = overrideCols || getCols(widget.cols, maxColsNUM);
    return (
      <React.Fragment key={key}>
        <Col xs={24} sm={cols} md={cols}>
          <WidgetItem widgetData={widget} />
        </Col>
      </React.Fragment>
    );
  };

  return (
    <Container>
      <Row gutter={[24, 24]}>
        {widgets.map((widget, index) => {
          return renderItem(widget, index + ' ' + widget.title);
        })}
      </Row>
    </Container>
  );
}

export default WidgetViewer;
