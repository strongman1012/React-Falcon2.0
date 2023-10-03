import axios from 'axios';

export const setAxiosDefaultHeader = flag => {
  console.log('set default log');
  if (flag === true) {
    axios.defaults.crossDomain = true;
    axios.defaults.withCredentials = true;
  } else if (flag === false) {
    axios.defaults.crossDomain = false;
    axios.defaults.withCredentials = false;
  }
};

export const setHeaderAccessToken = token => {
  if (token) {
    // Apply to every request
    console.log('Setting up "Authorization" header to Axios!');
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  } else {
    // Delete auth header
    console.log('Deleting "Authorization" header to Axios!');
    delete axios.defaults.headers.common['Authorization'];
  }
};
