import { useState } from "react";
import axiosInstance from "../utils/axiosInstance"; // pastikan axiosInstance telah di-configurasi

const useDeleteData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const deleteData = async (endpoint) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.delete(endpoint); // Use DELETE request instead of PUT
      console.log(response);
      setData(response.data); // Store the response data, typically some success message
    } catch (error) {
      setError(error.response?.data?.message || error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteData,
    loading,
    error,
    data,
  };
};

export default useDeleteData;
