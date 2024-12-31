import { IconCheck, IconPencil, IconX } from "@tabler/icons-react";

const Card = ({ title, icon, children, onCancel, toggleEdit, isEditing, isEditable = true }) => (
  <div className="bg-white rounded-lg w-full h-full border border-zinc-300 px-8 py-6 shadow">
    <div className="flex w-full justify-between">
      <div className="flex gap-3 items-center text-zinc-700">
        {icon}
        <h1 className="text-slate-800 text-lg font-bold">{title}</h1>
      </div>
      <div className="flex gap-2 items-center">
        {isEditable && (
          <button
            onClick={toggleEdit}
            type="button"
            className={`${
              isEditing ? "bg-slate-800 text-white hover:bg-slate-700 " : "bg-white text-zinc-800 hover:bg-zinc-100 border border-zinc-400"
            } px-2 text-xs flex items-center gap-1 py-2 rounded-xl ease-in-out transition-all duration-300`}
          >
            {isEditing ? <IconCheck size={18} /> : <IconPencil size={18} />}
            <span className=" font-bold text-xs">{isEditing ? "Save" : "Edit"}</span>
          </button>
        )}
        {isEditing && (
          <button
            onClick={onCancel}
            type="button"
            className=" bg-white px-2 text-xs flex items-center gap-1 py-2 rounded-xl border border-red-400 hover:bg-red-50 ease-in-out transition-all duration-300"
          >
            <IconX className={"text-red-500"} size={14} />
            <span className="text-red-500 font-bold text-xs">Cancel</span>
          </button>
        )}
      </div>
    </div>
    {children}
  </div>
);

export default Card;
