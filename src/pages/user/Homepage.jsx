import React, { useEffect, useState } from "react";
import Select from "react-select";
import Layouts from "./Layouts";
import { IconCircleCheckFilled, IconTransferIn, IconMapPinFilled, IconCoffee, IconCircle, IconCoffeeOff, IconTransferOut } from "@tabler/icons-react";
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useFetch from "../../hooks/useFetch";

// const generateMonthSelection = () => {
//   const today = new Date();
//   const currentYear = today.getFullYear();
//   const currentMonthIndex = today.getMonth();
//   const previousMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;

//   return [
//     {
//       value: new Date(currentYear, currentMonthIndex, 1).toISOString().split("T")[0],
//       label: new Date(currentYear, currentMonthIndex, 1).toLocaleString("default", { month: "long" }),
//     },
//     {
//       value: new Date(currentYear, previousMonthIndex, 1).toISOString().split("T")[0],
//       label: new Date(currentYear, previousMonthIndex, 1).toLocaleString("default", { month: "long" }),
//     },
//   ];
// };

const Homepage = () => {
  const { profile } = useAuth();
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

  const MonthSelection = generateMonthSelection();
  const [selectedMonth, setSelectedMonth] = useState(MonthSelection[0]);
  const lastDay = new Date(selectedMonth.value);
  lastDay.setMonth(lastDay.getMonth() + 1);
  lastDay.setDate(0);

  const {
    responseData: AttendanceData,
    loading: AttendanceDataLoading,
    error: AttendanceDataError,
  } = useFetch(`/attendance/${profile?.userId}?startDate=${selectedMonth.value}&endDate=${lastDay.toLocaleDateString("en-CA")}`);

  useEffect(() => {
    console.log(`Selected Month: ${selectedMonth.label}`);
  }, [selectedMonth]);

  console.log(AttendanceData);

  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) {
      return "Good Morning";
    } else if (currentHour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  // const profilePictureDocName =
  //   profile?.documents?.find((doc) => doc?.documentName?.startsWith("profilePicture"))?.documentName || profile?.documents[1]?.documentName;
  // const apiStoragePath = "http://localhost:3000/storage/document";

  // const profileImage = `${apiStoragePath}/${profile.employeeId.replace(/\s+/g, "_")}/${profilePictureDocName}`;
  return (
    <Layouts>
      <Layouts.Header bgColor="bg-slate-800" textColor="text-white">
        <div className="w-full flex justify-between items-center px-4 py-6">
          <img src="/image/sekantor-logo-mini.png" className="w-8" alt="Logo" />
          <NavLink to={"/settings"}>
            {/* <img src={profileImage || "/image/avatar.png"} className="w-10 h-10 rounded-full object-cover object-center" alt="Avatar" /> */}
            <div className="w-10 h-10 rounded-full font-semibold bg-gray-300 flex items-center justify-center text-slate-800 ">
              {profile?.fullName?.[0]?.toUpperCase() || "?"}
            </div>
          </NavLink>
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
            {/* Attendance Card */}
            <div className="flex flex-col items-center gap-2 p-3 bg-slate-800 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out w-1/3">
              <h2 className="text-xs font-semibold text-slate-300">Attendance</h2>
              <h3 className="text-2xl font-bold text-white">28d</h3>
              <p className="text-xs text-slate-400 whitespace-nowrap">Days attended</p>
            </div>

            {/* Day Off Card */}
            <div className="flex flex-col items-center gap-2 p-3 bg-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out w-1/3">
              <h2 className="text-sm font-semibold text-indigo-200">Day Off</h2>
              <h3 className="text-2xl font-bold text-white">12d</h3>
              <p className="text-xs text-indigo-200 whitespace-nowrap">Days off taken</p>
            </div>

            {/* Lateness Card */}
            <div className="flex flex-col items-center gap-2 p-3 bg-slate-600 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out w-1/3">
              <h2 className="text-xs font-semibold text-slate-300">Lateness</h2>
              <h3 className="text-2xl font-bold text-white">20h</h3>
              <p className="text-xs text-slate-400 whitespace-nowrap">Total lateness</p>
            </div>
          </div>
        </div>

        <div className="w-full mt-5 px-4">
          <div className="w-full bg-white rounded-3xl shadow border px-3 py-4">
            <h1 className="text-sm text-slate-800 font-semibold">Tuesday, 11 December 2024</h1>

            {/* Attendance Sections */}
            <div className="mt-4 pl-3 w-full">
              <div className="w-full border-l border-zinc-400 pl-6">
                <AttendanceItem
                  time="08:00AM"
                  label="Clock-in schedule"
                  statusLabel={"Clock-in"}
                  status="Ontime"
                  statusIcon={<IconCircleCheckFilled className="text-green-500" />}
                  icon={<IconTransferIn className="text-white" />}
                  statusClass="bg-gradient-to-br from-green-500 to-teal-400 text-white"
                  iconClass="text-indigo-500"
                />
                <AttendanceItem
                  time="2h 32m"
                  label="Start at 12:00PM"
                  status="Ongoing..."
                  statusIcon={<IconMapPinFilled className="text-indigo-500" />}
                  icon={<IconCoffee />}
                  statusLabel={"Break time"}
                  statusClass="bg-gradient-to-bl from-indigo-700 to-indigo-500 text-white"
                  iconClass="text-white"
                />
                <AttendanceItem
                  time="N/A"
                  label="Break-end schedule"
                  status="Now 12:01PM"
                  statusIcon={<IconCircle className="text-zinc-400" />}
                  statusLabel={"Break-end"}
                  icon={<IconCoffeeOff className="text-indigo-500" />}
                  statusClass="bg-zinc-50 text-zinc-600"
                  iconClass="text-indigo-500"
                />
                <AttendanceItem
                  time="16:30PM"
                  label="Clock-out schedule"
                  statusLabel={"Clock-out"}
                  statusIcon={<IconCircle className="text-zinc-400" />}
                  status="Now 12:01PM"
                  icon={<IconTransferOut className="text-indigo-500" />}
                  statusClass="bg-zinc-50 text-zinc-600"
                  iconClass="text-indigo-500"
                />
              </div>
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
      <p className="text-xs text-zinc-400">{label}</p>
      <div className="absolute -left-9 top-2 bg-white rounded-full">{statusIcon}</div>
    </div>
    <div className={`w-1/2 border rounded-xl py-2 px-3 flex items-center justify-between ${statusClass}`}>
      <div className="flex flex-col gap-1">
        <h1 className="text-sm font-semibold whitespace-nowrap">{statusLabel}</h1>
        <span className="text-xs">{status}</span>
      </div>
      <div className={iconClass}>{icon}</div>
    </div>
  </div>
);

export default Homepage;
