import React, { useState } from "react";
import FormInput from "../../../../components/FormInput";
import { bankOptions } from "../../../../utils/SelectOptions";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import {
  handleAddItemToArray,
  handleCurrencyInput,
  handleDeleteItemFromArray,
  handleNestedValueChange,
  handleUpdateItemInArray,
} from "../../../../utils/formUtils";

const Benefits = ({ data, handleFormInput, handleSelect, setFormData }) => {
  const { benefits } = data;
  const [newAdjustment, setNewAdjustment] = useState(false);
  const [addNewAdjustmentForm, setAddNewAdjustmentForm] = useState({
    name: "",
    type: "",
    amountType: "percent",
  });

  const addAdjustment = () => {
    setNewAdjustment((prev) => !prev);
    setAddNewAdjustmentForm({ type: "", name: "" });
  };
  const addAdjustmentInput = (name, type) => {
    handleAddItemToArray("benefits.adjustment", { name, type, amountType: "percent", amount: "" }, "name", setFormData);
    setAddNewAdjustmentForm({ type: "", name: "" });
    setNewAdjustment((prev) => !prev);
  };

  return (
    <div className="w-full">
      <div className="mt-10 w-full flex flex-col gap-1 pb-3 border-b border-zinc-400">
        <span className="text-zinc-500 text-sm font-semibold">Step 3</span>
        <h1 className="text-slate-800 font-bold">Asset dan Benefit</h1>
      </div>

      <div className="w-full mt-5 mb-3">
        <h1 className="text-slate-800 font-semibold">Informasi Bank Karyawan</h1>

        <div className="grid grid-cols-2 gap-3 mb-3 w-full mt-3">
          <FormInput type="select" options={bankOptions} label={"Nama Bank"} onChange={handleSelect("salary", "bankName")} />

          <FormInput
            type="number"
            label={"No. Rekening"}
            value={data?.salary?.bankAccountNumber || ""}
            onChange={handleFormInput("salary", "bankAccountNumber")}
            required
          />
        </div>

        <h1 className="text-slate-800 font-semibold mt-8">Tunjangan Kesehatan dan Ketenagakerjaan</h1>

        <div className="grid grid-cols-2 gap-3 mb-3 w-full mt-3">
          <FormInput
            type="number"
            label={"No. BPJS Kesehatan"}
            value={benefits?.bpjsKesehatanNumber || ""}
            onChange={handleFormInput("benefits", "bpjsKesehatanNumber")}
            required
          />
          <FormInput
            type="number"
            label={"No. BPJS Ketenagakerjaan"}
            value={benefits?.bpjsKetenagakerjaanNumber || ""}
            onChange={handleFormInput("benefits", "bpjsKetenagakerjaanNumber")}
            required
          />
        </div>

        <div className="w-full flex justify-between items-center mt-8">
          <h1 className="text-slate-800 font-semibold">Informasi Gaji dan Penyesuaian</h1>
          <div className="relative">
            <button
              type="button"
              onClick={addAdjustment}
              className="text-white font-semibold text-sm px-3 py-2 bg-emerald-700 rounded-xl inline-flex items-center gap-1 hover:underline hover:bg-emerald-900 transition-all duration-300 ease-in-out"
            >
              <IconPlus size={18} />
              <p>Tambah baru</p>
            </button>
            {newAdjustment && (
              <div className="absolute bg-white rounded-xl top-12 right-0 z-20 p-4 shadow-md w-[26rem] border border-gray-300">
                <div className="w-full border-b border-gray-200 pb-2 mb-3">
                  <h3 className="text-base font-medium text-gray-800">Tambah Lainnya</h3>
                </div>
                <div className="flex items-center gap-3">
                  {/* Input for Amount */}
                  <div className="flex-grow flex-shrink-0">
                    <FormInput
                      label="Nama Penyesuaian"
                      value={addNewAdjustmentForm.name}
                      placeholder={"Adjustment name"}
                      onChange={(e) => setAddNewAdjustmentForm({ ...addNewAdjustmentForm, name: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                  <div className="flex-shrink">
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
                      className="text-sm"
                      onChange={(e) => setAddNewAdjustmentForm({ ...addNewAdjustmentForm, type: e.value })}
                    />
                  </div>
                </div>

                <div className="mt-4 flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={addAdjustment}
                    className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-200"
                  >
                    Batal
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
                    Tambah
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3 w-full mt-3">
          <FormInput
            type="currency"
            value={data?.salary?.basicSalary}
            onChange={(amount) => handleCurrencyInput("salary", "basicSalary", setFormData)(amount)}
            label={"Gaji Pokok"}
          />

          {benefits?.adjustment?.map((item, idx) => (
            <div key={idx} className="flex w-full gap-2 items-center">
              <div className="flex-grow">
                <FormInput
                  type={item.amountType === "fixed" ? "currency" : "number"}
                  value={item.amount}
                  onChange={
                    item.amountType === "fixed"
                      ? (amount) => handleUpdateItemInArray("benefits.adjustment", idx, "amount", amount, setFormData)
                      : (e) => handleUpdateItemInArray("benefits.adjustment", idx, "amount", e.target.value, setFormData)
                  }
                  label={item.name}
                />
              </div>
              <FormInput
                type="select"
                label={"Jenis Nilai"}
                options={[
                  { label: "%", value: "percent" },
                  { label: "Rp.", value: "fixed" },
                ]}
                value={{ label: item.amountType === "percent" ? "%" : "Rp.", value: item.amountType }}
                onChange={(e) => handleNestedValueChange("benefits.adjustment", idx, "amountType", e.value, setFormData)}
              />
              <button
                type="button"
                onClick={() => handleDeleteItemFromArray("benefits.adjustment", idx, setFormData)}
                className="text-red-500 hover:text-red-700 mt-7"
              >
                <IconTrash />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-12">
          <h1 className="text-slate-800 font-semibold">Asset dan Fasilitas</h1>
          <button
            type="button"
            onClick={() => handleAddItemToArray("benefits.assets", { assetName: "" }, "assetName", setFormData)}
            className="text-white font-semibold text-sm px-3 py-2 bg-emerald-700 rounded-xl inline-flex items-center gap-1 hover:underline hover:bg-emerald-900 transition-all duration-300 ease-in-out"
          >
            <IconPlus size={18} />
            <p>Tambah baru</p>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3 w-full mt-3">
          {benefits?.assets?.length > 0 ? (
            benefits.assets.map((asset, index) => (
              <div key={index}>
                <div className="inline-flex items-center gap-2 w-full">
                  <div className="w-full">
                    <FormInput
                      type="text"
                      placeholder="Enter asset name or description"
                      value={asset.assetName}
                      onChange={(e) => handleUpdateItemInArray("benefits.assets", index, "assetName", e.target.value, setFormData)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteItemFromArray("benefits.assets", index, setFormData)}
                    className="text-red-500 hover:text-red-700 mt-3 flex flex-1"
                  >
                    <IconTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-zinc-600 italic">Asset dan fasilitas belum ditambahkan.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Benefits;
