import React, { useCallback, useState, useEffect } from "react";
import DashboardLayouts from "../../layouts/DashboardLayouts";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBrandCashapp,
  IconCash,
  IconCashOff,
  IconChecklist,
  IconDots,
  IconDownload,
  IconMoneybag,
  IconProgressAlert,
  IconReceipt,
  IconUser,
} from "@tabler/icons-react";
import useFetch from "../../hooks/useFetch";
import Table from "../../components/Table";
import { NavLink } from "react-router-dom";
import SalaryModal from "../../components/SalaryModal";
import { formatCurrency } from "../../utils/formatCurrency";
import { STORAGE_URL } from "../../config";
import { InternalServerError, NotFound } from "../../components/Errors";
import { Loading } from "../../components/Preloaders";
import Toast from "../../components/Toast";
import ExcelUpload from "../../components/ExcelUpload";
import { validatePayrollData } from "../../utils/excelValidations";
import { PayrollColumns } from "../../utils/excelColumns";
import Pagination from "../../components/Pagination";
import FormInput from "../../components/FormInput";
import useAuth from "../../hooks/useAuth";
import { handleDownloadFile } from "../../utils/handleDownloadFile";

const currentDate = new Date();
const MAX_MONTH = currentDate.getMonth() + 1;
const MIN_MONTH = currentDate.getMonth();

const getInitialPeriode = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const formattedPeriode = `${year}-${month}`;
  const formattedPeriodeForUi = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(today);
  return {
    formattedPeriode,
    formattedPeriodeForUi,
  };
};
const Payroll = () => {
  const [periode, setPeriode] = useState(getInitialPeriode());
  const [modalOpen, setModalOpen] = useState({ isOpen: false, employeeId: "" });
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [toast, setToast] = useState({ type: "", message: "" });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [status, setStatus] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [jobRoleOptions, setJobRoleOptions] = useState();
  const [jobRole, setJobRole] = useState("");

  const { auth } = useAuth();

  const handlePeriodeChange = useCallback((action) => {
    setPeriode((prevPeriode) => {
      const [year, month] = prevPeriode.formattedPeriode.split("-").map(Number);
      let newMonth = month;
      let newYear = year;

      if (action === "next") {
        newMonth++;
        if (newMonth > 12) {
          newMonth = 1;
          newYear++;
        }
      } else if (action === "prev") {
        newMonth--;
        if (newMonth < 1) {
          newMonth = 12;
          newYear--;
        }
      }

      return {
        formattedPeriode: `${newYear}-${newMonth.toString().padStart(2, "0")}`,
        formattedPeriodeForUi: new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
        }).format(new Date(newYear, newMonth - 1)),
      };
    });
  }, []);

  const {
    responseData: employeeData = [],
    loading: employeeDataLoading,
    error: employeeDataError,
    totalPages: employeeTotalPages,
    refetch: employeeDataRefetch,
  } = useFetch(
    `/employee/payroll?periode=${periode?.formattedPeriode}${
      status ? `&status=${status}` : ""
    }`,
    { currentPage, pageSize }
  );

  useEffect(() => {
    if (employeeTotalPages) {
      setTotalPages(employeeTotalPages);
    }
  }, [employeeTotalPages]);

  useEffect(() => {
    employeeDataRefetch();
  }, [pageSize, currentPage]);

  const handleOpenModal = useCallback((employeeId) => {
    setModalOpen({ isOpen: true, employeeId });
  }, []);

  const { updateData: markAsPaid } = useFetch("/employee/payroll/paid", {
    method: "PUT",
  });

  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    const userId = event.target.value;
    setSelectedUserIds((prevSelected) => {
      if (isChecked) {
        return [...prevSelected, userId];
      } else {
        return prevSelected.filter((id) => id !== userId);
      }
    });
  };

  const handleMarkAsPaid = async () => {
    const { success } = await markAsPaid({ userIds: selectedUserIds });
    if (success) {
      employeeDataRefetch();
      setSelectedUserIds([]);
    }
  };

  const employeeColumns = [
    {
      key: "employee",
      label: "Nama Karyawan",
      icon: <IconUser size={20} />,
      render: (keyVal, employee) => {
        const profileImage =
          employee?.profilePicture &&
          `${STORAGE_URL}/document/${employee?.userId}/${employee.profilePicture.path}`;
        return (
          <div className="flex items-center gap-3">
            {auth?.user?.role === "super" && (
              <div>
                <label>
                  <input
                    type="checkbox"
                    value={employee?.userId}
                    onChange={handleCheckboxChange}
                  />
                </label>
              </div>
            )}
            {profileImage ? (
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img
                  src={profileImage}
                  alt={`${employee?.fullName}'s Profile`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-slate-800 text-sm">
                {employee?.fullName?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-bold 2xl:w-full sm:w-24 lg:w-32 truncate">
                {employee?.fullName}
              </span>
              <p className="text-xs text-slate-800 font-normal">
                {employee?.jobRole?.jobRoleTitle}
              </p>
            </div>
          </div>
        );
      },
    },

    {
      key: "payrolls",
      label: "Gaji Pokok",
      icon: <IconMoneybag size={20} />,
      render: (payroll) => (
        <span className="text-sm text-zinc-800">
          {payroll?.basicSalary ? formatCurrency(payroll?.basicSalary) : "-"}
        </span>
      ),
    },
    {
      key: "payrolls",
      label: "Total Tunjangan",
      icon: <IconCash size={20} />,
      render: (payroll) => (
        <span className="text-sm text-emerald-700">
          {payroll?.allowanceTotal
            ? `+${formatCurrency(payroll?.allowanceTotal)}`
            : "-"}
        </span>
      ),
    },
    {
      key: "payrolls",
      label: "Total Potongan",
      icon: <IconCashOff size={20} />,
      render: (payroll) => (
        <span className={`text-sm text-red-500`}>
          {payroll?.deductionTotal
            ? `-${formatCurrency(payroll?.deductionTotal)}`
            : "-"}
        </span>
      ),
    },
    {
      key: "payrolls",
      label: "Gaji Bersih",
      icon: <IconBrandCashapp size={20} />,
      render: (payroll) => (
        <span className="text-sm text-zinc-800">
          {payroll?.netSalary ? formatCurrency(payroll?.netSalary) : "-"}
        </span>
      ),
    },
    {
      key: "payslips",
      label: "Slip Gaji",
      icon: <IconReceipt size={20} />,
      render: (payslip, rowData) => {
        const payslipDocument = `${STORAGE_URL}/document/payslip/${payslip[0]?.path}`;
        return payslip.length > 0 ? (
          <div className="2xl:w-48 xl:w-28 lg:w-24 md:w-20 sm:w-16 text-blue-500 px-2 border border-blue-500 rounded-full py-1 overflow-hidden whitespace-nowrap text-ellipsis">
            <NavLink
              to={payslipDocument}
              target="_blank"
              className="text-xs"
              title={payslip?.path}
            >
              {payslip[0]?.path}
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
            !payroll?.status || payroll?.status === "unpaid"
              ? "text-red-500 bg-red-100"
              : payroll?.status === "Confirmed"
              ? "text-emerald-700 bg-emerald-100"
              : "text-orange-500 bg-orange-100"
          } text-xs border rounded-full px-2 py-1`}
        >
          {payroll?.status ? payroll.status : "Belum diatur"}
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const { responseData: jobRoleData = [] } = useFetch("/jobrole");

  useEffect(() => {
    if (jobRoleData?.length) {
      setJobRoleOptions([
        { label: "Semua Job Role", value: null },
        ...jobRoleData.map(({ jobRoleTitle, jobRoleId }) => ({
          label: jobRoleTitle,
          value: jobRoleId,
        })),
      ]);
    } else {
      setJobRoleOptions([{ label: "TIdak ada data Job Role", value: null }]);
    }
  }, [jobRoleData]);

  const sortedData =
    employeeData
      ?.filter((employee) => {
        if (!jobRole || jobRole.trim() === "") return true;

        return employee.employeeId.startsWith(jobRole);
      })
      .map((employee, index) => ({ ...employee, index }))
      .sort((a, b) => {
        return sortOrder === "asc" ? a.index - b.index : b.index - a.index;
      })
      .map(({ index, ...rest }) => rest) || [];

  return (
    <>
      <DashboardLayouts>
        <div className="px-6 py-3">
          <div className="mb-6">
            <div className="flex gap-24 items-center mb-12">
              <div className="1/3">
                <h1 className="text-2xl font-extrabold text-gray-800">
                  Rekap Data Keahadiran dan Payroll
                </h1>
                <p className="text-gray-600 text-sm">
                  Menampilkan rincian gaji karyawan untuk proses penggajian yang
                  tepat.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center w-full mb-6">
            <div className="flex items-center gap-4">
              <ExcelUpload
                postUrl={"/payroll/upload"}
                columns={PayrollColumns}
                validate={validatePayrollData}
              />
              <button
                type="button"
                onClick={() =>
                  handleDownloadFile(
                    "/document/payroll",
                    `payroll_${periode.formattedPeriode}.xlsx`
                  )
                }
                className="bg-white flex items-center gap-1 hover:bg-zinc-50 rounded-lg transition-all duration-300 ease-in-out px-3 py-2 border border-zinc-300"
              >
                <IconDownload size={20} />
                <span className=" text-sm text-zinc-600 font-bold">
                  Download XLSX
                </span>
              </button>
              <div className="pl-4 flex items-center gap-4">
                <button
                  onClick={() => handlePeriodeChange("prev")}
                  type="button"
                  disabled={
                    periode.formattedPeriode ===
                    `${currentDate.getFullYear()}-${String(MIN_MONTH).padStart(
                      2,
                      "0"
                    )}`
                  }
                  className={`bg-white p-1 text-xs text-slate-800 hover:bg-zinc-100 transition-all duration-300 ease-in-out rounded-lg border border-slate-400 ${
                    periode.formattedPeriode ===
                    `${currentDate.getFullYear()}-${String(MIN_MONTH).padStart(
                      2,
                      "0"
                    )}`
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <IconArrowLeft />
                </button>
                <h1 className="font-bold text-slate-800">
                  {periode?.formattedPeriodeForUi}
                </h1>
                <button
                  onClick={() => handlePeriodeChange("next")}
                  type="button"
                  disabled={
                    periode.formattedPeriode ===
                    `${currentDate.getFullYear()}-${String(MAX_MONTH).padStart(
                      2,
                      "0"
                    )}`
                  }
                  className={`bg-white p-1 text-xs text-slate-800 hover:bg-zinc-100 transition-all duration-300 ease-in-out rounded-lg border border-slate-400 ${
                    periode.formattedPeriode ===
                    `${currentDate.getFullYear()}-${String(MAX_MONTH).padStart(
                      2,
                      "0"
                    )}`
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <IconArrowRight />
                </button>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="mt-2">
                {selectedUserIds.length > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAsPaid}
                    className="bg-emerald-700 rounded-xl px-3 py-2 flex items-center hover:bg-emerald-800 text-white"
                  >
                    <IconChecklist /> Konfirmasi
                  </button>
                )}
              </div>
              <FormInput
                type="select"
                options={[
                  { label: "10 Karyawan", value: 10 },
                  { label: "20 Karyawan", value: 20 },
                  { label: "50 Karyawan", value: 50 },
                  { label: "100 Karyawan", value: 100 },
                ]}
                value={{ label: `${pageSize} Karyawan`, value: pageSize }}
                onChange={(e) => {
                  setPageSize(e.value);
                  setCurrentPage(1);
                }}
              />

              <FormInput
                type="select"
                options={jobRoleOptions}
                placeholder={"Select Job Role"}
                onChange={(e) => setJobRole(e.value)}
              />

              <FormInput
                type="select"
                options={[
                  { label: "Filter Status", value: null },
                  { label: "Pending", value: "Pending" },
                  { label: "Confirmed", value: "Confirmed" },
                ]}
                value={{ label: status || "Filter Status", value: status }}
                onChange={(e) => setStatus(e.value)}
              />

              <FormInput
                type="select"
                options={[
                  { label: "Ascending", value: "asc" },
                  { label: "Descending", value: "desc" },
                ]}
                value={{
                  label: `${sortOrder === "asc" ? "Ascending" : "Descending"}`,
                  value: sortOrder,
                }}
                onChange={(e) => setSortOrder(e.value)}
              />
            </div>
          </div>

          {employeeDataLoading ? (
            <Loading />
          ) : employeeDataError?.status === 404 ? (
            <NotFound />
          ) : employeeDataError?.status === 500 ? (
            <InternalServerError />
          ) : (
            <>
              <Table
                title="Employee Table"
                icon="fa-users"
                columns={employeeColumns}
                data={sortedData}
              />
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
        {toast.message !== "" && (
          <Toast
            text={toast.message}
            type={toast.type}
            onClick={() => setToast({ type: "", message: "" })}
          />
        )}
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
