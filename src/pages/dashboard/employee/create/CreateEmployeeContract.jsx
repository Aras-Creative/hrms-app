import React, { useEffect, useState } from "react";
import DashboardLayouts from "../../../../layouts/DashboardLayouts";
import { IconArrowLeft, IconCircleCheckFilled } from "@tabler/icons-react";
import GeneralInformation from "./GeneralInformation";
import ContractDetails from "./ContractDetails";
import Benefits from "./Benefits";
import useFetch from "../../../../hooks/useFetch";
import { useNavigate } from "react-router-dom";

const formatDate = (date) => new Date(date).toLocaleDateString("en-CA");

const CreateEmployeeContract = () => {
  const initialState = {
    personalData: {
      fullName: "",
      gender: "",
      religion: "",
      placeOfBirth: "",
      dateOfBirth: "",
      address: "",
      email: "",
      phoneNumber: "",
    },
    contractData: {
      employementStatus: "Contract",
      salaryType: "Monthly",
      startDate: "",
      jobRole: "",
      endDate: "",
      scopeOfWork: [],
    },
    salary: {
      bankName: "",
      bankAccountNumber: "",
      basicSalary: "",
    },
    adjustment: [
      { type: "deduction", amount: "", name: "BPJS Kesehatan", amountType: "percent" },
      { type: "deduction", amount: "", name: "BPJS Jaminan Hari Tua", amountType: "percent" },
      { type: "deduction", amount: "", name: "BPJS Jaminan Pensiun", amountType: "percent" },
      { type: "allowance", amount: "", name: "Bonus Target", amountType: "percent" },
      { type: "deduction", amount: "", name: "Late Penalty", amountType: "percent" },
    ],
    assets: [],
  };

  const [formData, setFormData] = useState(initialState);
  const [currentStep, setCurrentStep] = useState(1);
  const [isFormComplete, setIsFormComplete] = useState({
    generalInfo: false,
    contractDetails: false,
    benefits: false,
  });

  const navigate = useNavigate();
  const stepKeys = ["generalInfo", "contractDetails", "benefits"];

  const handleChange = (formName, field) => (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [formName]: { ...prevState[formName], [field]: e.target.value },
    }));
  };

  const handleSelectChange = (formName, field) => (selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      [formName]: { ...prevState[formName], [field]: selectedOption.value },
    }));
  };

  const handleDatePick = (formName, field) => (selectedDate) => {
    const formattedDate = formatDate(selectedDate);
    setFormData((prevData) => ({
      ...prevData,
      [formName]: { ...prevData[formName], [field]: formattedDate },
    }));
  };

  const checkFormCompletion = () => {
    const isGeneralInfoComplete = Object.values(formData.personalData).every((value) => value.trim() !== "");
    const isContractDetailsComplete = Object.values(formData.contractData).every((value) => {
      if (Array.isArray(value)) {
        return value.every((item) => item.title !== "" && item.title !== null);
      }
      return value.trim() !== "";
    });

    const isBenefitsComplete =
      Object.values(formData.salary).every((value) => value.trim() !== "") &&
      Object.values(formData.assets).every((item) => item.assetName !== "" && item.assetName !== null) &&
      Object.values(formData.adjustment).every((item) => item.amount !== "" && item.amount !== null);

    setIsFormComplete({
      generalInfo: isGeneralInfoComplete,
      contractDetails: isContractDetailsComplete,
      benefits: isBenefitsComplete,
    });
  };

  useEffect(() => {
    checkFormCompletion();
  }, [formData]);

  const handleStepChange = (direction) => {
    setCurrentStep((prev) => {
      if (direction === "next" && prev < 3) return prev + 1;
      if (direction === "back" && prev > 1) return prev - 1;
      return prev;
    });
  };

  useEffect(() => {
    setFormData(initialState);
  }, []);

  const { submitData: createEmployee } = useFetch("/employee/create", { method: "POST" });

  const handleSubmit = async () => {
    const { success, data } = await createEmployee(formData);
    if (success) {
      navigate("/dashboard/employee");
    }
  };

  const renderStepContent = () => {
    const stepContentProps = {
      handleChange,
      handleSelectChange,
      handleDatePick,
      setFormData,
      data: formData,
    };
    switch (currentStep) {
      case 1:
        return <GeneralInformation {...stepContentProps} />;
      case 2:
        return <ContractDetails {...stepContentProps} />;
      case 3:
        return <Benefits {...stepContentProps} />;
      default:
        return null;
    }
  };

  const renderStepNavigation = () => {
    const isStepComplete = isFormComplete[stepKeys[currentStep - 1]];

    return (
      <div className={`w-full flex justify-${currentStep === 1 ? "end" : "between"} items-center mt-3`}>
        {currentStep > 1 && (
          <button type="button" onClick={() => handleStepChange("back")} className="text-slate-800 font-semibold flex gap-2 items-center">
            <IconArrowLeft />
            Back
          </button>
        )}
        <button
          type="button"
          onClick={currentStep < 3 ? () => handleStepChange("next") : handleSubmit}
          className={`${
            isStepComplete ? "bg-emerald-700 hover:bg-emerald-800" : "bg-zinc-500"
          } text-white font-semibold rounded-xl transition-all duration-300 ease-in-out px-3 py-2`}
          disabled={!isStepComplete}
        >
          {currentStep < 3 ? "Next" : "Create New Employee Contract"}
        </button>
      </div>
    );
  };

  return (
    <DashboardLayouts>
      <div className="flex justify-center w-full mt-8">
        <div className="max-w-5xl flex flex-col items-center justify-center w-full">
          <h1 className="text-slate-800 font-bold text-3xl mb-1">Create New Contract</h1>
          <p className="text-sm text-zinc-500 text-center">Create the employee contract terms with this guided process.</p>

          <div className="w-full flex mt-10 items-center relative">
            {stepKeys.map((step, index) => (
              <div key={index} className="flex items-center justify-center gap-2 flex-1 relative">
                <div
                  className={`bg-white rounded-full flex border z-10 ${
                    currentStep === index + 1 ? "border-emerald-700" : "border-slate-800"
                  } items-center gap-2 px-2.5 py-1.5`}
                >
                  {isFormComplete[step] ? (
                    <IconCircleCheckFilled className="text-emerald-700" size={24} />
                  ) : (
                    <div className="flex items-center justify-center w-6 h-6 border-2 border-dotted border-emerald-700 rounded-full">
                      <span className="text-emerald-700 text-xs font-semibold">{index + 1}</span>
                    </div>
                  )}

                  <p className={`text-xs whitespace-nowrap ${currentStep !== index + 1 ? "text-zinc-500" : "text-emerald-700"}`}>
                    {step === "generalInfo" && "General Information"}
                    {step === "contractDetails" && "Contract Details"}
                    {step === "benefits" && "Compensation and Benefits"}
                  </p>
                </div>

                {index < 2 && (
                  <div className="absolute top-1/2 left-[75%] transform -translate-x-1/2 -translate-y-1/2 w-full flex justify-center border-t-2 border-zinc-300"></div>
                )}
              </div>
            ))}
          </div>

          {renderStepContent()}
          {renderStepNavigation()}
        </div>
      </div>
    </DashboardLayouts>
  );
};

export default CreateEmployeeContract;
