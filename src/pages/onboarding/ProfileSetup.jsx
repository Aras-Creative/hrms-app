import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import Layouts from "./Layouts";
import useAuth from "../../hooks/useAuth";
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";
import ThirdStep from "./ThirdStep";
import FifthStep from "./FifthStep";

const ProfileSetup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { auth } = useAuth();

  const [profileData, setProfileData] = useState({
    fullname: "",
    gender: "",
    religion: "",
    placeOfBirth: "",
    dateOfBirth: "",
    typeOfBlood: "",
    jobRoleId: "",
    address: "",
    email: "",
    phoneNumber: "",
    bankName: "",
    bankAccountNumber: "",
  });

  const handleStepChange = () => {
    setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
  };

  useEffect(() => {
    setProfileData((prevData) => ({
      ...prevData,
      email: auth?.user?.email,
    }));
  }, [currentStep]);

  const { submitData: CreateProfile, loading: CreateProfileLoading, error: CreateProfileError } = useFetch("/profile/create", { method: "POST" });

  const handleProfilePicUpload = (imageData) => {
    console.log(imageData);
    setProfileData({ ...profileData, profilePicture: imageData });
  };

  const handleIdentityPictureUpload = (imageData) => {
    console.log(imageData);
    setProfileData({ ...profileData, identityPicture: imageData });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(profileData);
    const { success, data, error } = await CreateProfile(profileData);
    if (success) {
      console.log(data.content);
    }
    console.log(error);
  };

  return (
    <Layouts currentStep={currentStep} setCurrentStep={setCurrentStep}>
      <form encType="multpart/form-data" onSubmit={handleSubmit}>
        <Layouts.Body>
          {[
            <FirstStep profileData={profileData} setProfileData={setProfileData} />,
            <SecondStep profileData={profileData} setProfileData={setProfileData} />,
            <ThirdStep profileData={profileData} setProfileData={setProfileData} />,
            <FifthStep profileData={profileData} setProfileData={setProfileData} />,
          ][currentStep - 1] || <div>Invalid Step</div>}
        </Layouts.Body>

        <Layouts.Footer>
          {currentStep === 4 && (
            <>
              <div className="mb-2 text-xs text-zinc-400 text-center">
                By clicking 'Create an Account,' you agree to our{" "}
                <button type="button" className="text-xs px-1 text-indigo-500 hover:underline">
                  Privacy Policy
                </button>{" "}
                and
                <button type="button" className="text-xs px-1 text-indigo-500 hover:underline">
                  Terms & Conditions.
                </button>{" "}
              </div>
            </>
          )}
          <button
            type={currentStep === 5 ? "submit" : "button"}
            onClick={currentStep < 4 ? handleStepChange : handleSubmit}
            className="rounded-full w-full bg-indigo-500 text-white hover:bg-indigo-700 p-3 font-semibold transition-all duration-300 ease-in-out"
            disabled={CreateProfileLoading}
          >
            {CreateProfileLoading ? (
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"></svg>
            ) : currentStep < 4 ? (
              "Next"
            ) : (
              "Create an Account"
            )}
          </button>
        </Layouts.Footer>
      </form>
    </Layouts>
  );
};

export default ProfileSetup;
