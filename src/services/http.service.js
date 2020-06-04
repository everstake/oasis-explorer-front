import axios from 'axios';
import qs from 'qs';
import { startLoader, stopLoader } from '@/plugins/loader.plugin';

const http = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
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
