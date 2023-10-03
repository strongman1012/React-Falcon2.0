import React from 'react';

import Iframe from './Iframe';
import HelpPageContent from './HelpPageContent';

function WidgetViewer(props) {
  const { template } = props;

  switch (template.name) {
    case 'help':
      return <HelpPageContent {...props} />;
    case 'iframe':
      return <Iframe {...props} />;

    default:
      return null;
  }
}

export default WidgetViewer;
