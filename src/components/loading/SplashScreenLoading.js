import React from 'react';

import keys from 'utils/keys';
import vars from 'utils/vars';
import Loading from '.';
import Logo from '../../assets/img/logo.png';

/* props can be -> color, msg, msgColor, opacity */
function SplashScreenLoading(props) {
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
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999999
      }}
    >
      <img
        className="mb-4"
        src={localStorage.getItem(keys.SPLASH_LOGO) || Logo}
        width="200px"
        alt={vars.APP_NAME}
      />
      <Loading {...props} style={{ marginTop: 0 }} msgColor="inherit" />
    </div>
  );
}

export default SplashScreenLoading;
