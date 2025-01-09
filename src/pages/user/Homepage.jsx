import React, { useEffect, useState, useMemo, useCallback } from "react";
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
  IconPlus,
  IconClockPlay,
  IconHandClick,
} from "@tabler/icons-react";
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useFetch from "../../hooks/useFetch";
import RestDayIMG from "../../assets/user/restday.webp";
import { initializeSocket } from "../../utils/WebSocket";
import { formatDate, generateMonthSelection, getGreeting, getLastDayOfMonth, getMotivation } from "../../utils/dateUtils";
import { useCurrentTime } from "../../hooks/useCurrentTime";
import { getAttendanceStats, getProfilePicture } from "../../utils/userUtils";
import FormInput from "../../components/FormInput";

const Homepage = () => {
  // Hooks
  const { profile } = useAuth();
  const currentTime = useCurrentTime(50000);
  const MonthSelection = generateMonthSelection();

  // States
  const [notif, setNotif] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState();
  const [selectedMonth, setSelectedMonth] = useState(MonthSelection[0]);
  const [markAttendance, setMarkAttendance] = useState(false);

  // Fetch data
  const lastDay = useMemo(() => getLastDayOfMonth(selectedMonth.value), [selectedMonth.value]);
  const { responseData: TodayAttendance } = useFetch(`/attendance/today`);
  const { responseData: TodayEvent } = useFetch(`/event`);
  const { responseData: notifications } = useFetch(`/notification/${profile.userId}`);
  const { responseData: AttendanceData, refetch: AttendanceDataRefetch } = useFetch(
    `/attendance/${profile?.userId}?startDate=${selectedMonth.value}&endDate=${lastDay}`
  );
  const { responseData: ProfilePicture } = useFetch(`/employee/profile-picture/${profile.userId}`);

  // Derived Data
  const profilePicture = getProfilePicture(ProfilePicture, profile);
  const hasUnreadNotification = useMemo(() => notifications?.some((notification) => !notification.isRead), [notifications]);
  const stats = useMemo(() => getAttendanceStats(AttendanceData), [AttendanceData]);

  // Effects
  useEffect(() => {
    if (TodayAttendance) setTodayAttendance(TodayAttendance);
  }, [TodayAttendance]);

  useEffect(() => {
    const cleanupSocket = initializeSocket(
      "http://localhost:3000/user",
      {
        withCredentials: true,
        transports: ["websocket", "polling"],
        query: { userId: profile?.userId },
      },
      {
        new_attendance: (data) => {
          setTodayAttendance((prevAttendance) => ({
            ...prevAttendance,
            ...Object.fromEntries(Object.entries(data?.attendance).filter(([key, value]) => value != null)),
          }));

          AttendanceDataRefetch();
        },
        notification: () => {
          setNotif(true);
        },
      }
    );

    return cleanupSocket;
  }, [profile?.userId, AttendanceDataRefetch]);

  const { submitData: recordAttendance, loading: recordAttendanceLoading } = useFetch(`/attendance/send/${profile?.userId}`);

  const handleRecordAttendance = useCallback(async () => {
    const record = {
      date: new Date().toLocaleDateString("en-CA"),
      time: currentTime.format("hh:mm:ss"),
      userId: profile.userId,
    };
    const { success } = await recordAttendance(record);
    if (success) {
      setMarkAttendance(false);
    }
  }, [currentTime, profile.userId, recordAttendance]);

  const handleAttendance = () => {
    setMarkAttendance(true);
  };

  return (
    <>
      <div className="relative">
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
                <NavLink to={"/settings"}>{profilePicture}</NavLink>
              </div>
            </div>
            <div className="w-full px-4 pb-12">
              <h1 className="text-white font-bold text-2xl">
                {getGreeting()}, {profile?.fullName.split(" ").slice(1, 2).join(" ")}
              </h1>
              <p className="text-xs text-white">{getMotivation()}</p>
            </div>
          </Layouts.Header>

          <div className={`w-full top-40 ${markAttendance ? "fixed" : "absolute"} right-0  left-0 h-full bg-gray-100 z-10 rounded-t-3xl py-3`}>
            <div className="mx-auto w-16 h-1 rounded-full bg-slate-600"></div>
            <div className="bg-gray-100 rounded-xl pb-6">
              <div className="w-full px-5 flex justify-between items-center">
                <h1 className="text-slate-900 text-xl font-semibold">Ringkasan</h1>
                <div className="w-[45%]">
                  <FormInput type="select" options={MonthSelection} value={selectedMonth} onChange={(selected) => setSelectedMonth(selected)} />
                </div>
              </div>

              <div className="w-full mt-6 px-4">
                <div className="flex justify-between items-center gap-2">
                  {stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className={`${
                        stat.label === "Kehadiran" ? "bg-slate-800" : stat.label === "Izin Cuti" ? "bg-indigo-600" : "bg-slate-600"
                      } flex flex-col items-center gap-2 p-3  text-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out w-1/3`}
                    >
                      <h2 className="text-xs font-semibold text-slate-300">{stat.label}</h2>
                      <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                      <p className="text-xs text-white whitespace-nowrap">
                        {stat.label === "Kehadiran" ? "Hari" : stat.label === "Izin Cuti" ? "Cuti Diambil" : "Hari"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full mt-5 px-4">
                <div className="w-full bg-white rounded-3xl shadow border px-5 py-4">
                  <div className="flex justify-between">
                    <h1 className="text-sm text-slate-800 font-semibold">{formatDate(new Date())}</h1>
                    <NavLink to={"/leave/request"} className={"flex text-xs px-3 py-1 rounded-xl items-center bg-slate-800 text-white gap-2"}>
                      <IconPlus size={12} />
                      Izin Cuti
                    </NavLink>
                  </div>

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
                      <>
                        <div className="w-full border-l border-zinc-400 pl-6">
                          <AttendanceItem
                            time={todayAttendance?.clockIn || "N/A"}
                            label="Jam masuk"
                            statusLabel={"Jam Masuk"}
                            status={todayAttendance?.status === "Hadir" ? "Tepat Waktu" : todayAttendance?.status || "Belum ada"}
                            statusIcon={
                              todayAttendance?.status === "Terlambat" ? (
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
                                    todayAttendance?.status !== "Hadir" ? "from-red-500 to-pink-600" : "from-green-500 to-teal-400"
                                  } text-white`
                                : "bg-zinc-50 text-zinc-600"
                            }`}
                            iconClass={`${todayAttendance?.clockIn ? "text-white" : "text-indigo-600"}`}
                          />
                          <AttendanceItem
                            time={todayAttendance?.breakOut || "N/A"}
                            label={`${todayAttendance?.breakOut ? `Mulai jam ${todayAttendance?.breakOut}` : "Belum dimulai"}`}
                            status={`Jam ${currentTime.format("HH:mm")}`}
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
                            statusLabel={"Istirahat"}
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
                            label="Istirahat selesai"
                            status={`Jam ${currentTime.format("HH:mm")}`}
                            statusIcon={
                              todayAttendance?.breakIn ? (
                                <IconCircleCheckFilled className="text-green-500" />
                              ) : (
                                <IconCircle className="text-zinc-400" />
                              )
                            }
                            statusLabel={"Selesai"}
                            icon={<IconCoffeeOff />}
                            statusClass={`${
                              todayAttendance?.breakIn ? "bg-gradient-to-br from-green-500 to-teal-400 text-white" : "bg-zinc-50 text-zinc-600"
                            }`}
                            iconClass={`${todayAttendance?.breakIn ? "text-white" : "text-indigo-600"}`}
                          />
                          <AttendanceItem
                            time={todayAttendance?.clockOut || "16:30"}
                            label="Jam pulang"
                            statusLabel={"Jam Pulang"}
                            statusIcon={
                              todayAttendance?.clockOut ? (
                                <IconCircleCheckFilled className="text-green-500" />
                              ) : (
                                <IconCircle className="text-zinc-400" />
                              )
                            }
                            status={`Jam ${currentTime.format("HH:mm")}`}
                            icon={<IconTransferOut />}
                            statusClass={`${
                              todayAttendance?.clockOut ? "bg-gradient-to-br from-green-500 to-teal-400 text-white" : "bg-zinc-50 text-zinc-600"
                            }`}
                            iconClass={`${todayAttendance?.clockOut ? "text-white" : "text-indigo-600"}`}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    onClick={handleAttendance}
                    className="w-full bg-gradient-to-br from-indigo-600 to-indigo-500 text-white border border-zinc-200 px-5 flex justify-between items-center shadow py-3 mt-6 rounded-xl"
                  >
                    <div className="flex flex-col text-start">
                      <h1 className="text-lg font-semibold">
                        {(() => {
                          if (todayAttendance?.clockIn && !todayAttendance?.breakOut) {
                            return "Beristirahat";
                          } else if (todayAttendance?.breakOut && !todayAttendance?.breakIn) {
                            return "Berhenti Istirahat";
                          } else if (todayAttendance?.breakIn && !todayAttendance?.clockOut) {
                            return "Pulang";
                          } else if ((todayAttendance?.clockIn, todayAttendance?.clockOut, todayAttendance?.breakIn, todayAttendance?.breakOut)) {
                            return "Selesai";
                          } else {
                            return "Masuk";
                          }
                        })()}
                      </h1>

                      <p className="text-xs">Jam {currentTime.format("HH:mm")}</p>
                    </div>

                    <IconClockPlay />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Layouts>
        {markAttendance && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-10"></div>
            <div className="fixed bottom-0 bg-white w-full h-96 z-20 animate-slideUp rounded-t-2xl px-5 py-5">
              <div className="flex items-center justify-center flex-col">
                <button
                  type="button"
                  onClick={handleRecordAttendance}
                  className="w-52 h-52 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-400 border-4 border-zinc-100 shadow-md rounded-full"
                >
                  <IconHandClick size={90} stroke={0.5} className="text-white" />
                </button>
                <div className="mt-6 text-center">
                  <h1 className="text-2xl font-bold text-zinc-600">{currentTime.format("HH:mm")}</h1>
                  <p className="text-sm text-zinc-400">Waktu Sekarang</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMarkAttendance(false)}
                  className="w-full font-semibold bg-indigo-500 text-white text-center py-2 rounded-xl mt-5"
                >
                  Kembali
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
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

{
  /* <NavLink to={"/leave/request"}>
              <div className="w-full transition-all duration-300 ease-in-out bg-white hover:bg-gradient-to-br hover:from-indigo-500 hover:to-indigo-400 group px-6 py-3 rounded-3xl border shadow">
                <h1 className="group-hover:text-white text-sm font-bold text-slate-800 mb-1"> Feeling Overwhelmed?</h1>
                <p className="group-hover:text-white text-xs text-zinc-500 leading-tight">
                  Breaks clear your mind, boost energy, and come back stronger.
                </p>

                <div className="w-auto mt-2">
                  <div className="group-hover:text-white text-indigo-500 hover:text-indigo-600 rounded-lg font-semibbold text-xs">
                    Request Leave Now
                  </div>
                </div>
              </div>
            </NavLink> */
}
