import React, { useEffect, useState } from "react";
import AttendanceStats from "./AttendanceStats";

const TimeManagement = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  const handleAttendanceData = (data) => {
    setAttendanceData(data);
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric" }) : null;
  };

  const calculateDuration = (clockIn, clockOut, breakIn, breakOut) => {
    if (!clockIn || !clockOut || !breakIn || !breakOut) return "N/A";

    const clockInTime = new Date(`1970-01-01T${clockIn}Z`);
    const clockOutTime = new Date(`1970-01-01T${clockOut}Z`);
    const breakDuration = new Date(`1970-01-01T${breakIn}Z`) - new Date(`1970-01-01T${breakOut}Z`);

    const durationInMilliseconds = clockOutTime - clockInTime - breakDuration;
    const hours = Math.floor(durationInMilliseconds / 3600000);
    const minutes = Math.floor((durationInMilliseconds % 3600000) / 60000);

    return `${hours}h ${minutes}m`;
  };

  useEffect(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(1);
    setDateRange({
      startDate: startDate.toLocaleDateString("en-CA"),
      endDate: today.toLocaleDateString("en-CA"),
    });
  }, []);

  return (
    <div className="w-full">
      <AttendanceStats sendAttendanceData={handleAttendanceData} />

      <div className="w-full flex flex-col gap-3 mt-6">
        {attendanceData.length > 0
          ? attendanceData.map((attendance, idx) => (
              <AttendanceCard key={idx} attendance={attendance} dateRange={dateRange} formatDate={formatDate} calculateDuration={calculateDuration} />
            ))
          : null}
      </div>
    </div>
  );
};

const AttendanceCard = ({ attendance, dateRange, formatDate, calculateDuration }) => {
  return (
    <div className="w-full bg-white rounded-lg p-6 border border-zinc-200 overflow-hidden">
      <h1 className="w-full text-sm font-bold text-slate-800">{attendance.date === dateRange.endDate ? "Hari Ini" : formatDate(attendance.date)}</h1>
      <div className="mt-3 w-full flex items-center gap-4">
        <AttendanceDetail label="Jam Masuk" time={attendance.clockIn} status={attendance.status} />
        <div className="grow w-full pl-4 border-l border-zinc-300">
          <TimeSlots />
          <ProgressBar attendance={attendance} />
        </div>
        <AttendanceDetail label="Jam Pulang" time={attendance.clockOut} status={attendance.status} />
        <DurationDetail
          label="Durasi"
          duration={calculateDuration(attendance.clockIn, attendance.clockOut, attendance.breakIn, attendance.breakOut)}
        />
      </div>
    </div>
  );
};

const AttendanceDetail = ({ label, time, status }) => (
  <div className="flex flex-col gap-2 pr-4">
    <h1 className="text-xs font-semibold text-zinc-400 whitespace-nowrap">{label}</h1>
    <h1 className={`text-xs font-bold ${getStatusColor(status)}`}>{time || "N/A"}</h1>
  </div>
);

const DurationDetail = ({ label, duration }) => (
  <div className="w-1/4 flex border-l border-zinc-300 pl-4 items-center">
    <div className="w-1/2 flex flex-col gap-2">
      <h1 className="text-xs font-semibold text-zinc-400">{label}</h1>
      <h1 className="text-xs font -bold text-slate-800">{duration}</h1>
    </div>
  </div>
);

const TimeSlots = () => (
  <div className="w-full flex items-center mb-2 text-xs text-zinc-400 justify-between">
    <p>08:00</p>
    <p>11:00</p>
    <p>13:00</p>
    <p>15:00</p>
    <p>16:30</p>
  </div>
);

const ProgressBar = ({ attendance }) => {
  const [progressData, setProgressData] = useState({
    lateDuration: 0,
    workBeforeBreakDuration: 0,
    breakDuration: 0,
    workAfterBreakDuration: 0,
    earlyClockOutDuration: 0,
    totalDuration: 0,
  });

  useEffect(() => {
    if (attendance) calculateDurations(attendance);
  }, [attendance]);

  const calculateDurations = (attendance) => {
    const clockInTime = formatTime(attendance.clockIn);
    const clockOutTime = formatTime(attendance.clockOut);
    const breakStartTime = formatTime(attendance.breakOut);
    const breakEndTime = formatTime(attendance.breakIn);
    const lateThreshold = formatTime("08:10");
    const workEndTime = clockOutTime && clockOutTime < formatTime("16:30") ? clockOutTime : formatTime("16:30");

    const lateDuration = clockInTime && clockInTime > lateThreshold ? (clockInTime - lateThreshold) / 1000 / 60 : 0;
    const workBeforeBreakDuration = clockInTime && breakStartTime ? (breakStartTime - Math.max(clockInTime, lateThreshold)) / 1000 / 60 : 0;
    const breakDuration = breakStartTime && breakEndTime ? (breakEndTime - breakStartTime) / 1000 / 60 : 0;
    const workAfterBreakDuration = breakEndTime && workEndTime ? (workEndTime - breakEndTime) / 1000 / 60 : 0;
    const earlyClockOutDuration = clockOutTime && clockOutTime < formatTime("16:30") ? (formatTime("16:30") - clockOutTime) / 1000 / 60 : 0;
    const totalDuration = lateDuration + workBeforeBreakDuration + breakDuration + workAfterBreakDuration + earlyClockOutDuration;

    setProgressData({
      lateDuration,
      workBeforeBreakDuration,
      breakDuration,
      workAfterBreakDuration,
      earlyClockOutDuration,
      totalDuration,
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return null;
    const today = new Date();
    const [hours, minutes] = timeString.split(":");
    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
  };

  const renderProgressBar = () => {
    if (!attendance.clockIn && !attendance.clockOut) {
      return <StatusIndicator status={attendance.status} />;
    }

    const percentages = calculatePercentages(progressData);
    return <div className="relative h-6 w-full flex bg-gray-200 rounded overflow-hidden">{renderProgressSegments(percentages)}</div>;
  };

  const calculatePercentages = ({
    lateDuration,
    workBeforeBreakDuration,
    breakDuration,
    workAfterBreakDuration,
    earlyClockOutDuration,
    totalDuration,
  }) => {
    return {
      latePercentage: (lateDuration / totalDuration) * 100,
      workBeforeBreakPercentage: (workBeforeBreakDuration / totalDuration) * 100,
      breakPercentage: (breakDuration / totalDuration) * 100,
      workAfterBreakPercentage: (workAfterBreakDuration / totalDuration) * 100,
      earlyClockOutPercentage: (earlyClockOutDuration / totalDuration) * 100,
    };
  };

  const renderProgressSegments = (percentages) => {
    const { latePercentage, workBeforeBreakPercentage, breakPercentage, workAfterBreakPercentage, earlyClockOutPercentage } = percentages;

    const segments = [
      { width: latePercentage, color: "bg-red-500", label: "Terlambat" },
      { width: workBeforeBreakPercentage, color: "bg-blue-500", label: "Waktu Bekerja" },
      { width: breakPercentage, color: "bg-teal-500", label: "Waktu Istirahat" },
      { width: workAfterBreakPercentage, color: "bg-blue-500", label: "Waktu Bekerja" },
      { width: earlyClockOutPercentage, color: "bg-orange-500", label: "Pulang Awal" },
    ];

    let currentPosition = 0;
    return (
      <>
        {segments
          .filter((segment) => segment.width > 0)
          .map((segment, index) => {
            const segmentStyle = {
              width: `${segment.width}%`,
              left: `${currentPosition}%`,
            };
            currentPosition += segment.width;

            return <ProgressSegment key={index} width={segment.width} color={segment.color} label={segment.label} style={segmentStyle} />;
          })}
      </>
    );
  };

  return <div className="relative h-6 w-full flex bg-gray-200 rounded overflow-hidden">{renderProgressBar()}</div>;
};

const ProgressSegment = ({ width, color, label, style }) => (
  <div
    className={`${color} h-full absolute rounded text-xs overflow-hidden flex justify-center items-center text-white whitespace-nowrap font-semibold`}
    style={style} // Apply the calculated style here
  >
    {label}
  </div>
);

const StatusIndicator = ({ status }) => {
  const bgColor = status === "Izin Cuti" ? "bg-yellow-500" : status === "Libur" ? "bg-emerald-700" : "bg-red-500";
  return (
    <div className={`h-full w-full ${bgColor} flex justify-center items-center text-xs text-white font-semibold`}>
      {status === "Izin Cuti" ? "Cuti" : status === "Libur" ? "Libur" : "Tidak Masuk"}
    </div>
  );
};

const getStatusColor = (status) => {
  if (status === "Terlambat") return "text-red-500";
  if (status === "Tidak Masuk" || status === "Izin Cuti") return "text-zinc-400";
  return "text-slate-800";
};

export default TimeManagement;
