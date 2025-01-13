import React from "react";

const CurrencyInput = ({ label, value, onChange, prefix, placeholder, intlConfig, border, type = "text", errors, disabled }) => {
  const formatCurrency = (amount) => {
    if (!amount) return null;
    const pref = prefix || intlConfig?.currency || "Rp. ";
    const decimalSeparator = intlConfig?.decimalSeparator || ".";
    const formattedValue = amount
      .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      .replace(/[^0-9]/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, decimalSeparator);

    return `${pref} ${formattedValue}`;
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    const numericValue = inputValue
      .replace(new RegExp(`\\${prefix || intlConfig.currency}`, "g"), "")
      .replace(new RegExp(`\\${intlConfig?.decimalSeparator}`, "g"), "");
    onChange(numericValue);
  };

  return (
    <div>
      <input
        type={type}
        id={label}
        value={formatCurrency(value)}
        onChange={handleInputChange}
        className={`w-full px-3 py-2.5 rounded-xl ${border} ${errors ? "border-red-500" : "border-gray-300"} focus:border-slate-700 outline-none`}
        placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
        disabled={disabled}
      />
    </div>
  );
};

export default CurrencyInput;
