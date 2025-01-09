import React, { useCallback, useState } from "react";
import Layouts from "./Layouts";
import useAuth from "../../../hooks/useAuth";
import { getBankImage } from "../../../utils/bankImages";
import FormInput from "../../../components/FormInput";
import useFetch from "../../../hooks/useFetch";
import { bankOptions } from "../../../utils/SelectOptions";
import Snackbar from "../../../components/Snackbar";

const Contact = () => {
  const { profile, profileRefetch } = useAuth();
  const [snackbar, setSnackbar] = useState({ text: "", show: false });
  const [errors, setErrors] = useState(null);
  const [profileData, setProfileData] = useState({
    address: profile?.address || "",
    phoneNumber: profile?.phoneNumber || "",
    email: profile?.email || "",
    emergencyContact: profile?.emergencyContact || "",
    bankAccountNumber: profile?.bankAccountNumber || "",
    bankName: profile?.bankName || "",
  });

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

  const { updateData, loading } = useFetch(`/profile/contact/update/${profile?.userId}`, { method: "PUT" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { success, error: submitError, data } = await updateData(profileData);
    if (success) {
      setErrors(null);
      setSnackbar({ text: data?.message, show: true });

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

  return (
    <Layouts title={"Privacy and Contact Information"} backUrl={"/security"}>
      <div className="relative">
        <form className="w-full" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="w-full mt-12 flex flex-col justify-center items-center py-8">
            <div className="w-full px-6 flex flex-col gap-4">
              <FormInput
                type="text"
                label="Residential Address"
                value={profileData.address}
                onChange={(e) => handleDataChange("address", e.target.value)}
                required
                errors={errors?.address}
              />

              <FormInput
                type="phone"
                label="Phone Number"
                value={profileData.phoneNumber}
                onChange={(e) => handleDataChange("phoneNumber", e.target.value)}
                required
                errors={errors?.phoneNumber}
              />
              <FormInput
                type="email"
                label="Email Address"
                value={profileData.email}
                onChange={(e) => handleDataChange("email", e.target.value)}
                required
                errors={errors?.email}
              />
              <FormInput
                type="phone"
                label="Emergency Contact"
                value={profileData.emergencyContact}
                onChange={(e) => handleDataChange("emergencyContact", e.target.value)}
                required
                errors={errors?.emergencyContact}
              />
              <FormInput
                type="select"
                label="Bank Name"
                value={{
                  label: (
                    <div className="flex items-center gap-2">
                      <img src={getBankImage(profileData?.bankName)} alt="BCA" className="w-12" />
                      Bank {profileData?.bankName}
                    </div>
                  ),
                  value: profileData?.bankName,
                }}
                options={bankOptions}
                onChange={(e) => handleDataChange("bankName", e.value)}
                required
                errors={errors?.bankName}
              />
              <FormInput
                type="number"
                label="Bank Acount Number"
                value={profileData.bankAccountNumber}
                onChange={(e) => handleDataChange("bankAccountNumber", e.target.value)}
                required
                errors={errors?.bankAccountNumber}
              />
            </div>

            {/* Submit Button */}
            <div className="w-full px-6 mt-6">
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
        {snackbar.show && <Snackbar text={snackbar.text} show={snackbar.show} />}
      </div>
    </Layouts>
  );
};

export default Contact;
