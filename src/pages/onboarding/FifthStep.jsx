import React from "react";
import FormInput from "../../components/FormInput";
import bankOptions from "../../utils/BankOptions";

const FifthStep = ({ profileData, setProfileData }) => {
  return (
    <div>
      <FormInput
        type="text"
        label={"Job Role"}
        value={profileData.jobRoleId}
        onChange={(e) => setProfileData({ ...profileData, jobRoleId: e.target.value })}
        required
      />

      <FormInput
        type="select"
        options={bankOptions}
        label={"Bank Name"}
        onChange={(selectedOption) => setProfileData({ ...profileData, bankName: selectedOption.value })}
      />

      <FormInput
        type="text"
        label={"Bank Account Number"}
        value={profileData.bankAccountNumber}
        onChange={(e) => setProfileData({ ...profileData, bankAccountNumber: e.target.value })}
        required
      />
    </div>
  );
};

export default FifthStep;
