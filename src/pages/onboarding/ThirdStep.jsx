import React from "react";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import FormInput from "../../components/FormInput";

const ThirdStep = ({ profileData, setProfileData }) => {
  return (
    <div>
      <FormInput
        type="text"
        label={"Phone Number"}
        value={profileData.phoneNumber}
        onInput={formatPhoneNumber}
        onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
        required
      />

      <FormInput
        type="email"
        label={"Email Address"}
        value={profileData.email}
        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
        required
      />

      <FormInput
        type="email"
        label={"Residential Address"}
        value={profileData.address}
        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
        required
      />
    </div>
  );
};

export default ThirdStep;
