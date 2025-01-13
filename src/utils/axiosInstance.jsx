import axios from "axios";
import { BASE_API_URL, NODE_ENV } from "../config";

const axiosInstance = axios.create({
  baseURL: `${BASE_API_URL}api/v1`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (NODE_ENV === "development") {
      console.error("Response Error:", error);
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (NODE_ENV === "development") {
      console.error("Response Error:", error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Silent handling for response errors
//     if (error.response) {
//       // Server responded with a status other than 2xx
//       console.error("Response error:", error.response.status, error.response.data); // Optional for debugging
//     } else if (error.request) {
//       // No response received
//       console.error("Request error:", error.request); // Optional for debugging
//     } else {
//       // Other errors
//       console.error("Error:", error.message); // Optional for debugging
//     }
//     // Return a resolved promise to avoid throwing the error to the console
//     return Promise.resolve({ data: null, error: true });
//   }
// );
