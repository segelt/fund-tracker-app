import axios from 'axios';

export const CancelToken = axios.CancelToken;

//ipconfig --> IPv4 address needs to be included
export default axios.create({
  baseURL: 'http://192.168.5.108:8080/api',
  timeout: 10000,
});
