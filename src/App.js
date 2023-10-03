import Axios from 'axios';
import { Provider } from 'react-redux';
import React, { useState, useEffect, useRef } from 'react';

import './assets/less/antd.less';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-datepicker/dist/react-datepicker.css';

import AppBody from 'AppBody';
import keys from 'utils/keys';
import store from './redux/store';
import endpoint from 'utils/endpoint';
import handleError from 'utils/handleError';
import { getQueryVariable, sleep } from 'helpers/utils';
import { setCurrentUser } from 'redux/slices/authSlice';
import { setSettings } from 'redux/slices/settingsSlice';
import LoadingCenter from 'components/loading/LoadingCenter';
import SplashScreenLoading from 'components/loading/SplashScreenLoading';

const App = () => {
  const _isMounted = useRef(false);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const checkUserSession = async () => {
    try {
      _isMounted.current && setChecking(true);
      const userProfileRes = await Axios.get(endpoint.userProfile);
      const user = userProfileRes.data;
      console.log('App User Profile: ', user);
      store.dispatch(setCurrentUser(user));
      _isMounted.current && setChecking(false);

      const isDebugChecked = getQueryVariable('debug') || '';
      // Disable console.log in prod
      console.log('NODE_ENV:', process.env.NODE_ENV);
      if (process.env.NODE_ENV === 'production') {
        if (user?.permissions?.admin === true) return; // Admin can see
        // Else have to put ?debug=yes|1 (any value)
        if (!isDebugChecked) {
          console.log = () => {};
        }
      }
    } catch (error) {
      console.log('User needs to login:', error);
      _isMounted.current && setChecking(false);
    }
  };

  const getAppSettings = async () => {
    try {
      _isMounted.current && setLoading(true);
      await sleep(500); // For splash feel
      const settingsRes = await Axios.get(endpoint.settings);
      const settingsData = settingsRes.data;
      console.log('App Settings: ', settingsData);
      const splash_logo = settingsData?.splash_logoISfile?.uri;
      if (splash_logo) localStorage.setItem(keys.SPLASH_LOGO, splash_logo);

      // Change app title
      document.title = settingsData.title;
      store.dispatch(setSettings(settingsData));

      updateRedirectAfterLoginVal(localStorage.getItem(keys.REDIRECT));

      await checkUserSession(settingsData);

      _isMounted.current && setLoading(false);
    } catch (error) {
      handleError(error, true);
      _isMounted.current &&
        setError('Something went wrong. Please refresh & try again!');
    }
  };

  const updateRedirectAfterLoginVal = val =>
    val !== '/' &&
    val !== '/login' &&
    localStorage.setItem(keys.REDIRECT_AFTER_LOGIN, val);

  useEffect(() => {
    _isMounted.current = true;
    getAppSettings();
    return () => {
      _isMounted.current = false;
    };
  }, []);

  if (loading && error)
    return <LoadingCenter msg={error} msgColor="tomato" simple={true} />;
  if (loading || checking)
    return <SplashScreenLoading msg="Loading Application..." simple={true} />;

  return (
    <>
      <Provider store={store}>
        <AppBody />
      </Provider>
    </>
  );
};

export default App;
