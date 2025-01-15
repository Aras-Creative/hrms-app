import React, { useEffect, useMemo, useReducer, useState, useCallback } from "react";
import useFetch from "../../hooks/useFetch";
import { IconBubbleText, IconCalendarTime, IconCheck, IconLink, IconQuestionMark, IconUserFilled, IconX } from "@tabler/icons-react";
import Table from "../../components/Table";
import { STORAGE_URL } from "../../config";
import DashboardLayouts from "../../layouts/DashboardLayouts";
import { NavLink } from "react-router-dom";
import { toTitleCase } from "../../utils/toTitleCase";
import { Loading } from "../../components/Preloaders";
import Toast from "../../components/Toast";
import { formatDate } from "../../utils/dateUtils";
import FormInput from "../../components/FormInput";
import { mappedLeavesData } from "../../utils/mappedSummaryData";
import { InternalServerError, NotFound } from "../../components/Errors";

const initialState = {
  currentPage: 1,
  pageSize: 20,
  totalPages: null,
  filterParams: {
    status: "",
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_PAGE_SIZE":
      return { ...state, pageSize: action.payload };
    case "SET_TOTAL_PAGES":
      return { ...state, totalPages: action.payload };
    case "SET_FILTER_PARAMS":
      return { ...state, filterParams: action.payload };
    default:
      return state;
  }
};

const Leaves = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentPage, pageSize } = state;

  const { responseData: leaveRequests, error, loading, totalPages, refetch } = useFetch("/dashboard/leaves", { currentPage, pageSize });
  const { responseData: statsData, refetch: statsRefetch } = useFetch("/dashboard/leaves/stats");
  const { updateData } = useFetch(`/employee/leave`, { method: "PUT" });

  const [toast, setToast] = useState({ text: "", type: "" });
  const stats = useMemo(() => mappedLeavesData(statsData), [statsData]);

  useEffect(() => {
    if (totalPages) {
      dispatch({ type: "SET_TOTAL_PAGES", payload: totalPages });
    }
  }, [totalPages]);

  const handleActions = useCallback(
    async (status, userId, leaveType, endDate, startDate, id) => {
      const data = { status, startDate, endDate, userId, leaveType, leavesId: id };
      const { success, error } = await updateData(data);
      if (success) {
        refetch();
        statsRefetch();
      } else {
        setToast({ text: error || "Failed to update", type: "error" });
      }
    },
    [updateData, refetch, statsRefetch]
  );

  const employeeColumns = useMemo(
    () => [
      {
        key: "employee",
        label: "Nama Karyawan",
        icon: <IconUserFilled />,
        render: (value, rowData) => {
          if (!rowData) return <span>Loading...</span>;
          const profileImage = value.profilePicture && `${STORAGE_URL}/document/${rowData?.userId}/${value.profilePicture.path}`;
          return (
            <div className="flex items-center gap-3">
              {value.profilePicture && profileImage ? (
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img src={profileImage} alt={`${value}'s Profile`} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-slate-800 text-sm">
                  {value.fullName[0]?.toUpperCase() || "?"}
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-bold">{value.fullName}</span>
                <p className="text-sm text-slate-800">{value.employeeId}</p>
              </div>
            </div>
          );
        },
      },
      {
        icon: <IconCalendarTime />,
        label: "Durasi",
        render: (value, rowData) => (
          <div className="w-full flex items-center gap-3 whitespace-nowrap">
            <h1 className={`text-slate-800 text-sm`}>{formatDate(rowData?.startDate) || "N/A"}</h1>
            <div className="flex items-center gap-1">
              <span className="text-xs text-zinc-400">ke</span>
            </div>
            <h1 className={`text-slate-800 text-sm`}>{formatDate(rowData?.endDate) || "N/A"}</h1>
          </div>
        ),
      },
      {
        key: "leaveType",
        label: "Tipe Cuti",
        icon: <IconQuestionMark />,
        render: (value) => {
          const typeStyles = {
            sakit: "bg-yellow-50 text-yellow-500 border-yellow-500",
            mendesak: "bg-red-50 text-red-500 border-red-500",
            liburan: "bg-green-50 text-green-500 border-green-500",
            default: "bg-gray-50 text-gray-500 border-gray-500",
          };
          const style = typeStyles[value] || typeStyles.default;
          return <div className={`${style} justify-center inline-flex px-3 py-1 rounded-full border`}>{toTitleCase(value)}</div>;
        },
      },
      {
        key: "reason",
        label: "Alasan",
        icon: <IconBubbleText />,
        render: (value) => value || "N/A",
      },
      {
        key: "attachment",
        label: "Lampiran",
        icon: <IconLink />,
        render: (value, rowData) => {
          if (!value) return <span>No attachment</span>;
          return (
            <NavLink
              to={`${STORAGE_URL}/document/${rowData?.userId}/${value}`}
              target="_blank"
              className={`whitespace-nowrap text-xs px-2 inline-flex py-0.5 gap-2 items-center rounded-xl ${
                value === "Late" || value === "Early Clock Out" || value === "Absent"
                  ? "bg-red-100 text-red-500"
                  : value === "Break Time"
                  ? "bg-teal-100 text-teal-600"
                  : value === "Leave"
                  ? "bg-orange-100 text-orange-500"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {value}
            </NavLink>
          );
        },
      },
      {
        key: "status",
        label: "Actions",
        render: (value, rowData) => {
          if (value === "pending") {
            return (
              <div className="flex gap-2 items-center">
                {" "}
                <button
                  type="button"
                  onClick={() => handleActions("ditolak", rowData?.userId, rowData?.leaveType, null, null, rowData?.id)}
                  className="p-2 rounded-lg bg-red-100 text-red-500"
                >
                  {" "}
                  <IconX size={16} />{" "}
                </button>
                <button
                  type="button"
                  onClick={() => handleActions("disetujui", rowData?.userId, rowData?.leaveType, rowData?.endDate, rowData?.startDate, rowData?.id)}
                  className="px-3 gap-2 flex items-center rounded-lg py-1.5 bg-emerald-700 text-white"
                >
                  <IconCheck size={16} />
                  Approve
                </button>
              </div>
            );
          }
          return value === "disetujui" ? (
            <span className="text-emerald-700 px-2 py-1 rounded-full border border-emerald-700 bg-emerald-50 inline-flex gap-1 items-center overflow-hidden whitespace-nowrap text-ellipsis text-xs">
              <span className="rounded-full bg-emerald-700 text-white p-0.5 text-xs">
                <IconCheck size={10} />
              </span>
              {toTitleCase(value)}
            </span>
          ) : (
            <span className="text-red-500 px-2 py-1 rounded-full border border-red-500 bg-red-50 inline-flex gap-1 items-center overflow-hidden whitespace-nowrap text-ellipsis text-xs">
              <span className="rounded-full bg-red-500 text-white p-0.5 text-xs">
                <IconX size={10} />
              </span>
              {toTitleCase(value)}
            </span>
          );
        },
      },
    ],
    [handleActions]
  );

  return (
    <DashboardLayouts>
      <div className="px-3 py-3">
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800">Data Permohonan Cuti</h1>
              <p className="text-gray-600 text-sm">Kelola permohonan cuti karyawan Anda.</p>
              <div className="mt-2 flex gap-4 items-center">
                {stats.Stats.length > 0
                  ? stats.Stats.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div
                          className={`${
                            item.label === "Ditolak"
                              ? "bg-red-500"
                              : item.label === "Disetujui"
                              ? "bg-emerald-700"
                              : item.label === "Menunggu Konfirmasi"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          } w-2 h-2 rounded-full`}
                        ></div>
                        {item.value} {item.label}
                      </div>
                    ))
                  : null}
              </div>
            </div>
            <div className="w-1/5">
              <FormInput
                type="select"
                options={[
                  { label: "10 Employees", value: 10 },
                  { label: "20 Employees", value: 20 },
                  { label: "50 Employees", value: 50 },
                  { label: "100 Employees", value: 100 },
                ]}
                value={{ label: `${pageSize} Employees`, value: pageSize }}
                onChange={(e) => dispatch({ type: "SET_PAGE_SIZE", payload: e.value })}
              />
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : error?.status === 404 ? (
        <NotFound />
      ) : error?.status === 500 ? (
        <InternalServerError />
      ) : (
        <Table title="Employee Table" icon="fa-users" columns={employeeColumns} data={leaveRequests || []} />
      )}

      {toast.text && <Toast text={toast.text} type={toast.type || "error"} onClick={() => setToast({ text: "", type: "" })} />}
    </DashboardLayouts>
  );
};

export default Leaves;
