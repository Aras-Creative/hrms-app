import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const useFetch = (endpoint, options = {}) => {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const { method = "GET", params = {}, data = null, headers = {}, pageSize = 10, currentPage = 1, allowCredentials = "include" } = options;

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance({
        method,
        url: endpoint,
        params: {
          ...params,
          page: currentPage,
          pageSize,
        },
        allowCredentials,
        data,
        headers,
      });

      if (method === "GET") {
        const { content, pagination } = response.data;
        if (pagination && pagination.totalItems) {
          setTotalPages(Math.ceil(pagination.totalItems / pageSize));
        } else {
          setTotalPages(1);
        }
        setResponseData(content);
      } else {
        setResponseData(response.data);
      }
    } catch (err) {
      setError(err.response ? { status: err.response.data.status, message: err.response.data.message } : { message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const deleteData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.delete(endpoint, { headers });
      setResponseData(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response ? err.response.data.message : err.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const submitData = async (submitData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(endpoint, submitData, { headers });
      setResponseData(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response ? err.response.data.message || err.response.data.details[0] : err.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateData = async (updateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put(endpoint, updateData, { headers });
      setResponseData(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response ? err.response.data.message || err.response.data.details[0] : err.message;
      setError(err.response ? err.response.data.message : err.message);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (method === "GET") fetchData();
  }, [refreshKey, endpoint, pageSize, currentPage, method]);

  return {
    responseData,
    loading,
    error,
    totalPages,
    refetch,
    submitData,
    updateData,
    deleteData,
  };
};

export default useFetch;
