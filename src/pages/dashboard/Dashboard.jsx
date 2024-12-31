import React, { useEffect, useState } from "react";
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
  IconGraphFilled,
  IconLayoutGridRemove,
  IconListDetails,
  IconMapPinFilled,
  IconSearch,
  IconUserFilled,
} from "@tabler/icons-react";
import SummaryCard from "../../components/SummaryCard";
import Table from "../../components/Table";
import useFetch from "../../hooks/useFetch";
import Select from "react-select";
import { io } from "socket.io-client";
import FormInput from "../../components/FormInput";

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(null);
  const today = currentDate.toLocaleDateString("en-CA");
  const currentMonth = currentDate.toISOString().slice(0, 7);

  const {
    responseData: attendancesData = [],
    loading: attendancesDataLoading,
    error: attendancesDataError,
    totalPages: attendancesDataPages,
    refetch: attendancesDataRefetch,
  } = useFetch(`/attendance?date=${today}&month=${currentMonth}`, { currentPage, pageSize });
  const [attendances, setAttendances] = useState();

  const calculateDuration = (clockIn, clockOut) => {
    if (!clockIn || !clockOut) {
      return "N/A";
    }

    const clockInTime = new Date(`1970-01-01T${clockIn}Z`);
    const clockOutTime = new Date(`1970-01-01T${clockOut}Z`);

    const durationInMilliseconds = clockOutTime - clockInTime;

    const hours = Math.floor(durationInMilliseconds / 3600000);
    const minutes = Math.floor((durationInMilliseconds % 3600000) / 60000);

    return `${hours}h ${minutes}m`;
  };

  useEffect(() => {
    if (attendancesDataPages) {
      setTotalPages(attendancesDataPages);
      setAttendances(attendancesData?.attendances);
    }
  }, [attendancesDataPages, attendancesData]);

  useEffect(() => {
    const socket = io("http://localhost:3000/admin", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("new_attendance", (data) => {
      setAttendances((prevAttendances) => {
        const existingIndex = prevAttendances?.findIndex((att) => att.employeeId === data.attendance.employeeId);
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
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

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

  const checkTime = (timeToCheck, treshold, isEarlyClockOutCheck = false) => {
    if (!timeToCheck) return false;
    const referenceTime = new Date();
    const [hours, minutes, seconds] = treshold.split(":");
    referenceTime.setHours(hours, minutes, seconds);

    const currentTime = new Date();
    const [checkHours, checkMinutes, checkSeconds] = timeToCheck.split(":");
    currentTime.setHours(checkHours, checkMinutes, checkSeconds);

    if (isEarlyClockOutCheck) {
      return currentTime <= referenceTime;
    }
    return currentTime > referenceTime;
  };

  const mappedSummaryData = (stats) => {
    const todayStats = stats?.todayStats || {
      totalEmployees: 0,
      present: "0",
      absent: "0",
      leave: "0",
      late: "0",
      early_clock_out: "0",
      invalid: "0",
    };

    const yesterdayStats = stats?.yesterdayStats?.[0] || {
      totalEmployees: 0,
      present: "0",
      absent: "0",
      leave: "0",
      late: "0",
      early_clock_out: "0",
      invalid: "0",
    };

    const toNumber = (value) => parseInt(value, 10) || 0;

    const calculateChange = (key) => toNumber(todayStats[key]) - toNumber(yesterdayStats[key]);

    return {
      attendanceData: [
        {
          label: "On time",
          value: toNumber(todayStats.present),
          change: calculateChange("present"),
        },
        {
          label: "Late clock-in",
          value: toNumber(todayStats.late),
          change: calculateChange("late"),
        },
        {
          label: "Early clock-out",
          value: toNumber(todayStats["early_clock out"]),
          change: calculateChange("early clock out"),
        },
      ],
      notPresentData: [
        {
          label: "Absent",
          value: toNumber(todayStats.absent),
          change: calculateChange("absent"),
        },
        {
          label: "Invalid",
          value: toNumber(todayStats.invalid),
          change: calculateChange("invalid"),
        },
        {
          label: "Day Off",
          value: toNumber(todayStats.leave),
          change: calculateChange("leave"),
        },
      ],
    };
  };

  const { attendanceData, notPresentData, dayOffData } = mappedSummaryData(attendancesData?.monthAttendance || {});

  const employeeColumns = [
    {
      key: "fullName",
      label: "Employee Name",
      icon: <IconUserFilled />,
      render: (value, rowData) => {
        if (!rowData) {
          return <span>Loading...</span>;
        }
        const profileImage = rowData.profilePicture && `http://localhost:3000/storage/document/${rowData.userId}/${rowData.profilePicture}`;
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
      label: "Clock-in & Clock-out",
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
            value === "Late" || value === "Early Clock Out" || value === "Absent"
              ? "bg-red-100 text-red-500"
              : value === "Break Time"
              ? "bg-teal-100 text-teal-600"
              : value === "Leave"
              ? "bg-orange-100 text-orange-500"
              : "bg-blue-100 text-blue-600"
          } whitespace-nowrap text-xs px-2 inline-flex py-0.5 gap-2 items-center rounded-xl`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "address",
      label: "Location",
      icon: <IconMapPinFilled />,
      render: (value, rowData) => (
        <span className="text-blue-500 px-2 py-1 rounded-full border border-blue-500 inline-flex gap-1 items-center overflow-hidden whitespace-nowrap text-ellipsis text-xs">
          <IconMapPinFilled size={14} /> {value || "Address not available"}
        </span>
      ),
    },
  ];

  const filterOptions = [
    { label: "Late", value: "Late" },
    { label: "On Time", value: "On time" },
    { label: "Break Time", value: "Break time" },
  ];

  return (
    <DashboardLayouts>
      <div className="w-full mb-8 flex items-center justify-between">
        <div className="w-full flex items-center gap-3">
          <div className="pr-4 border-r border-slate-300">
            <h1 className="text-3xl font-bold text-slate-800">Attendance</h1>
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
          <button className="bg-white flex gap-2 transition-all duration-300 ease-in-out text-zinc-500 border whitespace-nowrap px-3 py-2 rounded-lg hover:bg-gray-100 text-sm font-semibold">
            <IconDownload /> Export Attendance Report
          </button>
          <button className="bg-emerald-700 flex gap-2 transition-all duration-300 ease-in-out text-white whitespace-nowrap px-3 py-2 rounded-lg hover:bg-emerald-800 text-sm font-bold">
            <IconFileImport /> Import from XLSX
          </button>
        </div>
      </div>

      <div className="w-full flex gap-3 mb-8">
        <SummaryCard width={"w-1/2"} title="Present Summary" icon={<IconClipboardCheck />} items={attendanceData} />
        <SummaryCard width={"w-1/2"} title="Not Present Summary" icon={<IconClipboardX />} items={notPresentData} />
        {/* <SummaryCard width={"w-1/3"} title="Day Off Summary" icon={<IconHourglassOff />} items={dayOffData} /> */}
      </div>
      <div className="w-full flex justify-between items-center mb-5">
        <div className="flex items-center bg-white border rounded-full w-1/3 p-2">
          <IconSearch />
          <input
            type="text"
            placeholder="Search employee name..."
            className="ml-2 w-full bg-transparent border-none focus:outline-none text-sm text-gray-600"
          />
        </div>
        <div className="flex gap-3 items-center">
          {/* <Select
            options={filterOptions}
            // onChange={onChange}
            // value={value}
            styles={{
              control: (base, state) => ({
                ...base,
                borderColor: "none",
                borderWidth: "none",
                boxShadow: "none",
                outline: "none",
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: "rgb(225, 225, 225)",
              }),
              clearIndicator: (base) => ({
                ...base,
                color: "rgb(99, 102, 241)",
              }),
              indicatorSeparator: (base) => ({
                ...base,
                backgroundColor: "none",
              }),
            }}
          /> */}

          <FormInput type="select" label={""} options={filterOptions} />
          <div className="flex gap-2 rounded-lg items-center px-3 py-2 border border-zinc-400 text-sm bg-white text-slate-800">
            <p>20 Employee</p>
            <i className="fa-solid fa-chevron-down"></i>
          </div>
          <div className="bg-white rounded-xl border p-1.5 border-zinc-400 flex gap-2">
            <div className="bg-zinc-100 p-1 rounded border border-zinc-300">
              <IconLayoutGridRemove size={14} />
            </div>
            <div className="bg-zinc-100 p-1 rounded border border-zinc-300">
              <IconListDetails size={14} />
            </div>
          </div>
        </div>
      </div>
      {attendancesDataLoading ? (
        <p>Loading...</p>
      ) : attendancesDataError ? (
        <p className="text-red-500">Failed to load employee data.</p>
      ) : (
        <Table title="Employee Table" icon="fa-users" columns={employeeColumns} data={attendances || []} />
      )}
    </DashboardLayouts>
  );
};

export default Dashboard;
