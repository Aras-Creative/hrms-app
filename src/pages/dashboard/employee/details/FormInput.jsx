import Select from "react-select";
import CurrencyInput from "../../../../components/CurrenyInput";
import { formatPhoneNumber } from "../../../../utils/formatPhoneNumber";

const FormInput = ({ type = "text", label, value, onChange, options, erorr, onEdit = true }) => {
  return (
    <>
      {type === "select" ? (
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor={label} className="text-zinc-500 text-sm">
            {label}
          </label>
          <Select
            options={options}
            value={value}
            onChange={onChange}
            className="w-full"
            isDisabled={!onEdit}
            styles={{
              control: (base, state) => ({
                ...base,
                border: "none",
                borderBottom: state.isDisabled ? "1px solid rgb(212, 212, 216)" : "1px solid rgb(113, 113, 122)",
                boxShadow: "none",
                outline: "none",
                color: state.isDisabled ? "#ddd" : "white",
                backgroundColor: state.isDisabled ?? "white",
                "&:hover": {
                  borderBottom: "1px solid rgb(113, 113, 122)",
                },
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
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected ? "rgb(225, 225, 225)" : state.isFocused ? "rgb(209, 209, 209)" : "transparent",
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
          {erorr && <p className="text-xs text-red-500">{erorr}</p>}
        </div>
      ) : type === "currency" ? (
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor={label} className="text-zinc-500 text-sm">
            {label}
          </label>
          <CurrencyInput
            type={type}
            id={label}
            value={value}
            onChange={onChange}
            prefix={"Rp."}
            border={"border-b"}
            intlConfig={{ locale: "id-ID", currency: "IDR", decimalSeparator: "," }}
            placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
            disabled={disabled}
            errors={erorr}
          />
        </div>
      ) : type === "phone" ? (
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor={label} className="text-zinc-500 text-sm">
            {label}
          </label>
          <input
            type={"number"}
            name={label}
            value={value}
            onChange={onChange}
            placeholder={`Input employee ${label.toLowerCase()}`}
            className={`border-b ${
              onEdit ? "border-zinc-500" : erorr ? "border-red-500" : "border-zinc-300"
            }  outline-none text-sm w-full focus:border-zinc-500 py-2 bg-white`}
            required
            disabled={!onEdit}
          />
          {erorr && <p className="text-xs text-red-500">{erorr}</p>}
        </div>
      ) : (
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor={label} className="text-zinc-500 text-sm">
            {label}
          </label>
          <input
            type={type}
            name={label}
            value={value}
            onChange={onChange}
            placeholder={`Input employee ${label.toLowerCase()}`}
            className={`border-b ${
              onEdit ? "border-zinc-500" : erorr ? "border-red-500" : "border-zinc-300"
            }  outline-none text-sm w-full focus:border-zinc-500 py-2 bg-white`}
            required
            disabled={!onEdit}
          />
          {erorr && <p className="text-xs text-red-500">{erorr}</p>}
        </div>
      )}
    </>
  );
};

export default FormInput;
