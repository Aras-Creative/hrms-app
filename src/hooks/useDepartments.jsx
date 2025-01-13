import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const useDepartments = (currentPage, pageSize) => {
  const [departmentData, setDepartmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getDepartments = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/department", {
          params: {
            page: currentPage,
            pageSize: pageSize,
          },
        });
        const { content, pagination } = response.data;
        if (pagination && pagination.totalItems) {
          setTotalPages(Math.ceil(pagination.totalItems / pageSize));
        } else {
          setTotalPages(1);
        }

        setDepartmentData(content);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    getDepartments();
  }, [currentPage, pageSize]);

  return { departmentData, loading, error, totalPages };
};

export default useDepartments;
