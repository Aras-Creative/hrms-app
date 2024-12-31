import { IconAlertTriangle, IconCircleCheckFilled, IconCircleXFilled, IconX } from "@tabler/icons-react";
import React from "react";

const Toast = ({ text, type, onClick }) => {
  return (
    <div>
      <div className="absolute bottom-5 right-5 bg-slate-800 shadow-lg rounded-xl z-30 " id="notification">
        <div className="flex gap-3 w-full items-center p-4">
          <div
            className={`rounded-full p-1 bg-white border-2 border-white ${
              type === "warn" ? "text-yellow-500" : type === "error" ? "text-red-500" : "text-green-500"
            } text-xl`}
          >
            {type === "warn" ? <IconAlertTriangle /> : type === "error" ? <IconCircleXFilled /> : <IconCircleCheckFilled />}
          </div>
          <div className="flex justify-between items-center gap-6">
            <h1 className="font-semibold text-slate-100">{text}</h1>
            <button onClick={onClick} type="button">
              <IconX className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
