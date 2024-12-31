import React, { useEffect, useState } from "react";
import DashboardLayouts from "../layouts/DashboardLayouts";
import {
  IconAlertTriangleFilled,
  IconArrowLeft,
  IconBriefcaseFilled,
  IconGridScan,
  IconMapPin2,
  IconPencil,
  IconTrashFilled,
  IconUserScan,
} from "@tabler/icons-react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import useUpdateData from "../hooks/useUpdateData";
import Toast from "../components/Toast";
import useDeleteData from "../hooks/useDeleteData";

const DepartmentDetails = () => {
  const { departmentId } = useParams();
  const [updatedDepartmentId, setUpdatedDepartmentId] = useState(departmentId);
  const [toast, setToast] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const {
    responseData: departmentData,
    loading: departmentLoading,
    error: departmentError,
    totalPages: departmentPages,
    refetch: departmentRefetch,
  } = useFetch(`/department/${departmentId}/details`);
  const { updateData, loading: updateLoading, error: updateError, data } = useUpdateData();
  const { deleteData, loading: deleteLoading, error: deleteError, data: deletedepartmentData } = useDeleteData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    departmentName: "",
    location: "",
    description: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (departmentData && departmentData.departmentName && departmentData.location) {
      console.log(departmentData);
      setFormData({
        departmentName: departmentData?.departmentName || "Default Department Name",
        location: departmentData?.location || "Not provided",
        description: departmentData?.description || `Description not provided for the ${departmentData.departmentName || "this"} department.`,
      });
    }
  }, [departmentData]);

  // useEffect(() => {
  //   if (data && data.content && data.content.departmentId) {
  //     console.log("Department ID updated:", data.content.departmentId);
  //     setUpdatedDepartmentId(data.content.departmentId);
  //   }
  // }, [data]);

  const handleEditClick = (e) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleCloseToast = () => {
    setToast(false);
  };

  const handleSaveClick = async (event) => {
    event.preventDefault();
    if (!isEditing) return;
    try {
      await updateData(`/department/${updatedDepartmentId}/update`, formData); // Use updatedDepartmentId for the update API call
      setToast(true); // Show toast on successful update
    } catch (err) {
      console.log(err.message);
      setToast(true); // Show error toast
    }
    setIsEditing(false);
  };

  const handleDeleteModal = () => {
    setDeleteModal((prev) => !prev);
  };

  const handleDelete = async () => {
    await deleteData(`/department/${updatedDepartmentId}/delete`);
    setToast(true);
    setTimeout(() => {
      navigate("/dashboard/department", { replace: true });
    }, 500);
  };

  return (
    <div>
      <DashboardLayouts>
        <div className="w-full relative h-full whitespace-nowrap">
          <div className="w-full flex justify-between items-center ">
            <div className="flex w-1/2 items-center gap-6">
              <div className="flex-1">
                <div className="space-y-4">
                  <form onSubmit={handleSaveClick}>
                    {/* Department Name Input */}
                    <div className="flex items-center gap-12">
                      {/* Back Button */}
                      <NavLink
                        to={"/dashboard/department"}
                        className="bg-white rounded-full p-2 text-sm border border-zinc-400 hover:bg-zinc-100 transition-all duration-300 ease-in-out"
                      >
                        <IconArrowLeft />
                      </NavLink>
                      <input
                        className={`text-2xl bg-transparent w-full font-extrabold text-gray-800 outline-none border-b ${
                          isEditing ? "border-zinc-500 focus:border-zinc-500" : "border-zinc-300"
                        } transition-all duration-200 ease-in-out focus:ring-0`}
                        value={formData.departmentName}
                        disabled={!isEditing}
                        name="departmentName"
                        onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                        placeholder="Department Name"
                      />

                      {!isEditing ? (
                        <button
                          type="button" // Change from type="submit" to type="button" when not editing
                          className="bg-transparent text-zinc-800 flex gap-2 items-center p-2 hover:bg-zinc-100 rounded-full transition-all duration-300 ease-in-out"
                          onClick={handleEditClick}
                        >
                          <IconPencil />
                          <p className="text-zinc-800 font-semibold">Edit</p>
                        </button>
                      ) : (
                        <button
                          type="submit" // Keep submit type for when editing
                          className="bg-slate-800 text-white font-bold px-4 py-2 rounded-full hover:bg-slate-700 transition-all duration-300 ease-in-out"
                        >
                          Save
                        </button>
                      )}
                    </div>

                    {/* Department ID and Location */}
                    <div className="flex gap-8 items-center px-24 my-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                        <IconGridScan />
                        <p>{departmentData?.departmentId}</p>
                      </div>

                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                        <IconBriefcaseFilled />
                        <p>{departmentData?.jobRoles?.length} Job Roles</p>
                      </div>

                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                        <IconUserScan />
                        <p>{departmentData?.jobRoles?.length} People</p>
                      </div>

                      <div className="flex items-center gap-2 w-full">
                        <IconMapPin2 />
                        <input
                          className={`text-sm bg-transparent font-semibold text-gray-700 outline-none ${
                            isEditing ? "border-b-2 border-zinc-500 focus:border-zinc-500" : "border-none"
                          } transition-all duration-200 ease-in-out focus:ring-0`}
                          value={formData.location}
                          disabled={!isEditing}
                          name="location"
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="Location"
                        />
                      </div>
                    </div>

                    {/* Description Input */}
                    <div className="flex flex-col gap-2 px-24 mt-2">
                      <label htmlFor="description" className="text-sm text-gray-600 font-semibold">
                        Description
                      </label>
                      <textarea
                        id="description"
                        className={`text-sm w-full bg-transparent font-semibold text-gray-700 outline-none ${
                          isEditing ? "border-b-2 border-zinc-500 focus:border-zinc-500" : "border-none"
                        } transition-all duration-200 ease-in-out focus:ring-0 resize-none`}
                        value={formData.description}
                        disabled={!isEditing}
                        name="description"
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter description..."
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleDeleteModal}
                className="bg-red-500 flex items-center rounded-lg px-3 py-2 gap-3 font-semibold text-white"
              >
                <IconTrashFilled /> Delete Department
              </button>
            </div>
          </div>

          {/* Table for Job Roles */}
          <div className="overflow-hidden rounded-xl border border-zinc-200 mx-12">
            {departmentData?.jobRoles?.length > 0 ? (
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="px-6 py-2 border border-gray-300 bg-gray-200 text-left text-sm font-semibold text-slate-800">#ID</th>
                    <th className="px-6 py-2 border border-gray-300 bg-gray-200 text-left text-sm font-semibold text-slate-800">Department Name</th>
                    <th className="px-6 py-2 border border-gray-300 bg-gray-200 text-left text-sm font-semibold text-slate-800"></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-2 border border-gray-300 bg-white text-center text-slate-500 italic">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    departmentData.jobRoles?.map((jobRole) => (
                      <tr key={jobRole.jobRoleId} className="group">
                        <td className="px-6 py-2 border border-gray-300 bg-white text-slate-800 group-hover:bg-zinc-50 transition-all duration-300 ease-in-out">
                          {jobRole.jobRoleId}
                        </td>
                        <td className="px-6 py-2 border border-gray-300 bg-white text-slate-800 group-hover:bg-zinc-50 transition-all duration-300 ease-in-out">
                          {jobRole.jobRoleTitle}
                        </td>
                        <td className="px-6 py-2 border border-gray-300 bg-white text-slate-800 group-hover:bg-zinc-50 transition-all duration-300 ease-in-out">
                          <NavLink to={`/dashboard/department/${jobRole.departmentId}/details`}>...</NavLink>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500 mt-36">No departments available</p>
            )}
          </div>
        </div>
        {toast ? <Toast text={data?.message || updateError?.message} type={data ? "success" : "error"} onClick={handleCloseToast} /> : null}
        {deleteModal && (
          <div id="deleteModal" className="fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 flex">
            <div className="bg-white p-8 rounded-lg w-1/4 relative">
              <div className="flex flex-col justify-center items-center pt-6">
                <span className="text-6xl text-red-500">
                  <IconAlertTriangleFilled size={64} />
                </span>
                <h1 className="text-3xl font-bold pt-4 pb-6">Are you sure?</h1>
                <h2 className="font-semibold text-gray-600">Are you sure you want to delete this department?</h2>
                <h2 className="font-semibold text-gray-600 pb-6">This action cannot be undone</h2>

                <div className="flex flex-col w-full gap-3">
                  <form id="deleteForm" onSubmit={handleDelete} className="w-full">
                    <button
                      type="submit"
                      className="bg-red-500 w-full hover:bg-red-600 transition-all duration-300 ease-in-out text-white rounded-xl p-3"
                    >
                      Delete
                    </button>
                  </form>
                  <button
                    className="bg-white hover:bg-gray-100 transition-all duration-300 ease-in-out text-gray-600 border border-gray-400 rounded-xl p-3"
                    type="button"
                    onClick={handleDeleteModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayouts>
    </div>
  );
};

export default DepartmentDetails;
