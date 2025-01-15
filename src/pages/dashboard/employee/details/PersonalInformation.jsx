import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { IconAddressBook, IconChevronRight, IconId, IconMap2, IconUser, IconUserFilled } from "@tabler/icons-react";
import Datepicker from "../../../../components/Datepicker";
import useFetch from "../../../../hooks/useFetch";
import { genderOptions, religionOptions } from "../../../../utils/SelectOptions";
import FormInput from "./FormInput";
import Card from "./Card";
import { calculateAge } from "./utils";
import Toast from "../../../../components/Toast";
import { formatDate, handleDatePick } from "../../../../utils/dateUtils";
import useFormHandler from "../../../../hooks/useFormHandler";
import { handleToastTimeout } from "../../../../utils/handleToastTimeOut";

const PersonalInformation = ({ data, refetch }) => {
  const { employeeId } = useParams();
  const { updateData } = useFetch(`/employee/${employeeId}/update`, { method: "POST" });
  const [toast, setToast] = useState({ text: "", type: "" });
  const [isFormEdit, setIsFormEdit] = useState({ personalInfo: false, addressInfo: false, contactInfo: false });
  const [errors, setErrors] = useState({});

  const getInitialFormData = (data) => ({
    personalInfo: {
      fullName: data?.fullName || "",
      gender: data?.gender || "",
      religion: data?.religion || "",
      placeOfBirth: data?.placeOfBirth || "",
      dateOfBirth: data?.dateOfBirth || "",
      bpjsKesehatanNumber: data?.bpjsKesehatanNumber || "",
      bpjsKetenagakerjaanNumber: data?.bpjsKetenagakerjaanNumber || "",
    },
    addressInfo: { address: data?.address || "" },
    contactInfo: {
      email: data?.email || "",
      phoneNumber: data?.phoneNumber || "",
      emergencyContact: data?.emergencyContact || "",
    },
    employementData: {
      jobRole: data?.jobRole?.jobRoleTitle || "",
      dateStarted: data?.contract?.startDate || "",
      employementType: data?.contract?.employementStatus || "",
    },
  });

  const { formData, handleSelect, handleFormInput, setFormData } = useFormHandler({
    initialState: getInitialFormData(data),
  });

  const handleBirtDatePick = handleDatePick(setFormData)("personalInfo");

  useEffect(() => {
    handleToastTimeout(toast.text, setToast);
  }, [toast.text]);

  const toggleFormEdit = async (e, formName) => {
    const isEditing = isFormEdit[formName];
    setIsFormEdit((prev) => ({ ...prev, [formName]: !isEditing }));

    if (isEditing) {
      e.preventDefault();
      const { success, data, error } = await updateData(formData[formName]);
      if (error) {
        const mappedErrors = error.reduce((acc, errorObj) => {
          for (let field in errorObj) {
            acc[field] = errorObj[field][0];
          }
          return acc;
        }, {});
        setErrors(mappedErrors);
      }
      if (success) {
        setToast({ text: data.message, type: "success" });
        refetch();
      }
    }
  };

  const handleCancelEdit = (formName) => {
    setFormData(getInitialFormData(data));
    setIsFormEdit((prev) => ({ ...prev, [formName]: false }));
  };

  useEffect(() => {
    setTimeout(() => setToast({ type: "", message: "" }), 4000);
  }, [toast.message]);

  return (
    <div className="w-full h-full flex gap-4 flex-grow">
      <div className="flex flex-col gap-4 w-2/3">
        <form>
          <Card
            title="Informasi Personal"
            icon={<IconUser />}
            isEditing={isFormEdit.personalInfo}
            onCancel={() => handleCancelEdit("personalInfo")}
            toggleEdit={(e) => toggleFormEdit(e, "personalInfo")}
          >
            <div className="mt-6 w-full grid grid-cols-2 px-3 gap-6 pb-4">
              <FormInput
                type="text"
                label="Nama Lengkap"
                value={formData.personalInfo.fullName}
                onChange={handleFormInput("personalInfo", "fullName")}
                onEdit={isFormEdit.personalInfo}
                erorr={errors.fullName}
              />
              <FormInput
                type="select"
                label="Jenis Kelamin"
                options={genderOptions}
                value={{ label: formData.personalInfo.gender || "-", value: formData.personalInfo.gender }}
                onChange={handleSelect("personalInfo", "gender")}
                onEdit={isFormEdit.personalInfo}
                erorr={errors.gender}
              />
              <FormInput
                type="select"
                label="Agama"
                options={religionOptions}
                value={{ label: formData.personalInfo.religion || "-", value: formData.personalInfo.religion }}
                onChange={handleSelect("personalInfo", "religion")}
                onEdit={isFormEdit.personalInfo}
                erorr={errors.religion}
              />
              <FormInput
                type="text"
                label="Tempat Lahir"
                value={formData.personalInfo.placeOfBirth}
                onChange={handleFormInput("personalInfo", "placeOfBirth")}
                onEdit={isFormEdit.personalInfo}
                erorr={errors.placeOfBirth}
              />
              <div className={`flex relative flex-col gap-1 border-b w-full ${isFormEdit.personalInfo ? "border-zinc-500" : "border-zinc-300"}`}>
                <label htmlFor="birthDate" className="text-zinc-500 text-sm">
                  Tanggal Lahir
                </label>
                <div className="w-full bottom-0 absolute">
                  <Datepicker
                    border="border-none"
                    style={"p-0"}
                    position={"top-30"}
                    label={"Select Birth Date"}
                    defaultDate={formData.personalInfo.dateOfBirth}
                    onChange={(date) => handleBirtDatePick("dateOfBirth")(date)}
                    isDisabled={!isFormEdit.personalInfo}
                    erorr={errors.dateOfBirth}
                  />
                </div>
              </div>
              <FormInput type="text" label="Usia" value={`${calculateAge(formData.personalInfo.dateOfBirth)} Tahun`} onEdit={false} />
              <FormInput
                type="number"
                label="No. BPJS Kesehatan"
                value={formData.personalInfo.bpjsKesehatanNumber}
                onChange={handleFormInput("personalInfo", "bpjsKesehatanNumber")}
                onEdit={isFormEdit.personalInfo}
              />
              <FormInput
                type="number"
                label="No. BPJS Ketenagakerjaan"
                value={formData.personalInfo.bpjsKetenagakerjaanNumber}
                onChange={handleFormInput("personalInfo", "bpjsKetenagakerjaanNumber")}
                onEdit={isFormEdit.personalInfo}
              />
            </div>
          </Card>
        </form>

        <Card
          title="Informasi Alamat"
          icon={<IconMap2 />}
          isEditing={isFormEdit.addressInfo}
          onCancel={() => handleCancelEdit("addressInfo")}
          toggleEdit={(e) => toggleFormEdit(e, "addressInfo")}
        >
          <div className="w-full flex items-center gap-24 mt-8 pr-44">
            <FormInput
              type="text"
              label="Alamat Tempat Tinggal"
              value={formData.addressInfo.address}
              onChange={handleFormInput("addressInfo", "address")}
              onEdit={isFormEdit.addressInfo}
            />
            <NavLink
              to={`https://maps.google.com/maps?q=${encodeURIComponent(formData.addressInfo.address)}`}
              className="flex items-center gap-2 underline text-sm whitespace-nowrap"
              target="_blank"
              rel="noopener noreferrer"
            >
              Lihat di map
              <IconChevronRight />
            </NavLink>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-4 w-1/3">
        <Card
          title="Informasi Kontak"
          icon={<IconAddressBook />}
          isEditing={isFormEdit.contactInfo}
          onCancel={() => handleCancelEdit("contactInfo")}
          toggleEdit={(e) => toggleFormEdit(e, "contactInfo")}
        >
          <div className="w-full mt-6 flex flex-col gap-3">
            <h1 className="w-full text-slate-800 font-semibold">Kontak Pribadi</h1>
            <div className="w-full mt-3 grid grid-cols-2 gap-6 pb-4">
              <FormInput
                type="email"
                label="Alamat Email"
                value={formData.contactInfo.email || "-"}
                onChange={handleFormInput("contactInfo", "email")}
                onEdit={isFormEdit.contactInfo}
              />
              <FormInput
                type="text"
                label="Nomor Handphone"
                value={formData.contactInfo.phoneNumber || "-"}
                onChange={handleFormInput("contactInfo", "phoneNumber")}
                onEdit={isFormEdit.contactInfo}
              />
            </div>
          </div>
          <div className="w-full mt-4 flex flex-col">
            <h1 className="w-full text-slate-800 font-semibold mb-2">Kontak Lain</h1>
            <div className="w-full grid grid-cols-2 gap-4">
              <FormInput
                type="text"
                label="Kontak Darurat"
                value={formData.contactInfo.emergencyContact || "-"}
                onChange={handleFormInput("contactInfo", "emergencyContact")}
                onEdit={isFormEdit.contactInfo}
              />
            </div>
          </div>
        </Card>

        <Card title="Ringkasan Karyawan" icon={<IconId />} isEditable={false}>
          <div className="mt-6 w-full grid grid-cols-2 gap-6 pb-4">
            <FormInput
              type="text"
              label="Tanggal Bergabung"
              value={formData.employementData.dateStarted ? formatDate(formData.employementData.dateStarted) : "-"}
              onEdit={false}
            />
            <FormInput type="text" label="Tipe Karyawan" value={formData.employementData.employementType || "-"} onEdit={false} />
          </div>
          <FormInput type="text" label="Job Role" value={formData.employementData.jobRole || "-"} onEdit={false} />
        </Card>

        {toast.text && <Toast type={toast.type || "error"} text={toast.text} onClick={() => setToast({ text: "", type: "" })} />}
      </div>
    </div>
  );
};

export default PersonalInformation;
