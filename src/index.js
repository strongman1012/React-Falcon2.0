import React from 'react';
import ReactDOM from 'react-dom';
import HttpsRedirect from 'react-https-redirect';

import App from './App';
import 'helpers/initFA';
import Main from './Main';
import keys from 'utils/keys';
import { setAxiosDefaultHeader } from 'utils/axiosHelpers';
import axiosReqInterceptor from 'utils/axiosReqInterceptor';

// Capture the initial req route
const initReqRoute = window.location.pathname + window.location.search;
console.log('Init page req:', initReqRoute);
localStorage.setItem(keys.REDIRECT, initReqRoute);

setAxiosDefaultHeader(true);
// Activate 'Refresh Token Strategy'
axiosReqInterceptor();

ReactDOM.render(
  <>
    <HttpsRedirect>
      <Main>
        <App />
      </Main>
    </HttpsRedirect>
  </>,
  document.getElementById('main')
);
