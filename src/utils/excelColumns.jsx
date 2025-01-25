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
  const headers = data[0];
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
      key: "Gaji Pokok",
      label: "Gaji Pokok",
      render: (value) => formatCurrency(value) || "-",
    },
    ...tunjanganColumns,
    ...potonganColumns,
  ];
};
