import React from "react";

const Layouts = ({ children }) => {
  return <div className="max-w-screen-2xl w-full">{children}</div>;
};

const Header = ({ children, bgColor = "bg-slate-800", textColor = "text-white", style }) => {
  return <div className={`fixed top-0 right-0 left-0 ${bgColor} ${textColor}`}>{children}</div>;
};

Layouts.Header = Header;

export default Layouts;
