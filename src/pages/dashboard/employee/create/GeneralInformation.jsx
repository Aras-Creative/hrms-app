import React from "react";
import FormInput from "../../../../components/FormInput";
import Datepicker from "../../../../components/Datepicker";
import { genderOptions, religionOptions } from "../../../../utils/SelectOptions";

const GeneralInformation = ({ handleChange, handleSelectChange, handleDatePick, data }) => {
  return (
    <div className="w-full">
      <div className="mt-10 w-full flex flex-col gap-1 pb-3 border-b border-zinc-400">
        <span className="text-zinc-500 text-sm font-semibold">Step 1</span>
        <h1 className="text-slate-800 font-bold">General Information</h1>
      </div>

      <div className="w-full mt-4">
        <h1 className="text-slate-800 font-semibold">Personal Information</h1>
        <div className="mt-3 w-full ">
          <FormInput
            type="text"
            label={"Employee Name"}
            value={data?.personalData?.fullName || ""}
            onChange={handleChange("personalData", "fullName")}
          />
          <div className="grid grid-cols-2 gap-3 mb-3 w-full mt-3">
            <FormInput
              type="select"
              label={"Gender"}
              value={{ label: data?.personalData?.gender || "Select Gender", value: data?.personalData?.gender }}
              options={genderOptions}
              onChange={handleSelectChange("personalData", "gender")}
            />
            <FormInput
              type="select"
              label={"Religion"}
              options={religionOptions}
              value={{ label: data?.personalData?.religion || "Select Religion", value: data?.personalData?.religion } || {}}
              onChange={handleSelectChange("personalData", "religion")}
            />
            <FormInput
              type="text"
              label={"Place Of Birth"}
              onChange={handleChange("personalData", "placeOfBirth")}
              value={data?.personalData?.placeOfBirth || ""}
            />
            <div className="flex flex-col w-full">
              <h1 className="text-slate-800 text-sm">Birth Date</h1>
              <div className="mt-2 py-0.5 border rounded-xl border-zinc-300 overflow-hidden bg-white">
                <Datepicker defaultDate={data?.personalData?.dateOfBirth || null} onChange={handleDatePick("personalData", "dateOfBirth")} />
              </div>
            </div>
          </div>

          <div className="w-full mt-5 mb-3">
            <h1 className="text-slate-800 font-semibold">Contact Information</h1>
            <div className="grid grid-cols-2 gap-3 mb-3 w-full mt-3">
              <FormInput
                type="email"
                label={"Email Address"}
                value={data?.personalData?.email || ""}
                onChange={handleChange("personalData", "email")}
              />
              <FormInput
                type="email"
                label={"Phone Number"}
                value={data?.personalData?.phoneNumber || ""}
                onChange={handleChange("personalData", "phoneNumber")}
              />
            </div>
            <FormInput
              type="text"
              onChange={handleChange("personalData", "address")}
              value={data?.personalData?.address || ""}
              label={"Residential Address"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInformation;
