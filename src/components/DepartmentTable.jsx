import React, { useState } from "react";

const DepartmentTable = ({ data, loading }) => {
  return (
    <table className="table-auto w-full border-collapse border rounded-xl overflow-hidden border-gray-300">
      <thead>
        <tr>
          <th className="px-6 py-2 border border-gray-300 bg-gray-200 text-left text-sm font-semibold text-slate-800">#ID</th>
          <th className="px-6 py-2 border border-gray-300 bg-gray-200 text-left text-sm font-semibold text-slate-800">Department Name</th>
          <th className="px-6 py-2 border border-gray-300 bg-gray-200 text-left text-sm font-semibold text-slate-800">Description</th>
          <th className="px-6 py-2 border border-gray-300 bg-gray-200 text-left text-sm font-semibold text-slate-800">Actions</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan="5" className="px-6 py-2 border border-gray-300 bg-white text-center text-slate-500 italic">
              Loading...
            </td>
          </tr>
        ) : data.length > 0 ? (
          data.map((department) => (
            <tr key={department.departmentId} className="group">
              <td className="px-6 py-2 border border-gray-300 bg-white text-slate-800 group-hover:bg-zinc-50 transition-all duration-300 ease-in-out">
                {department.departmentId}
              </td>
              <td className="px-6 py-2 border border-gray-300 bg-white text-slate-800 group-hover:bg-zinc-50 transition-all duration-300 ease-in-out">
                {department.departmentName}
              </td>
              <td className="px-6 py-2 border border-gray-300 bg-white text-slate-800 group-hover:bg-zinc-50 transition-all duration-300 ease-in-out">
                {department.description === "Not Provided"
                  ? `Description not provided for the ${department.departmentName} department.`
                  : department.description}
              </td>
              <td className="px-6 py-2 border border-gray-300 bg-white text-slate-800 group-hover:bg-zinc-50 transition-all duration-300 ease-in-out">
                <div className="flex items-center gap-3">
                  <button type="button" className="text-red-500">
                    <IconTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <span>No Data</span>
        )}
      </tbody>
    </table>
  );
};

export default DepartmentTable;
