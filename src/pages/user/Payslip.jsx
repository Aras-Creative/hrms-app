import React, { useCallback, useState } from "react";
import Layouts from "./profile/Layouts";
import CircularProgressBar from "../../components/CircularProgressBar";
import { IconArrowLeft, IconArrowRight, IconDownload } from "@tabler/icons-react";
import useFetch from "../../hooks/useFetch";
import { formatCurrency } from "../../utils/formatCurrency";
import { handleDownloadFile } from "../../utils/handleDownloadFile";

const currentDate = new Date();
const MAX_MONTH = currentDate.getMonth() + 1;
const MIN_MONTH = currentDate.getMonth();

const getInitialPeriode = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const formattedPeriode = `${year}-${month}`;
  const formattedPeriodeForUi = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long" }).format(today);
  return {
    formattedPeriode,
    formattedPeriodeForUi,
  };
};
const Payslip = () => {
  const [periode, setPeriode] = useState(getInitialPeriode());
  const { responseData: employeeData = [] } = useFetch(`/payroll?periode=${periode?.formattedPeriode}`);

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
        formattedPeriodeForUi: new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long" }).format(new Date(newYear, newMonth - 1)),
      };
    });
  }, []);

  const handleDownloadPayslip = async () => {
    const path = employeeData?.payslips[0]?.path;
    const apiUrl = `/payroll/download?filename=${path}`;
    handleDownloadFile(apiUrl, path);
  };

  const basicSalary = parseInt(employeeData?.payrolls?.basicSalary) || 0;
  const allowanceTotal = parseInt(employeeData?.payrolls?.allowanceTotal) || 0;
  const deductionTotal = parseInt(employeeData?.payrolls?.deductionTotal) || 0;

  const earnings = basicSalary + allowanceTotal;
  const deductions = deductionTotal;
  const earningsPercentage = (deductions / earnings) * 100;

  const allowance = employeeData?.adjustments?.filter((adjustment) => adjustment.type === "allowance");
  const deduction = employeeData?.adjustments?.filter((adjustment) => adjustment.type === "deduction");

  return (
    <Layouts title={"Slip Gaji"} backUrl={"/homepage"}>
      <div className="w-full pt-16 px-5 bg-white pb-12">
        <div className="w-full px-3 pb-5 pt-3 rounded-3xl bg-white shadow border">
          <div className="flex justify-end w-full mb-6">
            <div className="pl-4 flex items-center gap-4">
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
          </div>
          <CircularProgressBar
            progress={earningsPercentage}
            radius={75}
            strokeWidth={20}
            bgTextColor="white"
            textColor="black"
            strokeColor="stroke-red-500"
            baseColor="stroke-indigo-500"
            text={
              <>
                <div className="flex items-center flex-col gap-1">
                  <h1 className="text-sm font-bold">{formatCurrency(earnings - deductions)}</h1>
                  <p className="text-xs text-zinc-700">Gaji Bersih</p>
                </div>
              </>
            }
          />

          <div className="flex items-center justify-center mt-8">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <div className="flex flex-col items-start">
                  <p className="font-semibold text-zinc-700">{formatCurrency(earnings)}</p>
                  <h1 className="font-bold text-sm">Pendapatan</h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="flex flex-col items-start">
                  <p className="font-semibold text-zinc-700">{formatCurrency(deductions)}</p>
                  <h1 className="font-bold text-sm">Potongan</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {employeeData?.payrolls?.status === "Confirmed" && (
          <>
            <div className="flex items-center justify-between mt-5">
              <h1 className="text-xl font-semibold">Rincian</h1>
              <button
                type="button"
                onClick={handleDownloadPayslip}
                className="px-3 py-2 rounded-xl hover:bg-indigo-700 focus:bg-indigo-700 bg-indigo-500 flex items-center gap-2"
              >
                <IconDownload className="text-white" size={20} />
                <p className="text-white text-sm">Download Slip Gaji</p>
              </button>
            </div>

            <div className="w-full px-6 py-3 bg-white rounded-3xl border shadow mt-4">
              <h1 className="text-lg font-bold">Pendapatan</h1>

              <div className="grid grid-cols-1 mt-2 gap-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold">Gaji Pokok</p>
                  <p className="text-xs">{formatCurrency(employeeData?.payrolls?.basicSalary)}</p>
                </div>
                {allowance?.map((item, index) => (
                  <>
                    <div key={index} className="flex w-full items-center justify-between">
                      <p className="text-xs w-2/3 overflow-hidden whitespace-nowrap truncate font-semibold">{item.name}</p>
                      <p className="text-xs">
                        {item.amountType === "percent"
                          ? formatCurrency(parseFloat(item.amount / 100) * parseInt(employeeData?.payrolls?.basicSalary))
                          : formatCurrency(item.amount)}
                      </p>
                    </div>
                  </>
                ))}
              </div>
            </div>

            <div className="w-full px-6 py-3 bg-white rounded-3xl border shadow mt-3">
              <h1 className="text-lg font-bold">Potongan</h1>

              <div className="grid grid-cols-1 mt-2 gap-1">
                {deduction?.map((item, index) => (
                  <div key={index} className="flex w-full items-center justify-between">
                    <p className="text-xs w-2/3 overflow-hidden whitespace-nowrap truncate font-semibold">{item.name}</p>
                    <p className="text-xs">
                      {item.amountType === "percent"
                        ? formatCurrency(parseFloat(item.amount / 100) * parseInt(employeeData?.payrolls?.basicSalary))
                        : formatCurrency(item.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full flex items-center justify-between px-6 py-3 bg-white rounded-3xl border shadow mt-3">
              <h1 className="text-sm font-bold">Gaji Bersih</h1>
              <p className="text-sm">{formatCurrency(employeeData?.payrolls?.netSalary)}</p>
            </div>
          </>
        )}
      </div>
    </Layouts>
  );
};

export default Payslip;
