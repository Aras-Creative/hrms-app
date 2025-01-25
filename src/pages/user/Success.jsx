import React, { useEffect } from "react";
import SuccessAnimation from "../../assets/user/success.webp";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/homepage");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <div className=" h-screen flex flex-col items-center justify-center p-10">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center w-11/12 md:w-2/3 lg:w-1/2">
        <img src={SuccessAnimation} alt="Success" className="w-full h-auto rounded-lg hover:scale-105 transition-transform duration-300" />
        <p className="text-center text-sm text-indigo-600 font-medium mt-6">Izin cuti kamu sudah berhasil diajukan. Silakan menunggu persetujuan!.</p>
      </div>
    </div>
  );
};

export default Success;
