import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { IconAddressBook, IconChevronRight, IconId, IconMap2, IconUser } from "@tabler/icons-react";
import Datepicker from "../../../../components/Datepicker";
import useFetch from "../../../../hooks/useFetch";
import { genderOptions, religionOptions } from "../../../../utils/SelectOptions";
import FormInput from "./FormInput";
import Card from "./Card";
import { calculateAge } from "./utils";
import Toast from "../../../../components/Toast";

const PersonalInformation = ({ data, refetch }) => {
  const getInitialFormData = (data) => ({
    personalInfo: {
      fullName: data?.fullName || "",
      gender: data?.gender || "",
      religion: data?.religion || "",
      placeOfBirth: data?.placeOfBirth || "",
      dateOfBirth: data?.dateOfBirth || "",
    },
    addressInfo: { address: data?.address || "" },
    contactInfo: { email: data?.email || "", phoneNumber: data?.phoneNumber || "" },
    employementData: {
      jobRole: data?.jobRole?.jobRoleTitle || "",
      dateStarted: data?.contract?.startDate || "",
      employementType: data?.contract?.employementStatus || "",
    },
  });

  const { employeeId } = useParams();
  const { updateData } = useFetch(`/employee/${employeeId}/update`, { method: "POST" });
  const [toast, setToast] = useState({ text: "", type: "" });
  const [isFormEdit, setIsFormEdit] = useState({ personalInfo: false, addressInfo: false, contactInfo: false });
  const [formData, setFormData] = useState(getInitialFormData(data));

  useEffect(() => {
    if (data) {
      setFormData(getInitialFormData(data));
    }
  }, [data]);

  useEffect(() => {
    if (toast.text) {
      const timer = setTimeout(() => setToast({ text: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.text]);

  const handleDatePick = (selectedDate) => {
    const dateOnly = new Date(selectedDate).toLocaleDateString("en-CA");
    setFormData((prev) => ({ ...prev, personalInfo: { ...prev.personalInfo, dateOfBirth: dateOnly } }));
  };

  const toggleFormEdit = async (e, formName) => {
    const isEditing = isFormEdit[formName];
    setIsFormEdit((prev) => ({ ...prev, [formName]: !isEditing }));

    if (isEditing) {
      e.preventDefault();
      const { success, data, error } = await updateData(formData[formName]);
      setToast({ text: success ? data.message : error || "An error occurred", type: success ? "success" : "error" });
      if (success) refetch();
    }
  };

  const handleCancelEdit = (formName) => {
    setFormData(getInitialFormData(data));
    setIsFormEdit((prev) => ({ ...prev, [formName]: false }));
  };

  const handleChange = (formName, field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [formName]: { ...prev[formName], [field]: value } }));
  };

  const handleSelectChange = (formName, field) => (selectedOption) => {
    setFormData((prev) => ({ ...prev, [formName]: { ...prev[formName], [field]: selectedOption.value } }));
  };

  const formatDate = (date) => new Date(date)?.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <div className="flex flex-col gap-4 w-2/3">
        <form>
          <Card
            title="Personal Information"
            icon={<IconUser Filled />}
            isEditing={isFormEdit.personalInfo}
            onCancel={() => handleCancelEdit("personalInfo")}
            toggleEdit={(e) => toggleFormEdit(e, "personalInfo")}
          >
            <div className="mt-6 w-full grid grid-cols-2 px-3 gap-6 pb-4">
              <FormInput
                type="text"
                label="Full Name"
                value={formData.personalInfo.fullName}
                onChange={handleChange("personalInfo", "fullName")}
                onEdit={isFormEdit.personalInfo}
              />
              <FormInput
                type="select"
                label="Gender"
                options={genderOptions}
                value={{ label: formData.personalInfo.gender, value: formData.personalInfo.gender }}
                onChange={handleSelectChange("personalInfo", "gender")}
                onEdit={isFormEdit.personalInfo}
              />
              <FormInput
                type="select"
                label="Religion"
                options={religionOptions}
                value={{ label: formData.personalInfo.religion, value: formData.personalInfo.religion }}
                onChange={handleSelectChange("personalInfo", "religion")}
                onEdit={isFormEdit.personalInfo}
              />
              <FormInput
                type="text"
                label="Place Of Birth"
                value={formData.personalInfo.placeOfBirth}
                onChange={handleChange("personalInfo", "placeOfBirth")}
                onEdit={isFormEdit.personalInfo}
              />
              <div className={`flex flex-col gap-1 border-b w-full ${isFormEdit.personalInfo ? "border-zinc-500" : "border-zinc-300"}`}>
                <label htmlFor="birthDate" className="text-zinc-500 text-sm">
                  Birth Date
                </label>
                <Datepicker defaultDate={formData.personalInfo.dateOfBirth} onChange={handleDatePick} isDisabled={!isFormEdit.personalInfo} />
              </div>
              <FormInput type="text" label="Age" value={`${calculateAge(formData.personalInfo.dateOfBirth)} years old`} onEdit={false} />
            </div>
          </Card>
        </form>

        <Card
          title="Address Information"
          icon={<IconMap2 />}
          isEditing={isFormEdit.addressInfo}
          onCancel={() => handleCancelEdit("addressInfo")}
          toggleEdit={(e) => toggleFormEdit(e, "addressInfo")}
        >
          <div className="w-full flex items-center gap-24 mt-8 pr-44">
            <FormInput
              type="text"
              label="Residential Address"
              value={formData.addressInfo.address}
              onChange={handleChange("addressInfo", "address")}
              onEdit={isFormEdit.addressInfo}
            />
            <NavLink
              to={`https://maps.google.com/maps?q=${encodeURIComponent(formData.addressInfo.address)}`}
              className="flex items-center gap-2 underline text-sm whitespace-nowrap"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on map
              <IconChevronRight />
            </NavLink>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-4 w-1/3">
        <Card
          title="Contact Information"
          icon={<IconAddressBook />}
          isEditing={isFormEdit.contactInfo}
          onCancel={() => handleCancelEdit("contactInfo")}
          toggleEdit={(e) => toggleFormEdit(e, "contactInfo")}
        >
          <div className="w-full mt-6 flex flex-col gap-3">
            <h1 className="w-full text-slate-800 font-semibold">Personal Contact</h1>
            <div className="w-full mt-3 grid grid-cols-2 gap-6 pb-4">
              <FormInput
                type="email"
                label="Email Address"
                value={formData.contactInfo.email}
                onChange={handleChange("contactInfo", "email")}
                onEdit={isFormEdit.contactInfo}
              />
              <FormInput
                type="text"
                label="Phone Number"
                value={formData.contactInfo.phoneNumber}
                onChange={handleChange("contactInfo", "phoneNumber")}
                onEdit={isFormEdit.contactInfo}
              />
            </div>
          </div>
          <div className="w-full mt-4 flex flex-col">
            <h1 className="w-full text-slate-800 font-semibold mb-2">Other Contact</h1>
            <div className="w-full grid grid-cols-2 gap-4">
              <p className="text-zinc-500 text-sm">Not Provided</p>
            </div>
          </div>
        </Card>

        <Card title="Employment Overview" icon={<IconId />} isEditable={false}>
          <div className="mt-6 w-full grid grid-cols-2 gap-6 pb-4">
            <FormInput type="text" label="Date Started" value={formatDate(formData.employementData.dateStarted)} onEdit={false} />
            <FormInput type="text" label="Employment Type" value={formData.employementData.employementType} onEdit={false} />
          </div>
          <FormInput type="text" label="Job Role" value={formData.employementData.jobRole || "Not Assigned"} onEdit={false} />
        </Card>

        {toast.text && <Toast type={toast.type || "error"} text={toast.text} onClick={() => setToast({ text: "", type: "" })} />}
      </div>
    </>
  );
};

export default PersonalInformation;
