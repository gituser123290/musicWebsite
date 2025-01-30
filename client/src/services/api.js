
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: apiUrl, 
});


export default api;


// api.interceptors.request.use(config => {
//   config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
//   return config;
// });