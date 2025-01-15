import {
  IconBuildingBank,
  IconBuildingMosque,
  IconCake,
  IconCreditCard,
  IconDeviceMobile,
  IconGenderBigender,
  IconMail,
  IconMapPin,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import FormInput from "./FormInput";
import { STORAGE_URL } from "../config";

const SalaryModal = ({ employeeId, handleClose, isVisible, periode, refetch }) => {
  const fetchUrl = `/employee/${employeeId}/salary`;
  const { responseData: data = {}, loading } = useFetch(fetchUrl);
  const [newAdjustment, setNewAdjustment] = useState(false);
  const [salaryAdjustment, setSalaryAdjustment] = useState({
    salary: {
      basicSalary: "",
      totalSalary: "",
    },
    adjustment: [],
    removed: "",
  });

  useEffect(() => {
    if (data) {
      setSalaryAdjustment({
        salary: {
          basicSalary: parseFloat(data.salary.basicSalary).toFixed(0) || 0,
          totalSalary: data.salary.totalSalary || 0,
        },
        adjustment: data.adjustments || [],
        removed: "",
      });
    }
  }, [data, employeeId]);

  const handleCloseModal = () => {
    handleClose((prev) => !prev);
  };

  const [addNewAdjustmentForm, setAddNewAdjustmentForm] = useState({
    name: "",
    type: "",
    amountType: "fixed",
  });

  const addAdjustment = () => {
    setNewAdjustment((prev) => !prev);
    setAddNewAdjustmentForm({ type: "", name: "" });
  };

  const removeAdjustment = (index) => {
    setSalaryAdjustment((prevState) => {
      return {
        ...prevState,
        adjustment: prevState.adjustment.filter((_, i) => i !== index),
      };
    });

    setSalaryAdjustment((prev) => ({
      ...prev,
      removed: [...prev.removed, salaryAdjustment.adjustment[index]],
    }));
  };

  const handleSalaryAdjustmentChange = (index, value) => {
    const updatedAdjustment = [...salaryAdjustment.adjustment];
    updatedAdjustment[index].amount = value;
    setSalaryAdjustment((prevState) => ({
      ...prevState,
      adjustment: updatedAdjustment,
    }));
  };

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

  const handleCurrencyInput = (formName, field) => (value) => {
    setSalaryAdjustment((prevState) => ({
      ...prevState,
      [formName]: {
        ...prevState[formName],
        [field]: value,
      },
    }));
  };

  const calculateTotalSalary = () => {
    const basicSalary = parseFloat(salaryAdjustment?.salary?.basicSalary) || 0;

    const allowanceTotal = salaryAdjustment.adjustment
      ?.filter((adjustment) => adjustment?.type === "allowance")
      ?.reduce((sum, item) => {
        if (item.amountType === "percent") {
          const percentage = parseFloat(item.amount) || 0;
          return sum + (basicSalary * percentage) / 100;
        }
        return sum + parseFloat(item.amount || 0);
      }, 0);

    const deductionTotal = salaryAdjustment.adjustment
      ?.filter((adjustment) => adjustment?.type === "deduction")
      ?.reduce((sum, item) => {
        if (item.amountType === "percent") {
          const percentage = parseFloat(item.amount) || 0;
          return sum + (basicSalary * percentage) / 100;
        }
        return sum + parseFloat(item.amount || 0);
      }, 0);

    const totalSalary = formatCurrency(basicSalary + allowanceTotal - deductionTotal);
    const salaryWithAllowance = formatCurrency(basicSalary + allowanceTotal);
    const salaryDeduction = formatCurrency(deductionTotal);

    return { totalSalary, salaryWithAllowance, salaryDeduction };
  };

  const addAdjustmentInput = (name, type) => {
    setSalaryAdjustment((prevState) => ({
      ...prevState,
      adjustment: [...prevState.adjustment, { name, type, amountType: "percent", amount: "" }],
    }));
    setAddNewAdjustmentForm({ type: "", name: "" });
    setNewAdjustment((prev) => !prev);
  };

  const handleValueTypeChange = (idx, type) => {
    const updatedAdjustment = [...salaryAdjustment.adjustment];
    updatedAdjustment[idx].amountType = type;
    setSalaryAdjustment((prevState) => ({
      ...prevState,
      adjustment: updatedAdjustment,
    }));
  };

  const { submitData: postSalary, loading: postSalaryLoading } = useFetch(
    `/employee/salary/${employeeId}/update?month=${periode?.formattedPeriode}`,
    {
      method: "POST",
    }
  );

  const handleSubmit = async () => {
    const { success, error, data } = await postSalary(salaryAdjustment);
    if (success) {
      handleCloseModal();
      refetch();
    } else {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-start justify-end">
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-500 ${isVisible ? "opacity-50" : "opacity-0"}`}
        onClick={handleCloseModal}
      ></div>
      <div
        className={`relative bg-white rounded-l-xl h-screen overflow-y-scroll scrollbar-none shadow-lg 2xl:w-[70%] xl:w-[95%] lg:w-[100%] md:w-[100%] sm:w-[100%] ${
          isVisible ? "animate-slideIn" : "animate-slideOut"
        }`}
      >
        <div className="w-full flex bg-white items-center justify-between px-6 py-4 border-b border-zinc-300">
          <h2 className="text-xl font-bold text-gray-800 text-end">Rekap Kehadiran dan Payroll</h2>

          <button type="button" onClick={handleCloseModal}>
            <IconX />
          </button>
        </div>
        <div className="bg-white w-full flex px-8 justify-between items-center gap-8 border-b border-zinc-300">
          <div className="flex w-2/3 items-center gap-8">
            {data?.profilePicture ? (
              <img src={`${STORAGE_URL}/document/${data?.userId}/${data?.profilePicture?.path}`} className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-slate-800 text-3xl font-bold">
                {data?.fullName[0] || "?"}
              </div>
            )}
            <div className="flex items-start gap-2 flex-col">
              <h1 className="text-lg font-bold">{data?.fullName}</h1>
              <div className="flex items-center gap-10">
                <div className="flex flex-col items-start">
                  <span className="text-sm text-zinc-500 flex gap-1">Employee ID</span>
                  <h1 className="text-sm font-semibold">{data?.employeeId}</h1>
                </div>

                <div className="flex flex-col items-start">
                  <span className="text-sm text-zinc-500 flex gap-1">Position</span>
                  <h1 className="text-sm font-semibold">{data?.jobRole?.jobRoleTitle}</h1>
                </div>
              </div>
            </div>
          </div>
          <Statistics data={data?.attendances} />
        </div>
        <div className=" flex items-star h-[calc(100vh-225px)] bg-zinc-100">
          <div className="w-2/3 border-r border-zinc-300 px-8 py-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div className="flex items-center justify-between relative">
              <h1 className="text-lg font-semibold">Kompensasi</h1>
              <button
                type="button"
                onClick={addAdjustment}
                className="text-white font-semibold text-sm px-3 py-2 bg-emerald-700 rounded-xl inline-flex items-center gap-1 hover:underline hover:bg-emerald-900 transition-all duration-300 ease-in-out"
              >
                <IconPlus size={18} />
                <p>Tambah</p>
              </button>

              {newAdjustment && (
                <div className="absolute bg-white rounded-xl top-12 right-0 z-20 p-4 shadow-md w-[26rem] border border-gray-300">
                  <div className="w-full border-b border-gray-200 pb-2 mb-3">
                    <h3 className="text-base font-medium text-gray-800">Tambah penyesuaian gaji</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <FormInput
                      label="Name Adjustment"
                      value={addNewAdjustmentForm.name}
                      placeholder={"Nama Penyesuaian"}
                      onChange={(e) => setAddNewAdjustmentForm({ ...addNewAdjustmentForm, name: e.target.value })}
                      className="flex-1 text-sm"
                    />
                    <FormInput
                      label="Jenis"
                      type="select"
                      value={{
                        label: addNewAdjustmentForm.type ? addNewAdjustmentForm.type : "Type",
                        value: addNewAdjustmentForm.type,
                      }}
                      options={[
                        { label: "Tunjangan", value: "allowance" },
                        { label: "Pengurangan", value: "deduction" },
                      ]}
                      placeholder="Select Type"
                      className="flex-1 text-sm"
                      onChange={(e) => setAddNewAdjustmentForm({ ...addNewAdjustmentForm, type: e.value })}
                    />
                  </div>
                  <div className="mt-4 flex gap-4 justify-end">
                    <button
                      type="button"
                      onClick={addAdjustment}
                      className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (!addNewAdjustmentForm.name || !addNewAdjustmentForm.type) {
                          return;
                        }
                        addAdjustmentInput(addNewAdjustmentForm.name, addNewAdjustmentForm.type);
                      }}
                      type="button"
                      className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition duration-200"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="w-full mb-6 mt-8">
              <h1 className="text-lg font-semibold">Gaji Pokok dan Tunjangan</h1>
            </div>
            <div className="grid grid-cols-2 w-full gap-6">
              <FormInput
                type="currency"
                label={"Gaji Pokok"}
                value={salaryAdjustment?.salary?.basicSalary || "0"}
                border={"border-b"}
                onChange={(ammount) => handleCurrencyInput("salary", "basicSalary")(ammount)}
              />
              {salaryAdjustment?.adjustment?.length > 0 &&
                salaryAdjustment.adjustment
                  .map((item, index) => ({ ...item, globalIndex: index }))
                  .filter((adjustment) => adjustment?.type === "allowance")
                  .map((item) => (
                    <div key={item.globalIndex} className="flex items-center gap-2">
                      <div className="flex-grow">
                        <FormInput
                          type={item.amountType === "fixed" ? "currency" : "text"}
                          label={item.name || "Unknown"}
                          value={item.amount || ""}
                          placeholder={`Enter ${item.name} amount`}
                          border={"border-b"}
                          onChange={
                            item.amountType === "fixed"
                              ? (amount) => handleSalaryAdjustmentChange(item.globalIndex, amount)
                              : (amount) => handleSalaryAdjustmentChange(item.globalIndex, amount.target.value)
                          }
                        />
                      </div>
                      <div className="flex-2">
                        <FormInput
                          type="select"
                          label={"Type"}
                          options={[
                            { label: "%", value: "percent" },
                            { label: "Rp.", value: "fixed" },
                          ]}
                          value={{ label: item.amountType === "percent" ? "%" : "Rp.", value: item.amountType }}
                          onChange={(event) => handleValueTypeChange(item.globalIndex, event.value)}
                        />
                      </div>
                      <button type="button" onClick={() => removeAdjustment(item.globalIndex)} className="text-red-500 hover:text-red-700 mt-7">
                        <IconTrash />
                      </button>
                    </div>
                  ))}
            </div>
            <div className="mt-6 border-t border-zinc-300 pt-4">
              <p className="text-lg font-bold text-slate-800 flex justify-between">
                Total: <span>{calculateTotalSalary().salaryWithAllowance}</span>
              </p>
            </div>
            <div className="w-full mt-8 mb-6">
              <h1 className="text-lg font-semibold">Pengurangan</h1>
            </div>
            <div className="grid grid-cols-2 w-full gap-6">
              {salaryAdjustment?.adjustment?.length > 0 &&
                salaryAdjustment.adjustment
                  .map((item, index) => ({ ...item, globalIndex: index }))
                  .filter((adjustment) => adjustment?.type === "deduction")
                  .map((item) => (
                    <div key={item.globalIndex} className="flex items-center justify-between gap-2 w-full">
                      <div className="flex-grow">
                        <FormInput
                          type={item.amountType === "fixed" ? "currency" : "text"}
                          label={item.name || "Unknown"}
                          value={item.amount || ""}
                          placeholder={`Enter ${item.name} amount`}
                          border={"border-b"}
                          onChange={
                            item.amountType === "fixed"
                              ? (amount) => handleSalaryAdjustmentChange(item.globalIndex, amount)
                              : (amount) => handleSalaryAdjustmentChange(item.globalIndex, amount.target.value)
                          }
                        />
                      </div>

                      <div className="flex-grow">
                        <FormInput
                          type="select"
                          label={"Type"}
                          options={[
                            { label: "%", value: "percent" },
                            { label: "Rp.", value: "fixed" },
                          ]}
                          value={{ label: item.amountType === "percent" ? "%" : "Rp.", value: item.amountType }}
                          onChange={(event) => handleValueTypeChange(item.globalIndex, event.value)}
                        />
                      </div>

                      <button type="button" onClick={() => removeAdjustment(item.globalIndex)} className="text-red-500 hover:text-red-700 mt-7">
                        <IconTrash />
                      </button>
                    </div>
                  ))}
            </div>
            <div className="mt-6 border-t border-zinc-300 pt-4">
              <p className="text-lg font-bold text-red-600 flex justify-between">
                Total: <span>-{calculateTotalSalary().salaryDeduction}</span>
              </p>
            </div>
            <div className="w-full mb-4 py-4 rounded-lg mt-6">
              <p className="text-xl font-bold text-slate-800 flex justify-between">
                Grand Total: <span>{calculateTotalSalary().totalSalary}</span>
              </p>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-emerald-700 text-white font-semibold hover:bg-emerald-800 transition-all duration-300 ease-in-out px-3 py-2 rounded-lg"
              >
                Simpan
              </button>
            </div>
          </div>
          <div className="w-1/3 px-8 py-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            <h1 className="w-full font-semibold text-lg">Informasi Personal</h1>
            <div className="w-full grid grid-cols-2 gap-4 mt-6">
              <span className="text-sm text-zinc-600 flex gap-1 items-center">
                <IconGenderBigender size={18} />
                Jenis Kelamin
              </span>
              <span className="text-sm text-zinc-600">{data?.gender}</span>
              <span className="text-sm text-zinc-600 flex gap-1 items-center">
                <IconBuildingMosque size={18} /> Agama
              </span>
              <span className="text-sm text-zinc-600">{data?.religion}</span>
              <span className="text-sm text-zinc-600 flex gap-1 items-center">
                <IconCake size={18} /> Tanggal Lahir
              </span>
              <span className="text-sm text-zinc-600">
                {new Date(data?.dateOfBirth).toLocaleString("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                })}
              </span>
              <span className="text-sm text-zinc-600 flex gap-1 items-center">
                <IconMapPin size={18} /> Alamat
              </span>
              <span className="text-sm text-zinc-600 whitespace-nowrap overflow-hidden truncate">{data?.address}</span>
            </div>

            <h1 className="w-full font-semibold text-lg mt-8">Informasi Kontrak</h1>
            <div className="w-full grid grid-cols-2 gap-4 mt-6">
              <span className="text-sm text-zinc-600 flex gap-1 items-center">
                <IconMail size={18} />
                Email
              </span>
              <span className="text-sm text-zinc-600">{data?.email}</span>
              <span className="text-sm text-zinc-600 flex gap-1 items-center">
                <IconDeviceMobile size={18} /> No. Handphone
              </span>
              <span className="text-sm text-zinc-600">{data?.phoneNumber}</span>

              <span className="text-sm text-zinc-600 flex gap-1 items-center">
                <IconBuildingBank size={18} /> Nama Bank
              </span>
              <span className="text-sm text-zinc-600">Bank {data?.bankName}</span>
              <span className="text-sm text-zinc-600 flex gap-1 items-center">
                <IconCreditCard size={18} /> No. Rekening
              </span>
              <span className="text-sm text-zinc-600">{data?.bankAccountNumber}</span>
            </div>

            <h1 className="w-full font-semibold text-lg mt-8">Ruang Lingkup Kerja</h1>
            <div className="flex-col flex w-full gap-2 mt-5">
              {data?.workingScopes?.length > 0 ? (
                data?.workingScopes.map((scope, index) => (
                  <div key={index} className="border text-sm border-zinc-500 rounded-lg p-2">
                    {scope.title}
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-600">Belum ditambahkan</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProgressBar = ({ label, value, max }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="space-y-4">
      <div className="flex items-center ">
        <span className="text-xs text-blue-500 w-12 text-left whitespace-nowrap">{value}</span>
        <div className="flex-grow relative bg-gray-200 rounded-full h-1" style={{ direction: "rtl" }}>
          <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${percentage}%`, transform: "scaleX(-1)" }}></div>
          <span className="absolute right-0 -top-4 text-xs text-blue-500">{label}</span>
        </div>
      </div>
    </div>
  );
};

const Statistics = ({ data }) => {
  const stats = [
    { label: "Kehadiran", value: 0, max: 0 },
    { label: "Pulang Awal", value: 0, max: 0 },
    { label: "Izin Cuti", value: 0, max: 0 },
    { label: "Terlambat", value: 0, max: 0 },
    { label: "Tidak Hadir", value: 0, max: 0 },
  ];

  data?.forEach((entry) => {
    const statusIndex = stats.findIndex((stat) => stat.label === entry.status);
    if (statusIndex !== -1) {
      stats[statusIndex].value += 1;
    }
  });

  const totalAttendance = data?.length || 0;

  stats.forEach((stat) => {
    stat.max = totalAttendance;
  });

  return (
    <div className="p-6 w-1/3">
      <div className="space-y-2">
        {stats.map((stat, index) => (
          <ProgressBar key={index} label={stat.label} value={stat.value} max={stat.max} />
        ))}
      </div>
    </div>
  );
};
export default SalaryModal;
