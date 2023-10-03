import React from 'react';
import { Empty } from 'antd';

import Image from 'assets/img/no-permission.png';

function NoPermission(props) {
  const { imgStyles = {}, msg = `You don't have required permission.` } = props;

  return (
    <Empty
      className="my-4"
      image={Image}
      imageStyle={{ height: 150, ...imgStyles }}
      description={<b>{msg}</b>}
    />
  );
}

export default NoPermission;
