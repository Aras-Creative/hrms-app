import React, { useState } from "react";
import FormInput from "../../../../components/FormInput";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import useFetch from "../../../../hooks/useFetch";
import Datepicker from "../../../../components/Datepicker";
import { employementStatusOptions, LabelEmployementStatus, SalaryTypeOptions } from "../../../../utils/SelectOptions";
import { handleAddItemToArray, handleDeleteItemFromArray, handleUpdateItemInArray } from "../../../../utils/formUtils";

const ContractDetails = ({ handleChange, handleSelect, handleDatePick, data, setFormData }) => {
  const { responseData: jobRoleData, loading: jobRoleLoading, error: JobRoleError } = useFetch("/jobrole");

  const options = (() => {
    if (jobRoleLoading) {
      return [{ value: "", label: "Loading..." }];
    }

    if (JobRoleError) {
      return [{ value: "", label: JobRoleError[0] }];
    }

    return (
      jobRoleData?.map((role) => ({
        value: role.jobRoleId,
        label: `${role.jobRoleTitle} (${role.jobRoleId})`,
      })) || []
    );
  })();

  return (
    <div className="w-full">
      <div className="mt-10 w-full flex flex-col gap-1 pb-3 border-b border-zinc-400">
        <span className="text-zinc-500 text-sm font-semibold">Step 2</span>
        <h1 className="text-slate-800 font-bold">Detail Kontrak</h1>
      </div>
      <div className="w-full mt-4">
        <h1 className="text-slate-800 font-semibold">Detail Kepegawaian</h1>
        <div className="grid grid-cols-2 gap-3 mb-3 w-full mt-3">
          <FormInput
            type="select"
            label={"Tipe pegawai"}
            value={{
              label: <LabelEmployementStatus label={data?.contractData?.employementStatus} /> || "Select Employement Status",
              value: data?.contractData?.employementStatus,
            }}
            options={employementStatusOptions}
            onChange={handleSelect("contractData", "employementStatus")}
          />
          <FormInput
            type="select"
            label={"Tipe Gaji"}
            value={{
              label: data?.contractData?.salaryType || "Pilih Tipe Gaji",
              value: data?.contractData?.salaryType,
            }}
            options={SalaryTypeOptions}
            onChange={handleSelect("contractData", "salaryType")}
          />
        </div>
        <FormInput type="select" label={"Job Roles"} options={options} onChange={handleSelect("contractData", "jobRole")} />
      </div>

      <div className="w-full mt-4">
        <h1 className="text-slate-800 font-semibold">Ringkasan Kontrak</h1>
        <div className="grid grid-cols-2 gap-3 mb-3 w-full mt-3">
          <div className="flex flex-col w-full">
            <h1 className="text-slate-800 text-sm">Tanggal Mulai</h1>
            <div className="mt-2 py-0.5 border rounded-xl border-zinc-300 overflow-hidden bg-white">
              <Datepicker
                position={"top-30"}
                label={"Select Start Date"}
                defaultDate={data?.contractData?.startDate || null}
                onChange={(date) => handleDatePick("contractData")("startDate")(date)}
              />
            </div>
          </div>

          <div className="flex flex-col w-full">
            <h1 className="text-slate-800 text-sm">Tanggal Berakhir</h1>
            <div className="mt-2 py-0.5 border rounded-xl border-zinc-300 overflow-hidden bg-white">
              <Datepicker
                position={"top-30"}
                label={"Select End Date"}
                defaultDate={data?.contractData?.endDate || null}
                onChange={(date) => handleDatePick("contractData")("endDate")(date)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <h1 className="text-slate-800 font-semibold">Working Scope</h1>
          <button
            type="button"
            onClick={() => handleAddItemToArray("contractData.scopeOfWork", { title: "" }, "title", setFormData)}
            className="text-white font-semibold text-sm px-3 py-2 bg-emerald-700 rounded-xl inline-flex items-center gap-1 hover:underline hover:bg-emerald-900 transition-all duration-300 ease-in-out"
          >
            <IconPlus size={18} />
            <p>Tambah baru</p>
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
                      onChange={(e) => handleUpdateItemInArray("contractData.scopeOfWork", index, "title", e.target.value, setFormData)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteItemFromArray("contractData.scopeOfWork", index, setFormData)}
                    className="text-red-500 hover:text-red-700 mt-3 flex flex-1"
                  >
                    <IconTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-zinc-600 italic">Working scope belum ditambahkan</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;
