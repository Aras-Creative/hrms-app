import React, { useState, useCallback } from "react";
import DashboardLayouts from "../../../layouts/DashboardLayouts";
import { NavLink, useParams } from "react-router-dom";
import {
  IconChevronRight,
  IconFile,
  IconFileTypeDocx,
  IconFileTypeJpg,
  IconFileTypePdf,
  IconFileTypeXls,
  IconHomeFilled,
  IconTrash,
} from "@tabler/icons-react";
import useFetch from "../../../hooks/useFetch";
import { BASE_API_URL } from "../../../config";
import { InternalServerError } from "../../../components/Errors";
import { Loading } from "../../../components/Preloaders";

const Files = () => {
  const { path } = useParams();
  const [deleting, setDeleting] = useState(null);

  const { responseData: files, loading, error, refetch } = useFetch(`/document/${path}`);
  const { updateData: deleteFile, loading: deleteLoading, error: deleteError } = useFetch(`/document/`, { method: "DELETE" });

  const handleDeleteFile = useCallback(
    async (filePath) => {
      setDeleting(filePath); // Track file being deleted

      try {
        const { success, error } = await deleteFile({ path: filePath });
        if (success) {
          refetch(); // Refetch data after deletion
        } else {
          console.error(error); // Log error
        }
      } catch (err) {
        console.error("Deletion failed:", err); // Handle deletion failure
      } finally {
        setDeleting(null); // Reset deleting state
      }
    },
    [deleteFile, refetch]
  );

  const getFileIcon = useCallback((type) => {
    switch (type) {
      case "png":
      case "jpg":
      case "jpeg":
        return <IconFileTypeJpg size={100} className="text-emerald-600" />;
      case "docx":
        return <IconFileTypeDocx size={100} className="text-emerald-700" />;
      case "pdf":
        return <IconFileTypePdf size={100} className="text-emerald-700" />;
      case "xlsx":
        return <IconFileTypeXls size={100} className="text-emerald-700" />;
      default:
        return <IconFile size={100} className="text-emerald-700" />;
    }
  }, []);

  return (
    <DashboardLayouts>
      <div className="w-full px-4 py-3 pb-6 border-b border-zinc-400">
        <div className="flex flex-col gap-1 items-start">
          <h1 className="text-3xl font-bold text-zinc-800">Documents</h1>
          <p className="text-sm text-zinc-600">Easily browse, upload, and manage all employee-related documents in one place.</p>
        </div>
      </div>

      <div className="w-full px-6 mt-12 flex gap-2 text-emerald-700 items-center">
        <NavLink
          end
          to="/dashboard/document"
          className={({ isActive }) => `flex gap-2 items-center ${isActive ? "text-emerald-700" : "text-zinc-700"}`}
        >
          <IconHomeFilled /> Documents
        </NavLink>
        <IconChevronRight /> {path}
      </div>

      {loading ? (
        <div className="text-center text-emerald-700">
          <Loading />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">
          <InternalServerError />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-6 w-full gap-6 mt-6">
          {files?.files?.map((file) => (
            <div
              key={file.path}
              className="relative bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              <NavLink target="_blank" to={`${BASE_API_URL}${file.path}`} className="flex flex-col items-start gap-3 p-4">
                <div className="flex justify-center items-center mb-4">{getFileIcon(file.type)}</div>
                <h1 className="text-md font-semibold text-gray-800 w-3/4 overflow-hidden text-ellipsis whitespace-nowrap">{file.name}</h1>
              </NavLink>

              {/* Delete button */}
              <div className="absolute top-3 right-3">
                <button
                  type="button"
                  onClick={() => handleDeleteFile(file.path)}
                  disabled={deleting === file.path || deleteLoading}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                >
                  {deleting === file.path || deleteLoading ? <span>Deleting...</span> : <IconTrash className="w-5 h-5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayouts>
  );
};

export default Files;
