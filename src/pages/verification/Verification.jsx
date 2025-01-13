import { IconLink, IconUpload } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import IDCardPlaceholder from "../../assets/idcard.png";
import useFetch from "../../hooks/useFetch";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Verification = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [ktpImage, setKtpImage] = useState(null);
  const [ktpFile, setKtpFile] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const { profile, isVerified, setIsVerified } = useAuth();
  const [verifiedStatus, setVerifiedStatus] = useState(isVerified);
  const { submitData, loading, error, responseData } = useFetch(
    `/profile/document/${profile?.employeeId}`,
    { method: "POST" },
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  const navigate = useNavigate();

  const handleImageChange = (event, setFile, setImage) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (isVerified) {
      navigate("/verify");
    }
  }, [isVerified]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ktpImage || !profileImage) {
      alert("Both KTP and Profile images are required!");
      return;
    }
    const formData = new FormData();
    formData.append("KTPPhoto", ktpFile);
    formData.append("profilePicture", profileFile);
    formData.append("employeeId", profile?.employeeId);

    const { success, error } = await submitData(formData);

    if (success) {
      setVerifiedStatus((prev) => !prev);
      navigate("/verify");
    } else {
      //   setToast({ text: error || "An Error Occured", type: "error" });
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-zinc-100 max-w-screen-sm mx-auto">
      {!isVerified ? (
        <>
          <div className="flex w-full justify-center">
            <h1 className="text-center text-lg font-bold text-slate-800 py-4">Verification</h1>
          </div>
          <form encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className="w-full px-6 mt-6 justify-center flex">
              <div className="bg-white rounded-xl w-full flex justify-center items-center relative">
                <img
                  src={profileImage || "/image/student.avif"}
                  alt="Profile Preview"
                  className="absolute -top-3 inset-0 border-2 border-dashed mx-auto w-20 h-20 object-cover rounded-xl"
                />

                <div className="w-full flex flex-col items-center justify-center mt-16 text-center">
                  <h1 className="text-xs text-slate-800 px-8 pt-4 pb-6">Upload a profile picture that clearly shows your face.</h1>
                  <div className="border-t w-full border-zinc-200 py-4">
                    <label htmlFor="profile-upload" className="flex justify-center gap-3 w-full items-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl cursor-pointer hover:bg-blue-200 transition duration-200">
                        <IconLink className="text-blue-500" size={24} />
                      </div>
                      <div className="flex flex-col items-start">
                        <p className="text-slate-800 text-sm font-bold">Selfie Photo</p>
                        <p className="text-xs text-slate-800">Upload</p>
                      </div>
                    </label>
                    <input
                      type="file"
                      id="profile-upload"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, setProfileFile, setProfileImage)}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full px-6 mt-12 justify-center flex">
              <div className="bg-white rounded-xl w-full flex justify-center items-center relative">
                <img
                  src={ktpImage || IDCardPlaceholder}
                  alt="Profile Preview"
                  className="absolute -top-6 inset-0 mx-auto w-20 h-14 rounded-lg object-cover"
                />

                <div className="w-full flex flex-col items-center justify-center mt-12 text-center">
                  <h1 className="text-xs text-slate-800 px-8 pt-4 pb-6">Upload ID Card or KTP picture to check your informations are correct</h1>
                  <div className="border-t w-full border-zinc-200 py-4">
                    <label htmlFor="ktp-upload" className="flex justify-center gap-3 w-full items-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl cursor-pointer hover:bg-blue-200 transition duration-200">
                        <IconLink className="text-blue-500" size={24} />
                      </div>
                      <div className="flex flex-col items-start">
                        <p className="text-slate-800 text-sm font-bold">ID/KTP Photo</p>
                        <p className="text-xs text-slate-800">Upload</p>
                      </div>
                    </label>
                    <input
                      type="file"
                      id="ktp-upload"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, setKtpFile, setKtpImage)}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full px-6 my-6">
              <button
                type="submit"
                className="w-full bg-indigo-500 rounded-xl py-2 text-white font-semibold hover:bg-indigo-700 transition-all duration-300 ease-in-out"
              >
                Submit all
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <p>sudah</p>
        </>
      )}
    </div>
  );
};

export default Verification;

// {
//   /* Profile Picture Upload */
// }
// <div className="mb-8">
//   <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">Upload Profile Picture</h2>
//   <div className="flex justify-center">
//     <div className="relative border-4 border-dashed border-gray-300 rounded-full w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center">
//       {profileImage ? (
//         <img src={profileImage} alt="Profile Preview" className="absolute inset-0 w-full h-full object-cover rounded-full" />
//       ) : (
//         <span className="text-gray-400">Profile Picture</span>
//       )}
//       <label htmlFor="profile-upload" className="absolute bottom-0 translate-y-5 flex justify-center w-full">
//         <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition duration-200">
//           <IconUpload className="text-white" size={24} />
//         </div>
//       </label>
//     </div>
//   </div>
//   <input type="file" id="profile-upload" accept="image/*" onChange={(e) => handleImageChange(e, setProfileImage)} className="hidden" />
// </div>;

// {
//   /* KTP/ID Card Upload */
// }
// <div>
//   <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">Upload KTP/ID Card</h2>
//   <div className="flex justify-center">
//     <div className="relative border-2 border-dashed border-gray-300 rounded-lg w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center">
//       {ktpImage ? (
//         <img src={ktpImage} alt="KTP Preview" className="absolute inset-0 w-full h-full object-cover rounded-lg" />
//       ) : (
//         <span className="text-gray-400">Drag and drop your KTP/ID Card here</span>
//       )}

//       <label htmlFor="ktp-upload" className="absolute bottom-0 translate-y-5 flex justify-center w-full">
//         <div className="flex items-center justify-center w-12 h-12 bg-indigo-500 rounded-full cursor-pointer hover:bg-indigo-600 transition duration-200">
//           <IconUpload className="text-white" size={24} />
//         </div>
//       </label>
//     </div>
//   </div>
//   <input type="file" id="ktp-upload" accept="image/*" onChange={(e) => handleImageChange(e, setKtpImage)} className="hidden" />
// </div>;
