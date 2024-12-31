import { useState } from "react";
import axiosInstance from "../utils/axiosInstance"; // pastikan axiosInstance telah di-configurasi

const useUpdateData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const updateData = async (endpoint, payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put(endpoint, payload);
      console.log(response);
      setData(response.data);
    } catch (error) {
      setError(error.response?.data?.message || error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return {
    updateData,
    loading,
    error,
    data,
  };
};

export default useUpdateData;
