import React from "react";
import Select from "react-select";
import CurrencyInput from "../components/CurrenyInput";
import { formatPhoneNumber } from "../utils/formatPhoneNumber";

const FormInput = ({
  label,
  height,
  value,
  onChange,
  options,
  placeholder,
  formatOptionLabel,
  filterOption,
  type = "text",
  readOnly = false,
  errors,
  disabled,
  border = "border",
  getOptionLabel,
  getOptionValue,
}) => {
  return (
    <div>
      <label htmlFor={label} className="text-sm block px-2 mb-2">
        {label}
      </label>
      {type === "select" ? (
        <div
          className={`flex items-center whitespace-nowrap gap-3 rounded-xl border ${
            errors ? "border-red-500" : "border-gray-300"
          } focus-within:border-slate-700 px-2 py-1 mt-1 bg-white`}
        >
          <Select
            options={options}
            value={value}
            formatOptionLabel={formatOptionLabel}
            onChange={onChange}
            placeholder={placeholder || `Select ${label}...`}
            className="w-full"
            isDisabled={disabled}
            filterOption={filterOption}
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
            isSearchable={true}
            styles={{
              control: (base, state) => ({
                ...base,
                border: "none",
                boxShadow: "none",
                outline: "none",
              }),
              singleValue: (base, state) => ({
                ...base,
                color: state.isDisabled ? "rgb(0, 0, 0)" : "black",
              }),
              placeholder: (base, state) => ({
                ...base,
                color: state.isDisabled ? "rgb(0, 0, 0)" : "black",
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: "1px solid rgb(113, 113, 122)",
              }),
              clearIndicator: (base) => ({
                ...base,
                color: "rgb(225, 225, 225)",
              }),
              indicatorSeparator: (base) => ({
                ...base,
                backgroundColor: "none",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "white",
                zIndex: 999,
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected ? "rgb(225, 225, 225)" : "transparent",
                color: state.isSelected ? "black" : "inherit",
                ":active": {
                  backgroundColor: "rgb(186, 186, 186)",
                },
                ":hover": {
                  backgroundColor: "rgb(226, 226, 226)",
                },
              }),
            }}
          />
        </div>
      ) : type === "textarea" ? (
        <textarea
          id={label}
          value={value}
          onChange={onChange}
          className={`w-full h-${height || "44"} px-3 py-2.5 rounded-xl border ${
            errors ? "border-red-500" : "border-gray-300"
          } focus:border-slate-700 outline-none`}
          placeholder={placeholder || `Enter your ${label}`}
          disabled={disabled}
          readOnly={readOnly}
        />
      ) : type === "currency" ? (
        <CurrencyInput
          type={type}
          id={label}
          value={value}
          onChange={onChange}
          prefix={"Rp."}
          border={border}
          intlConfig={{ locale: "id-ID", currency: "IDR", decimalSeparator: "," }}
          placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
          disabled={disabled}
          readOnly={readOnly}
        />
      ) : type === "switch" ? (
        <div className="px-2">
          <div
            onClick={() => onChange(!value)}
            className={`w-10 h-5 rounded-full cursor-pointer transition-colors ${value ? "bg-emerald-700" : "bg-gray-300"} relative`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`}
            ></div>
          </div>
        </div>
      ) : type === "phone" ? (
        <input
          type={"text"}
          id={label}
          value={value}
          onChange={onChange}
          className={`w-full px-3 py-2.5 rounded-xl ${border} ${
            errors ? "border-red-500" : "border-gray-300"
          } disabled:text-zinc-500 focus:border-slate-700 outline-none`}
          placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
          disabled={disabled}
          readOnly={readOnly}
          onInput={(e) => formatPhoneNumber(e)}
        />
      ) : (
        <input
          type={type}
          id={label}
          value={value}
          onChange={onChange}
          className={`w-full px-3 py-2.5 rounded-xl ${border} ${
            errors ? "border-red-500" : "border-gray-300"
          } disabled:text-zinc-500 focus:border-slate-700 outline-none`}
          placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
          disabled={disabled}
          readOnly={readOnly}
        />
      )}
      {errors && <p className="text-red-500 text-xs mt-2 px-3">{errors}</p>}
    </div>
  );
};

export default FormInput;
