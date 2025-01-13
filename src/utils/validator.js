export const validatePersonalData = (data) => Object.values(data).every((value) => value.trim() !== "");

export const validateContractDetails = (data) =>
  Object.values(data).every((value) => {
    if (Array.isArray(value)) {
      return value.every((item) => item.title !== "" && item.title !== null);
    }
    return value.trim() !== "";
  });

export const validateBenefits = (data) => {
  const { assets, adjustment } = data;
  return (
    assets.every((item) => item.assetName !== "" && item.assetName !== null) && adjustment.every((item) => item.amount !== "" && item.amount !== null)
  );
};
