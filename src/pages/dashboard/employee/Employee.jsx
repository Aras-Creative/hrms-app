import React, { useEffect, useReducer, useMemo, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import {
  IconAddressBook,
  IconAlarm,
  IconBriefcase,
  IconDownload,
  IconGenderBigender,
  IconGraph,
  IconPhone,
  IconPlus,
  IconUser,
  IconX,
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
import { validateEmployeeData } from "../../../utils/excelValidations";
import { EmployeeColumns } from "../../../utils/excelColumns";
import Modal from "../../../components/Modal";
import Datepicker from "../../../components/Datepicker";

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
  const [modal, setModal] = useState({ title: "" });
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
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [contractStart, setContractStart] = useState(new Date());
  const [contractEnd, setContractEnd] = useState(new Date());
  const [shiftOptions, setShiftOptions] = useState(new Date());

  const {
    responseData: employeeData,
    loading: employeeDataLoading,
    error: employeeDataError,
    totalPages: employeeDataPages,
    refetch: employeeDataRefetch,
  } = useFetch(url, { currentPage, pageSize });
  const { responseData: shiftData, refetch: shiftRefetch, loading: shiftLoading, error: shiftErr } = useFetch(`/shift`);

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

  useEffect(() => {
    if (shiftData && !shiftLoading && !shiftErr) {
      const options = shiftData?.map((shift, idx) => ({ label: `${shift.name} ( ${shift.clockIn} - ${shift.clockOut})`, value: shift.id }));
      setShiftOptions(options);
    }
  }, [shiftData]);

  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    const userId = event.target.value;
    setSelectedUserIds((prevSelected) => {
      if (isChecked) {
        return [...prevSelected, userId];
      } else {
        return prevSelected.filter((id) => id !== userId);
      }
    });
  };

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
              <div>
                <label>
                  <input type="checkbox" value={rowData?.userId} onChange={handleCheckboxChange} />
                </label>
              </div>

              {profileImage ? (
                <NavLink to={`/dashboard/employee/${rowData?.userId}/details`} className="w-8 h-8 rounded-full overflow-hidden">
                  <img src={profileImage} alt={`${value}'s Profile`} className="w-full h-full object-cover" />
                </NavLink>
              ) : (
                <NavLink
                  to={`/dashboard/employee/${rowData?.userId}/details`}
                  className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-slate-800 text-sm"
                >
                  {value?.[0]?.toUpperCase() || "?"}
                </NavLink>
              )}
              <div className="flex flex-col">
                <span className="font-bold 2xl:w-full sm:w-24 lg:w-36 truncate overflow-hidden text-sm">{value}</span>
                <p className="text-xs text-slate-800 font-normal">{rowData?.employeeId}</p>
              </div>
            </div>
          );
        },
      },
      {
        key: "gender",
        label: "Jenis Kelamin",
        icon: <IconGenderBigender size={20} />,
        render: (value) => <span className="text-sm">{value || "?"}</span>,
      },
      {
        key: "jobRole",
        label: "Job Role",
        icon: <IconBriefcase size={20} />,
        render: (value) => <span className="text-sm">{value?.jobRoleTitle || "?"}</span>,
      },
      {
        key: "workingHours",
        label: "Jam Kerja",
        icon: <IconAlarm />,
        render: (value) => (value ? <span className="text-sm">{`${value.clockIn || "N/A"} - ${value.clockOut || "N/A"}`}</span> : "-"),
      },
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
            } inline-flex rounded-full border px-2 py-1 text-xs`}
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
    ],
    []
  );

  const handleTableViewChange = (view) => {
    dispatch({ type: "SET_TABLE_VIEW", payload: view });
  };

  const { updateData: updateJobRoleData = [], loading: updateJobroleLoading } = useFetch("employee/jobrole/update", { method: "PUT" });
  const { updateData: updateShiftData = [], loading: updateShiftLoading } = useFetch("employee/shift/update", { method: "PUT" });

  const updateJobRole = async (value) => {
    const data = {
      jobRoleId: value,
      userIds: selectedUserIds,
    };
    const { success } = await updateJobRoleData(data);
    if (success) {
      setSelectedUserIds([]);
      employeeDataRefetch();
      setModal({ title: "" });
    }
  };

  const updateShift = async (value) => {
    const data = {
      shiftId: value,
      userIds: selectedUserIds,
    };
    const { success } = await updateShiftData(data);
    if (success) {
      setSelectedUserIds([]);
      employeeDataRefetch();
      setModal({ title: "" });
    }
  };

  const handlePageChange = (page) => dispatch({ type: "SET_PAGE", payload: page });
  const { updateData: extendContract, loading: extendContractLoading } = useFetch(`/employee/contract/extends`, { method: "PUT" });
  const handleExtendContract = async () => {
    const contractData = {
      startDate: contractStart,
      endDate: contractEnd,
      employeeId: selectedUserIds,
    };
    await extendContract(contractData);
    setModal({ title: "" });
  };

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
              onChange={(e) => {
                dispatch({ type: "SET_PAGE_SIZE", payload: e.value });
                dispatch({ type: "SET_PAGE", payload: 1 });
              }}
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

      {selectedUserIds.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 flex items-center justify-center px-4">
          <div className="flex flex-col items-center justify-between p-4 rounded-xl bg-white border shadow-lg w-auto">
            <div className="flex space-x-4">
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-lg hover:bg-gray-600 focus:outline-none"
                onClick={() => {
                  setSelectedUserIds([]);
                  employeeDataRefetch();
                }}
              >
                Unselect All
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 focus:outline-none"
                onClick={() => setModal({ title: "Update Contract" })}
              >
                Update Contract
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-700 rounded-lg hover:bg-emerald-900 focus:outline-none"
                onClick={() => setModal({ title: "Update Job Role" })}
              >
                Update Job Role
              </button>

              <button
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-700 rounded-lg hover:bg-emerald-900 focus:outline-none"
                onClick={() => setModal({ title: "Atur Jam Kerja" })}
              >
                Atur Jam Kerja
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={modal.title !== ""} width="1/3">
        <Modal.Header>
          <div className="div flex items-center justify-between">
            {modal.title}{" "}
            <button type="button" onClick={() => setModal({ title: "" })}>
              <IconX />
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="pb-12">
            {modal.title === "Update Job Role" ? (
              <FormInput
                type="select"
                options={jobRoleOptions}
                placeholder={"Select Job Role"}
                label={"Job Role"}
                onChange={(e) => updateJobRole(e.value)}
                disabled={updateJobroleLoading}
              />
            ) : modal.title === "Atur Jam Kerja" ? (
              <>
                <FormInput
                  type="select"
                  options={shiftOptions}
                  placeholder={"Select Jam Kerja"}
                  label={"Jam Kerja"}
                  onChange={(e) => updateShift(e.value)}
                  disabled={updateShiftLoading}
                />
              </>
            ) : (
              <div className="w-full flex flex-col items-center p-4">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className=" w-full relative">
                    <h1 className="text-slate-800 text-sm">Tanggal Mulai</h1>
                    <div className="absolute top-4 w-full">
                      <Datepicker label={"Select Start Date"} defaultDate={contractStart} onChange={(date) => setContractStart(date)} />
                    </div>
                  </div>
                  <div className=" w-full relative">
                    <h1 className="text-slate-800 text-sm">Tanggal Berakhir</h1>
                    <div className="absolute top-4 w-full">
                      <Datepicker defaultDate={contractEnd} label={"Select Start Date"} onChange={(date) => setContractEnd(date)} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>

        {modal.title === "Update Contract" && (
          <Modal.Footer>
            <button
              type="button"
              onClick={() => setModal({ title: "" })}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleExtendContract}
              disabled={extendContractLoading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-200"
            >
              {extendContractLoading ? "Menyimpan..." : "Simpan"}
            </button>
          </Modal.Footer>
        )}
      </Modal>
    </DashboardLayouts>
  );
};

export default Employee;
