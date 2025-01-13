import React, { useCallback, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useFetch from "../../../hooks/useFetch";
import FormInput from "../../../components/FormInput";
import Layouts from "./Layouts";
import Snackbar from "../../../components/Snackbar";

const Password = () => {
  const { profile } = useAuth();
  const [errors, setErrors] = useState(null);
  const [snackbar, setSnackbar] = useState({ text: "", open: false });
  const [profileData, setProfileData] = useState({
    email: profile?.email || "",
    oldPassword: "",
    newPassword: "",
  });

  const handleDataChange = useCallback((field, value) => {
    setProfileData((prevData) => {
      if (prevData[field] !== value) {
        return {
          ...prevData,
          [field]: value,
        };
      }

      console.log(prevData);
      return prevData;
    });
  }, []);

  const { updateData, loading } = useFetch(`/auth/password/change`, { method: "PUT" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { success, error: submitError } = await updateData(profileData);
    if (success) {
      setErrors(null);
      setSnackbar({ text: data.message, open: true });
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
    <Layouts title={"Keamanan dan Katasandi"} backUrl={"/security"}>
      <form className="w-full" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="w-full mt-12 flex flex-col justify-center items-center py-8">
          <div className="w-full px-6 flex flex-col gap-4">
            <FormInput
              type="email"
              label="Alamat Email"
              value={profileData?.email}
              onChange={(e) => handleDataChange("email", e.target.value)}
              errors={errors?.email}
            />

            <FormInput
              type="password"
              label="Kata sandi saat ini"
              value={profileData?.oldPassowrd}
              onChange={(e) => handleDataChange("oldPassword", e.target.value)}
              required
              errors={errors?.oldPassword}
            />
            <FormInput
              type="password"
              label="Kata sandi baru"
              value={profileData?.newPassword}
              onChange={(e) => handleDataChange("newPassword", e.target.value)}
              required
              errors={errors?.newPassword}
            />
          </div>

          {/* Submit Button */}
          <div className="w-full px-6 mt-6">
            <button
              type="submit"
              className="rounded-full w-full bg-indigo-500 text-white hover:bg-indigo-700 p-3 font-semibold transition-all duration-300 ease-in-out"
              disabled={loading}
            >
              Perbarui Kata sandi
            </button>
          </div>
        </div>
      </form>

      {snackbar.open && <Snackbar text={snackbar.text} show={snackbar.open} />}
    </Layouts>
  );
};

export default Password;
