/* eslint-disable no-undef */
// import React from 'react';
// import loadable from '@loadable/component';
// import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
// import { loadableOptions } from '../HelperElements';

/* Custom Viewlist Templates */

/* Custom View/Edit Templates */

function TemplateChecker(props) {
  const { activeTemplate } = props;
  // const SCREENS_INFO = useBreakpoint();
  // const otherProps = { SCREENS_INFO };

  switch (activeTemplate.name) {
    /* Custom Viewlist Templates */

    /* Custom View/Edit Templates */

    default:
      return props.children;
  }
}

export default TemplateChecker;
