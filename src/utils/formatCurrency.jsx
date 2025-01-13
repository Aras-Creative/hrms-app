export const formatCurrency = (amount, prefix = "Rp.") => {
  if (!amount) return `${prefix} 0,00`;
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) {
    console.error("Invalid amount provided to formatCurrency:", amount);
    return `${prefix} 0,00`;
  }
  const formattedValue = numericAmount.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${prefix} ${formattedValue}`;
};
