import React, { useState } from 'react';
import axios from 'axios';
import { Popconfirm, Button, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import endpoint from 'utils/endpoint';
import handleError from 'utils/handleError';

function DeleteDataItemBtn({
  module,
  id,
  onDelete,
  local,
  hasDeletePermission,
  getPopupContainer,
  popupTitle = 'Delete this item?',
  endpoint: ep
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (local === true) {
      return onDelete(id);
    }
    try {
      setLoading(true);
      const res = await axios.delete(
        ep || endpoint.getDataItemDeleteEndpoint(module, id)
      );
      console.log('Data item delete response:', res.data);
      setLoading(false);
      onDelete(id);
    } catch (error) {
      setLoading(false);
      handleError(error, true);
    }
  };

  if (!hasDeletePermission) return null;

  const popupProps = {};
  if (getPopupContainer) {
    popupProps.getPopupContainer = getPopupContainer;
  }

  return (
    <Popconfirm
      title={popupTitle}
      placement="left"
      onConfirm={handleDelete}
      {...popupProps}
    >
      <Tooltip title="Delete" {...popupProps}>
        <Button
          loading={loading}
          type="link"
          size="small"
          style={{ color: 'tomato' }}
          icon={<DeleteOutlined />}
        />
      </Tooltip>
    </Popconfirm>
  );
}

export default DeleteDataItemBtn;
