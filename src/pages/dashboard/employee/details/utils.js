export const calculateAge = (birthDate) => {
  if (!birthDate) return "";
  const givenDate = new Date(birthDate);
  const currentDate = new Date();
  const differenceInMilliseconds = currentDate - givenDate;
  return Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));
};

export const getInitialData = (formName) => {
  const initialDataMap = {
    personalInfo: { name: "", dob: "", gender: "" },
    addressInfo: { street: "", city: "", state: "" },
    contactInfo: { phone: "", email: "" },
    employementData: { company: "", position: "" },
  };
  return initialDataMap[formName] || {};
};

export const calculateDaysLeft = (end) => {
  const currentDate = new Date();
  const endDate = new Date(end);

  const timeDifference = endDate - currentDate;
  const daysLeft = timeDifference / (1000 * 3600 * 24);

  return Math.max(0, Math.floor(daysLeft));
};

export const calculateProgress = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const currentDate = new Date();

  const totalDuration = (endDate - startDate) / (1000 * 3600 * 24);
  const elapsedDays = (currentDate - startDate) / (1000 * 3600 * 24);
  const progressPercentage = (elapsedDays / totalDuration) * 100;

  return Math.min(progressPercentage, 100);
};
