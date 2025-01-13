import React from "react";
import NoData from "../assets/error/no-data.webp";

const Table = ({ columns, data }) => {
  return (
    <div className="table-container">
      <div className="rounded-lg w-full overflow-hidden">
        {data.length > 0 ? (
          <table className="table-auto w-full border">
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index} className="text-slate-800 text-sm font-semibold px-6 py-2 border-zinc-300 border-b text-start bg-gray-200">
                    <div className="flex items-center gap-1 text-start whitespace-nowrap">
                      {col.icon} {col.label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="group">
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="bg-white font-semibold text-slate-800 group-hover:bg-gray-100 transition-all text-sm duration-300 ease-in-out px-6 py-2 border-b border-gray-200 whitespace-nowrap"
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex mt-48 items-center justify-center">
            <img src={NoData} alt="No Data" className="w-96 h-auto" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
