export const mappedLeavesData = (stats) => {
  // Ambil data status dari parameter stats
  const data = stats || [];

  // Hitung jumlah status menggunakan reduce
  const summary = data.reduce(
    (acc, item) => {
      if (item.status === "approved") acc.Approved++;
      else if (item.status === "rejected") acc.Rejected++;
      else if (item.status === "pending") acc.Pending++;
      acc.Total++;
      return acc;
    },
    { Approved: 0, Rejected: 0, Pending: 0, Total: 0 }
  );

  return {
    Stats: [
      {
        label: "Total Permohonan",
        value: summary.Total,
      },
      {
        label: "Ditahan",
        value: summary.Pending,
      },
      {
        label: "Ditolak",
        value: summary.Rejected,
      },
      {
        label: "Disetujui",
        value: summary.Approved,
      },
    ],
  };
};

export const mappedAttendanceData = (stats) => {
  const todayStats = stats?.todayStats || {
    totalEmployees: 0,
    present: "0",
    absent: "0",
    leave: "0",
    late: "0",
    early_clock_out: "0",
    invalid: "0",
  };

  const yesterdayStats = stats?.yesterdayStats?.[0] || {
    totalEmployees: 0,
    present: "0",
    absent: "0",
    leave: "0",
    late: "0",
    early_clock_out: "0",
    invalid: "0",
  };

  const toNumber = (value) => parseInt(value, 10) || 0;

  const calculateChange = (key) => toNumber(todayStats[key]) - toNumber(yesterdayStats[key]);

  return {
    attendanceData: [
      {
        label: "Tepat Waktu",
        value: toNumber(todayStats.hadir),
        change: calculateChange("present"),
      },
      {
        label: "Terlambat",
        value: toNumber(todayStats.terlambat),
        change: calculateChange("late"),
      },
      {
        label: "Pulang Lebih Awal",
        value: toNumber(todayStats["pulang_awal"]),
        change: calculateChange("early clock out"),
      },
    ],
    notPresentData: [
      {
        label: "Absen",
        value: toNumber(todayStats["tidak_masuk"]),
        change: calculateChange("absent"),
      },
      {
        label: "Tidak Valid",
        value: toNumber(todayStats.invalid),
        change: calculateChange("invalid"),
      },
      {
        label: "Izin/Cuti",
        value: toNumber(todayStats.libur),
        change: calculateChange("leave"),
      },
    ],
  };
};
