import React, { useEffect, useState } from "react";
import DashboardLayouts from "../../layouts/DashboardLayouts";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBrandCashapp,
  IconCash,
  IconCashOff,
  IconDots,
  IconMoneybag,
  IconProgressAlert,
  IconReceipt,
  IconUser,
} from "@tabler/icons-react";
import useFetch from "../../hooks/useFetch";
import Table from "../../components/Table";
import { NavLink } from "react-router-dom";
import SalaryModal from "../../components/SalaryModal";

const currentDate = new Date();
const MAX_MONTH = currentDate.getMonth() + 1;
const MIN_MONTH = currentDate.getMonth();

const Payroll = () => {
  const [periode, setPeriode] = useState({
    formattedPeriode: "",
    formattedPeriodeForUi: "",
  });

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const formattedPeriode = `${year}-${month}`;
    const formattedPeriodeForUi = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long" }).format(today);
    setPeriode({
      formattedPeriode,
      formattedPeriodeForUi,
    });
  }, []);

  const [modalOpen, setModalOpen] = useState({
    isOpen: false,
    employeeId: "",
  });

  const handlePeriodeChange = (action) => {
    const [year, month] = periode.formattedPeriode.split("-").map(Number);

    if (action === "next") {
      let newMonth = month + 1;
      let newYear = year;
      if (newMonth > 12) {
        newMonth = 1;
        newYear++;
      }
      setPeriode({
        formattedPeriode: `${newYear}-${newMonth.toString().padStart(2, "0")}`,
        formattedPeriodeForUi: new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long" }).format(new Date(newYear, newMonth - 1)),
      });
    } else if (action === "prev") {
      let newMonth = month - 1;
      let newYear = year;
      if (newMonth < 1) {
        newMonth = 12;
        newYear--;
      }
      setPeriode({
        formattedPeriode: `${newYear}-${newMonth.toString().padStart(2, "0")}`,
        formattedPeriodeForUi: new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long" }).format(new Date(newYear, newMonth - 1)),
      });
    }
  };

  const {
    responseData: employeeData = [],
    loading: employeeDataLoading,
    error: employeeDataError,
    totalPages: employeeDataPages,
    refetch: employeeDataRefetch,
  } = useFetch(`/employee/payroll?periode=${periode?.formattedPeriode}`);

  const formatCurrency = (amount, prefix = "Rp.") => {
    if (!amount) return `${prefix} 0,00`;
    const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numericAmount)) {
      console.error("Invalid amount provided to formatCurrency:", amount);
      return `${prefix} 0,00`;
    }
    const formattedValue = numericAmount.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${prefix} ${formattedValue}`;
  };

  const handleOpenModal = (employeeId) => {
    setModalOpen({
      isOpen: true,
      employeeId,
    });
  };

  const employeeColumns = [
    {
      key: "employee",
      label: "Employee",
      icon: <IconUser size={20} />,
      render: (keyVal, employee) => (
        <div className="flex items-center gap-3">
          {/* {profileImage ? (
          <img src={profileImage} alt={`${value}'s Profile`} className="w-10 h-10 rounded-full object-cover" />
        ) : ( */}
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-slate-800 text-sm">
            {employee?.fullName?.[0]?.toUpperCase() || "?"}
          </div>
          {/* )} */}
          <div className="flex flex-col">
            <span className="font-bold 2xl:w-full sm:w-24 lg:w-40 truncate">{employee?.fullName}</span>
            <p className="text-xs text-slate-800 font-normal">{employee?.jobRole?.jobRoleTitle}</p>
          </div>
        </div>
      ),
    },

    {
      key: "payrolls",
      label: "Basic Salary",
      icon: <IconMoneybag size={20} />,
      render: (payroll) => <span className="text-sm text-zinc-800">{payroll?.basicSalary ? formatCurrency(payroll?.basicSalary) : "-"}</span>,
    },
    {
      key: "payrolls",
      label: "Allowance Total",
      icon: <IconCash size={20} />,
      render: (payroll) => (
        <span className="text-sm text-emerald-700">{payroll?.allowanceTotal ? `+${formatCurrency(payroll?.allowanceTotal)}` : "-"}</span>
      ),
    },
    {
      key: "payrolls",
      label: "Deduction Total",
      icon: <IconCashOff size={20} />,
      render: (payroll) => (
        <span className={`text-sm text-red-500`}>{payroll?.deductionTotal ? `-${formatCurrency(payroll?.deductionTotal)}` : "-"}</span>
      ),
    },
    {
      key: "payrolls",
      label: "Net Salary",
      icon: <IconBrandCashapp size={20} />,
      render: (payroll) => <span className="text-sm text-zinc-800">{payroll?.netSalary ? formatCurrency(payroll?.netSalary) : "-"}</span>,
    },
    {
      key: "documents",
      label: "Pay Slip",
      icon: <IconReceipt size={20} />,
      render: (documents, rowData) => {
        const payslipDocument = documents?.find((doc) => doc.documentName.startsWith(`payslip_${periode.formattedPeriode}`));

        return payslipDocument ? (
          <div className="2xl:w-48 xl:w-28 lg:w-24 md:w-20 sm:w-16 text-blue-500 px-2 border border-blue-500 rounded-full py-1 overflow-hidden whitespace-nowrap text-ellipsis">
            <NavLink
              to={`http://localhost:3000/storage/document/${rowData?.userId}/${payslipDocument?.documentName}`}
              target="_blank"
              className="text-xs"
              title={payslipDocument.documentName}
            >
              {payslipDocument.documentName}
            </NavLink>
          </div>
        ) : (
          <span className="text-sm text-gray-500">-</span>
        );
      },
    },
    {
      key: "payrolls",
      label: "Status",
      icon: <IconProgressAlert size={20} />,
      render: (payroll) => (
        <span
          className={`${
            !payroll?.status || payroll?.status === "Unpaid"
              ? "text-red-500 bg-red-100"
              : payroll?.status === "Paid"
              ? "text-emerald-700 bg-emerald-100"
              : "text-orange-500 bg-orange-100"
          } text-xs border rounded-full px-2 py-1`}
        >
          {payroll?.status ? payroll.status : "Not Set"}
        </span>
      ),
    },
    {
      key: "userId",
      label: "Action",
      icon: "",
      render: (userId) => {
        return (
          <button type="button" onClick={() => handleOpenModal(userId)}>
            <IconDots />
          </button>
        );
      },
    },
  ];

  return (
    <>
      <DashboardLayouts>
        <div className="px-6 py-3">
          <div className="mb-6">
            <div className="flex gap-24 items-center mb-12">
              <div className="1/3">
                <h1 className="text-2xl font-extrabold text-gray-800">Attendance and Payroll Summary</h1>
                <p className="text-gray-600 text-sm">
                  View employee salary details, including earnings, bonuses, deductions, and payslips for accurate payroll processing
                </p>
              </div>
            </div>
          </div>
          <div className="pl-4 flex items-center gap-4 mb-6">
            <button
              onClick={() => handlePeriodeChange("prev")}
              type="button"
              disabled={periode.formattedPeriode === `${currentDate.getFullYear()}-${String(MIN_MONTH).padStart(2, "0")}`}
              className={`bg-white p-1 text-xs text-slate-800 hover:bg-zinc-100 transition-all duration-300 ease-in-out rounded-lg border border-slate-400 ${
                periode.formattedPeriode === `${currentDate.getFullYear()}-${String(MIN_MONTH).padStart(2, "0")}`
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <IconArrowLeft />
            </button>
            <h1 className="font-bold text-slate-800">{periode?.formattedPeriodeForUi}</h1>
            <button
              onClick={() => handlePeriodeChange("next")}
              type="button"
              disabled={periode.formattedPeriode === `${currentDate.getFullYear()}-${String(MAX_MONTH).padStart(2, "0")}`}
              className={`bg-white p-1 text-xs text-slate-800 hover:bg-zinc-100 transition-all duration-300 ease-in-out rounded-lg border border-slate-400 ${
                periode.formattedPeriode === `${currentDate.getFullYear()}-${String(MAX_MONTH).padStart(2, "0")}`
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <IconArrowRight />
            </button>
          </div>
          <Table title="Employee Table" icon="fa-users" columns={employeeColumns} data={employeeData || []} />
        </div>
      </DashboardLayouts>

      {modalOpen.isOpen && (
        <SalaryModal
          employeeId={modalOpen.employeeId}
          handleClose={setModalOpen}
          isVisible={modalOpen}
          periode={periode}
          refetch={employeeDataRefetch}
        ></SalaryModal>
      )}
    </>
  );
};

export default Payroll;
