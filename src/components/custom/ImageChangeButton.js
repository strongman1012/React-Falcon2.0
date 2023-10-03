import React from 'react';
import Axios from 'axios';
import { Button } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';

import endpoint from 'utils/endpoint';
import { getBase64 } from 'helpers/utils';
import handleError from 'utils/handleError';
import { getFileObjForAjax } from 'views/DataModule/HelperElements';

function ImageChangeButton(props) {
  const {
    fieldKey = 'imageFILE',
    buttonLabel = 'Change Profile Picture',
    module_name,
    id,
    onFinish,
    isProfileImage = false
  } = props;

  const _isMounted = React.useRef(false);
  const inputFile = React.useRef(null);
  const [processing, setProcessing] = React.useState(false);

  React.useEffect(() => {
    _isMounted.current = true;
    return () => {
      _isMounted.current = false;
    };
  }, []);

  const onChangeFile = async event => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files?.[0];
    if (!file) return;
    _isMounted.current && setProcessing(true);
    try {
      const data = await getBase64(file);
      const imageData = getFileObjForAjax(file, data);
      const ep = isProfileImage
        ? endpoint.userProfile
        : endpoint.getDataItemEditEndpoint(module_name, id);
      console.log(`${fieldKey} update endpoint: `, ep);
      console.log(`${fieldKey} update postData: `, imageData, module_name, id);
      const res = await Axios.patch(ep, { [fieldKey]: imageData });
      console.log(`${fieldKey} update response:`, res.data);
      _isMounted.current && setProcessing(false);
      onFinish(res.data);
    } catch (error) {
      handleError(error, true);
      _isMounted.current && setProcessing(false);
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        ref={inputFile}
        onChange={onChangeFile}
        style={{ display: 'none' }}
      />
      <Button
        type="default"
        icon={<FileImageOutlined />}
        onClick={() => inputFile.current.click()}
        loading={processing}
      >
        {buttonLabel}
      </Button>
    </>
  );
}

export default ImageChangeButton;
