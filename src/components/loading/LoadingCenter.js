import React from 'react';
import PropTypes from 'prop-types';

import Loading from '.';

/* props can be -> color, msg, msgColor, opacity */
function LoadingCenter(props) {
  const { style = {}, bgColor } = props;
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: bgColor ? bgColor : 'transparent',
        zIndex: 999999,
        ...style
      }}
    >
      <Loading {...props} />
    </div>
  );
}

export default LoadingCenter;
LoadingCenter.propTypes = {
  component: PropTypes.node,
  msg: PropTypes.string,
  bgColor: PropTypes.string,
  msgColor: PropTypes.string,
  style: PropTypes.object,
  simple: PropTypes.bool
};
