import { eachDayOfInterval, startOfMonth, endOfMonth, format, parseISO, isSameDay, isSameMonth, getDay, isToday, subMonths, addMonths } from "date-fns";

import { IconChevronLeft, IconChevronRight, IconCheck, IconAlertTriangle, IconMinus, IconCalendarPause, IconCircleX, IconX, IconCalendarEvent } from "@tabler/icons-react";

import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import useAuth from "../../hooks/useAuth";
import Layouts from "../../pages/user/profile/Layouts";

export default function AttendanceCalendar() {
  const { profile } = useAuth();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    setStartDate(format(start, "yyyy-MM-dd"));
    setEndDate(format(end, "yyyy-MM-dd"));
  }, []);

  const { responseData: AttendanceData } = useFetch(startDate && endDate && profile?.userId ? `/attendance/${profile.userId}?startDate=${startDate}&endDate=${endDate}` : null);

  const attendanceStats = AttendanceData?.attendanceStats || {};
  const thisMonthData = attendanceStats?.thisMonthData || [];
  const lastMonthData = attendanceStats?.lastMonthData || [];

  const allData = [...thisMonthData, ...lastMonthData];

  const filteredData = allData.filter((entry) => {
    if (!entry?.date) return false;
    const parsed = parseISO(entry.date);
    return isSameMonth(parsed, currentDate);
  });

  const days = getDaysInMonth(currentDate);
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const firstDayOfWeek = getDay(startOfMonth(currentDate));

  const getDataForDay = (day) =>
    filteredData.find((entry) => {
      if (!entry?.date) return false;
      return isSameDay(parseISO(entry.date), day);
    }) || null;

  const getStatusIcon = (status) => {
    switch (status) {
      case "Hadir":
      case "Istirahat":
        return <IconCheck size={14} className="text-green-600" />;
      case "Tidak Masuk":
        return <IconCircleX size={14} className="text-red-600" />;
      case "Terlambat":
      case "Pulang Awal":
        return <IconAlertTriangle size={14} className="text-yellow-600" />;
      case "Izin Cuti":
        return <IconCalendarPause size={14} className="text-blue-600" />;
      default:
        return <IconMinus size={14} className="text-gray-400" />;
    }
  };

  return (
    <Layouts backUrl={"/homepage"} title={"Kalendar Riwayat Kehadiran"}>
      <div className="w-full px-2 py-4 mb-12 mt-14">
        {/* Header Navigasi */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setCurrentDate((d) => subMonths(d, 1))}>
            <IconChevronLeft />
          </button>
          <h2 className="text-lg font-bold text-center">{format(currentDate, "MMMM yyyy")}</h2>
          <button onClick={() => setCurrentDate((d) => addMonths(d, 1))}>
            <IconChevronRight />
          </button>
        </div>

        {/* Header Hari */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-gray-700">
          {dayNames.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Kalender */}
        <div className="grid grid-cols-7 gap-1 mt-1">
          {Array(firstDayOfWeek)
            .fill(null)
            .map((_, idx) => (
              <div key={`empty-${idx}`} />
            ))}

          {days.map((day) => {
            const entry = getDataForDay(day);
            let status = entry?.status ?? null;

            if (!status && entry?.clockIn) status = "Hadir";

            const icon = getStatusIcon(status);
            const bgClass = statusColors[status] ?? "bg-gray-50 text-gray-400 border-gray-200";

            return (
              <div
                key={day.toISOString()}
                className={`flex flex-col items-center justify-center rounded border text-center p-1 aspect-square
                ${bgClass} }
              `}>
                <div className="text-[11px] font-bold">{format(day, "d")}</div>
                <div className="mt-0.5">{icon}</div>
                <div className="text-[9px] leading-tight mt-0.5 text-center">
                  {status ?? "-"}
                  <div className="mt-0.5">
                    <div>In: {entry?.clockIn ? format(parseISO(`2000-01-01T${entry.clockIn}`), "HH:mm") : "-"}</div>
                    <div>Out: {entry?.clockOut && entry.clockOut !== "-" ? format(parseISO(`2000-01-01T${entry.clockOut}`), "HH:mm") : "-"}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layouts>
  );
}

function getDaysInMonth(date) {
  return eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });
}

const statusColors = {
  "Pulang Awal": "bg-yellow-50 text-yellow-800 border-yellow-200",
  Hadir: "bg-green-50 text-green-800 border-green-200",
  "Tidak Masuk": "bg-red-50 text-red-800 border-red-200",
  Terlambat: "bg-yellow-50 text-yellow-800 border-yellow-200",
  "Izin Cuti": "bg-blue-50 text-blue-800 border-blue-200",
  "No ClockOut": "bg-yellow-50 text-yellow-800 border-yellow-200",
};
