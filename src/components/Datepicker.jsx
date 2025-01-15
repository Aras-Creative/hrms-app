import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import React, { useState } from "react";
import DatePicker from "tailwind-datepicker-react";

const Datepicker = ({ onChange, defaultDate, isDisabled, label, style = "py-0.5 mt-3", border = "border border-zinc-300" }) => {
  const [show, setShow] = useState(false);

  const handleClose = (state) => {
    setShow(state);
  };

  const DatepickerOptions = {
    title: label,
    autoHide: true,
    todayBtn: false,
    clearBtn: true,
    clearBtnText: "Clear",
    maxDate: new Date("2030-01-01"),
    minDate: new Date("1950-01-01"),
    theme: {
      background: "bg-white",
      clearBtn: `bg-transparent border border-zinc-300 text-zinc-800 hover:bg-zinc-50 transition-all duration-300 ease-in-out ${
        isDisabled ? "cursor-not-allowed opacity-50" : ""
      }`,
      icons: `bg-transparent text-zinc-800 hover:bg-zinc-100 hover:text-zinc-800 transition-all duration-300 ease-in-out ${
        isDisabled ? "cursor-not-allowed opacity-50" : ""
      }`,
      text: `hover:bg-indigo-100 transition-all duration-300 ease-in-out ${isDisabled ? "text-zinc-400" : ""}`,
      input: `bg-white border-none outline-none ring-none text-zinc-800 transition-all duration-300 ease-in-out ${
        isDisabled ? "cursor-default text-zinc-800" : ""
      }`,
      inputIcon: `text-zinc-600 ${isDisabled ? "cursor-default" : ""}`,
      selected: "bg-indigo-500 text-slate-100 hover:bg-indigo-400 transition-all duration-300 ease-in-out",
    },
    icons: {
      prev: () => <IconArrowLeft />,
      next: () => <IconArrowRight />,
    },
    datepickerClassNames: "mt-5",
    language: "en-GB",
    disabledDates: [],
    weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    inputNameProp: "date",
    inputIdProp: "date",
    inputPlaceholderProp: "Select Date",
    inputDateFormatProp: {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  };

  return (
    <div className={`bg-white rounded-xl ${border}  ${style} w-full `}>
      <DatePicker
        value={new Date(defaultDate || "1950-01-01")}
        show={show && !isDisabled}
        setShow={handleClose}
        onChange={isDisabled ? undefined : onChange}
        options={DatepickerOptions}
      />
    </div>
  );
};

export default Datepicker;
