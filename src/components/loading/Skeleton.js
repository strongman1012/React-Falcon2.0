import React from 'react';
import { Skeleton } from 'antd';

export default function ({ number = 1 }) {
  return (
    <>
      {Array(number)
        .fill()
        .map((item, index) => (
          <Skeleton active key={index} />
        ))}
    </>
  );
}
