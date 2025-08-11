import React from "react";

const Layouts = ({ children }) => {
  return <div className="w-full max-w-screen-md mx-auto">{children}</div>;
};

const Header = ({ children, bgColor = "bg-slate-900", textColor = "text-white", style }) => {
  return (
    <div className={`fixed top-0 left-0 right-0 ${bgColor} ${textColor}`}>
      <div className="w-full max-w-screen-md mx-auto px-4">{children}</div>
    </div>
  );
};

Layouts.Header = Header;

export default Layouts;
