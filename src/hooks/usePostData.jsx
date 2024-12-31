import { useState } from "react";
import axiosInstance from "../utils/axiosInstance"; // pastikan axiosInstance telah di-configurasi

const usePostData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const postData = async (endpoint, payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(endpoint, payload);
      console.log(response);
      setData(response.data);
    } catch (error) {
      setError(error.response?.data?.message || error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return {
    postData,
    loading,
    error,
    data,
  };
};

export default usePostData;
