import React, { useEffect, useState } from "react";
import Select from "react-select";
import Layouts from "./Layouts";
import {
  IconCircleCheckFilled,
  IconTransferIn,
  IconMapPinFilled,
  IconCoffee,
  IconCircle,
  IconCoffeeOff,
  IconTransferOut,
  IconCircleXFilled,
  IconBellFilled,
} from "@tabler/icons-react";
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useFetch from "../../hooks/useFetch";
import { io } from "socket.io-client";
import dayjs from "dayjs";
import RestDayIMG from "../../assets/user/restday.webp";

const generateMonthSelection = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  return [
    {
      value: new Date(currentYear, currentMonth, 1).toLocaleDateString("en-CA"),
      label: new Date(currentYear, currentMonth, 1).toLocaleDateString("en-CA", { month: "long" }),
    },
    {
      value: new Date(currentYear, previousMonth, 1).toLocaleDateString("en-CA"),
      label: new Date(currentYear, previousMonth, 1).toLocaleString("default", { month: "long" }),
    },
  ];
};

const Homepage = () => {
  const { profile } = useAuth();
  const MonthSelection = generateMonthSelection();
  const lastDay = new Date(selectedMonth.value);
  lastDay.setMonth(lastDay.getMonth() + 1);
  lastDay.setDate(0);

  const [notif, setNotif] = useState(false);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [todayAttendance, setTodayAttendance] = useState();
  const [selectedMonth, setSelectedMonth] = useState(MonthSelection[0]);

  const { responseData: TodayAttendance } = useFetch(`/attendance/today`);
  const { responseData: TodayEvent } = useFetch(`/event`);
  const { responseData: notifications } = useFetch(`/notification/${profile.userId}`);
  const { responseData: AttendanceData, refetch: AttendanceDataRefetch } = useFetch(
    `/attendance/${profile?.userId}?startDate=${selectedMonth.value}&endDate=${lastDay.toLocaleDateString("en-CA")}`
  );

  const hasUnreadNotification = notifications?.some((notification) => notification.isRead === false);

  const stats = [
    { label: "Present", value: 0 },
    { label: "Leave", value: 0 },
    { label: "Absent", value: 0 },
  ];

  AttendanceData?.attendanceStats?.thisMonthData?.forEach((entry) => {
    const statusIndex = stats.findIndex((stat) => stat.label === entry.status);
    if (statusIndex !== -1) {
      stats[statusIndex].value += 1;
    }
  });

  useEffect(() => {
    if (TodayAttendance) {
      setTodayAttendance(TodayAttendance);
    }
  }, [TodayAttendance]);

  useEffect(() => {
    const socket = io("http://localhost:3000/user", {
      withCredentials: true,
      transports: ["websocket", "polling"],
      query: { userId: profile?.userId },
    });
    socket.on("new_attendance", (data) => {
      setTodayAttendance((prevAttendance) => ({
        ...prevAttendance,
        ...Object.fromEntries(Object.entries(data?.attendance).filter(([key, value]) => value != null)),
      }));
      AttendanceDataRefetch();
    });
    socket.on("notification", (data) => {
      setNotif(true);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) {
      return "Good Morning";
    } else if (currentHour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Night";
    }
  };

  return (
    <Layouts>
      <Layouts.Header bgColor="bg-slate-800" textColor="text-white">
        <div className="w-full flex justify-between items-center px-4 py-6">
          <img src="/image/sekantor-logo-mini.png" className="w-8" alt="Logo" />
          <div className="flex gap-3 items-center">
            <div className="relative">
              <NavLink to={"/notification"}>
                <IconBellFilled />
              </NavLink>
              {(hasUnreadNotification || notif) && <div className="absolute top-0 right-0 bg-red-500 p-1 rounded"></div>}
            </div>
            <NavLink to={"/settings"}>
              <div className="w-10 h-10 rounded-full font-semibold bg-gray-300 flex items-center justify-center text-slate-800 ">
                {profile?.fullName?.[0]?.toUpperCase() || "?"}
              </div>
            </NavLink>
          </div>
        </div>
        <div className="w-full px-4 pb-12">
          <h1 className="text-white font-bold text-2xl">
            {getGreeting()}, {profile?.fullName.split(" ").slice(1, 2).join(" ")}
          </h1>
          <p className="text-xs text-white">Let's be productive today!</p>
        </div>
      </Layouts.Header>

      <div className="w-full top-40 absolute right-0 left-0 h-full bg-gray-100 z-10 rounded-t-3xl py-3">
        <div className="mx-auto w-16 h-1 mb-4 rounded-full bg-slate-600"></div>
        <div className="w-full px-5 flex justify-between items-center">
          <h1 className="text-slate-900 text-xl font-semibold">Overview</h1>
          <div className="w-1/3">
            <Select
              options={MonthSelection}
              placeholder="Month"
              value={selectedMonth}
              onChange={(selectedOption) => setSelectedMonth(selectedOption)}
              className="w-full"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "none",
                  boxShadow: "none",
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  color: "rgb(99, 102, 241)",
                }),
                indicatorSeparator: (base) => ({
                  ...base,
                  backgroundColor: "none",
                }),
              }}
            />
          </div>
        </div>

        <div className="w-full mt-6 px-4">
          <div className="flex justify-between items-center gap-2">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`${
                  stat.label === "Present" ? "bg-slate-800" : stat.label === "Leave" ? "bg-indigo-600" : "bg-slate-600"
                } flex flex-col items-center gap-2 p-3  text-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out w-1/3`}
              >
                <h2 className="text-xs font-semibold text-slate-300">{stat.label}</h2>
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                <p className="text-xs text-white whitespace-nowrap">
                  {stat.label === "Present" ? "Days Present" : stat.label === "Leave" ? "Leave Taken" : "Days Absent"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full mt-5 px-4">
          <div className="w-full bg-white rounded-3xl shadow border px-5 py-4">
            <h1 className="text-sm text-slate-800 font-semibold">
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                day: "numeric",
                month: "long",
              })}
            </h1>

            {/* Attendance Sections */}
            <div className="mt-4 pl-3 w-full">
              {TodayEvent && TodayEvent?.type === "holiday" ? (
                <div className="flex flex-col items-center w-full justify-center pb-4 mt-12">
                  <img src={RestDayIMG} alt="Rest Day" className="w-72 mb-4" />
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-800">Hari Ini Adalah Hari Libur 🎉</h2>
                    <p className=" text-gray-600 mb-2">Waktunya santai, nikmati liburmu!</p>
                    <p className="text-sm font-medium text-blue-500">{TodayEvent.title}</p>
                  </div>
                </div>
              ) : (
                <div className="w-full border-l border-zinc-400 pl-6">
                  <AttendanceItem
                    time={todayAttendance?.clockIn || "N/A"}
                    label="Clock-in schedule"
                    statusLabel={"Clock-in"}
                    status={todayAttendance?.status === "Present" ? "Ontime" : todayAttendance?.status || "Not Schedule"}
                    statusIcon={
                      todayAttendance?.status === "Late" ? (
                        <IconCircleXFilled className="text-red-500" />
                      ) : todayAttendance?.clockIn ? (
                        <IconCircleCheckFilled className="text-green-500" />
                      ) : (
                        <IconCircle className="text-zinc-400" />
                      )
                    }
                    icon={<IconTransferIn />}
                    statusClass={`${
                      todayAttendance?.clockIn
                        ? `bg-gradient-to-br ${
                            todayAttendance?.status !== "Present" ? "from-red-500 to-pink-600" : "from-green-500 to-teal-400"
                          } text-white`
                        : "bg-zinc-50 text-zinc-600"
                    }`}
                    iconClass={`${todayAttendance?.clockIn ? "text-white" : "text-indigo-600"}`}
                  />
                  <AttendanceItem
                    time={todayAttendance?.breakOut || "N/A"}
                    label={`${todayAttendance?.breakOut ? `Start at ${todayAttendance?.breakOut}` : "Not Started"}`}
                    status={`Now is ${currentTime.format("hh:mm A")}`}
                    statusIcon={
                      todayAttendance?.breakIn ? (
                        <IconCircleCheckFilled className="text-green-500" />
                      ) : todayAttendance?.breakOut ? (
                        <IconMapPinFilled className="text-indigo-500" />
                      ) : (
                        <IconCircle className="text-zinc-400" />
                      )
                    }
                    icon={<IconCoffee />}
                    statusLabel={"Break time"}
                    statusClass={`${
                      todayAttendance?.breakIn
                        ? "bg-gradient-to-br from-green-500 to-teal-400 text-white"
                        : todayAttendance?.breakOut
                        ? "bg-gradient-to-bl from-indigo-700 to-indigo-500 text-white"
                        : "bg-zinc-50 text-zinc-600"
                    }`}
                    iconClass={`${todayAttendance?.breakOut ? "text-white" : "text-indigo-600"}`}
                  />

                  <AttendanceItem
                    time={todayAttendance?.breakIn || "N/A"}
                    label="Break-end schedule"
                    status={`Now is ${currentTime.format("hh:mm A")}`}
                    statusIcon={
                      todayAttendance?.breakIn ? <IconCircleCheckFilled className="text-green-500" /> : <IconCircle className="text-zinc-400" />
                    }
                    statusLabel={"Break-end"}
                    icon={<IconCoffeeOff />}
                    statusClass={`${
                      todayAttendance?.breakIn ? "bg-gradient-to-br from-green-500 to-teal-400 text-white" : "bg-zinc-50 text-zinc-600"
                    }`}
                    iconClass={`${todayAttendance?.breakIn ? "text-white" : "text-indigo-600"}`}
                  />
                  <AttendanceItem
                    time={todayAttendance?.clockOut || "16:30"}
                    label="Clock-out schedule"
                    statusLabel={"Clock-out"}
                    statusIcon={
                      todayAttendance?.clockOut ? <IconCircleCheckFilled className="text-green-500" /> : <IconCircle className="text-zinc-400" />
                    }
                    status={`Now is ${currentTime.format("hh:mm A")}`}
                    icon={<IconTransferOut />}
                    statusClass={`${
                      todayAttendance?.clockOut ? "bg-gradient-to-br from-green-500 to-teal-400 text-white" : "bg-zinc-50 text-zinc-600"
                    }`}
                    iconClass={`${todayAttendance?.clockOut ? "text-white" : "text-indigo-600"}`}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="w-full mt-3">
            <div className="w-full bg-white px-6 py-3 rounded-3xl border shadow">
              <h1 className="text-sm font-bold text-slate-800"> Feeling Overwhelmed?</h1>
              <p className="text-xs text-zinc-500 leading-tight">Breaks clear your mind, boost energy, and come back stronger.</p>

              <div className="w-auto">
                <button className=" text-indigo-500 hover:text-indigo-600 rounded-lg font-semibbold text-xs">Request time off</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layouts>
  );
};

const AttendanceItem = ({ time, label, statusLabel, status, icon, statusClass, iconClass, statusIcon }) => (
  <div className="flex w-full items-center py-2">
    <div className="flex w-1/2 flex-col items-start relative">
      <h1 className="text-slate-800 font-semibold">{time}</h1>
      <p className="text-[12px] text-zinc-400">{label}</p>
      <div className="absolute -left-9 top-2 bg-white rounded-full">{statusIcon}</div>
    </div>
    <div className={`w-1/2 border rounded-xl py-2 px-3 flex items-center justify-between ${statusClass}`}>
      <div className="flex flex-col gap-1">
        <h1 className="text-sm font-semibold whitespace-nowrap">{statusLabel}</h1>
        <span className="text-[10px]">{status}</span>
      </div>
      <div className={iconClass}>{icon}</div>
    </div>
  </div>
);

export default Homepage;
