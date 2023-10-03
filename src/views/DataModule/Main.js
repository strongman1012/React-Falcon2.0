import React from 'react';
import loadable from '@loadable/component';

import { loadableOptions } from './HelperElements';
import TemplateChecker from './CustomTemplate/TemplateChecker';

const DataModuleAdd = loadable(
  () => import('./Add/DataModuleAdd'),
  loadableOptions
);
const DataModuleViewEdit = loadable(
  () => import('./ViewEdit/DataModuleViewEdit'),
  loadableOptions
);
const DataModuleViewlist = loadable(
  () => import('./Viewlist/DataModuleViewlist'),
  loadableOptions
);

export default function (props) {
  const name = props.template?.name || '';
  const type = props?.type;

  if (name.includes('data_module_viewlist') || type === 'viewlist') {
    console.log('Template is "viewlist".');
    return <DataModuleViewlist {...props} />;
  } else if (name.includes('data_module_add') || type === 'add') {
    console.log('Template is "add".');
    return (
      <div className="bg-white p-3 min-vh-75" style={{ color: 'inherit' }}>
        <TemplateChecker {...props}>
          <DataModuleAdd {...props} />
        </TemplateChecker>
      </div>
    );
  } else if (
    name.includes('data_module_view') ||
    name.includes('data_module_edit') ||
    type === 'view' ||
    type === 'edit'
  ) {
    console.log('Template is "view/edit".');
    return <DataModuleViewEdit {...props} />;
  } else if (type === 'profile' || name.includes('data_module_profile')) {
    console.log('Template is "profile".');
    return <DataModuleViewEdit {...props} />;
  } else {
    console.log('Template is empty.');
    return null;
  }
}
