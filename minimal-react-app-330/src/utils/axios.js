import axios from 'axios';
// config
import { HOST_API } from '../config';

// ----------------------------------------------------------------------

axios.defaults.baseURL = process.env.REACT_APP_API_URL

const axiosInstance = axios.create({
  baseURL: HOST_API,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
