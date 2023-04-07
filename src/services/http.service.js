import axios from 'axios';
import qs from 'qs';
import { startLoader, stopLoader } from '@/plugins/loader.plugin';
import constants from '@/plugins/constants.plugin';

const http = axios.create({
  baseURL: constants.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer(params) {
    return qs.stringify(params, { arrayFormat: 'repeat' });
  },
});

http.interceptors.request.use(
  (config) => {
    startLoader();
    return config;
  },
  (error) => {
    stopLoader();
    return error;
  },
);

http.interceptors.response.use(
  (response) => {
    stopLoader();
    return response;
  },
  (error) => {
    stopLoader();
    return error;
  },
);

export default http;
