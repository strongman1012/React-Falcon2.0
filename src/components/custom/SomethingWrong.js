import React from 'react';
import { Result, Button, Row } from 'antd';

import HeroImage from 'assets/img/error.png';

function SomethingWrong({ title, subTitle, onClick, height, iconStyles = {} }) {
  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: height ?? '100vh' }}
    >
      <Result
        title={title ?? '500'}
        icon={
          <img
            src={HeroImage}
            alt="Something is wrong!"
            width="220px"
            style={iconStyles}
          />
        }
        subTitle={subTitle ?? `Sorry, Something went wrong. Please try again.`}
        extra={
          <Button
            type="dashed"
            onClick={onClick ? () => onClick() : () => window.location.reload()}
          >
            <b>Try Again</b>
          </Button>
        }
      />
    </Row>
  );
}

export default React.memo(SomethingWrong);
