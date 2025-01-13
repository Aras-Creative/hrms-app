import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import useFetch from "../../../../hooks/useFetch";

// Constants
const STAT_TYPES = [
  { key: "dayOff", label: "Cuti" },
  { key: "lateClockIn", label: "Terlambat" },
  { key: "earlyClockOut", label: "Pulang Awal" },
  { key: "noClockOut", label: "Tidak Absen Pulang" },
  { key: "absent", label: "Tidak Hadir" },
];

const currentDate = new Date();
const MAX_MONTH = currentDate.getMonth() + 1; // This is the current month
const MIN_MONTH = currentDate.getMonth(); // The previous month

// Utility Functions
const formatDate = (date, options) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-GB", options);
};

const calculateStats = (data) => {
  if (!data) return {};
  const stats = {
    dayOff: 0,
    lateClockIn: 0,
    earlyClockOut: 0,
    noClockOut: 0,
    absent: 0,
  };
  data.forEach((entry) => {
    switch (entry.status) {
      case "Cuti":
        stats.dayOff++;
        break;
      case "Terlambat":
        stats.lateClockIn++;
        break;
      case "Pulang Awal":
        stats.earlyClockOut++;
        break;
      case "Tidak Masuk":
        stats.absent++;
        break;
      default:
        break;
    }
  });
  return stats;
};

// Components
const StatCard = ({ label, current, previous }) => {
  const diff = current - previous;
  const diffColor = diff < 0 ? "text-red-500" : "text-blue-500";

  return (
    <div className={`w-1/5 border-zinc-200 pl-4 ${label === "Day Off" ? "" : "border-l"} flex flex-col justify-center items-start`}>
      <h1 className="text-zinc-400 text-xs font-semibold">{label}</h1>
      <h1 className="text-2xl text-slate-800 font-bold">{current}</h1>
      <div className="text-start">
        <span className={`${diffColor} text-xs font-semibold`}>
          {diff > 0 ? "+" : ""}
          {diff}
        </span>
        <span className="text-zinc-400 text-xs font-semibold"> vs bulan lalu</span>
      </div>
    </div>
  );
};

const AttendanceStats = ({ sendAttendanceData, periode }) => {
  const { employeeId } = useParams();
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1, 12).toISOString().slice(0, 10);
    const endDate = today.toISOString().slice(0, 10);
    const endDateForUI = formatDate(today, { month: "long", year: "numeric" });
    return { startDate, endDate, endDateForUI };
  });

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 7);
  });

  const fetchUrl = `/attendance/${employeeId}?month=${selectedMonth}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
  const { responseData: attendancesData = {}, loading } = useFetch(fetchUrl);

  // Set Initial Date Range
  useEffect(() => {
    if (attendancesData) {
      sendAttendanceData(attendancesData?.lastWeekAttendance);
      if (periode) {
        periode(selectedMonth);
      }
    }
  }, [attendancesData]);

  const handleMonthChange = (action) => {
    let [year, month] = selectedMonth.split("-").map(Number);
    const today = new Date();

    if (action === "nextMonth") {
      month++;
      if (month > 12) {
        year++;
        month = 1;
      }
    } else if (action === "prevMonth") {
      month--;
      if (month < 1) {
        year--;
        month = 12;
      }
    }

    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1;

    const startDate = new Date(year, month - 1, 1, 12); // Awal bulan
    const endDate = isCurrentMonth
      ? today // Jika bulan yang dipilih adalah bulan ini, gunakan today
      : new Date(year, month, 0, 12); // Jika tidak, akhir bulan

    setSelectedMonth(`${year}-${month.toString().padStart(2, "0")}`);
    setDateRange({
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
      endDateForUI: formatDate(endDate, { month: "long", year: "numeric" }),
    });
  };

  const thisMonthStats = calculateStats(attendancesData?.attendanceStats?.thisMonthData);
  const lastMonthStats = calculateStats(attendancesData?.attendanceStats?.lastMonthData);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col justify-center items-center rounded-lg overflow-hidden border border-zinc-200">
        <div className="w-full justify-center flex items-center gap-4 bg-zinc-200 py-3">
          <button
            onClick={() => handleMonthChange("prevMonth")}
            disabled={selectedMonth === `${currentDate.getFullYear()}-${String(MIN_MONTH).padStart(2, "0")}`}
            className={`bg-white p-1 text-xs text-slate-800 hover:bg-zinc-100 transition-all duration-300 ease-in-out rounded-lg border border-slate-400 ${
              selectedMonth === `${currentDate.getFullYear()}-${String(MIN_MONTH).padStart(2, "0")}` ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <IconArrowLeft size={20} />
          </button>

          <h1 className="font-bold text-slate-800">{dateRange.endDateForUI}</h1>
          <button
            onClick={() => handleMonthChange("nextMonth")}
            disabled={selectedMonth === `${currentDate.getFullYear()}-${String(MAX_MONTH).padStart(2, "0")}`}
            className={`bg-white p-1 text-xs text-slate-800 hover:bg-zinc-100 transition-all duration-300 ease-in-out rounded-lg border border-slate-400 ${
              selectedMonth === `${currentDate.getFullYear()}-${String(MAX_MONTH).padStart(2, "0")}` ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <IconArrowRight size={20} />
          </button>
        </div>
        <div className="bg-white w-full py-3 px-6 flex items-center">
          {STAT_TYPES.map((stat) => (
            <StatCard key={stat.key} label={stat.label} current={thisMonthStats[stat.key]} previous={lastMonthStats[stat.key]} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceStats;
