import React, { useEffect, useState, useMemo } from "react";
import DashboardLayouts from "../../layouts/DashboardLayouts";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBriefcase2Filled,
  IconClipboardCheck,
  IconClipboardX,
  IconClockFilled,
  IconDownload,
  IconFileImport,
  IconFileTypeJpg,
  IconGraphFilled,
  IconLink,
  IconUserFilled,
} from "@tabler/icons-react";
import SummaryCard from "../../components/SummaryCard";
import Table from "../../components/Table";
import useFetch from "../../hooks/useFetch";
import { io } from "socket.io-client";
import FormInput from "../../components/FormInput";
import { BASE_API_URL, STORAGE_URL } from "../../config";
import { attendanceFilter } from "../../utils/SelectOptions";
import { NavLink } from "react-router-dom";
import { mappedAttendanceData } from "../../utils/mappedSummaryData";
import { calculateDuration, checkTime } from "../../utils/attendanceUtils";
import { InternalServerError, NotFound } from "../../components/Errors";
import { Loading } from "../../components/Preloaders";
import Pagination from "../../components/Pagination";
import { handleDownloadFile } from "../../utils/handleDownloadFile";
import { formatDate } from "../../utils/dateUtils";

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);

  const today = currentDate.toLocaleDateString("en-CA");
  const currentMonth = currentDate.toISOString().slice(0, 7);

  const {
    responseData: attendancesData = [],
    loading: attendancesDataLoading,
    error: attendancesDataError,
    totalPages: attendancesDataPages,
    refetch: attendancesDataRefetch,
  } = useFetch(`/attendance?date=${today}&month=${currentMonth}&status=${filterStatus || ""}`, { currentPage, pageSize });

  const [attendances, setAttendances] = useState([]);
  const prevDate = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 1);
      return newDate;
    });
  };

  const nextDate = () => {
    setCurrentDate((prevDate) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const prevDateCopy = new Date(prevDate);
      if (prevDateCopy.setHours(0, 0, 0, 0) === today.getTime()) {
        return prevDateCopy;
      }
      prevDateCopy.setDate(prevDateCopy.getDate() + 1);
      return prevDateCopy;
    });
  };

  useEffect(() => {
    if (attendancesDataPages) {
      setTotalPages(attendancesDataPages);
      setAttendances(attendancesData?.attendances || []);
    }
  }, [attendancesDataPages, attendancesData]);

  useEffect(() => {
    attendancesDataRefetch();
  }, [filterStatus, currentPage, pageSize]);

  useEffect(() => {
    const socket = io(`${BASE_API_URL}admin`, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("new_attendance", (data) => {
      setAttendances((prevAttendances) => {
        const existingIndex = prevAttendances.findIndex((att) => att.employeeId === data.attendance.employeeId);
        if (existingIndex !== -1) {
          const updatedAttendances = [...prevAttendances];
          updatedAttendances[existingIndex] = {
            ...updatedAttendances[existingIndex],
            ...data.attendance,
          };
          return updatedAttendances;
        }
        return [data.attendance, ...prevAttendances];
      });
      attendancesDataRefetch();
    });

    return () => {
      socket.disconnect();
    };
  }, [attendancesDataRefetch]);

  const { attendanceData, notPresentData } = mappedAttendanceData(attendancesData?.monthAttendance || {});

  const employeeColumns = useMemo(
    () => [
      {
        key: "fullName",
        label: "Nama Karyawan",
        icon: <IconUserFilled />,
        render: (value, rowData) => {
          if (!rowData) return <span>Loading...</span>;
          const profileImage = rowData.profilePicture && `${STORAGE_URL}/document/${rowData.userId}/${rowData.profilePicture}`;
          return (
            <div className="flex items-center gap-3">
              {profileImage ? (
                <img src={profileImage} alt={`${value}'s Profile`} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-slate-800 text-sm">
                  {value[0]?.toUpperCase() || "?"}
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-bold">{value}</span>
                <p className="text-sm text-slate-800">{rowData?.employeeId}</p>
              </div>
            </div>
          );
        },
      },
      {
        icon: <IconClockFilled />,
        label: "Jam masuk & Jam pulang",
        render: (value, rowData) => (
          <div className="w-full flex items-center gap-3 whitespace-nowrap">
            <h1 className={`${checkTime(rowData?.clockIn, "08:00:00") ? "text-red-500" : "text-slate-800"} text-sm `}>{rowData?.clockIn || "N/A"}</h1>
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-zinc-400 rounded-full"></span>
                <span className="w-6 h-0.5 bg-zinc-400"></span>
              </div>
              <p className={`${rowData?.status === "Break Time" ? "text-teal-500 " : "text-zinc-400"} text-xs`}>
                {calculateDuration(rowData?.clockIn, rowData?.clockOut)}
              </p>
              <div className="flex items-center">
                <span className="w-6 h-0.5 bg-zinc-400"></span>
                <span className="w-2 h-2 bg-zinc-400 rounded-full"></span>
              </div>
            </div>
            <h1 className={`${checkTime(rowData?.clockOut, "16:30:00", true) ? "text-slate-800" : " text-red-500"} text-sm`}>
              {rowData?.clockOut || "N/A"}
            </h1>
          </div>
        ),
      },
      {
        key: "jobRole",
        label: "Job Role",
        icon: <IconBriefcase2Filled />,
        render: (value) => value || "N/A",
      },
      {
        key: "status",
        label: "Status",
        icon: <IconGraphFilled />,
        render: (value) => (
          <span
            className={`${
              value === "Terlambat" || value === "Pulang Awal" || value === "Tidak Hadir"
                ? "bg-red-100 text-red-500"
                : value === "Istirahat"
                ? "bg-teal-100 text-teal-600"
                : value === "Cuti"
                ? "bg-orange-100 text-orange-500"
                : value === "Libur"
                ? "bg-green-100 text-green-600"
                : "bg-blue-100 text-blue-600"
            } whitespace-nowrap text-xs px-2 inline-flex py-0.5 gap-2 items-center rounded-xl`}
          >
            {value}
          </span>
        ),
      },
    ],
    []
  );

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <DashboardLayouts>
      <div className="w-full mb-8 flex items-center justify-between">
        <div className="w-full flex items-center gap-3">
          <div className="pr-4 border-r border-slate-300">
            <h1 className="text-3xl font-bold text-slate-800">Data Kehadiran</h1>
          </div>
          <div className="pl-4 flex items-center gap-4">
            <button onClick={prevDate} className="bg-white p-1 text-xs text-slate-800 hover:bg-zinc-100 rounded-lg border">
              <IconArrowLeft />
            </button>
            <h1 className="font-bold text-slate-800">{formatDate(currentDate)}</h1>
            <button
              onClick={nextDate}
              type="button"
              disabled={currentDate === today}
              className="bg-white p-1 text-sm text-slate-800 hover:bg-zinc-100 rounded-lg border"
            >
              <IconArrowRight />
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-3 items-center">
          <button
            onClick={() => handleDownloadFile("/document/download-attendance", "attendance-report.xlsx")}
            className="bg-white flex gap-2 transition-all duration-300 ease-in-out text-zinc-500 border whitespace-nowrap px-3 py-2 rounded-lg hover:bg-gray-100 text-sm font-semibold"
          >
            <IconDownload /> Download Laporan Kehadiran
          </button>
          <button className="bg-emerald-700 flex gap-2 transition-all duration-300 ease-in-out text-white whitespace-nowrap px-3 py-2 rounded-lg hover:bg-emerald-800 text-sm font-bold">
            <IconFileImport /> Import XLSX
          </button>
        </div>
      </div>

      <div className="w-full flex gap-3 mb-8">
        <SummaryCard width={"w-1/2"} title="Rekap Data Kehadiran" icon={<IconClipboardCheck />} items={attendanceData} />
        <SummaryCard width={"w-1/2"} title="Rekap Data Absensi" icon={<IconClipboardX />} items={notPresentData} />
      </div>
      <div className="w-full flex justify-end items-center mb-5">
        <div className="flex gap-3 items-center">
          <FormInput type="select" placeholder={"Filter Status"} options={attendanceFilter} onChange={(e) => setFilterStatus(e.value)} />
          <FormInput
            type="select"
            options={[
              { label: "10 Karyawan", value: 10 },
              { label: "20 Karyawan", value: 20 },
              { label: "50 Karyawan", value: 50 },
              { label: "100 Karyawan", value: 100 },
            ]}
            value={{ label: `${pageSize} Karyawan`, value: pageSize }}
            onChange={(e) => setPageSize(e.value)}
          />
        </div>
      </div>
      {attendancesDataLoading ? (
        <Loading />
      ) : attendancesDataError?.status === 404 ? (
        <NotFound />
      ) : attendancesDataError?.status === 500 ? (
        <InternalServerError />
      ) : attendanceData?.length > 0 ? (
        <>
          <Table title="Employee Table" icon="fa-users" columns={employeeColumns} data={attendances || []} />
          {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
        </>
      ) : (
        <NotFound />
      )}
    </DashboardLayouts>
  );
};

export default Dashboard;
