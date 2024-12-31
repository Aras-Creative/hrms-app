import { IconArrowLeft } from "@tabler/icons-react";
import React from "react";
import { NavLink } from "react-router-dom";
const Layouts = ({ children, title, backUrl }) => {
  return (
    <div className="max-w-screen-2xl w-full relative bg-white">
      <div className="w-full flex items-center gap-4 bg-white fixed top-0 right-0 left-0 px-3 py-4 z-10">
        <NavLink to={backUrl} className={"text-slate-800"}>
          <IconArrowLeft />
        </NavLink>
        <h1 className="text-lg font-bold text-slate-800">{title}</h1>
      </div>
      {children}
    </div>
  );
};
export default Layouts;
