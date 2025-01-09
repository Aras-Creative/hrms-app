import React from "react";

const SummaryCard = ({ title, icon, items, width }) => {
  return (
    <div className={`${width} bg-white p-4 rounded-lg border-zinc-200 border whitespace-nowrap`}>
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <span className="text-blue-500">{icon}</span>
          <h1 className="text-slate-800 font-semibold">{title}</h1>
        </div>
        <button>
          <i className="fa-solid fa-ellipsis"></i>
        </button>
      </div>
      <div className="mt-8 flex justify-between w-full items-center">
        {items.map((item, index) => (
          <div key={index} className={`w-1/3 ${index !== 0 ? "border-l pl-4" : ""} border-slate-300 pr-4 text-start flex flex-col`}>
            <h1 className="text-zinc-400 font-semibold text-xs">{item.label}</h1>
            <h1 className="text-slate-800 text-2xl font-bold">{item.value}</h1>
            <div className="text-start">
              <span className={`text-xs font-semibold ${item.change > 0 ? "text-blue-500" : "text-red-500"}`}>
                {item.change > 0 ? `+${item.change}` : item.change}
              </span>
              <span className="text-zinc-400 text-xs font-semibold"> vs kemarin</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryCard;
