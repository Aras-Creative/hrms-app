import { formatCurrency } from "./formatCurrency";

const isValidDate = (cell) => {
  if (cell instanceof Date) {
    return !isNaN(cell.getTime());
  }

  if (typeof cell === "number") {
    return cell >= 1;
  }
  const parsedDate = new Date(cell);
  return !isNaN(parsedDate.getTime());
};

export const EmployeeColumns = (data) => {
  return [
    {
      key: "No",
      label: "#No",
      render: (value) => value || "-",
    },
    {
      key: "Nama",
      label: "Nama",
      render: (value) => value || "-",
    },
    {
      key: "Bagian",
      label: "Bagian",
      render: (value) => value || "-",
    },
    {
      key: "Tempat Lahir",
      label: "Tempat Lahir",
      render: (value) => value || "-",
    },
    {
      key: "Tanggal Lahir",
      label: "Tanggal Lahir",
      render: (value) => {
        if (isValidDate(value)) {
          const dateValue = new Date(Math.round((value - 25569) * 864e5));
          return dateValue.getFullYear() > 1900 ? dateValue.toLocaleDateString("en-CA") : value;
        }
        return value;
      },
    },
    {
      key: "NIK KTP",
      label: "NIK KTP",
      render: (value) => value || "-",
    },
    {
      key: "Alamat",
      label: "Alamat",
      render: (value) => value || "-",
    },
  ];
};

export const PayrollColumns = (data) => {
  const headers = data[1];

  const tunjanganKeys = new Set();
  const potonganKeys = new Set();
  headers?.forEach((header) => {
    if (header.includes("Tunjangan")) {
      tunjanganKeys.add(header);
    }
    if (header.includes("Potongan")) {
      potonganKeys.add(header);
    }
  });

  const tunjanganColumns = Array.from(tunjanganKeys).map((key) => ({
    key: key,
    label: `Tunjangan ${key.replace("Tunjangan ", "")}`,
    render: (value) => (value < 1 ? `${(value * 100).toFixed(1)}%` : formatCurrency(value)),
  }));

  const potonganColumns = Array.from(potonganKeys).map((key) => ({
    key: key,
    label: `Potongan ${key.replace("Potongan ", "")}`,
    render: (value) => (value < 1 ? `${(value * 100).toFixed(1)}%` : formatCurrency(value)),
  }));

  return [
    {
      key: "No",
      label: "#No",
      render: (value) => value,
    },
    {
      key: "Nama",
      label: "Nama",
      render: (value) => value || "-",
    },
    {
      key: "Hadir",
      label: "Hadir",
      render: (value) => value || "-",
    },
    {
      key: "Sakit",
      label: "Sakit",
      render: (value) => value || "-",
    },
    {
      key: "Cuti",
      label: "Cuti",
      render: (value) => value || "-",
    },
    {
      key: "Izin",
      label: "Izin",
      render: (value) => value || "-",
    },

    {
      key: "Absen",
      label: "Absen",
      render: (value) => value || "-",
    },
    {
      key: "Terlambat",
      label: "Terlambat",
      render: (value) => value || "-",
    },
    {
      key: "Total Kehadiran",
      label: "Total Kehadiran",
      render: (value) => value || "-",
    },
    {
      key: "Tunjangan Makan",
      label: "Tunjangan Makan",
      render: (value) => value || "-",
    },
    {
      key: "Tunjangan Transport",
      label: "Tunjangan Transport",
      render: (value) => value || "-",
    },
    {
      key: "Gaji Perhari",
      label: "Gaji Perhari",
      render: (value) => value || "-",
    },
    {
      key: "Gaji Pokok",
      label: "Gaji Pokok",
      render: (value) => formatCurrency(value) || "-",
    },
    ...tunjanganColumns,
    ...potonganColumns,
  ];
};

// export const PayrollColumns = (data) => {
//   const headers = data[1];

//   return [
//     {
//       key: "No",
//       label: "#No",
//       render: (value) => value,
//     },
//     {
//       key: "Nama",
//       label: "Nama",
//       render: (value) => value || "-",
//     },
//     {
//       key: "Gaji Pokok",
//       label: "Hadir",
//       render: (value) => value || "-",
//     },{
//       key: "Tunjangan Jabatan",
//       label: "Tunjangan Jabatan",
//       render: (value) => value || "-",
//     },

//     {
//       key: "Tunjangan Jabatan",
//       label: "Tunjangan Jabatan",
//       render: (value) => value || "-",
//     },
//     {
//       key: "Cuti",
//       label: "Cuti",
//       render: (value) => value || "-",
//     },
//     {
//       key: "Izin",
//       label: "Izin",
//       render: (value) => value || "-",
//     },
//     {
//       key: "Sakit",
//       label: "Sakit",
//       render: (value) => value || "-",
//     },
//     {
//       key: "Absen",
//       label: "Absen",
//       render: (value) => value || "-",
//     },
//     {
//       key: "Terlambat",
//       label: "Terlambat",
//       render: (value) => value || "-",
//     },
//     {
//       key: "Total Kehadiran",
//       label: "Total Kehadiran",
//       render: (value) => value || "-",
//     },
//     {
//       key: "Tunjangan Makan",
//       label: "Tunjangan Makan",
//       render: (value) => value || "-",
//     },
//     {
//       key: "Tunjangan Transport",
//       label: "Tunjangan Transport",
//       render: (value) => value || "-",
//     },
//     {
//       key: "Gaji Perhari",
//       label: "Gaji Perhari",
//       render: (value) => value || "-",
//     },
//     {
//       key: "Gaji Pokok",
//       label: "Gaji Pokok",
//       render: (value) => formatCurrency(value) || "-",
//     },
//     ...tunjanganColumns,
//     ...potonganColumns,
//   ];
// };
