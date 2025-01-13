import React, { useEffect, useMemo, useState } from "react";
import DashboardLayouts from "../../../../layouts/DashboardLayouts";
import { IconArrowLeft, IconCircleCheckFilled } from "@tabler/icons-react";
import GeneralInformation from "./GeneralInformation";
import ContractDetails from "./ContractDetails";
import Benefits from "./Benefits";
import useFetch from "../../../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { handleDatePick as DatePick } from "../../../../utils/dateUtils";
import { createContractState as initialState } from "../../../../utils/constants";
import useFormHandler from "../../../../hooks/useFormHandler";
import { validateBenefits, validateContractDetails, validatePersonalData } from "../../../../utils/validator";
import Toast from "../../../../components/Toast";
import { handleToastTimeout } from "../../../../utils/handleToastTimeOut";

const CreateEmployeeContract = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ text: "", type: "success" });
  // constants
  const steps = [
    { key: "personalData", label: "Personal Information", component: GeneralInformation },
    { key: "contractData", label: "Contract Details", component: ContractDetails },
    { key: "benefits", label: "Compensation and Benefits", component: Benefits },
  ];
  const stepKeys = ["generalInfo", "contractData", "benefits"];

  const validationFunctions = useMemo(
    () => ({
      personalData: (data) => validatePersonalData(data),
      contractData: (data) => validateContractDetails(data),
      benefits: (data) => validateBenefits(data),
    }),
    []
  );

  const { formData, currentStep, isFormComplete, handleSelect, handleFormInput, setFormData, handleStepChange } = useFormHandler({
    initialState: initialState,
    validationFunctions,
    totalSteps: stepKeys.length,
  });

  const handleDatePick = DatePick(setFormData);

  const stepContentProps = {
    handleFormInput,
    handleSelect,
    handleDatePick,
    setFormData,
    data: formData,
  };

  const { submitData: createEmployee, loading: createLoading, error: createError } = useFetch("/employee/create", { method: "POST" });
  const handleSubmit = async () => {
    const { success, error } = await createEmployee(formData);
    if (success) {
      navigate("/dashboard/employee");
    } else {
      setToast({ text: error || "An error occured", type: "error" });
    }
  };

  useEffect(() => {
    handleToastTimeout("", setToast);
  }, [toast.text]);

  const renderStepContent = () => {
    const CurrentComponent = steps[currentStep - 1]?.component;
    return CurrentComponent ? <CurrentComponent {...stepContentProps} /> : null;
  };

  const renderStepNavigation = () => {
    const currentStepKey = steps[currentStep - 1]?.key;
    const isStepComplete = currentStepKey ? isFormComplete[currentStepKey] : false;
    const isLastStep = currentStep === steps.length;
    return (
      <div className={`w-full flex justify-${currentStep === 1 ? "end" : "between"} items-center mt-3`}>
        {currentStep > 1 && (
          <button type="button" onClick={() => handleStepChange("back")} className="text-slate-800 font-semibold flex gap-2 items-center">
            <IconArrowLeft />
            Kembali
          </button>
        )}
        <button
          type="button"
          onClick={isLastStep ? handleSubmit : () => handleStepChange("next")}
          className={`${
            isStepComplete ? "bg-emerald-700 hover:bg-emerald-800" : "bg-zinc-500"
          } text-white font-semibold rounded-xl transition-all duration-300 ease-in-out px-3 py-2`}
          disabled={!isStepComplete}
        >
          {isLastStep ? "Buat Data Karyawan" : "Selanjutnya"}
        </button>
      </div>
    );
  };

  return (
    <DashboardLayouts>
      <div className="flex justify-center w-full mt-8">
        <div className="max-w-5xl flex flex-col items-center justify-center w-full">
          <h1 className="text-slate-800 font-bold text-3xl mb-1">Buat Kontrak Baru</h1>
          <p className="text-sm text-zinc-500 text-center">Buat ketentuan kontrak karyawan dengan proses panduan ini.</p>

          <div className="w-full flex mt-10 items-center relative">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center justify-center gap-2 flex-1 relative">
                <div
                  className={`bg-white rounded-full flex border z-10 ${
                    currentStep === index + 1 ? "border-emerald-700" : "border-slate-800"
                  } items-center gap-2 px-2.5 py-1.5`}
                >
                  {isFormComplete[step.key] ? (
                    <IconCircleCheckFilled className="text-emerald-700" size={24} />
                  ) : (
                    <div className="flex items-center justify-center w-6 h-6 border-2 border-dotted border-emerald-700 rounded-full">
                      <span className="text-emerald-700 text-xs font-semibold">{index + 1}</span>
                    </div>
                  )}
                  <p className={`text-xs whitespace-nowrap ${currentStep !== index + 1 ? "text-zinc-500" : "text-emerald-700"}`}>{step.label}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute top-1/2 left-[75%] transform -translate-x-1/2 -translate-y-1/2 w-full flex justify-center border-t-2 border-zinc-300"></div>
                )}
              </div>
            ))}
          </div>
          {renderStepContent()}
          {renderStepNavigation()}
          {toast.text !== "" && (
            <Toast type={toast.type || "error"} text={toast.text || "An error occured"} onClick={() => setToast({ text: "", type: "" })} />
          )}
        </div>
      </div>
    </DashboardLayouts>
  );
};

export default CreateEmployeeContract;
