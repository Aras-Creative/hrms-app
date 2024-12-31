import React, { useEffect, useState } from "react";
import AttendanceStats from "./AttendanceStats";
import { IconPlus, IconTrash, IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import FormInput from "../../../../components/FormInput";
import useFetch from "../../../../hooks/useFetch";
import { useParams } from "react-router-dom";

const Payroll = ({ data }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [newAdjustment, setNewAdjustment] = useState(false);
  const [periode, setPeriode] = useState("");

  const { employeeId } = useParams();

  const [salaryAdjustment, setSalaryAdjustment] = useState({
    salary: {
      basicSalary: data?.salary?.basicSalary,
      totalSalary: data?.salary?.totalSalary,
    },
    adjustment: data?.adjustments,
    removed: "",
  });

  const [addNewAdjustmentForm, setAddNewAdjustmentForm] = useState({
    name: "",
    type: "",
    amountType: "fixed",
  });

  const handleAttendanceData = (data) => {
    setAttendanceData(data);
  };

  const handleSelectPeriode = (data) => {
    setPeriode(data);
  };

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

  const { submitData: postSalary, loading: postSalaryLoading } = useFetch(`/employee/salary/${employeeId}/update?month=${periode}`, {
    method: "POST",
  });

  const handleSubmit = async () => {
    const { success, error, data } = await postSalary(salaryAdjustment);
    if (success) {
      console.log(data);
    } else {
      console.log(error);
    }
    // const { success, error, data } = await createEmployee(formData);
    // if (success) {
    //   console.log(data);
    //   navigate("/dashboard/employee");
    // } else {
    // }
  };

  return (
    <div className="w-full">
      <AttendanceStats sendAttendanceData={handleAttendanceData} periode={handleSelectPeriode} />
      <div className="flex justify-center items-start w-full gap-4 mt-4">
        <div className="w-1/2  bg-white border border-zinc-300 py-6 rounded-lg">
          <div className="flex w-full justify-between px-8">
            <div className="flex gap-3 items-center text-zinc-500">
              <IconTrendingUp />
              <h1 className="text-slate-800 text-lg font-bold">Allowance</h1>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={addAdjustment}
                className="text-white font-semibold text-sm px-3 py-2 bg-emerald-700 rounded-xl inline-flex items-center gap-1 hover:underline hover:bg-emerald-900 transition-all duration-300 ease-in-out"
              >
                <IconPlus size={18} />
                <p>Add New</p>
              </button>
              {newAdjustment && (
                <div className="absolute bg-white rounded-xl top-12 right-0 z-20 p-4 shadow-md w-[26rem] border border-gray-300">
                  <div className="w-full border-b border-gray-200 pb-2 mb-3">
                    <h3 className="text-base font-medium text-gray-800">Add Other Salary Adjustment</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <FormInput
                      label="Name Adjustment"
                      value={addNewAdjustmentForm.name}
                      placeholder={"Adjustment Name"}
                      onChange={(e) => setAddNewAdjustmentForm({ ...addNewAdjustmentForm, name: e.target.value })}
                      className="flex-1 text-sm"
                    />
                    <FormInput
                      label="Adjustment Type"
                      type="select"
                      value={{
                        label: addNewAdjustmentForm.type ? addNewAdjustmentForm.type : "Type",
                        value: addNewAdjustmentForm.type,
                      }}
                      options={[
                        { label: "Allowance", value: "allowance" },
                        { label: "Deduction", value: "deduction" },
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
          </div>
          <div className="px-12 grid grid-cols-2 w-full mt-12 gap-8">
            <FormInput
              type="currency"
              label={"Basic Salary"}
              value={salaryAdjustment?.salary?.basicSalary}
              border={"border-b"}
              onChange={(ammount) => handleCurrencyInput("salary", "basicSalary")(ammount)}
            />
            {salaryAdjustment?.adjustment?.length > 0 &&
              salaryAdjustment.adjustment
                .map((item, index) => ({ ...item, globalIndex: index }))
                .filter((adjustment) => adjustment?.type === "allowance")
                .map((item) => (
                  <div key={item.globalIndex} className="flex items-center gap-2">
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
                    <button
                      type="button"
                      onClick={() => removeAdjustment(item.globalIndex)}
                      className="text-red-500 hover:text-red-700 mt-7 flex flex-1"
                    >
                      <IconTrash />
                    </button>
                  </div>
                ))}
          </div>
          <div className="px-12 mt-6 border-t pt-4">
            <p className="text-lg font-bold text-slate-800 flex justify-between">
              Total: <span>{calculateTotalSalary().salaryWithAllowance}</span>
            </p>
          </div>
        </div>
        <div className="w-1/2 bg-white border border-zinc-300 py-6 rounded-lg">
          <div className="flex w-full justify-between px-8">
            <div className="flex gap-3 items-center text-zinc-500">
              <IconTrendingDown />
              <h1 className="text-slate-800 text-lg font-bold">Salary Deduction</h1>
            </div>
          </div>
          <div className="px-12 grid grid-cols-2 w-full mt-12 gap-8">
            {salaryAdjustment?.adjustment?.length > 0 &&
              salaryAdjustment.adjustment
                .map((item, index) => ({ ...item, globalIndex: index }))
                .filter((adjustment) => adjustment?.type === "deduction")
                .map((item) => (
                  <div key={item.globalIndex} className="flex items-center gap-2">
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
                    <button
                      type="button"
                      onClick={() => removeAdjustment(item.globalIndex)}
                      className="text-red-500 hover:text-red-700 mt-7 flex flex-1"
                    >
                      <IconTrash />
                    </button>
                  </div>
                ))}
          </div>
          <div className="px-12 mt-6 border-t pt-4">
            <p className="text-lg font-bold text-slate-800 flex justify-between">
              Total: <span>{calculateTotalSalary().salaryDeduction}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="w-full mb-4 bg-white border border-zinc-300 py-4 rounded-lg mt-6 px-12">
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
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Payroll;

// {data?.adjustments?.length > 0
//   ? data.adjustments
//       .filter((item) => item.type === "allowance")
//       .map((item, idx) => (
//         <>
//           <div key={idx} className="flex gap-2 items-center">
//             <FormInput type="text" value={item.amount} label={item.name} />
//             <span className="text-zinc-400 text-xs font-semibold">IDR</span>
//           </div>
//         </>
//       ))
//   : null}
