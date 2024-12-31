import React, { useCallback, useState } from "react";
import Layouts from "./Layouts";
import useAuth from "../../../hooks/useAuth";
import avatarPlaceholder from "../../../assets/avatar.png";
import { IconCamera } from "@tabler/icons-react";
import FormInput from "../../../components/FormInput";
import Datepicker from "../../../components/Datepicker";
import useFetch from "../../../hooks/useFetch";
import { useNavigate } from "react-router-dom";

const ProfileDetails = () => {
  const { profile, profileRefetch } = useAuth();
  const navigate = useNavigate();

  const [updatedProfileImage, setUpdatedProfileImage] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [profileData, setProfileData] = useState({
    fullName: profile?.fullName || "",
    gender: profile?.gender || "",
    religion: profile?.religion || "",
    placeOfBirth: profile?.placeOfBirth || "",
    dateOfBirth: profile?.dateOfBirth || "",
    typeOfBlood: profile?.typeOfBlood || "",
  });
  const [errors, setErrors] = useState({});

  // Profile picture and storage URL
  const profilePictureDocName =
    profile?.document.find((doc) => doc.documentName.startsWith("profilePicture"))?.documentName || profile?.document[1]?.documentName;
  const apiStoragePath = "http://localhost:3000/storage/document";
  const profileImageUrl = `${apiStoragePath}/${profile.employeeId.replace(/\s+/g, "_")}/${profilePictureDocName}`;

  // Fetch hook for submitting data
  const { submitData, loading, error, responseData } = useFetch(
    `/profile/update/${profile?.employeeId}`,
    { method: "POST" },
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  // Handle image upload change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && profileFile !== file) {
      setProfileFile(file);
      setUpdatedProfileImage(URL.createObjectURL(file));
    }
  };

  // Handle form data change
  const handleDataChange = useCallback((field, value) => {
    setProfileData((prevData) => {
      if (prevData[field] !== value) {
        return {
          ...prevData,
          [field]: value,
        };
      }
      return prevData;
    });
  }, []);

  // Handle Datepicker change
  const handleDatePick = (selectedDate) => {
    const date = new Date(selectedDate);
    const formattedDate = date.toLocaleDateString("en-CA");
    setProfileData((prevData) => ({
      ...prevData,
      dateOfBirth: formattedDate,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profilePicture", profileFile);
    formData.append("data", JSON.stringify(profileData));

    const { success, error: submitError } = await submitData(formData);
    if (success) {
      profileRefetch();
      navigate("/settings");
    } else {
      const mappedErrors = submitError.reduce((acc, errorObj) => {
        for (let field in errorObj) {
          acc[field] = errorObj[field][0];
        }
        return acc;
      }, {});

      setErrors(mappedErrors);
    }
  };

  // Define gender and religion options
  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  const religionOptions = [
    { label: "Islam", value: "Islam" },
    { label: "Protestan", value: "Protestan" },
    { label: "Katolik", value: "Katolik" },
    { label: "Hindu", value: "Hindu" },
    { label: "Buddha", value: "Buddha" },
    { label: "Khonghucu", value: "Khonghucu" },
  ];

  return (
    <Layouts title="Personal Identity" backUrl="/settings">
      <form className="w-full" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="w-full mt-12 flex flex-col justify-center items-center py-8">
          {/* Profile image */}
          <div className="relative">
            <img
              src={updatedProfileImage || profileImageUrl || avatarPlaceholder}
              alt="Profile"
              className="w-36 h-36 rounded-full border-4 border-white object-cover object-center shadow-md transition-transform duration-200 hover:scale-105"
            />
            <div className="absolute bottom-0 right-1">
              <label htmlFor="profile-upload" className="flex justify-center gap-3 w-full items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full cursor-pointer hover:bg-indigo-200 transition duration-200">
                  <IconCamera className="text-indigo-500" size={22} />
                </div>
              </label>
              <input type="file" id="profile-upload" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
          </div>

          {/* Profile Form Inputs */}
          <div className="w-full px-6 mt-10">
            <FormInput
              type="text"
              label="Full Name"
              value={profileData.fullName}
              onChange={(e) => handleDataChange("fullName", e.target.value)}
              required
              errors={errors?.fullName}
            />

            <div className="grid grid-cols-2 gap-4 w-full">
              <FormInput
                type="select"
                options={genderOptions}
                label="Gender"
                value={{ label: profileData.gender, value: profileData.gender }}
                onChange={(selectedOption) => handleDataChange("gender", selectedOption.value)}
                errors={errors?.gender}
              />
              <FormInput
                type="select"
                options={religionOptions}
                label="Religion"
                value={{ label: profileData.religion, value: profileData.religion }}
                onChange={(selectedOption) => handleDataChange("religion", selectedOption.value)}
                errors={errors?.religion}
              />
            </div>

            <FormInput
              type="text"
              label="Place Of Birth"
              value={profileData.placeOfBirth}
              onChange={(e) => handleDataChange("placeOfBirth", e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="mb-4">
                <label htmlFor="dateOfBirth" className="text-sm block px-2 mb-2">
                  Date Of Birth
                </label>
                <div className="flex items-center gap-3 rounded-full border border-gray-300 focus-within:border-indigo-500 px-2 py-1 mt-1">
                  <Datepicker defaultDate={profileData.dateOfBirth} onChange={handleDatePick} />
                </div>
              </div>
              <FormInput
                type="select"
                options={[
                  { label: "A", value: "A" },
                  { label: "AB", value: "AB" },
                  { label: "B", value: "B" },
                  { label: "O", value: "O" },
                ]}
                label="Type Of Blood"
                value={{ label: profileData.typeOfBlood, value: profileData.typeOfBlood }}
                onChange={(selectedOption) => handleDataChange("typeOfBlood", selectedOption.value)}
                errors={errors?.typeOfBlood}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="w-full px-6">
            <button
              type="submit"
              className="rounded-full w-full bg-indigo-500 text-white hover:bg-indigo-700 p-3 font-semibold transition-all duration-300 ease-in-out"
              disabled={loading}
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </Layouts>
  );
};

export default ProfileDetails;
