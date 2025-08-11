import React, { useEffect, useMemo, useReducer, useState, useCallback } from "react";
import useFetch from "../../hooks/useFetch";
import { IconBubbleText, IconCalendarTime, IconCheck, IconClock, IconDeviceMobile, IconLink, IconQuestionMark, IconUserFilled, IconX } from "@tabler/icons-react";
import Table from "../../components/Table";
import { STORAGE_URL } from "../../config";
import DashboardLayouts from "../../layouts/DashboardLayouts";
import { NavLink } from "react-router-dom";
import { toTitleCase } from "../../utils/toTitleCase";
import { Loading } from "../../components/Preloaders";
import Toast from "../../components/Toast";
import { formatDate, formatTimeOnly } from "../../utils/dateUtils";
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

const ChangeDevice = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentPage, pageSize } = state;

  const { responseData: deviceChangeRequests, error, loading, totalPages, refetch } = useFetch("/auth/change-device/list", { currentPage, pageSize });

  const { updateData } = useFetch(`/auth/change-device/action`, { method: "PUT" });

  const [toast, setToast] = useState({ text: "", type: "" });

  useEffect(() => {
    if (totalPages) {
      dispatch({ type: "SET_TOTAL_PAGES", payload: totalPages });
    }
  }, [totalPages]);

  const handleActions = useCallback(
    async (status, id) => {
      const data = { id, status };
      const { success, error } = await updateData(data);
      if (success) {
        refetch();
      } else {
        setToast({ text: error || "Failed to update", type: "error" });
      }
    },
    [updateData, refetch]
  );

  const employeeColumns = useMemo(
    () => [
      {
        key: "fullName",
        label: "Nama Karyawan",
        icon: <IconUserFilled />,
        render: (value, rowData) => {
          if (!rowData) return <span>Loading...</span>;
          return (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-slate-800 text-sm">{value?.[0]?.toUpperCase() || "?"}</div>
              <div className="flex flex-col">
                <span className="font-bold text-sm">{value}</span>
                <p className="text-xs text-slate-800">{rowData.employeeId}</p>
              </div>
            </div>
          );
        },
      },
      {
        key: "newDevice",
        label: "Informasi Device Baru",
        icon: <IconDeviceMobile />,
        render: (value) => {
          return <div className={`bg-gray-50 text-gray-500 border-gray-500 justify-center text-xs inline-flex px-1.5 py-1 rounded-full border`}>{value}</div>;
        },
      },
      {
        key: "createdAt",
        label: "Waktu Request",
        icon: <IconClock />,
        render: (value) => {
          const date = new Date(value);
          const formatted = date.toLocaleString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
          return <div className="text-xs w-52 whitespace-normal overflow-hidden">{formatted || "N/A"}</div>;
        },
      },
      {
        key: "id",
        label: "Actions",
        render: (value, rowData) => {
          if (rowData.status === "pending") {
            return (
              <div className="flex gap-2 items-center">
                <button type="button" onClick={() => handleActions("ditolak", value)} className="p-2 rounded-lg bg-red-100 text-red-500">
                  <IconX size={16} />{" "}
                </button>
                <button type="button" onClick={() => handleActions("disetujui", value)} className="px-3 gap-2 flex items-center rounded-lg py-1.5 bg-emerald-700 text-white">
                  <IconCheck size={16} />
                  Approve
                </button>
              </div>
            );
          }
          return rowData.status === "disetujui" ? (
            <span className="text-emerald-700 px-2 py-1 rounded-full border border-emerald-700 bg-emerald-50 inline-flex gap-1 items-center overflow-hidden whitespace-nowrap text-ellipsis text-xs">
              <span className="rounded-full bg-emerald-700 text-white p-0.5 text-xs">
                <IconCheck size={10} />
              </span>
              {toTitleCase(rowData.status)}
            </span>
          ) : (
            <span className="text-red-500 px-2 py-1 rounded-full border border-red-500 bg-red-50 inline-flex gap-1 items-center overflow-hidden whitespace-nowrap text-ellipsis text-xs">
              <span className="rounded-full bg-red-500 text-white p-0.5 text-xs">
                <IconX size={10} />
              </span>
              {toTitleCase(rowData.status)}
            </span>
          );
        },
      },
    ],
    []
  );

  return (
    <DashboardLayouts>
      <div className="px-3 py-3">
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800">Data Permohonan Mengganti Device</h1>
              <p className="text-gray-600 text-sm">Kelola permohonan mengganti device karyawan Anda.</p>
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
                onChange={(e) => {
                  dispatch({ type: "SET_PAGE_SIZE", payload: e.value });
                  dispatch({ type: "SET_PAGE", payload: 1 });
                }}
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
        <Table title="Employee Table" icon="fa-users" columns={employeeColumns} data={deviceChangeRequests || []} />
      )}

      {toast.text && <Toast text={toast.text} type={toast.type || "error"} onClick={() => setToast({ text: "", type: "" })} />}
    </DashboardLayouts>
  );
};

export default ChangeDevice;
