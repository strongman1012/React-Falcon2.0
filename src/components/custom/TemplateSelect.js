import React from 'react';
import { Select } from 'antd';
import { useSelector } from 'react-redux';
import { CaretDownFilled } from '@ant-design/icons';

import { isEmpty } from 'helpers/utils';
import { CustomRow, PrefixListIcon } from 'views/DataModule/HelperElements';

function TemplateSelectInput(props) {
  const { activeTemplate, setActiveTemplate, wrapperClass = '' } = props;

  const temp_templates = props.available_templates || [];
  /*
		@Steven
		if the tabYN = false, render the select input.
		But only insert templates into that select that also have tabYN = false
	*/
  const available_templates = temp_templates.filter(x => !x.tabYN);
  const { currentModuleSchema } = useSelector(state => state.currentData);

  let { template } = currentModuleSchema;
  if (!isEmpty(template.children)) {
    template = template.children[0];
  }
  const isTabView = template?.tabYN === true;

  if (available_templates.length <= 1 || isTabView) return <div />;

  let isChildSelected = false;

  if (activeTemplate?.id) {
    const found = available_templates.find(x => x.id === activeTemplate?.id);
    if (!found) {
      isChildSelected = true;
    }
  }

  return (
    <CustomRow className={wrapperClass}>
      <PrefixListIcon />
      <Select
        defaultValue="default"
        className="app-select-input-with-prefix"
        style={{ width: 160 }}
        suffixIcon={<CaretDownFilled className="caret-icon" />}
        value={
          isChildSelected
            ? activeTemplate?.parentISbb_apps_modules_templatesID
            : activeTemplate?.id
        }
        onChange={val => {
          const newSelectedTemplate = available_templates.find(
            x => x.id === val
          );
          if (!isEmpty(newSelectedTemplate.children)) {
            setActiveTemplate(newSelectedTemplate.children[0]);
          } else {
            setActiveTemplate(newSelectedTemplate);
          }
        }}
      >
        {available_templates.map((x, i) => (
          <Select.Option key={i} value={x.id}>
            {x.title}
          </Select.Option>
        ))}
      </Select>
    </CustomRow>
  );
}

export default TemplateSelectInput;
