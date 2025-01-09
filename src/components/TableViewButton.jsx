import React from "react";
import { IconLayoutGridRemove, IconListDetails } from "@tabler/icons-react";

const TableViewButtons = ({ tableView, handleTableViewChange }) => (
  <div className="items-center flex gap-2 text-zinc-700">
    <button
      type="button"
      onClick={() => handleTableViewChange("grid")}
      className={`${
        tableView === "grid" ? "bg-zinc-200" : "bg-white"
      } p-1 rounded border border-zinc-300 hover:bg-zinc-200 transition-all duration-300 ease-in-out`}
    >
      <IconLayoutGridRemove size={25} />
    </button>
    <button
      type="button"
      onClick={() => handleTableViewChange("list")}
      className={`${
        tableView === "list" ? "bg-zinc-200" : "bg-white"
      } p-1 rounded border border-zinc-300 hover:bg-zinc-200 transition-all duration-300 ease-in-out`}
    >
      <IconListDetails size={25} />
    </button>
  </div>
);

export default TableViewButtons;
