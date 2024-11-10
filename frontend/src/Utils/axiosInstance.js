import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://bill-project-backend.onrender.com/",
});

export default axiosInstance;


// "http://localhost:3002/"