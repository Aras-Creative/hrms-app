import React, { useEffect } from "react";
import KYCIcons from "../../assets/kyc.webp";
import KYCSuccess from "../../assets/kyc-success.webp";
import { IconCircleCheckFilled, IconFaceId, IconId } from "@tabler/icons-react";
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const VerifyId = () => {
  const { isVerified, profileRefetch } = useAuth();

  useEffect(() => {
    profileRefetch();
  }, [isVerified]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-white max-w-screen-sm mx-auto">
      <div className="w-full mt-0 pt-6 rounded-lg flex items-center justify-center">
        <img src={isVerified ? KYCSuccess : KYCIcons} className="w-80" />
      </div>
      <div className="w-full flex flex-col items-center">
        <h1 className="text-xl font-bold text-slate-800">{isVerified ? "Your identity is verified" : "Verify your identity"}</h1>
        <p className="text-xs text-center text-zinc-400 px-10 mt-1">
          {isVerified
            ? " Thank you for submitting your documents. Your verification is complete."
            : "Please submit the following documents to proccess your verification."}
        </p>

        <div className="w-full flex flex-col items-start">
          <div className="flex items-start gap-3 mt-8 px-12">
            {isVerified ? <IconCircleCheckFilled className="text-green-500" /> : <IconFaceId />}
            <div className="flex flex-col gap-1 items-start">
              <h1 className="text-sm font-semibold text-slate-800">
                {isVerified ? "Your ID/KTP has been verified" : "Upload a picture of a valid ID/KTP"}
              </h1>
              <p className="text-xs text-zinc-500 text-start">
                {isVerified ? "Your personal information has been successfully confirmed." : "To check your personal informations are correct."}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 mt-6 px-12">
            {isVerified ? <IconCircleCheckFilled className="text-green-500" /> : <IconFaceId />}
            <div className="flex flex-col gap-1 items-start">
              <h1 className="text-sm font-semibold text-slate-800">
                {isVerified ? "Your profile picture has been verified" : "Upload a profile picture that clearly shows your face."}
              </h1>
              <p className="text-xs text-zinc-500 text-start">
                {isVerified ? "Your face matches the photo on your ID/KTP" : "To match your face to your ID/KTP photo."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 mb-8 w-full px-8 flex justify-center">
          <NavLink
            to={isVerified ? "/homepage" : "/verification"}
            className={
              "bg-indigo-500 w-full text-center py-2 rounded-xl text-white font-semibold hover:bg-indigo-700 ease-in-out transition-all duration-300"
            }
          >
            {isVerified ? "Back to homepage" : "Get Started"}
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default VerifyId;
