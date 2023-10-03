import React from 'react';

import Loading from './index';

/* props can be -> color, msg, msgColor, opacity */
function LoaderOverlay(props) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        height: '100vh',
        width: '100vw',
        scroll: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: `rgba(0, 0, 0, ${
          props.opacity ? props.opacity : 0.7
        })`,
        zIndex: 999999
      }}
    >
      <Loading msgColor="#fff" {...props} />
    </div>
  );
}

export default LoaderOverlay;
