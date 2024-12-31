import React, { useState, useMemo, useReducer, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { IconBriefcase, IconBuilding, IconGridScan, IconTrash } from "@tabler/icons-react";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
import NoData from "../../assets/error/no-data.webp";
import axiosInstance from "../../utils/axiosInstance";
import FormInput from "../../components/FormInput";
import Toast from "../../components/Toast";
import Pagination from "../../components/Pagination";
import useDebounce from "../../hooks/useDebounce";
import { NavLink } from "react-router-dom";

const jobRoleReducer = (state, action) => {
  switch (action.type) {
    case "SET_FORM_DATA":
      return { ...state, formRoleData: action.payload };
    case "SET_TOAST":
      return { ...state, toast: action.payload };
    case "TOGGLE_MODAL":
      return { ...state, isModalOpen: !state.isModalOpen };
    default:
      return state;
  }
};

const JobRole = ({ departmentData }) => {
  const initialState = {
    isModalOpen: false,
    formRoleData: { jobRole: "", departmentId: null },
    toast: { text: "", type: "success" },
  };
  const [state, dispatch] = useReducer(jobRoleReducer, initialState);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const { submitData: jobRoleCreate, loading: jobRoleCreateLoading, error: jobRoleDataError } = useFetch("/jobrole/create", { method: "POST" });

  const debouncedSearch = useDebounce((value) => {
    setDebouncedSearchQuery(value);
  }, 300);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const {
    responseData: jobRoleData,
    totalPages: jobRolePages,
    refetch: jobRoleRefetch,
  } = useFetch(`/jobrole?q=${debouncedSearchQuery}`, { currentPage, pageSize });

  useEffect(() => {
    if (debouncedSearchQuery) {
      jobRoleRefetch();
    }
  }, [debouncedSearchQuery]);

  const handleJobRoleSubmit = async (event) => {
    event.preventDefault();
    const { success, error, data } = await jobRoleCreate(state.formRoleData);
    if (success) {
      dispatch({ type: "SET_TOAST", payload: { text: data.message, type: "success" } });
      dispatch({ type: "TOGGLE_MODAL" });
      jobRoleRefetch();
    } else {
      dispatch({ type: "SET_TOAST", payload: { text: error || "An Error Occurred", type: "error" } });
    }
  };

  const handleDeleteJobRole = async (id) => {
    try {
      const response = await axiosInstance.delete(`/jobrole/${id}`);
      if (response.data.code === 200) {
        jobRoleRefetch();
        dispatch({ type: "SET_TOAST", payload: { text: response.data.message, type: "success" } });
      }
    } catch {
      dispatch({ type: "SET_TOAST", payload: { text: "Failed to delete job role", type: "error" } });
    }
  };

  const renderEmployeeAvatars = (employees) => (
    <div className="flex -space-x-4">
      {employees.map((employee, index) => {
        const profilePicture = employee?.documents[0]?.documentName;
        console.log(profilePicture);
        const profilePictureUrl = profilePicture ? `http://localhost:3000/storage/document/${employee?.userId}/${profilePicture || ""}` : null;

        console.log(profilePictureUrl);

        return profilePicture ? (
          <NavLink to={`/dashboard/employee/${employee?.userId}/details`}>
            <img
              key={index}
              src={profilePictureUrl}
              alt={`${employee.fullName}'s Profile`}
              className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-md"
            />
          </NavLink>
        ) : (
          <NavLink
            to={`/dashboard/employee/${employee?.userId}/details`}
            key={index}
            className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-slate-800 text-sm border-2 border-white"
          >
            {employee?.fullName[0]?.toUpperCase() || "?"}
          </NavLink>
        );
      })}
      {employees.length > 0 && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-slate-800 text-sm border-2 border-white">
          {`+${employees.length}`}
        </div>
      )}
    </div>
  );

  const jobRoleColumns = useMemo(
    () => [
      {
        key: "jobRoleId",
        label: "ID",
        icon: <IconGridScan size={20} />,
      },
      {
        key: "jobRoleTitle",
        label: "Job Role",
        icon: <IconBriefcase size={20} />,
      },
      {
        key: "department",
        label: "Department",
        icon: <IconBuilding size={20} />,
        render: (department) => <span>{department.departmentName}</span>,
      },
      {
        key: "employees",
        label: "Employees",
        icon: <IconBriefcase size={20} />,
        render: renderEmployeeAvatars,
      },
      {
        key: "jobRoleId",
        label: "Action",
        render: (id) => (
          <button onClick={() => handleDeleteJobRole(id)} className="text-sm text-red-500 hover:text-red-700">
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex w-full justify-between items-center">
          <div className="flex flex-col w-1/2">
            <h1 className="text-2xl font-bold text-gray-800">Manage Job Roles</h1>
            <p className="text-sm text-gray-600 mb-2">Easily manage and organize job roles across different departments.</p>
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
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search job roles..."
                className="ml-2 w-full bg-transparent border-none focus:outline-none text-sm text-gray-600"
              />
            </div>

            {/* Dropdown Select */}
            <FormInput
              type="select"
              options={[
                { label: "10 Job Roles", value: 10 },
                { label: "20 Job Roles", value: 20 },
                { label: "50 Job Roles", value: 50 },
                { label: "100 Job Roles", value: 100 },
              ]}
              value={{ label: `${pageSize} Job Roles`, value: pageSize }}
              onChange={(e) => setPageSize(e.value)}
            />
            <button
              onClick={() => dispatch({ type: "TOGGLE_MODAL" })}
              className="px-5 mt-1 py-2 flex items-center gap-3 text-white bg-emerald-700 rounded-lg shadow-md hover :bg-emerald-800 transition duration-300"
            >
              <IconBriefcase />
              Add Job Role
            </button>
          </div>
        </div>
      </div>

      <div>
        <Table columns={jobRoleColumns} data={jobRoleData || []} />
        <Pagination currentPage={currentPage} totalPages={jobRolePages} onPageChange={handlePageChange} />
      </div>

      {state.isModalOpen && (
        <Modal isOpen={state.isModalOpen}>
          <Modal.Header>Add Job Role</Modal.Header>
          <form onSubmit={handleJobRoleSubmit}>
            <Modal.Body>
              <div className="flex flex-col gap-4">
                <FormInput
                  type="text"
                  label="Job Role Title"
                  value={state.formRoleData?.jobRole}
                  onChange={(e) => dispatch({ type: "SET_FORM_DATA", payload: { ...state.formRoleData, jobRole: e.target.value } })}
                />
                <FormInput
                  type="select"
                  options={departmentData.map((dept) => ({
                    value: dept.departmentId,
                    label: dept.departmentName,
                  }))}
                  label="Department"
                  onChange={(selectedOption) =>
                    dispatch({ type: "SET_FORM_DATA", payload: { ...state.formRoleData, departmentId: selectedOption.value } })
                  }
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
                disabled={jobRoleCreateLoading}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-200"
              >
                {jobRoleCreateLoading ? "Saving..." : "Save"}
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
  );
};

export default JobRole;
