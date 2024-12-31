import React, { useState, useMemo, useReducer, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { IconBuilding, IconGridScan, IconTextCaption, IconTrash } from "@tabler/icons-react";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
import NoData from "../../assets/error/no-data.webp";
import axiosInstance from "../../utils/axiosInstance";
import FormInput from "../../components/FormInput";
import Toast from "../../components/Toast";
import Pagination from "../../components/Pagination";
import useDebounce from "../../hooks/useDebounce";
import DashboardLayouts from "../../layouts/DashboardLayouts";
import JobRole from "./JobRole";

const departmentReducer = (state, action) => {
  switch (action.type) {
    case "SET_FORM_DATA":
      return { ...state, formData: action.payload };
    case "SET_TOAST":
      return { ...state, toast: action.payload };
    case "TOGGLE_MODAL":
      return { ...state, isModalOpen: !state.isModalOpen };
    default:
      return state;
  }
};

const Department = () => {
  const initialState = {
    isModalOpen: false,
    formData: {
      departmentName: "",
      description: "",
    },
    toast: { text: "", type: "success" },
  };
  const [state, dispatch] = useReducer(departmentReducer, initialState);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    responseData: departmentData,
    totalPages: departmentPages,
    refetch: departmentRefetch,
  } = useFetch("/department", { currentPage, pageSize });
  const { submitData: createDepartment, loading: createDepartmentLoading } = useFetch("/department/create", { method: "POST" });

  const debouncedSearch = useDebounce(async (value) => {
    try {
      const response = await axiosInstance.get(`/department?q=${value}`);
      setFilteredDepartments(response.data.code === 200 ? response.data.content : []);
    } catch {
      setFilteredDepartments([]);
    }
  }, 300);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const { success, error, data } = await createDepartment(state.formData);
    if (success) {
      dispatch({ type: "SET_TOAST", payload: { text: data.message, type: "success" } });
      dispatch({ type: "TOGGLE_MODAL" });
      departmentRefetch();
    } else {
      dispatch({ type: "SET_TOAST", payload: { text: error || "An Error Occurred", type: "error" } });
    }
  };

  const handleDeleteDepartment = async (id) => {
    try {
      const response = await axiosInstance.delete(`/department/${id}`);
      if (response.data.code === 200) {
        departmentRefetch();
        dispatch({ type: "SET_TOAST", payload: { text: response.data.message, type: "success" } });
      }
    } catch {
      dispatch({ type: "SET_TOAST", payload: { text: "Failed to delete department", type: "error" } });
    }
  };

  const departmentColumns = useMemo(
    () => [
      {
        key: "departmentId",
        label: "ID",
        icon: <IconGridScan size={20} />,
      },
      {
        key: "departmentName",
        label: "Department Name",
        icon: <IconBuilding size={20} />,
      },
      {
        key: "description",
        label: "Description",
        icon: <IconTextCaption size={20} />,
      },

      {
        key: "departmentId",
        label: "Action",
        render: (id) => (
          <button onClick={() => handleDeleteDepartment(id)} className="text-sm text-red-500 hover:text-red-700">
            <IconTrash />
          </button>
        ),
      },
    ],
    []
  );

  const handlePageChange = (page) => setCurrentPage(page);

  useEffect(() => {
    if (state.toast.text) {
      const timer = setTimeout(() => {
        dispatch({ type: "SET_TOAST", payload: { text: "", type: "success" } });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.toast.text]);

  return (
    <DashboardLayouts>
      <div className="flex flex-col gap-6 px-6">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex w-full justify-between items-center">
            <div className="flex flex-col w-1/2">
              <h1 className="text-2xl font-bold text-gray-800">Manage Departments</h1>
              <p className="text-sm text-gray-600 mb-2">Create a Unified Approach to Department Management.</p>
            </div>
            <div className="flex items-center gap-4 w-1/2 justify-end">
              <div className="flex items-center bg-white border rounded-full w-1/3 p-2 mt-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.5 8.5 7.5 7.5 0 0116.65 16.65z" />
                </svg>
                <input
                  type="text"
                  onChange={(e) => debouncedSearch(e.target.value)}
                  placeholder="Search departments..."
                  className="ml-2 w-full bg-transparent border-none focus:outline-none text-sm text-gray-600"
                />
              </div>

              {/* Dropdown Select */}
              <FormInput
                type="select"
                options={[
                  { label: "10 Department", value: 10 },
                  { label: "20 Department", value: 20 },
                  { label: "50 Department", value: 50 },
                  { label: "100 Department", value: 100 },
                ]}
                value={{ label: `${pageSize} Department`, value: pageSize }}
                onChange={(e) => setPageSize(e.value)}
              />
              <button
                onClick={() => dispatch({ type: "TOGGLE_MODAL" })}
                className="px-5 mt-1 py-2 flex items-center gap-3 text-white bg-emerald-700 rounded-lg shadow-md hover:bg-emerald-800 transition duration-300 whitespace-nowrap"
              >
                <IconBuilding />
                Add Department
              </button>
            </div>
          </div>
        </div>

        <div>
          {(filteredDepartments.length > 0 ? filteredDepartments : departmentData)?.length > 0 ? (
            <>
              <Table columns={departmentColumns} data={filteredDepartments.length > 0 ? filteredDepartments : departmentData || []} />
              <Pagination currentPage={currentPage} totalPages={departmentPages} onPageChange={handlePageChange} />
            </>
          ) : (
            <div className="flex items-center justify-center">
              <img src={NoData} alt="No Data" className="w-72 h-auto" />
            </div>
          )}
        </div>

        {state.isModalOpen && (
          <Modal isOpen={state.isModalOpen}>
            <Modal.Header>Add New Department</Modal.Header>
            <form onSubmit={handleFormSubmit}>
              <Modal.Body>
                <div className="flex flex-col gap-4">
                  <FormInput
                    type="text"
                    label="Department Name"
                    value={state.formData?.departmentName}
                    onChange={(e) => dispatch({ type: "SET_FORM_DATA", payload: { ...state.formData, departmentName: e.target.value } })}
                  />
                  <FormInput
                    type="textarea"
                    label="Description"
                    value={state.formData?.description}
                    onChange={(e) => dispatch({ type: "SET_FORM_DATA", payload: { ...state.formData, description: e.target.value } })}
                  />
                </div>
              </Modal.Body>

              <Modal.Footer>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "TOGGLE_MODAL" })}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createDepartmentLoading}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-200"
                >
                  {createDepartmentLoading ? "Saving..." : "Save"}
                </button>
              </Modal.Footer>
            </form>
          </Modal>
        )}

        {state.toast.text && (
          <Toast
            type={state.toast.type || "error"}
            text={state.toast.text}
            onClick={() => dispatch({ type: "SET_TOAST", payload: { text: "", type: "success" } })}
          />
        )}
      </div>
      <div className="w-full mt-12 px-6">
        <JobRole departmentData={departmentData} />
      </div>
    </DashboardLayouts>
  );
};

export default Department;
