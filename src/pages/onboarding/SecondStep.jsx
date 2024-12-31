import React, { useState } from "react";
import FormInput from "../../components/FormInput";
import Datepicker from "../../components/Datepicker";

const SecondStep = ({ profileData, setProfileData }) => {
  const [datePickerShow, setDatepickerShow] = useState(false);

  const handleDatePick = (selectedDate) => {
    const date = new Date(selectedDate);
    const dateOnly = date.toLocaleDateString("en-CA");
    setProfileData((prevData) => ({
      ...prevData,
      dateOfBirth: dateOnly,
    }));
  };

  const bloodTypeOptions = [
    { label: "A", value: "A" },
    { label: "AB", value: "AB" },
    { label: "B", value: "B" },
    { label: "O", value: "O" },
  ];

  return (
    <div>
      <FormInput
        type="text"
        label={"Place Of Birth"}
        value={profileData.placeOfBirth}
        onChange={(e) => setProfileData({ ...profileData, placeOfBirth: e.target.value })}
        required
      />
      <div className="mb-4">
        <label htmlFor="dateOfBirth" className="text-sm block px-2 mb-2">
          Date Of Birth
        </label>
        <div className="flex items-center gap-3 rounded-full border border-gray-300 focus-within:border-indigo-500 px-2 py-1 mt-1">
          <Datepicker selectedDate={new Date()} onChange={handleDatePick} />
        </div>
      </div>

      <FormInput
        type="select"
        options={bloodTypeOptions}
        label={"Type Of Blood"}
        onChange={(selectedOption) => setProfileData({ ...profileData, typeOfBlood: selectedOption.value })}
      />
    </div>
  );
};

export default SecondStep;
