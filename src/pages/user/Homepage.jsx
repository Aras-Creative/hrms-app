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
  IconLoader2,
  IconArrowRight,
  IconCalendarCheck,
  IconClockOff,
  IconClockExclamation,
  IconCalendarOff,
  IconCalendarCode,
  IconCalendarPause,
  IconMichelinBibGourmand,
  IconReceipt,
  IconMinus,
  IconX,
  IconCalendar,
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
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import Forbidden from "../../assets/error/403.webp";
import { BASE_API_URL } from "../../config";
import moment from "moment";
import CircularProgressBar from "../../components/CircularProgressBar";

const Homepage = () => {
  // Hooks
  const { profile } = useAuth();

  const currentTime = useCurrentTime(50000);
  const MonthSelection = generateMonthSelection();
  const motivation = useMemo(() => getMotivation(), []);
  // States
  const [notif, setNotif] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState();
  const [selectedMonth, setSelectedMonth] = useState(MonthSelection[0]);

  // Fetch data
  const lastDay = useMemo(() => getLastDayOfMonth(selectedMonth.value), [selectedMonth.value]);
  const { responseData: TodayAttendance, refetch: AttendanceDataRefetch } = useFetch(`/attendance/today`);
  const { responseData: TodayEvent } = useFetch(`/event`);
  const { responseData: notifications } = useFetch(`/notification/${profile?.userId}`);
  const { responseData: AttendanceData } = useFetch(`/attendance/${profile?.userId}?startDate=${selectedMonth.value}&endDate=${lastDay}`);
  const { responseData: ProfilePicture } = useFetch(`/employee/profile-picture/${profile?.userId}`);

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
      `${BASE_API_URL}user`,
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

  const {
    submitData: recordAttendance,
    loading: recordAttendanceLoading,
    error: recordAttendanceError,
  } = useFetch(`/attendance/send/${profile?.userId}`, { method: "POST" });
  const [error, setError] = useState(false);

  useEffect(() => {
    if (recordAttendanceError) {
      setError(true);
      const timer = setTimeout(() => {
        setError(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [recordAttendanceError]);

  const isDisabled = () => {
    const clockOut = todayAttendance?.clockOut;
    const breakIn = todayAttendance?.breakIn;
    const thresholdTime = { hour: 16, minute: 30 };
    const isBeforeThreshold = breakIn && moment().isBefore(moment().set(thresholdTime));
    return clockOut || (isBeforeThreshold && todayAttendance?.status !== "Pulang Awal") || todayAttendance?.status === "Izin Cuti";
  };

  const [position, setPosition] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const startSwipe = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const onSwipe = (e) => {
    if (dragging) {
      const offsetX = e.clientX || e.touches[0].clientX;
      const newPosition = Math.max(0, Math.min(window.innerWidth - 110, offsetX - 40));
      setPosition(newPosition);

      let threshold = window.innerWidth * 0.5;
      if (window.innerWidth < 720) {
        threshold = window.innerWidth * 0.4;
      }
      if (newPosition >= threshold && !hasFetched) {
        doPostFetch();
        setHasFetched(true);
      }
    }
  };

  const stopSwipe = () => {
    setDragging(false);
    setHasFetched(false);
    if (!hasFetched) {
      setPosition(0);
    }
  };

  const doPostFetch = async () => {
    try {
      let fingerprint = localStorage.getItem("fingerprint");
      if (!fingerprint) {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        fingerprint = result.visitorId;

        localStorage.setItem("fingerprint", fingerprint);
      }
      const record = {
        date: new Date().toLocaleDateString("en-CA"),
        time: currentTime.format("HH:mm:ss"),
        userId: profile.userId,
        fingerprint,
      };

      const { success } = await recordAttendance(record);

      if (success) {
        AttendanceDataRefetch();
        setPosition(0);
      }
    } catch (error) {
      console.error("Error during POST request:", error);
    } finally {
      setPosition(0);
    }
  };

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = moment("08:00", "HH:mm");
    const endTime = moment("16:30", "HH:mm");
    const interval = setInterval(() => {
      const now = moment();
      if (now.isAfter(endTime)) {
        clearInterval(interval);
        setProgress(100);
      } else {
        const totalDuration = endTime.diff(startTime);
        const elapsedDuration = now.diff(startTime);
        const progressPercentage = (elapsedDuration / totalDuration) * 100;
        setProgress(progressPercentage);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
            <div className="flex w-full items-center px-4 pb-12 justify-between">
              <div className="w-full">
                <h1 className="text-white font-bold text-2xl">
                  {getGreeting()}, {profile?.fullName.split(" ").slice(1, 2).join(" ")}
                </h1>
                <p className="text-xs text-white">{motivation}</p>
              </div>
            </div>
          </Layouts.Header>

          <div className={`w-full top-40 absolute right-0 left-0 h-full bg-gray-100 z-10 rounded-t-3xl py-3`}>
            <div className="mx-auto w-16 h-1 rounded-full bg-slate-600"></div>
            <div className="bg-gray-100 pb-6 rounded-lg">
              <div className="px-4 py-4">
                <div className="px-6 py-3 bg-white shadow rounded-3xl">
                  <div className="justify-between items-center flex w-full">
                    <div className="flex flex-col gap-1 justify-center">
                      <h1 className="text-slate-900 text-lg font-bold">{selectedMonth.label}</h1>
                      <div className="flex items-center">
                        <IconCalendarCheck />
                        <h1 className="text-slate-700">Kehadiran</h1>
                      </div>
                      <h1 className="text-3xl font-bold text-indigo-600">{stats[0].value} Hari</h1>
                    </div>

                    <div className="flex justify-center">
                      <CircularProgressBar
                        baseColor="stroke-gray-300"
                        strokeColor="stroke-indigo-500"
                        radius={50}
                        strokeWidth={15}
                        text={currentTime.format("HH:mm")}
                        progress={progress}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 mt-2 mb-2">
                    <div className="w-full gap-3 flex items-center">
                      <div className="w-1/2 rounded-2xl px-3 py-2 bg-red-500 flex  justify-between items-center text-white font-semibold">
                        <div className="flex flex-col">
                          <h1 className="text-sm">Absen</h1>
                          <h1 className="text-lg font-bold">{stats[2].value} Hari</h1>
                        </div>

                        <IconCalendarOff />
                      </div>
                      <div className="w-1/2 rounded-2xl px-3 py-2 bg-yellow-500 flex  justify-between items-center text-white font-semibold">
                        <div className="flex flex-col">
                          <h1 className="text-sm">Izin/Cuti</h1>
                          <h1 className="text-lg font-bold">{stats[1].value} Hari</h1>
                        </div>

                        <IconCalendarPause />
                      </div>
                    </div>

                    <div className="w-full bg-slate-800 flex justify-between items-center rounded-3xl px-4 py-1">
                      <div className="flex gap-4 items-center">
                        <IconClockExclamation size={40} className="text-white text-xl" />
                        <div className="flex flex-col">
                          <h1 className="text-white text-sm">Keterlambatan</h1>
                          <p className={`text-sm font-bold ${stats[3].value >= 30 ? "text-red-500" : "text-white"}`}>{stats[3].value}/30 Menit</p>
                        </div>
                      </div>
                      <div className="flex justify-center items-center">
                        <CircularProgressBar
                          textSize={"text-xs"}
                          bgTextColor={"none"}
                          textColor="text-white"
                          radius={24}
                          strokeWidth={6}
                          text={`${Math.min(Math.floor((stats[3].value / 30) * 100), 100)}%`}
                          progress={Math.min(Math.floor((stats[3].value / 30) * 100), 100)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="px-2 py-3 flex items-center justify-between gap-2 bg-white shadow rounded-3xl">
                  <div>
                    <NavLink
                      to={"/leave/request"}
                      className="px-3 py-2.5 flex w-full whitespace-nowrap items-center gap-2 flex-row-reverse text-white font-bold bg-indigo-500 rounded-full"
                    >
                      <p className="text-sm">Izin Cuti</p>
                      <IconCalendarPause size={18} />
                    </NavLink>
                  </div>

                  <div>
                    <NavLink
                      to={"/payslip"}
                      className="px-3 py-2.5 flex w-full whitespace-nowrap items-center gap-2 flex-row-reverse text-white font-bold bg-indigo-500 rounded-full"
                    >
                      <p className="text-sm">Slip Gaji</p>
                      <IconReceipt size={18} />
                    </NavLink>
                  </div>

                  <div>
                    <NavLink
                      to={"/calendar"}
                      className="p-2.5 flex w-full whitespace-nowrap items-center gap-2 flex-row-reverse text-white font-bold bg-indigo-500 rounded-full"
                    >
                      <p className="text-sm">Kalender</p>
                      <IconCalendar size={18} />
                    </NavLink>
                  </div>
                </div>
              </div>

              <div className="w-full px-4">
                <div className="w-full bg-white rounded-3xl shadow border px-5 py-4">
                  <div className="flex justify-between">
                    <h1 className="text-sm text-slate-800 font-semibold">{formatDate(new Date())}</h1>
                  </div>
                  <div className="mt-4 pl-3 w-full">
                    {TodayEvent && TodayEvent?.type === "Holiday" ? (
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
                  {!isDisabled() && (
                    <div
                      className="w-full mt-6"
                      onMouseMove={onSwipe}
                      onTouchMove={onSwipe}
                      onMouseUp={stopSwipe}
                      onTouchEnd={stopSwipe}
                      onMouseDown={startSwipe}
                      onTouchStart={startSwipe}
                    >
                      <div className="bg-slate-100 w-full rounded-full p-2 relative">
                        <div className="absolute inset-0 flex items-center justify-center text-center z-0">
                          <p className="text-slate-500">
                            {(() => {
                              if (todayAttendance?.clockIn && !todayAttendance?.breakOut) {
                                return "Isitrahat";
                              } else if (todayAttendance?.breakOut && !todayAttendance?.breakIn) {
                                return "Selesai Istirahat";
                              } else if (todayAttendance?.breakIn && !todayAttendance?.clockOut) {
                                return "Pulang";
                              } else if ((todayAttendance?.clockIn, todayAttendance?.clockOut, todayAttendance?.breakIn, todayAttendance?.breakOut)) {
                                return "Selesai";
                              } else {
                                return "Masuk";
                              }
                            })()}
                          </p>
                        </div>
                        <div
                          className="bg-indigo-500 z-10 flex items-center justify-center text-white font-bold h-12 w-12 rounded-full cursor-pointer"
                          style={{ transform: `translateX(${position}px)` }}
                        >
                          {recordAttendanceLoading ? (
                            <div className="animate-spin">
                              <IconLoader2 />
                            </div>
                          ) : (
                            <IconArrowRight />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Layouts>
        {error && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-10"></div>
            <div className="fixed bottom-0 bg-white w-full h-96 z-20 animate-slideUp rounded-t-2xl px-5 py-5">
              <div className="flex items-center justify-center flex-col">
                <div className="text-center">
                  <img src={Forbidden} className="w-48 mx-auto mt-12" alt="Attendance Error" />
                  <p className="mt-4 text-xs text-red-600 font-semibold">
                    Mohon maaf, sistem mendeteksi ada ketidaksesuaian pada absensi Anda. Silakan coba lagi atau hubungi admin jika membutuhkan
                    bantuan.
                  </p>
                </div>
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

// <button
//   onClick={handleAttendance}
//   disabled={isDisabled()}
//   className={`w-full bg-gradient-to-br from-indigo-600 to-indigo-500 text-white border border-zinc-200 px-5 flex justify-between items-center shadow py-3 mt-6 rounded-xl ${
//     isDisabled() ? "opacity-50 cursor-not-allowed" : ""
//   }`}
// >
//   <div className="flex flex-col text-start">
//     <h1 className="text-lg font-semibold">
//       {(() => {
//         if (todayAttendance?.clockIn && !todayAttendance?.breakOut) {
//           return "Beristirahat";
//         } else if (todayAttendance?.breakOut && !todayAttendance?.breakIn) {
//           return "Selesai Istirahat";
//         } else if (todayAttendance?.breakIn && !todayAttendance?.clockOut) {
//           return "Pulang";
//         } else if ((todayAttendance?.clockIn, todayAttendance?.clockOut, todayAttendance?.breakIn, todayAttendance?.breakOut)) {
//           return "Selesai";
//         } else {
//           return "Masuk";
//         }
//       })()}
//     </h1>

//     <p className="text-xs">Jam {currentTime.format("HH:mm")}</p>
//   </div>

//   <IconClockPlay />
// </button>
