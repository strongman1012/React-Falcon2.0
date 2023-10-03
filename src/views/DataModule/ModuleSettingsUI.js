import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Empty, Input, message, Row, Select } from 'antd';
import { CaretDownFilled, PlusCircleOutlined } from '@ant-design/icons';

import endpoint from 'utils/endpoint';
import handleError from 'utils/handleError';
import { getPopupContainer, isEmpty } from 'helpers/utils';
import { CustomRow, PrefixListIcon } from './HelperElements';

function ModuleSettingsUI(props) {
  const { data, module_name } = props;

  const [current, setCurrent] = useState(data[0]);
  const [setting, setSetting] = useState(data[0].name);

  const options = data.map(x => ({ title: x.name, value: x.name }));

  useEffect(() => {
    const item = data.find(x => x.name === setting);
    setCurrent(item);
  }, [setting]);

  if (!module_name) return null;

  return (
    <>
      <Row className="mb-3">
        <CustomRow wrap={false} align="middle" className="w-100">
          <PrefixListIcon />
          <Select
            defaultValue="default"
            className="w-100 app-select-input-with-prefix"
            suffixIcon={<CaretDownFilled className="caret-icon" />}
            value={setting}
            onChange={val => setSetting(val)}
            getPopupContainer={getPopupContainer}
            showSearch
          >
            {options.map((x, i) => (
              <Select.Option key={i} value={x.value}>
                {x.title}
              </Select.Option>
            ))}
          </Select>
        </CustomRow>
      </Row>

      <ModuleSettingsForm
        setting={setting}
        data={current}
        module_name={module_name}
        updateLocally={props.onModuleSettingItemUpdate}
      />
    </>
  );
}

export default ModuleSettingsUI;

function ModuleSettingsForm(props) {
  const { data, module_name, setting } = props;
  const { name, value: val, message: msg } = data || {};
  const [, forceUpdate] = useState();
  const [value, setValue] = useState(val);
  const [processing, setProcessing] = useState(false);
  const _isMounted = React.useRef(false);

  useEffect(() => {
    _isMounted.current = true;
    return () => {
      _isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setValue(val);
  }, [val, name, message]);

  useEffect(() => {
    forceUpdate({});
  }, [setting]);

  const handleUpdate = async () => {
    try {
      _isMounted.current && setProcessing(true);
      const ep = endpoint.getModuleSettingUpdateEndpoint(module_name, name);
      const response = await axios.patch(ep, { value });
      console.log('Module setting update response:', response.data);
      props.updateLocally({ ...data, value });
      message.success('Saved successfully!');
    } catch (error) {
      handleError(error, true);
    } finally {
      _isMounted.current && setProcessing(false);
    }
  };

  if (isEmpty(data)) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <>
      {msg && (
        <div className="mb-3" dangerouslySetInnerHTML={{ __html: msg }} />
      )}
      <Input.TextArea
        rows={4}
        value={value}
        className="mb-3"
        style={{ width: '100%' }}
        onChange={e => setValue(e.target.value)}
      />
      <Row align="end">
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          htmlType="button"
          onClick={handleUpdate}
          disabled={processing}
          loading={processing}
        >
          Save
        </Button>
      </Row>
    </>
  );
}
