export const mappedLeavesData = (stats) => {
  const data = stats || [];
  const summary = data.reduce(
    (acc, item) => {
      if (item.status === "disetujui") acc.Approved++;
      else if (item.status === "ditolak") acc.Rejected++;
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
        label: "Menunggu Konfirmasi",
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
    hadir: "0",
    tidak_masuk: "0",
    izin_cuti: "0",
    terlambat: "0",
    pulang_awal: "0",
    invalid: "0",
  };

  const yesterdayStats = stats?.yesterdayStats || {
    totalEmployees: 0,
    hadir: "0",
    tidak_masuk: "0",
    izin_cuti: "0",
    terlambat: "0",
    pulang_awal: "0",
    invalid: "0",
  };

  const toNumber = (value) => parseInt(value, 10) || 0;

  const calculateChange = (key) => toNumber(todayStats[key]) - toNumber(yesterdayStats[key]);

  return {
    attendanceData: [
      {
        label: "Tepat Waktu",
        value: toNumber(todayStats.hadir),
        change: calculateChange("hadir"),
      },
      {
        label: "Terlambat",
        value: toNumber(todayStats.terlambat),
        change: calculateChange("terlambat"),
      },
      {
        label: "Pulang Lebih Awal",
        value: toNumber(todayStats["pulang_awal"]),
        change: calculateChange("pulang_awal"),
      },
    ],
    notPresentData: [
      {
        label: "Absen",
        value: toNumber(todayStats["tidak_masuk"]),
        change: calculateChange("tidak_masuk"),
      },
      {
        label: "Tidak Valid",
        value: toNumber(todayStats.invalid),
        change: calculateChange("invalid"),
      },
      {
        label: "Izin/Cuti",
        value: toNumber(todayStats["izin_cuti"]),
        change: calculateChange("izin_cuti"),
      },
    ],
  };
};
