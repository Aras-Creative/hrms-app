import React, { useEffect, useState } from "react";
import FormInput from "../../../../components/FormInput";
import { bankOptions } from "../../../../utils/SelectOptions";
import { IconPlus, IconTrash } from "@tabler/icons-react";

const Benefits = ({ data, handleChange, handleSelectChange, setFormData }) => {
  const [newAdjustment, setNewAdjustment] = useState(false);
  const [addNewAdjustmentForm, setAddNewAdjustmentForm] = useState({
    name: "",
    type: "",
    amountType: "percent",
  });
  const [isSwitchActive, setIsSwitchActive] = useState({
    bpjsKS: "0",
    bpjsKTjp: "0",
    bpjsKTjkk: "0",
    bpjsKTjht: "0",
  });

  const addNewAsset = () => {
    setFormData((prevState) => ({
      ...prevState,
      assets: [...prevState.assets, { assetName: "" }],
    }));
  };

  const addAdjustment = () => {
    setNewAdjustment((prev) => !prev);
    setAddNewAdjustmentForm({ type: "", name: "" });
  };

  const addAdjustmentInput = (name, type) => {
    setFormData((prevState) => ({
      ...prevState,
      adjustment: [...prevState.adjustment, { name, type, amountType: "percent", amount: "" }],
    }));
    setAddNewAdjustmentForm({ type: "", name: "" });
    setNewAdjustment((prev) => !prev);
  };

  const removeAsset = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      assets: prevState.assets.filter((_, i) => i !== index),
    }));
  };

  const handleAssetChange = (index, value) => {
    const updatedAssets = [...data.assets];
    updatedAssets[index].assetName = value;
    setFormData((prevState) => ({
      ...prevState,
      assets: updatedAssets,
    }));
  };

  const handleCurrencyInput = (formName, field) => (value) => {
    setFormData((prevState) => ({
      ...prevState,
      [formName]: {
        ...prevState[formName],
        [field]: value,
      },
    }));
  };

  const removeAdjustment = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      adjustment: prevState.adjustment.filter((_, i) => i !== index),
    }));
  };

  const handleAdjustmentChange = (index, value) => {
    const updatedAdjustment = [...data.adjustment];
    updatedAdjustment[index].amount = value;
    setFormData((prevState) => ({
      ...prevState,
      adjustment: updatedAdjustment,
    }));
  };

  const handleValueTypeChange = (idx, type) => {
    const updatedAdjustment = [...data.adjustment];
    updatedAdjustment[idx].amountType = type;
    setFormData((prevState) => ({
      ...prevState,
      adjustment: updatedAdjustment,
    }));
  };

  return (
    <div className="w-full">
      <div className="mt-10 w-full flex flex-col gap-1 pb-3 border-b border-zinc-400">
        <span className="text-zinc-500 text-sm font-semibold">Step 3</span>
        <h1 className="text-slate-800 font-bold">Assets and Benefits</h1>
      </div>

      <div className="w-full mt-5 mb-3">
        <h1 className="text-slate-800 font-semibold">Employee Bank Information</h1>

        <div className="grid grid-cols-2 gap-3 mb-3 w-full mt-3">
          <FormInput type="select" options={bankOptions} label={"Bank Name"} onChange={handleSelectChange("salary", "bankName")} />

          <FormInput
            type="text"
            label={"Bank Account Number"}
            value={data?.salary?.bankAccountNumber}
            onChange={handleChange("salary", "bankAccountNumber")}
            required
          />
        </div>

        <div className="w-full flex justify-between items-center mt-8">
          <h1 className="text-slate-800 font-semibold">Salary Expenses and Deductions</h1>
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
                  {/* Input for Amount */}
                  <div className="flex-grow flex-shrink-0">
                    <FormInput
                      label="Amount"
                      value={addNewAdjustmentForm.amount}
                      placeholder={"Enter Amount"}
                      onChange={(e) => setAddNewAdjustmentForm({ ...addNewAdjustmentForm, amount: e.target.value })}
                      className="text-sm"
                    />
                  </div>

                  {/* Select for Amount Type */}
                  <div className="flex-shrink">
                    <FormInput
                      label="Amount Type"
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

        <div className="grid grid-cols-2 gap-3 mb-3 w-full mt-3">
          <FormInput
            type="currency"
            value={data?.salary?.basicSalary}
            onChange={(ammount) => handleCurrencyInput("salary", "basicSalary")(ammount)}
            label={"Basic Salary"}
          />

          {data?.adjustment?.map((item, idx) => (
            <div key={idx} className="flex w-full gap-2 items-center">
              <div className="flex-grow">
                <FormInput
                  type={item.amountType === "fixed" ? "currency" : "text"}
                  value={item.amount}
                  onChange={
                    item.amountType === "fixed"
                      ? (amount) => handleAdjustmentChange(idx, amount)
                      : (amount) => handleAdjustmentChange(idx, amount.target.value)
                  }
                  label={item.name}
                />
              </div>
              <FormInput
                type="select"
                label={"Amount Type"}
                options={[
                  { label: "%", value: "percent" },
                  { label: "Rp.", value: "fixed" },
                ]}
                value={{ label: item.amountType === "percent" ? "%" : "Rp.", value: item.amountType }}
                onChange={(event) => handleValueTypeChange(idx, event.value)}
              />
              <button type="button" onClick={() => removeAdjustment(idx)} className="text-red-500 hover:text-red-700 mt-7">
                <IconTrash />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-12">
          <h1 className="text-slate-800 font-semibold">Assets and Facilities</h1>
          <button
            type="button"
            onClick={addNewAsset}
            className="text-white font-semibold text-sm px-3 py-2 bg-emerald-700 rounded-xl inline-flex items-center gap-1 hover:underline hover:bg-emerald-900 transition-all duration-300 ease-in-out"
          >
            <IconPlus size={18} />
            <p>Add New</p>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3 w-full mt-3">
          {data?.assets?.length > 0 ? (
            data.assets.map((asset, index) => (
              <div key={index}>
                <div className="inline-flex items-center gap-2 w-full">
                  <div className="w-full">
                    <FormInput
                      type="text"
                      placeholder="Enter asset name or description"
                      value={asset.assetName}
                      onChange={(e) => handleAssetChange(index, e.target.value)}
                    />
                  </div>
                  <button type="button" onClick={() => removeAsset(index)} className="text-red-500 hover:text-red-700 mt-3 flex flex-1">
                    <IconTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-zinc-600 italic">No assets provided yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Benefits;
