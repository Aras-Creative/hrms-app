import React, { useState } from "react";
import DashboardLayouts from "../../layouts/DashboardLayouts";
import { IconFolderFilled, IconHomeFilled, IconTrash } from "@tabler/icons-react";
import useFetch from "../../hooks/useFetch";
import { NavLink } from "react-router-dom";

const Documents = () => {
  const { responseData: documents, loading, error, refetch } = useFetch("/document");
  const { updateData: deleteFile } = useFetch(`/document/`, { method: "DELETE" });

  const [deleting, setDeleting] = useState(null);

  const handleDeleteDirectory = async (path) => {
    setDeleting(path); // Menandakan direktori mana yang sedang dihapus
    const { success, error } = await deleteFile({ path });

    if (success) {
      refetch(); // Refetch data setelah berhasil menghapus
    } else {
      console.log(error);
    }

    setDeleting(null); // Reset loading state setelah selesai
  };

  return (
    <DashboardLayouts>
      <div className="w-full px-4 py-3 pb-6 border-b border-zinc-400">
        <div className="flex flex-col gap-1 items-start">
          <h1 className="text-3xl font-bold text-zinc-800">Documents</h1>
          <p className="text-sm text-zinc-600">Easily browse, upload, and manage all employee-related documents in one place.</p>
        </div>
      </div>

      <div className="w-full px-6 mt-12">
        <NavLink
          to={"/dashboard/document"}
          className={({ isActive }) => `flex gap-2 items-center ${isActive ? "text-emerald-700" : "text-zinc-700"}`}
        >
          <IconHomeFilled /> Documents
        </NavLink>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-6 mt-6">
        {documents?.directories?.map((directory) => (
          <div key={directory.path} className="relative bg-white shadow-md rounded-lg p-6 transition-all transform hover:scale-105 hover:shadow-xl">
            <NavLink to={directory.path} className="flex flex-col items-center gap-3">
              <div className="flex justify-center items-center bg-zinc-100 p-4 rounded-full mb-4">
                <IconFolderFilled className="text-emerald-700" size={80} />
              </div>
              <h1 className="text-xl font-semibold text-zinc-800 truncate">{directory.name}</h1>
              <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
                <p className="font-medium">{directory.totalFiles} Files</p>
                <div className="w-1 h-1 rounded-full bg-zinc-400 mt-0.5"></div>
                <p>{directory.totalSize} MB</p>
              </div>
            </NavLink>

            {/* Delete button */}
            <div className="absolute top-4 right-4">
              <button
                type="button"
                onClick={() => handleDeleteDirectory(`storage/document/${directory.path}`)}
                disabled={deleting === directory.path}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200"
              >
                {deleting === directory.path ? <span>Deleting...</span> : <IconTrash className="w-5 h-5" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayouts>
  );
};

export default Documents;
