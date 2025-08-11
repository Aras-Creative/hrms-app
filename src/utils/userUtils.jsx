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
    { label: "Hadir", value: 0 },
    { label: "Izin Cuti", value: 0 },
    { label: "Tidak Masuk", value: 0 },
    { label: "Keterlambatan", value: 0 }, // Ini akan menjadi total menit keterlambatan bulanan sebenarnya
    { label: "Exceded Times", value: 0 }, // Ini akan menjadi total berapa kali kuota terlampaui bulanan
  ];

  const quotaMinutes = 30; // Definisi kuota menit per "Exceded Time"

  // Pastikan ada data dan ambil record terakhir/terbaru
  // Asumsi AttendanceData.attendanceStats.thisMonthData sudah terurut DESC (terbaru paling atas)
  const latestAttendanceEntry = AttendanceData?.attendanceStats?.thisMonthData?.[0];

  AttendanceData?.attendanceStats?.thisMonthData?.forEach((entry) => {
    // === Logic untuk Menghitung Status Hadir, Izin Cuti, Tidak Masuk ===
    // Ini benar jika Anda ingin menghitung JUMLAH HARI dengan status tersebut
    const statusIndex = stats.findIndex((stat) => stat.label === entry.status);
    if (statusIndex !== -1) stats[statusIndex].value += 1;

    // Jika status Terlambat atau Pulang Awal, juga dianggap Hadir
    if (entry.status === "Terlambat" || entry.status === "Pulang Awal") {
      stats.find((stat) => stat.label === "Hadir").value += 1;
    }
  });

  // === Logic untuk Menghitung Keterlambatan dan Exceded Times (Hanya dari record TERBARU) ===
  if (latestAttendanceEntry) {
    const latenessFromDB = latestAttendanceEntry.lateness || 0;
    const maxLateTimesFromDB = latestAttendanceEntry.max_late_times || 0;

    // Hitung total menit keterlambatan yang sebenarnya terkumpul
    stats.find((stat) => stat.label === "Keterlambatan").value = maxLateTimesFromDB * quotaMinutes + latenessFromDB;

    // Set nilai exceeded times
    stats.find((stat) => stat.label === "Exceded Times").value = maxLateTimesFromDB;
  }

  return stats;
};
