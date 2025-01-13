import React from "react";
import FormInput from "../../components/FormInput";

const FirstStep = ({ profileData, setProfileData }) => {
  const religionOptions = [
    { label: "Islam", value: "Islam" },
    { label: "Protestan", value: "Protestan" },
    { label: "Katolik", value: "Katolik" },
    { label: "Hindu", value: "Hindu" },
    { label: "Buddha", value: "Buddha" },
    { label: "Khonghucu", value: "Khonghucu" },
  ];

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];

  return (
    <div>
      <FormInput
        type="text"
        label={"Full Name"}
        value={profileData.fullname}
        onChange={(e) => setProfileData({ ...profileData, fullname: e.target.value })}
        required
      />

      <FormInput
        type="select"
        options={genderOptions}
        label={"Gender"}
        onChange={(selectedOption) => setProfileData({ ...profileData, gender: selectedOption.value })}
      />

      <FormInput
        type="select"
        options={religionOptions}
        label={"Religion"}
        onChange={(selectedOption) => setProfileData({ ...profileData, religion: selectedOption.value })}
      />
    </div>
  );
};

export default FirstStep;
