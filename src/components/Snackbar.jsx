import React from "react";

const Snackbar = ({ text, show }) => {
  return (
    <div
      className={`fixed ${
        show ? "animate-fade-in" : "animate-fade-out"
      } text-xs bottom-5 w-[90%] text-white translate-x-1/2 right-1/2 bg-slate-800 px-3 py-2 rounded-full`}
    >
      {text}
    </div>
  );
};

export default Snackbar;
