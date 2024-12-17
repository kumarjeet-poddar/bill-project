import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://bill-project-backend.onrender.com/',
  // baseURL: "http://localhost:3002/",
});

export default axiosInstance;
