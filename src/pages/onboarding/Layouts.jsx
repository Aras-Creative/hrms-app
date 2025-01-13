import { IconArrowLeft } from "@tabler/icons-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Layouts = ({ children, currentStep, setCurrentStep }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (currentStep >= 1) {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      } else {
        navigate("/welcome");
      }
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center bg-white max-w-screen-sm mx-auto">
      <div className="w-full mt-0 rounded-lg p-6">
        <div className="mb-16 flex items-center justify-between">
          <button type="button" onClick={handleClick} className="bg-white text-slate-800">
            <IconArrowLeft />
          </button>
          <img src="/image/sekantor-logo.png" className="w-24" alt="logo" />
        </div>
        <h1 className="mb-1 text-lg font-bold text-zinc-700">Hello there!👋</h1>
        <h1 className="text-4xl text-start font-semibold">Setup your profile</h1>
        <p className="text-sm text-zinc-600 mt-2 mb-8">Complete your profile for a more personalized experience!</p>
        {children}
      </div>
    </div>
  );
};

const Body = ({ children }) => {
  return <div className="w-full">{children}</div>;
};

const Footer = ({ children }) => {
  return <div className="mt-8">{children}</div>;
};

Layouts.Body = Body;
Layouts.Footer = Footer;

export default Layouts;
