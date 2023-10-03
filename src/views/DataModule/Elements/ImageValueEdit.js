import React from 'react';
import Axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';
import { Avatar, Popconfirm, Spin } from 'antd';
import { FileDoneOutlined } from '@ant-design/icons';
import keys from 'utils/keys';
import endpoint from 'utils/endpoint';
import handleError from 'utils/handleError';
import { getPopupContainer } from 'helpers/utils';

const ProfileImagePlaceholder = (
  <Avatar
    size={54}
    icon={<FaUserCircle />}
    className="card d-flex justify-content-center align-items-center"
    style={{ marginBottom: 15 }}
  />
);

// If image exist then it will show so that user can delete
function ImageValueEdit(props) {
  const {
    record,
    column,
    local = false,
    containerStyles = {},
    contentStyles = {},
    params = {},
    onEdit,
    originatedFromModal = false,
    parentProps,
    isProfileAction,
    closeToProfileAction,
    moduleID
  } = props;

  const _isMounted = React.useRef(false);
  const [done, setDone] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);
  const val = record[column.field];

  React.useEffect(() => {
    _isMounted.current = true;
    return () => {
      _isMounted.current = false;
    };
  }, []);

  if (done && (isProfileAction || closeToProfileAction))
    return ProfileImagePlaceholder;
  if (done) return null;
  if (column.type !== 'file') return null;

  let isImageTypeField = false;
  if (val && typeof val === 'object' && val.hasOwnProperty('thumbnail')) {
    isImageTypeField = true;
  }

  if (!isImageTypeField) {
    if (
      (isProfileAction || closeToProfileAction) &&
      column.field === keys.PROFILE_IMAGE_FIELD_KEY
    )
      return ProfileImagePlaceholder;
    return null;
  }

  const handleDelete = async () => {
    if (local) return onEdit({ [column.field]: null });
    try {
      setProcessing(true);
      let { module_name } = params;
      if (originatedFromModal || !module_name) {
        // This modal from custom template
        module_name = parentProps.module;
      }
      let ep;
      if (isProfileAction) {
        ep = endpoint.getDeleteProfileFileEndpoint(column.field);
      } else {
        ep = endpoint.getDeleteFileEndpoint(
          module_name,
          moduleID || record._id,
          column.field
        );
      }
      console.log(`Image delete endpoint - `, ep);
      const res = await Axios.delete(ep);
      console.log(`Image delete action response:`, res.data);
      onEdit(
        { ...record, [column.field]: null },
        'Successfully deleted the image file!'
      );
      _isMounted.current && setProcessing(false);
      _isMounted.current && setDone(true);
    } catch (error) {
      handleError(error, true);
      _isMounted.current && setProcessing(false);
    }
  };

  // console.log(val)
  const { thumbnail = '', type = '', uri = '' } = val || {};
  const isImage = type.includes('image');
  const avatarProps = {};
  if (isImage) {
    avatarProps.src = thumbnail || uri;
  } else {
    avatarProps.icon = <FileDoneOutlined size={45} />;
    avatarProps.style = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#4f5d73'
    };
  }

  const _getPopupContainer = () => {
    if (isProfileAction) {
      return null;
    } else {
      return getPopupContainer;
    }
  };

  return (
    <Popconfirm
      title="Are you sure you want to remove this file?"
      onConfirm={handleDelete}
      okText="Yes"
      cancelText="No"
      getPopupContainer={_getPopupContainer()}
      placement={isProfileAction || closeToProfileAction ? 'top' : 'left'}
      disabled={processing}
    >
      <div
        style={{
          marginLeft: isProfileAction || closeToProfileAction ? 0 : 10,
          marginRight: isProfileAction || closeToProfileAction ? 10 : 0,
          position: 'relative',
          ...containerStyles
        }}
      >
        {processing && (
          <div
            style={{
              position: 'absolute',
              top: isProfileAction || closeToProfileAction ? 16 : 13,
              right: isProfileAction || closeToProfileAction ? 21 : 15,
              zIndex: 9
            }}
          >
            <Spin size="small" />
          </div>
        )}
        <div
          style={{
            opacity: processing ? 0.5 : 1,
            pointerEvents: processing ? 'none' : 'auto',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            width: 'max-content',
            textAlign: 'center',
            ...contentStyles
          }}
        >
          {isProfileAction || closeToProfileAction ? (
            <Avatar size={54} src={thumbnail} className="app-box-shadow" />
          ) : (
            <Avatar
              shape="square"
              size={45}
              style={{ border: '1px solid silver' }}
              {...avatarProps}
            />
          )}
          <span style={{ fontSize: 10, color: 'tomato' }}>Delete</span>
        </div>
      </div>
    </Popconfirm>
  );
}

export default ImageValueEdit;
