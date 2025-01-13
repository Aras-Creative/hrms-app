import { STORAGE_URL } from "../config";

export const getProfilePicture = (ProfilePicture, profile, width = "10", height = width, border) => {
  if (ProfilePicture) {
    return (
      <img
        src={`${STORAGE_URL}/document/${profile?.userId}/${ProfilePicture?.path}`}
        alt={`${profile?.fullName}'s profile picture`}
        className={`w-${width} h-${height} object-cover object-center rounded-full ${border ? `${border} border-2` : ""} `}
      />
    );
  }
  return (
    <div className={`w-${width} h-${height} rounded-full font-semibold bg-gray-300 flex items-center justify-center text-slate-800`}>
      {profile?.fullName?.[0]?.toUpperCase() || "?"}
    </div>
  );
};

export const getAttendanceStats = (AttendanceData) => {
  const stats = [
    { label: "Kehadiran", value: 0 },
    { label: "Izin Cuti", value: 0 },
    { label: "Tidak Hadir", value: 0 },
  ];

  AttendanceData?.attendanceStats?.thisMonthData?.forEach((entry) => {
    const statusIndex = stats.findIndex((stat) => stat.label === entry.status);
    if (statusIndex !== -1) stats[statusIndex].value += 1;
  });

  return stats;
};
