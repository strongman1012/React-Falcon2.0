/* Refresh Token Strategy Using Request Interceptor */
import Axios from 'axios';
import aes from 'crypto-js/aes';
import encUTF8 from 'crypto-js/enc-utf8';

import keys from './keys';
import store from 'redux/store';
import endpoint from './endpoint';
import handleError from './handleError';
import { setHeaderAccessToken } from './axiosHelpers';

/**
 * Add json cleaner to set undefined/null values to empty string.
 * This is to prevent axios(json to string using jsonify) from removing those keys
 * when converting json payload to string.
 */
function cleanJSON(json) {
  for (let key in json) {
    // if (json[key] === undefined || json[key] === null) {
    if (json[key] === undefined) {
      // json[key] = ''
      json[key] = null;
    } else if (typeof json[key] === 'object') json[key] = cleanJSON(json[key]);
  }
  return json;
}

export default () => {
  //Add a axios request interceptor
  Axios.interceptors.request.use(
    async config => {
      // Convert undefined to null so that JSON.stringify can't omit it
      if (['post', 'put', 'patch'].includes(config.method)) {
        config.data = cleanJSON(config.data);
      }

      const { Authorization } = config.headers.common;
      // If there is an 'Authorization' token then user requesting to Protected API endpoint
      // We don't need the Public API endpoint req, so return those
      if (!Authorization) return config;

      const encryptedAccessTokenRes = localStorage.getItem(keys.ACCESS_TOKEN);

      const client_id =
        store.getState().settings?.oauth_clientISbb_oauth_clientsID;
      if (!encryptedAccessTokenRes && !client_id) return config;

      // Decrypt the access token response
      const decryptedTokenRes = aes.decrypt(encryptedAccessTokenRes, client_id);
      const accessTokenRes = JSON.parse(decryptedTokenRes.toString(encUTF8));
      // console.log('Decrypted: ', accessTokenRes)
      // Check for expired token
      const currentTime = Math.floor(Date.now() / 1000);
      const tokenExpTime = accessTokenRes.expires_in;
      const timeDifference = tokenExpTime - currentTime;
      const refreshTokenBefore = 300; // 5 * 60 = 300 seconds = 5 min
      // If still have more than 5 min validity then return original req
      if (timeDifference > refreshTokenBefore) {
        console.log(
          `Access token still valid for ${Math.round(timeDifference / 60)} min.`
        );
        return config;
      }

      // Else refresh the token using API endpoint
      const refreshTokenPostData = {
        client_id,
        grant_type: 'refresh_token',
        refresh_token: accessTokenRes.refresh_token
      };

      try {
        const response = await fetch(endpoint.authTokenEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(refreshTokenPostData)
        });
        const refreshTokenRes = await response.json();
        console.log('Refresh token response:', refreshTokenRes);
        const { access_token, expires_in } = refreshTokenRes;
        // Update 'expires_in' value
        const currentTime = Math.floor(Date.now() / 1000);
        refreshTokenRes['expires_in'] = currentTime + expires_in;
        // Encrypt the access token response
        const encryptedRefreshTokenRes = aes
          .encrypt(JSON.stringify(refreshTokenRes), client_id)
          .toString();
        console.log('Refresh Token Encrypted: ', encryptedRefreshTokenRes);
        // Store encrypted access token response for future use
        localStorage.setItem(keys.ACCESS_TOKEN, encryptedRefreshTokenRes);
        // Update the current req header
        config.headers.common['Authorization'] = 'Bearer ' + access_token;
        // Update the "Authorization" header.
        // So that it will be used in every AJAX req automatically
        setHeaderAccessToken(access_token);
        // Store access token response to redux
        // store.dispatch(setAccessToken(refreshTokenRes))
        return config; // Return with new refreshed token
      } catch (error) {
        handleError(error, true);
      }
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );
};
