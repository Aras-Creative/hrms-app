import { useEffect, useState, useMemo } from "react";
import Layouts from "./Layouts";
import {
  IconLoader2,
  IconClockPlay,
  IconCircleX,
  IconCircleCheck,
  IconSun,
  IconBriefcase,
  IconBell,
  IconFingerprint,
  IconClock,
  IconCalendarExclamation,
  IconAlertCircle,
  IconClockStop,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useFetch from "../../hooks/useFetch";

import { initializeSocket } from "../../utils/WebSocket";
import { generateMonthSelection, getLastDayOfMonth, getMotivation } from "../../utils/dateUtils";
import { useCurrentTime } from "../../hooks/useCurrentTime";
import { getAttendanceStats, getProfilePicture } from "../../utils/userUtils";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { BASE_API_URL } from "../../config";
import moment from "moment";
import "moment/locale/id";

import { format, parseISO } from "date-fns";
import BottomNavigation from "../../components/BottomNav";
import AutoCloseModal from "../../components/AutoCloseModal";
import subtleTexture from "../../assets/texture/subtle.jpg";
import Shortcut from "../../components/Shortcut";
import { id } from "date-fns/locale";

const Homepage = () => {
  // Hooks
  const { profile } = useAuth();

  const currentTime = useCurrentTime(50000);
  const MonthSelection = generateMonthSelection();
  // States
  const [notif, setNotif] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState();
  const [selectedMonth, setSelectedMonth] = useState(MonthSelection[0]);
  const [successModal, setSuccessModal] = useState(false);

  // Fetch data
  const lastDay = useMemo(() => getLastDayOfMonth(selectedMonth.value), [selectedMonth.value]);
  const { responseData: TodayAttendance, refetch: AttendanceDataRefetch } = useFetch(`/attendance/today`);
  const { responseData: TodayEvent } = useFetch(`/event`);
  const { responseData: notifications } = useFetch(`/notification/${profile?.userId}`);
  const { responseData: AttendanceData } = useFetch(`/attendance/${profile?.userId}?startDate=${selectedMonth.value}&endDate=${lastDay}`);
  const { responseData: ProfilePicture } = useFetch(`/employee/profile-picture/${profile?.userId}`);
  const { responseData: activities } = useFetch(`/employee/activities/${profile?.userId}`);

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

  const { submitData: recordAttendance, loading: recordAttendanceLoading, error: recordAttendanceError } = useFetch(`/attendance/send/${profile?.userId}`, { method: "POST" });
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
    const clockIn = todayAttendance?.clockIn;
    const breakIn = todayAttendance?.breakIn;
    const startShiftTime = moment(profile?.workingHours?.clockIn, "HH:mm:ss");
    const endShiftTime = moment(profile?.workingHours?.clockOut, "HH:mm:ss");
    const breakTime = startShiftTime.clone().add(2, "hours");
    const now = moment();
    const breakMoment = moment(breakTime, "HH:mm");
    const thresholdMoment = moment(endShiftTime, "HH:mm");
    const isBeforeBreakTime = now.isBefore(breakMoment);
    const isBeforeThreshold = breakIn && now.isBefore(thresholdMoment);
    return (
      clockOut ||
      (isBeforeThreshold && todayAttendance?.status !== "Pulang Awal") ||
      todayAttendance?.status === "Izin Cuti" ||
      (isBeforeBreakTime && clockIn) ||
      (TodayEvent && TodayEvent?.type === "Holiday")
    );
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
        userId: profile?.userId,
        workingHours: profile?.workingHours,
        fingerprint,
      };
      const { success } = await recordAttendance(record);
      if (success) {
        AttendanceDataRefetch();
        setSuccessModal(true);
      }
    } catch (error) {
      setError(true);
    } finally {
      setError(false);
    }
  };

  const totalLatenessMinutes = stats.find((stat) => stat.label === "Keterlambatan").value;
  const exceededTimes = stats.find((stat) => stat.label === "Exceded Times").value;

  const isOverQuota = exceededTimes > 0;
  const quotaMinutes = 30;
  const remainingLateness = Math.max(0, quotaMinutes - (totalLatenessMinutes % quotaMinutes));

  console.log(stats);
  AttendanceData?.attendanceStats?.thisMonthData?.forEach((entry) => {
    const lateness = entry.lateness || 0;
    const maxLate = entry.max_late_times || 0;
    console.log(`Date: ${entry.date}, Lateness: ${lateness}, Max Late Times: ${maxLate}, Total: ${maxLate * 30 + lateness}`);
  });

  function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours} jam ${mins} menit` : `${mins} menit`;
  }

  const statusMap = {
    Hadir: {
      icon: <IconCircleCheck className="text-green-500" size={18} />,
      color: "text-green-700",
    },
    Terlambat: {
      icon: <IconClock className="text-yellow-500" size={18} />,
      color: "text-yellow-700",
    },
    "Tidak Masuk": {
      icon: <IconCircleX className="text-red-500" size={18} />,
      color: "text-red-700",
    },
    "Izin Cuti": {
      icon: <IconCalendarExclamation className="text-blue-500" size={18} />,
      color: "text-blue-700",
    },
  };

  const remainingTime = getRemainingTimeFromWorkingHours(profile?.workingHours);
  return (
    <>
      <div>
        <Layouts>
          <div className="relative mb-12">
            <Header showDot={hasUnreadNotification} profilePicture={profilePicture} profile={profile ?? {}} />
            <div
              className="py-20 px-4 h-88 text-white"
              style={{
                backgroundImage: `linear-gradient(to bottom, #818CF8, #6366F1),
                url(${subtleTexture})`,
                backgroundBlendMode: "multiply, normal",
                backgroundSize: "cover, auto",
                backgroundRepeat: "no-repeat, repeat",
              }}>
              <ShiftCard
                jobRole={profile?.jobRole?.jobRoleTitle}
                remainingTime={remainingTime}
                status={todayAttendance?.status ?? "N/A"}
                employeeId={profile?.employeeId}
                employmentStatus={profile?.status}
                shiftName={profile?.workingHours?.name}
                endTime={todayAttendance?.clockOut}
                startTime={todayAttendance?.clockIn}
              />
            </div>
            <div className="w-full mt-[-48px] relative z-10">
              <div className="z-20 bg-white rounded-3xl overflow-y-auto p-3">
                <div className="flex flex-col gap-4 bg-white rounded-xl px-4 py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <IconCircleCheck className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="text-xs">
                        <p className="text-gray-500">Kehadiran</p>
                        <p className="font-semibold text-indigo-600">{stats[0].value} Hari</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                        <IconSun className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="text-xs">
                        <p className="text-gray-500">Izin & Cuti</p>
                        <p className="font-semibold text-indigo-600">{stats[1].value} Hari</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <IconCircleX className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="text-xs">
                        <p className="text-gray-500">Absent</p>
                        <p className="font-semibold text-indigo-600">{stats[2].value} Hari</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-indigo-50 px-4 py-3 rounded-xl shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                        <IconBriefcase className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-indigo-700">{profile?.leave_quota?.[0]?.totalQuota ?? 0} Hari</p>
                        <p className="text-xs text-gray-500">
                          Kuota Cuti Tahunan • <span className="font-semibold">{profile?.leave_quota?.[0]?.year || new Date().getFullYear()}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <p className="font-semibold text-orange-500">
                        {profile?.leave_quota?.[0]?.used ?? 0} Hari <span className="text-gray-500 font-normal">digunakan</span>
                      </p>
                      <p className="font-semibold text-emerald-600">
                        {(profile?.leave_quota?.[0]?.totalQuota ?? 0) - (profile?.leave_quota?.[0]?.used ?? 0)} Hari <span className="text-gray-500 font-normal">sisa</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-white py-3">
                    <p className="text-xs text-gray-500 mb-1">Keterlambatan bulan ini</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
                        <span>
                          {formatTime(totalLatenessMinutes)} / {quotaMinutes} menit
                        </span>
                        <span className="text-[11px] font-normal text-gray-500">• {isOverQuota ? 0 : formatTime(remainingLateness)} tersisa</span>
                      </div>

                      {isOverQuota && <span className="text-[10px] text-red-500 font-medium bg-red-50 px-2 py-1 rounded-full">Batas Terlampaui {exceededTimes}X</span>}
                    </div>

                    {/* Progress bar selalu tampil, lebar max 100% */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`${isOverQuota ? "bg-red-500" : "bg-indigo-600"} h-2 rounded-full transition-all`}
                        style={{ width: `${((totalLatenessMinutes % quotaMinutes) / quotaMinutes) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <Shortcut />
              </div>

              <div className="w-full mt-3 px-4 rounded-3xl py-4 bg-white">
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex justify-between items-center">
                  Riwayat Kehadiran
                  <Link to="/calendar-attendance" className="text-sm text-indigo-500 hover:underline">
                    Lihat Semua
                  </Link>
                </h3>

                <ul className="divide-y divide-gray-200">
                  {AttendanceData?.lastWeekAttendance?.slice(0, 7).map((item) => {
                    const status = statusMap[item.status] || {
                      icon: <IconCircleX className="text-red-500" size={18} />,
                      color: "text-gray-700",
                    };

                    return (
                      <li key={item.attendanceId} className="flex items-start gap-3 py-4">
                        <div className="pt-1 shrink-0">{status.icon}</div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${status.color} bg-gray-100`}>{item.status}</span>
                            {item.lateness > 0 && <span className="text-gray-500 font-normal text-xs">• Terlambat {formatTime(item.late_today ?? 0)}</span>}
                          </div>

                          <div className="text-sm text-gray-600">
                            <span className="font-medium">{format(new Date(item.date), "eeee", {locale: id})}</span>, {format(new Date(item.date), "d MMM yyyy", {locale: id})}
                          </div>

                          <div className="text-xs text-gray-500 mt-0.5">
                            Clock In: <span className="font-medium">{item.clockIn ?? "-"}</span> | Clock Out: <span className="font-medium">{item.clockOut ?? "-"}</span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <ActivityList activities={activities || []} />
            </div>
          </div>
        </Layouts>
        {error && (
          <AutoCloseModal
            message="Mohon maaf, sistem mendeteksi ada ketidaksesuaian pada absensi Anda. Silakan coba lagi atau hubungi admin jika membutuhkan bantuan."
            show={error}
            duration={5000}
          />
        )}

        {successModal && (
          <AutoCloseModal
            message={
              todayAttendance?.clockIn && !todayAttendance?.clockOut
                ? todayAttendance?.status === "Terlambat"
                  ? "Absensi masuk berhasil, namun Anda terlambat. Tetap semangat!"
                  : "Absensi masuk berhasil. Selamat bekerja!"
                : todayAttendance?.clockOut
                ? "Absensi pulang berhasil. Terima kasih atas kerja keras hari ini!"
                : "Mohon maaf, sistem mendeteksi ada ketidaksesuaian pada absensi Anda."
            }
            onClose={() => setSuccessModal(false)}
            show={successModal}
            duration={5000}
            icon={
              todayAttendance?.clockIn && !todayAttendance?.clockOut ? (
                todayAttendance?.status === "Terlambat" ? (
                  <IconAlertCircle className="mx-auto text-yellow-500 w-16 h-16 mb-4" />
                ) : (
                  <IconCircleCheck className="mx-auto text-green-500 w-16 h-16 mb-4" />
                )
              ) : todayAttendance?.clockOut ? (
                <IconCircleCheck className="mx-auto text-blue-500 w-16 h-16 mb-4" />
              ) : (
                <IconCircleX className="mx-auto text-red-500 w-16 h-16 mb-4" />
              )
            }
          />
        )}
      </div>

      <BottomNavigation actionButton={<ActionButton loading={recordAttendanceLoading} onClick={doPostFetch} status={todayAttendance?.status} visible={!isDisabled()} />} />
    </>
  );
};

export default Homepage;

function ShiftCard({
  status = "Terlambat",
  remainingTime = "7 hours 8 minutes",
  startTime = "N/A",
  endTime = "N/A",
  employeeId = "-",
  shiftName = "-",
  employmentStatus = "-",
  jobRole = "N/A",
}) {
  const statusColors = {
    Hadir: "text-green-600 bg-green-100",
    Terlambat: "text-yellow-700 bg-yellow-100",
    "Tidak Masuk": "text-red-600 bg-red-100",
    "Pulang Awal": "text-blue-600 bg-blue-100",
    "Izin Cuti": "text-purple-600 bg-purple-100",
  };

  const textStatusColors = {
    Hadir: "text-green-600",
    Terlambat: "text-yellow-700",
    "Tidak Masuk": "text-red-600 ",
    "Pulang Awal": "text-blue-600 ",
    "Izin Cuti": "text-purple-600 ",
  };

  const badgeClass = statusColors[status] || "text-gray-600 bg-gray-100";
  const clockColor = textStatusColors[status] || "text-gray-600";

  return (
    <div className="w-full mx-auto rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="text-xs text-gray-600">
          <p className="font-semibold text-sm text-gray-800">{employeeId}</p>
          <p className="text-[11px]">Shift {shiftName}</p>
        </div>
        <div className="text-xs text-gray-600 text-end">
          <p className="font-semibold capitalize text-sm text-gray-800">{jobRole}</p>
          <p className="capitalize text-[11px]">{employmentStatus ? employmentStatus.replaceAll("_", " ") : "-"}</p>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-2 px-4 py-3 bg-gray-50 text-sm text-gray-600">
          {/* Jam Masuk */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <IconClockPlay size={16} className={`text-green-500`} />
              <span className="text-[10px] uppercase tracking-wide text-gray-400">Jam Masuk</span>
            </div>
            <span className={`font-medium ml-6 ${clockColor}`}>{startTime ?? "N/A"}</span>
          </div>

          {/* Jam Pulang */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <IconClockStop size={16} className={` text-blue-500`} />
              <span className="text-[10px] uppercase tracking-wide text-gray-400">Jam Pulang</span>
            </div>
            <span className={`font-medium ${endTime !== "N/A" ? clockColor : "text-gray-600"}`}>{endTime ?? "N/A"}</span>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        <div className="flex items-center justify-between px-4 py-2 text-xs">
          <div className="text-start text-xs">
            <p className="text-gray-600">Waktu Jam Kerja Tersisa</p>
            <p className="font-semibold text-indigo-600">{remainingTime}</p>
          </div>

          <span className={`px-2 py-0.5 rounded-full font-medium text-xs tracking-wide ${badgeClass}`}>{status}</span>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ onClick, loading, status, visible }) {
  const statusColors = {
    Hadir: "bg-green-500 hover:bg-green-600 disabled:bg-green-300",
    Terlambat: "bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300",
    "Tidak Masuk": "bg-red-500 hover:bg-red-600 disabled:bg-red-300",
    "Pulang Awal": "bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300",
    "Izin Cuti": "bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300",
  };

  const buttonColor = statusColors[status] || "bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300";

  return (
    <button
      type="button"
      aria-label="Absen"
      title={`Absen - ${status || "Status Tidak Diketahui"}`}
      onClick={onClick}
      disabled={loading || !visible}
      className={`
          w-20 h-20 rounded-full flex items-center justify-center
          shadow-md border-4 border-white transition-all duration-150
          text-white disabled:cursor-not-allowed
          ${buttonColor}
        `}>
      {loading ? <IconLoader2 size={40} className="text-white animate-spin" /> : <IconFingerprint size={40} className="text-white" />}
    </button>
  );
}

function Header({ showDot, profilePicture, profile }) {
  const fullName = profile?.fullName ?? "User";

  return (
    <header className="flex items-center justify-between px-4 py-3 absolute top-0 left-0 right-0 z-20 bg-transparent">
      <div className="flex flex-col items-start">
        {" "}
        <span className="text-sm font-semibold text-white">{fullName}</span>
        <span className="text-xs text-white italic opacity-75">{getMotivation()}</span>
      </div>

      <div className="flex items-center gap-2">
        <Link to={"/notification"} className="relative p-1 rounded-full hover:bg-gray-100/20 transition-all duration-300 ease-in-out">
          <IconBell className="w-5 h-5 text-white" />
          {showDot && <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />}
        </Link>

        <div className="flex items-center gap-2">
          <Link to={"/settings"}>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentNode.querySelector("span").style.display = "flex";
                  }}
                />
              ) : null}{" "}
              <span
                className="text-sm font-semibold text-gray-800"
                style={{
                  display: profilePicture ? "none" : "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}>
                {fullName ? fullName.charAt(0).toUpperCase() : "P"}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

function getRemainingTimeFromWorkingHours(workingHours) {
  const now = new Date();
  const [outHour, outMinute, outSecond] = workingHours?.clockOut?.split(":").map(Number) || [0, 0, 0];

  const todayClockOut = new Date(now);
  todayClockOut.setHours(outHour, outMinute, outSecond, 0);

  const diffMs = todayClockOut.getTime() - now.getTime();

  if (diffMs <= 0) return "Selesai";

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${diffHours} jam ${diffMinutes} menit`;
}

function ActivityList({ activities }) {
  const statusMap = {
    success: { icon: <IconCircleCheck size={18} />, color: "text-green-500" },
    failed: { icon: <IconCircleX size={18} />, color: "text-red-500" },
    pending: { icon: <IconAlertCircle size={18} />, color: "text-yellow-500" },
  };

  return (
    <div className="w-full mt-3 px-4 rounded-3xl py-4 bg-white shadow-sm">
      {" "}
      <h3 className="text-base font-semibold text-gray-800 mb-3 flex justify-between items-center">
        Riwayat Aktivitas
        <Link to="/activity" className="text-sm text-indigo-500 hover:underline">
          Lihat Semua
        </Link>
      </h3>
      <ul className="divide-y divide-gray-200">
        {activities?.length > 0 ? (
          activities.slice(0, 7).map((item) => {
            const statusInfo = statusMap[item.status] || {
              icon: <IconCircleX size={18} className="text-gray-400" />,
              color: "text-gray-700",
            };

            const activityInfo = {
              label: item.activity.replace(/_/g, " ") || "Aktivitas Tidak Dikenal",
            };

            const formattedDate = item.createdAt ? format(parseISO(item.createdAt), "dd MMMM yyyy, HH:mm", { locale: id }) : "-";

            return (
              <li key={item.id} className="flex items-start gap-3 py-4">
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-800 flex items-center">
                    <span className={`mr-2 text-xs font-semibold ${statusInfo.color}`}>{statusInfo.icon}</span>
                    <span className="capitalize"> {activityInfo.label}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.meta?.reason || `Status: ${item.status}`}</p>
                  <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>
                </div>
              </li>
            );
          })
        ) : (
          <li className="py-4 text-center text-gray-500">Tidak ada aktivitas terbaru.</li>
        )}
      </ul>
    </div>
  );
}
