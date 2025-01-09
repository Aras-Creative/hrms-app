import React from "react";
import FormInput from "../../../../components/FormInput";
import Datepicker from "../../../../components/Datepicker";
import { genderOptions, religionOptions } from "../../../../utils/SelectOptions";

const GeneralInformation = ({ handleFormInput, handleSelect, handleDatePick, data }) => {
  return (
    <div className="w-full">
      <div className="mt-10 w-full flex flex-col gap-1 pb-3 border-b border-zinc-400">
        <span className="text-zinc-500 text-sm font-semibold">Step 1</span>
        <h1 className="text-slate-800 font-bold">Informasi Umum</h1>
      </div>

      <div className="w-full mt-4">
        <h1 className="text-slate-800 font-semibold">Informasi Pribadi</h1>
        <div className="mt-3 w-full ">
          <div className="grid grid-cols-2 gap-3 mb-3 w-full mt-3">
            <FormInput
              type="text"
              label={"Nama Lengkap"}
              value={data?.personalData?.fullName || ""}
              onChange={handleFormInput("personalData", "fullName")}
            />
            <FormInput type="number" label={"No. KTP"} value={data?.personalData?.NoKTP || ""} onChange={handleFormInput("personalData", "NoKTP")} />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3 w-full mt-3">
            <FormInput
              type="select"
              label={"Jenis Kelamin"}
              value={{ label: data?.personalData?.gender || "Jenis Kelamin", value: data?.personalData?.gender }}
              options={genderOptions}
              onChange={handleSelect("personalData", "gender")}
            />
            <FormInput
              type="select"
              label={"Agama"}
              options={religionOptions}
              value={{ label: data?.personalData?.religion || "Pilih Agama", value: data?.personalData?.religion } || {}}
              onChange={handleSelect("personalData", "religion")}
            />
            <FormInput
              type="text"
              label={"Tempat Lahir"}
              onChange={handleFormInput("personalData", "placeOfBirth")}
              value={data?.personalData?.placeOfBirth || ""}
            />
            <div className="flex flex-col w-full">
              <h1 className="text-slate-800 text-sm">Tanggal Lahir</h1>
              <div className="mt-2 py-0.5 border rounded-xl border-zinc-300 overflow-hidden bg-white">
                <Datepicker
                  position={"top-30"}
                  label={"Tanggal lahir"}
                  defaultDate={data?.personalData?.dateOfBirth || null}
                  onChange={(date) => handleDatePick("personalData")("dateOfBirth")(date)}
                />
              </div>
            </div>
          </div>

          <div className="w-full mt-5 mb-3">
            <FormInput
              type="textarea"
              height={"24"}
              onChange={handleFormInput("personalData", "address")}
              value={data?.personalData?.address || ""}
              label={"Alamat Karyawan"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInformation;
