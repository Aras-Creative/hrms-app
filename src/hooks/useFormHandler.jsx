import { useEffect, useState } from "react";

const useFormHandler = ({ initialState, validationFunctions, totalSteps }) => {
  const [formData, setFormData] = useState(initialState);
  const [currentStep, setCurrentStep] = useState(1);
  const [isFormComplete, setIsFormComplete] = useState({});

  useEffect(() => {
    if (!validationFunctions || typeof validationFunctions !== "object") {
      return;
    }
    const completeness = {};
    for (const [key, validate] of Object.entries(validationFunctions)) {
      completeness[key] = validate(formData[key]);
    }
    setIsFormComplete(completeness);
  }, [formData, validationFunctions]);

  const handleFormInput = (formName, field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [formName]: { ...prev[formName], [field]: e.target.value },
    }));
  };

  const handleSelect = (formName, field) => (selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      [formName]: { ...prevState[formName], [field]: selectedOption.value },
    }));
  };

  const handleStepChange = (direction) => {
    setCurrentStep((prev) => {
      if (direction === "next" && prev < totalSteps) return prev + 1;
      if (direction === "back" && prev > 1) return prev - 1;
      return prev;
    });
  };

  return {
    formData,
    currentStep,
    isFormComplete,
    setFormData,
    handleFormInput,
    handleStepChange,
    handleSelect,
  };
};

export default useFormHandler;
