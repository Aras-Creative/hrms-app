import React, { useEffect, useReducer, useMemo, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import {
  IconAddressBook,
  IconBriefcase,
  IconChevronDown,
  IconDots,
  IconDownload,
  IconFilter,
  IconGenderBigender,
  IconGenderFemale,
  IconGenderMale,
  IconGraph,
  IconGridScan,
  IconLayoutGridRemove,
  IconListDetails,
  IconPhone,
  IconPlus,
  IconSearch,
  IconUser,
} from "@tabler/icons-react";
import Table from "../../../components/Table";
import DashboardLayouts from "../../../layouts/DashboardLayouts";
import { NavLink } from "react-router-dom";
import FormInput from "../../../components/FormInput";
import axiosInstance from "../../../utils/axiosInstance";
import useDebounce from "../../../hooks/useDebounce";
import Grid from "../../../components/Grid";
import { fetchJobRoles, genderFilterOptions } from "../../../utils/SelectOptions";

// Initial state for the reducer
const initialState = {
  currentPage: 1,
  pageSize: 20,
  totalPages: null,
  tableView: "list",
  filter: false,
  jobRoleOptions: [],
  filterParams: {
    gender: "",
    jobRole: {
      jobRoleId: "",
      jobRoleTitle: "",
    },
  },
  searchQuery: "",
  debouncedSearchQuery: "",
};

// Reducer function to manage state
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_TOTAL_PAGES":
      return { ...state, totalPages: action.payload };
    case "SET_TABLE_VIEW":
      return { ...state, tableView: action.payload };
    case "TOGGLE_FILTER":
      return { ...state, filter: !state.filter };
    case "SET_JOB_ROLE_OPTIONS":
      return { ...state, jobRoleOptions: action.payload };
    case "SET_FILTER_PARAMS":
      return { ...state, filterParams: action.payload };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_DEBOUNCED_SEARCH_QUERY":
      return { ...state, debouncedSearchQuery: action.payload };
    default:
      return state;
  }
};

const Employee = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentPage, pageSize, totalPages, tableView, filter, jobRoleOptions, filterParams, searchQuery, debouncedSearchQuery } = state;

  const debouncedSearch = useDebounce((value) => {
    dispatch({ type: "SET_DEBOUNCED_SEARCH_QUERY", payload: value });
  }, 300);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    dispatch({ type: "SET_SEARCH_QUERY", payload: value });
    debouncedSearch(value);
  };

  const query = useMemo(() => {
    const genderQuery = filterParams.gender ? `gender=${filterParams.gender.toLowerCase()}` : "";
    const jobRoleQuery = filterParams.jobRole.jobRoleId ? `jobRole=${filterParams.jobRole.jobRoleId.toLowerCase()}` : "";
    const q = debouncedSearchQuery ? `q=${debouncedSearchQuery.toLowerCase()}` : "";
    return [genderQuery, jobRoleQuery, q].filter(Boolean).join("&");
  }, [filterParams, debouncedSearchQuery]);

  const url = `/employee${query ? `?${query}` : ""}`;

  const {
    responseData: employeeData = [],
    loading: employeeDataLoading,
    error: employeeDataError,
    totalPages: employeeDataPages,
    refetch: employeeDataRefetch,
  } = useFetch(url, { currentPage, pageSize });

  useEffect(() => {
    if (debouncedSearchQuery) {
      employeeDataRefetch();
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (employeeDataPages) {
      dispatch({ type: "SET_TOTAL_PAGES", payload: employeeDataPages });
    }
  }, [employeeDataPages]);

  useEffect(() => {
    fetchJobRoles(true, dispatch);
  }, [filter]);

  const employeeColumns = useMemo(
    () => [
      {
        key: "employeeId",
        label: "ID",
        icon: <IconGridScan size={20} />,
      },
      {
        key: "fullName",
        label: "Employee Name",
        icon: <IconUser size={20} />,
        render: (value, rowData) => {
          if (!rowData) return <span>Loading...</span>;

          const profileImage =
            rowData.document?.[0]?.documentName && `http://localhost:3000/storage/document/${rowData.employeeId}/${rowData.document[0].documentName}`;

          return (
            <div className="flex items-center gap-3">
              {profileImage ? (
                <img src={profileImage} alt={`${value}'s Profile`} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-slate-800 text-sm">
                  {value?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-bold 2xl:w-full sm:w-24 lg:w-48 truncate">{value}</span>
                <p className="text-xs text-slate-800 font-normal">{rowData?.email}</p>
              </div>
            </div>
          );
        },
      },
      { key: "gender", label: "Gender", icon: <IconGenderBigender size={20} /> },
      { key: "jobRole", label: "Job Role", icon: <IconBriefcase size={20} />, render: (value) => value?.jobRoleTitle },
      { key: "status", label: "Status", icon: <IconGraph size={20} />, render: () => "Active" },
      {
        key: "phoneNumber",
        label: "Contact Information",
        icon: <IconAddressBook size={20} />,
        render: (value) => (
          <span className="text-blue-500 px-2 py-1 rounded-full border text-xs border-blue-500 inline-flex gap-1 items-center">
            <IconPhone size={16} /> {value}
          </span>
        ),
      },
      {
        key: "actions",
        label: "Action",
        icon: "",
        render: (value, rowData) => (
          <NavLink to={`/dashboard/employee/${rowData?.user.userId}/details`}>
            <IconDots />
          </NavLink>
        ),
      },
    ],
    []
  );

  const handleTableViewChange = (view) => {
    dispatch({ type: "SET_TABLE_VIEW", payload: view });
  };

  return (
    <DashboardLayouts>
      <div className="px-6 py-3">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800">Employees</h1>
              <p className="text-gray-600 text-sm">Manage your company's employee data and roles.</p>
            </div>
            <div className="flex item-center gap-3">
              <NavLink
                to={"contract"}
                className="bg-emerald-700 flex items-center gap-1 hover:bg-emerald-800 rounded-lg transition-all duration-300 ease-in-out px-3 py-2 text-white"
              >
                <IconPlus size={20} />
                <span className="text-sm text-white font-bold">Add New Employee</span>
              </NavLink>
              <div className="bg-white flex items-center gap-1 hover:bg-zinc-50 rounded-lg transition-all duration-300 ease-in-out px-3 py-2 border border-zinc-300">
                <IconDownload size={20} />
                <span className=" text-sm text-zinc-600 font-bold">Download XLSX</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-between items-center mb-5">
          <div className="flex items-center bg-white border rounded-full w-1/3 p-2">
            <IconSearch />
            <input
              type="text"
              onChange={handleSearchChange}
              value={searchQuery}
              placeholder="Search employee name..."
              className="ml-2 w-full bg-transparent border-none focus:outline-none text-sm text-gray-600"
            />
          </div>
          <div className="flex gap-3 items-center max-w-1/2 justify-end scrollbar-none">
            <div className="relative">
              <button
                type="button"
                onClick={() => dispatch({ type: "TOGGLE_FILTER" })}
                className="bg-white border rounded-lg px-4 py-2 flex items-center gap-1"
              >
                <div className="pr-2">
                  <div
                    className={`h-5 w-5 items-center ${
                      !filterParams.gender && !filterParams.jobRole.jobRoleId ? "hidden" : "flex"
                    } justify-center text-xs text-white rounded-full bg-emerald-700`}
                  />
                </div>
                <IconFilter size={16} />
                Filter
                <div className="pl-2">
                  <IconChevronDown size={12} />
                </div>
              </button>
              {filter && (
                <div className="absolute flex items-start top-12 gap-1 w-64 right-0 flex-row-reverse">
                  <div className="bg-white rounded-xl shadow w-full px-4 py-3">
                    <div className="pb-1 flex justify-between items-center">
                      <h1 className="text-sm font-semibold">Select Filter</h1>
                      <button
                        type="button"
                        onClick={() => {
                          dispatch({
                            type: "SET_FILTER_PARAMS",
                            payload: {
                              gender: "",
                              jobRole: { jobRoleId: "", jobRoleTitle: "" },
                            },
                          });
                          dispatch({ type: "TOGGLE_FILTER" });
                        }}
                        className="text-emerald-700 text-xs"
                      >
                        Clear Filter
                      </button>
                    </div>
                    <FormInput
                      type="select"
                      options={genderFilterOptions}
                      placeholder={"Filter by gender"}
                      value={{
                        label: (
                          <div className="flex items-center gap-1">
                            {filterParams.gender === "Male" ? (
                              <IconGenderMale size={20} />
                            ) : filterParams.gender === "Female" ? (
                              <IconGenderFemale size={20} />
                            ) : (
                              "Select Gender"
                            )}
                            <span className="text-sm text-zinc-800">{filterParams.gender}</span>
                          </div>
                        ),
                        value: filterParams.gender,
                      }}
                      onChange={(e) => dispatch({ type: "SET_FILTER_PARAMS", payload: { ...filterParams, gender: e.value } })}
                    />
                    <FormInput
                      type="select"
                      options={jobRoleOptions}
                      placeholder={"Filter by job role"}
                      value={
                        filterParams.jobRole.jobRoleId ? { label: filterParams.jobRole.jobRoleTitle, value: filterParams.jobRole.jobRoleId } : null
                      }
                      onChange={(e) =>
                        dispatch({ type: "SET_FILTER_PARAMS", payload: { ...filterParams, jobRole: { jobRoleId: e.value, jobRoleTitle: e.label } } })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="items-center flex gap-2 text-zinc-700">
              <button
                type="button"
                onClick={() => handleTableViewChange("grid")}
                className={`${
                  tableView === "grid" ? "bg-zinc-200" : "bg-white"
                } p-1 rounded border border-zinc-300 hover:bg-zinc-200 transition-all duration-300 ease-in-out`}
              >
                <IconLayoutGridRemove size={25} />
              </button>
              <button
                type="button"
                onClick={() => handleTableViewChange("list")}
                className={`${
                  tableView === "list" ? "bg-zinc-200" : "bg-white"
                } p-1 rounded border border-zinc-300 hover:bg-zinc-200 transition-all duration-300 ease-in-out`}
              >
                <IconListDetails size={25} />
              </button>
            </div>
          </div>
        </div>
        {employeeDataLoading ? (
          <p>Loading...</p>
        ) : employeeDataError ? (
          <p className="text-red-500">Failed to load employee data.</p>
        ) : tableView === "list" ? (
          <Table title="Employee Table" columns={employeeColumns} data={employeeData || []} />
        ) : (
          <Grid data={employeeData} />
        )}
      </div>
    </DashboardLayouts>
  );
};

export default Employee;
