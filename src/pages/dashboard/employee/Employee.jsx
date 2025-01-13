import React, { useEffect, useReducer, useMemo, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import {
  IconAddressBook,
  IconBriefcase,
  IconDots,
  IconDownload,
  IconFileImport,
  IconGenderBigender,
  IconGraph,
  IconGridScan,
  IconPhone,
  IconPlus,
  IconUser,
} from "@tabler/icons-react";
import Table from "../../../components/Table";
import DashboardLayouts from "../../../layouts/DashboardLayouts";
import { NavLink } from "react-router-dom";
import useDebounce from "../../../hooks/useDebounce";
import Grid from "../../../components/Grid";
import { fetchJobRoles } from "../../../utils/SelectOptions";
import SearchInput from "../../../components/SearchInput";
import FilterDropdown from "../../../components/FilterDropdown";
import TableViewButtons from "../../../components/TableViewButton";
import { STORAGE_URL } from "../../../config";
import { toTitleCase } from "../../../utils/toTitleCase";
import { InternalServerError, NotFound } from "../../../components/Errors";
import { Loading } from "../../../components/Preloaders";
import FormInput from "../../../components/FormInput";
import Pagination from "../../../components/Pagination";
import { handleDownloadFile } from "../../../utils/handleDownloadFile";
import ExcelUpload from "../../../components/ExcelUpload";

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
    status: "",
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
    case "SET_PAGE_SIZE":
      return { ...state, pageSize: action.payload };
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
    const statusQuery = filterParams.status ? `status=${filterParams.status.toLowerCase()}` : "";
    const q = debouncedSearchQuery ? `q=${debouncedSearchQuery.toLowerCase()}` : "";
    return [genderQuery, jobRoleQuery, q, statusQuery].filter(Boolean).join("&");
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
    employeeDataRefetch();
  }, [pageSize, currentPage]);
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
        key: "fullName",
        label: "Nama Lengkap Karyawan",
        icon: <IconUser size={20} />,
        render: (value, rowData) => {
          if (!rowData) return <span>Loading...</span>;
          const profileImage = rowData.profilePicture && `${STORAGE_URL}/document/${rowData.userId}/${rowData.profilePicture.path}`;
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
                <p className="text-xs text-slate-800 font-normal">{rowData?.employeeId}</p>
              </div>
            </div>
          );
        },
      },
      { key: "gender", label: "Jenis Kelamin", icon: <IconGenderBigender size={20} />, render: (value) => value || "-" },
      { key: "jobRole", label: "Job Role", icon: <IconBriefcase size={20} />, render: (value) => value?.jobRoleTitle },
      {
        key: "status",
        label: "Status",
        icon: <IconGraph size={20} />,
        render: (value) => (
          <div
            className={`${
              value === "aktif"
                ? "bg-green-100 text-emerald-700 border-emerald-700"
                : value === "nonaktif"
                ? "bg-red-100 text-red-500 border-red-500"
                : value === "peringatan"
                ? "bg-yellow-100 text-yellow-500 border-yellow-500"
                : "bg-zinc-100 text-zinc-500"
            } inline-flex rounded-full border px-2 py-1`}
          >
            {toTitleCase(value)}
          </div>
        ),
      },
      {
        key: "phoneNumber",
        label: "Informasi Kontak",
        icon: <IconAddressBook size={20} />,
        render: (value, rowData) => (
          <div className="flex gap-2">
            {value && (
              <span className="text-blue-500 px-2 py-1 rounded-full border text-xs border-blue-500 inline-flex gap-1 items-center">
                <IconPhone size={16} /> {value}
              </span>
            )}
            {rowData?.emergencyContact && (
              <span className="text-blue-500 px-2 py-1 rounded-full border text-xs border-blue-500 inline-flex gap-1 items-center">
                <IconPhone size={16} /> {rowData?.emergencyContact}
              </span>
            )}
            {!value && !rowData?.emergencyContact && <span className="text-gray-500 text-sm">-</span>}
          </div>
        ),
      },

      {
        key: "userId",
        label: "Action",
        icon: "",
        render: (value, rowData) => (
          <NavLink to={`/dashboard/employee/${value}/details`}>
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

  const handlePageChange = (page) => dispatch({ type: "SET_PAGE", payload: page });

  return (
    <DashboardLayouts>
      <div className="px-6 py-3">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800">Data Karyawan</h1>
              <p className="text-gray-600 text-sm">Kelola data dan peran karyawan perusahaan Anda.</p>
            </div>
            <div className="flex item-center gap-3">
              <NavLink
                to={"contract"}
                className="bg-emerald-700 flex items-center gap-1 hover:bg-emerald-800 rounded-lg transition-all duration-300 ease-in-out px-3 py-2 text-white"
              >
                <IconPlus size={20} />
                <span className="text-sm text-white font-bold">Tambah Data Karyawan</span>
              </NavLink>
              <ExcelUpload />

              <button
                type="button"
                onClick={() => handleDownloadFile("/document/download-employee", "employees-data.xlsx")}
                className="bg-white flex items-center gap-1 hover:bg-zinc-50 rounded-lg transition-all duration-300 ease-in-out px-3 py-2 border border-zinc-300"
              >
                <IconDownload size={20} />
                <span className=" text-sm text-zinc-600 font-bold">Download XLSX</span>
              </button>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-between items-center mb-5">
          <SearchInput searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
          <div className="flex gap-3 items-center max-w-1/2 justify-end scrollbar-none">
            <FilterDropdown filter={filter} filterParams={filterParams} jobRoleOptions={jobRoleOptions} dispatch={dispatch} />
            <FormInput
              type="select"
              options={[
                { label: "10 Karyawan", value: 10 },
                { label: "20 Karyawan", value: 20 },
                { label: "50 Karyawan", value: 50 },
                { label: "100 Karyawan", value: 100 },
              ]}
              value={{ label: `${pageSize} Karyawan`, value: pageSize }}
              onChange={(e) => dispatch({ type: "SET_PAGE_SIZE", payload: e.value })}
            />
            <TableViewButtons tableView={tableView} handleTableViewChange={handleTableViewChange} />
          </div>
        </div>

        {employeeDataLoading ? (
          <Loading />
        ) : employeeDataError?.status === 404 ? (
          <NotFound />
        ) : employeeDataError?.status === 500 ? (
          <InternalServerError />
        ) : tableView === "list" ? (
          <>
            <Table title="Employee Table" columns={employeeColumns} data={employeeData || []} />
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
          </>
        ) : (
          <Grid data={employeeData} />
        )}
      </div>
    </DashboardLayouts>
  );
};

export default Employee;
