import React, { useCallback, useState } from "react";
import Layouts from "./Layouts";
import useAuth from "../../../hooks/useAuth";
import { IconCamera } from "@tabler/icons-react";
import FormInput from "../../../components/FormInput";
import Datepicker from "../../../components/Datepicker";
import useFetch from "../../../hooks/useFetch";
import { STORAGE_URL } from "../../../config";
import Snackbar from "../../../components/Snackbar";
import { genderOptions, religionOptions } from "../../../utils/SelectOptions";

const ProfileDetails = () => {
  const { profile, profileRefetch } = useAuth();
  const [snackbar, setSnackbar] = useState({ text: "", show: false });

  const [updatedProfileImage, setUpdatedProfileImage] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [profileData, setProfileData] = useState({
    fullName: profile?.fullName || "",
    gender: profile?.gender || "",
    religion: profile?.religion || "",
    placeOfBirth: profile?.placeOfBirth || "",
    dateOfBirth: profile?.dateOfBirth || "",
  });
  const [errors, setErrors] = useState({});

  const { responseData: ProfilePicture } = useFetch(`/employee/profile-picture/${profile.userId}`);

  const { updateData, loading } = useFetch(
    `/profile/update/${profile?.userId}`,
    { method: "PUT" },
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

    const { success, data, error: submitError } = await updateData(formData);
    if (success) {
      setSnackbar({ text: data.message, show: true });
      setTimeout(() => {
        setSnackbar({ text: "", show: false });
        profileRefetch();
      }, 2000);
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

  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name[0];
    return nameParts;
  };

  const profileImageSrc = updatedProfileImage || `${STORAGE_URL}/document/${profile?.userId}/${ProfilePicture?.path}`;
  const showPlaceholder = !updatedProfileImage && (!ProfilePicture || !ProfilePicture?.path);

  return (
    <Layouts title="Identitas Pribadi" backUrl="/settings">
      <form className="w-full" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="w-full mt-12 flex flex-col justify-center items-center py-8">
          {/* Profile image */}
          <div className="relative">
            {showPlaceholder ? (
              <div className="w-36 h-36 rounded-full border-4 text-4xl border-white bg-gray-300 flex items-center justify-center text-slate-800 font-bold shadow-md">
                {getInitials(profile?.fullName)} {/* Display initials */}
              </div>
            ) : (
              <img
                src={profileImageSrc}
                alt="Profile"
                className="w-36 h-36 rounded-full border-4 border-white object-cover object-center shadow-md transition-transform duration-200 hover:scale-105"
              />
            )}
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
            <div className="mb-4">
              <FormInput
                type="text"
                label="Nama Lengkap"
                value={profileData.fullName}
                onChange={(e) => handleDataChange("fullName", e.target.value)}
                required
                errors={errors?.fullName}
              />
            </div>

            <div className="grid grid-cols-2 mb-4 gap-4 w-full">
              <FormInput
                type="select"
                options={genderOptions}
                label="Jenis Kelamin"
                value={{ label: profileData.gender, value: profileData.gender }}
                onChange={(selectedOption) => handleDataChange("gender", selectedOption.value)}
                errors={errors?.gender}
              />
              <FormInput
                type="select"
                options={religionOptions}
                label="Agama"
                value={{ label: profileData.religion, value: profileData.religion }}
                onChange={(selectedOption) => handleDataChange("religion", selectedOption.value)}
                errors={errors?.religion}
              />
            </div>
            <div className="mb-4 w-full">
              <FormInput
                type="text"
                label="Tempat Lahir"
                value={profileData.placeOfBirth}
                onChange={(e) => handleDataChange("placeOfBirth", e.target.value)}
                required
              />
            </div>
            <div className="mb-4 relative">
              <label htmlFor="dateOfBirth" className="text-sm block mb-2 absolute -top-4 mt-4 left-2 bg-white px-1">
                Tanggal Lahir
              </label>
              <div className="absolute w-full mt-4">
                <Datepicker label={"Select Birth Date"} defaultDate={profileData.dateOfBirth} onChange={handleDatePick} />
              </div>
            </div>

            <div className="w-full px-6 mt-28">
              <button
                type="submit"
                className="rounded-full w-full bg-indigo-500 text-white hover:bg-indigo-700 p-3 font-semibold transition-all duration-300 ease-in-out"
                disabled={loading}
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      </form>
      {snackbar.show && <Snackbar text={snackbar.text} show={snackbar.show} />}
    </Layouts>
  );
};

export default ProfileDetails;
