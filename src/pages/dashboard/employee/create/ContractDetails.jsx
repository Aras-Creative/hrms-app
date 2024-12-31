import React, { useState } from "react";
import FormInput from "../../../../components/FormInput";
import { IconContract, IconFileTime, IconHourglass, IconPlus, IconTrash } from "@tabler/icons-react";
import useFetch from "../../../../hooks/useFetch";
import Datepicker from "../../../../components/Datepicker";
import { employementStatusOptions, LabelEmployementStatus } from "../../../../utils/SelectOptions";

const ContractDetails = ({ handleChange, handleSelectChange, handleDatePick, data, setFormData }) => {
  const { responseData: jobRoleData, loading: jobRoleLoading, error: JobRoleError } = useFetch("/jobrole");

  const SalaryTypeOptions = [
    {
      label: "Monthly",
      value: "Monthly",
    },
    { label: "Weekly", value: "Weekly" },
    { label: "Daily", value: "Daily" },
    { label: "Hourly", value: "Hourly" },
  ];

  const options = (() => {
    if (jobRoleLoading) {
      return [{ value: "", label: "Loading..." }];
    }

    if (JobRoleError) {
      return [{ value: "", label: "Failed to load job roles" }];
    }

    return (
      jobRoleData?.map((role) => ({
        value: role.jobRoleId,
        label: `${role.jobRoleTitle} (${role.jobRoleId})`,
      })) || []
    );
  })();

  const handleAddWorkingScope = () => {
    setFormData((prevState) => ({
      ...prevState,
      contractData: {
        ...prevState.contractData,
        scopeOfWork: [...prevState.contractData.scopeOfWork, { title: "" }],
      },
    }));
  };

  const handleWorkingScopeInput = (index, value) => {
    const updatedWorkingScope = [...data?.contractData?.scopeOfWork];
    updatedWorkingScope[index].title = value;
    setFormData((prevState) => ({
      ...prevState,
      contractData: {
        ...prevState.contractData,
        scopeOfWork: updatedWorkingScope,
      },
    }));
  };

  const handleDeleteWorkingScope = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      contractData: {
        ...prevState.contractData,
        scopeOfWork: prevState.contractData.scopeOfWork.filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div className="w-full">
      <div className="mt-10 w-full flex flex-col gap-1 pb-3 border-b border-zinc-400">
        <span className="text-zinc-500 text-sm font-semibold">Step 2</span>
        <h1 className="text-slate-800 font-bold">Contract Details</h1>
      </div>
      <div className="w-full mt-4">
        <h1 className="text-slate-800 font-semibold">Employement Details</h1>
        <div className="grid grid-cols-2 gap-3 mb-3 w-full mt-3">
          <FormInput
            type="select"
            label={"Employement Type"}
            value={{
              label: <LabelEmployementStatus label={data?.contractData?.employementStatus} /> || "Select Employement Status",
              value: data?.contractData?.employementStatus,
            }}
            options={employementStatusOptions}
            onChange={handleSelectChange("contractData", "employementStatus")}
          />
          <FormInput
            type="select"
            label={"Salary Type"}
            value={{
              label: data?.contractData?.salaryType || "Select Employement Status",
              value: data?.contractData?.salaryType,
            }}
            options={SalaryTypeOptions}
            onChange={handleSelectChange("contractData", "salaryType")}
          />
        </div>
        <FormInput type="select" label={"Job Role"} options={options} onChange={handleSelectChange("contractData", "jobRole")} />
      </div>

      <div className="w-full mt-4">
        <h1 className="text-slate-800 font-semibold">Contract Overview</h1>
        <div className="grid grid-cols-2 gap-3 mb-3 w-full mt-3">
          <div className="flex flex-col w-full">
            <h1 className="text-slate-800 text-sm">Start Date</h1>
            <div className="mt-2 py-0.5 border rounded-xl border-zinc-300 overflow-hidden bg-white">
              <Datepicker defaultDate={data?.contractData?.startDate || null} onChange={handleDatePick("contractData", "startDate")} />
            </div>
          </div>

          <div className="flex flex-col w-full">
            <h1 className="text-slate-800 text-sm">End Date</h1>
            <div className="mt-2 py-0.5 border rounded-xl border-zinc-300 overflow-hidden bg-white">
              <Datepicker defaultDate={data?.contractData?.endDate || null} onChange={handleDatePick("contractData", "endDate")} />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <h1 className="text-slate-800 font-semibold">Working Scope</h1>
          <button
            type="button"
            onClick={handleAddWorkingScope}
            className="text-white font-semibold text-sm px-3 py-2 bg-emerald-700 rounded-xl inline-flex items-center gap-1 hover:underline hover:bg-emerald-900 transition-all duration-300 ease-in-out"
          >
            <IconPlus size={18} />
            <p>Add New</p>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3 w-full mt-3">
          {data?.contractData?.scopeOfWork?.length > 0 ? (
            data.contractData.scopeOfWork.map((item, index) => (
              <div key={index}>
                <div className="inline-flex items-center gap-2 w-full">
                  <div className="w-full">
                    <FormInput
                      type="textarea"
                      placeholder="Enter working scope"
                      value={item.title}
                      onChange={(e) => handleWorkingScopeInput(index, e.target.value)}
                    />
                  </div>
                  <button type="button" onClick={() => handleDeleteWorkingScope(index)} className="text-red-500 hover:text-red-700 mt-3 flex flex-1">
                    <IconTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-zinc-600 italic">No working scope provided yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;
