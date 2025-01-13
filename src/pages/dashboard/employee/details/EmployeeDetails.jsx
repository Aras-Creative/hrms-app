import React, { useEffect, useState } from "react";
import DashboardLayouts from "../../../../layouts/DashboardLayouts";
import { NavLink, useParams } from "react-router-dom";
import {
  IconAlertCircleFilled,
  IconArrowLeft,
  IconCheck,
  IconCircleOff,
  IconContract,
  IconDotsVertical,
  IconFile,
  IconGridScan,
  IconMail,
  IconStopwatch,
  IconUserCircle,
} from "@tabler/icons-react";
import useFetch from "../../../../hooks/useFetch";
import PersonalInformation from "./PersonalInformation";
import ContractDetails from "./ContractDetails";
import TimeManagement from "./TimeManagement";
import { STORAGE_URL } from "../../../../config";
import { Loading } from "../../../../components/Preloaders";
import { InternalServerError } from "../../../../components/Errors";
import { toTitleCase } from "../../../../utils/toTitleCase";

const TABS = [
  { name: "personalInformation", label: "Informasi Personal", icon: IconUserCircle, component: PersonalInformation },
  { name: "contract", label: "Informasi Kontrak", icon: IconContract, component: ContractDetails },
  { name: "timeManagement", label: "Manajemen Waktu", icon: IconStopwatch, component: TimeManagement },
  { name: "documents", label: "Documents", icon: IconFile },
];

const EmployeeDetails = () => {
  const { employeeId } = useParams();
  const [activeTab, setActiveTab] = useState("personalInformation");
  const [actions, setActions] = useState(false);
  const [toast, setToast] = useState({ type: "", text: "" });

  // Fetch employee data
  const {
    responseData: employeeData,
    loading: employeeDataLoading,
    refetch: employeeDataRefetch,
    error: employeeDataError,
  } = useFetch(`/employee/${employeeId}/details`);

  const { updateData: updateStatus } = useFetch(`/employee/${employeeId}/status`, { method: "PUT" });

  const profileImage = employeeData?.profilePicture && `${STORAGE_URL}/document/${employeeId}/${employeeData.profilePicture.path}`;
  const renderTabContent = () => {
    const activeTabData = TABS.find((tab) => tab.name === activeTab);
    if (activeTabData?.component) {
      const TabComponent = activeTabData.component;
      return <TabComponent data={employeeData} refetch={employeeDataRefetch} />;
    }
    return null;
  };

  const handleUpdateStatus = async (status) => {
    const { success, error } = await updateStatus({ status });
    if (success) {
      setActions(false);
      employeeDataRefetch();
      setToast({ type: "success", text: "Status karyawan berhasil di update" });
    } else {
      setToast({ type: "error", text: error.message });
    }
  };

  useEffect(() => {
    setTimeout(() => setToast({ type: "", message: "" }), 4000);
  }, [toast.message]);

  return (
    <DashboardLayouts>
      <header className="w-full flex justify-between items-center">
        <div className="flex items-center gap-6">
          <NavLink to="/dashboard/employee" className="bg-white rounded-full p-1 text-sm border border-zinc-400 hover:bg-zinc-100 transition-all">
            <IconArrowLeft />
          </NavLink>
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center font-bold text-slate-800 text-sm">
            {profileImage ? (
              <img src={profileImage} alt="Profile Image" className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center font-bold text-slate-800 text-sm">
                {employeeData?.fullName?.[0]?.toUpperCase() || "?"}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            {employeeDataLoading ? (
              <div className="h-2 bg-zinc-200 rounded w-56 animate-pulse" />
            ) : (
              <h1 className="font-bold text-slate-800 text-lg">{employeeData?.fullName}</h1>
            )}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <IconGridScan size={20} />
                <h1 className="text-slate-800 text-xs font-semibold">{employeeData?.employeeId}</h1>
              </div>
              <span
                className={`${
                  employeeData?.status === "aktif"
                    ? "bg-green-100 text-green-600"
                    : employeeData?.status === "nonakitf"
                    ? "bg-red-100 text-red-500 "
                    : employeeData?.status === "peringatan"
                    ? "bg-yellow-100 text-yellow-500 "
                    : "bg-zinc-300 text-zinc-600"
                } text-xs gap-2  px-2 py-0.5 inline-flex items-center rounded-xl`}
              >
                <span
                  className={`${
                    employeeData?.status === "aktif"
                      ? "bg-green-700"
                      : employeeData?.status === "nonakitf"
                      ? "bg-red-600"
                      : employeeData?.status === "peringatan"
                      ? "bg-yellow-500"
                      : "bg-zinc-700"
                  } w-1.5 h-1.5 rounded-full`}
                />{" "}
                {toTitleCase(employeeData?.status)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <button
              type="button"
              onClick={() => setActions((prev) => !prev)}
              className="bg-white rounded-lg p-2 border border-zinc-400 hover:bg-zinc-100 transition-all"
            >
              <IconDotsVertical />
            </button>

            {actions && (
              <div className="bg-white absolute top-12 right-0 whitespace-nowrap rounded-xl shadow-md px-3 py-2 border border-zinc-300">
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus("aktif")}
                    className="bg-white flex items-center gap-2 hover:bg-zinc-100 transition-all py-2 px-3 rounded-b-lg"
                  >
                    <IconCheck className="text-emerald-700" />
                    <span className="text-sm text-slate-800">Aktifkan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus("peringatan")}
                    className="bg-white flex items-center gap-2 hover:bg-zinc-100 transition-all py-2 px-3 rounded-t-lg"
                  >
                    <IconAlertCircleFilled className="text-yellow-500" />
                    <span className="text-sm text-slate-800">Berikan Peringatan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus("nonaktif")}
                    className="bg-white flex items-center gap-2 hover:bg-zinc-100 transition-all py-2 px-3 rounded-b-lg"
                  >
                    <IconCircleOff className="text-red-500" />
                    <span className="text-sm text-slate-800">Nonaktifkan</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          <NavLink
            to={`mailto:${employeeData?.email}`}
            type="button"
            className="bg-green-700 flex gap-2 px-3 py-2 rounded-lg items-center text-white hover:bg-green-800 transition-all"
          >
            <IconMail /> Send Email
          </NavLink>
        </div>
      </header>

      <nav className="w-full mt-8 flex items-center gap-10 border-b border-zinc-300">
        {TABS.map(({ name, label, icon: Icon }) => (
          <button
            key={name}
            type="button"
            className={`${
              activeTab === name ? "text-zinc-800 border-b-2" : "text-zinc-500"
            } flex text-sm hover:text-slate-800 py-3 items-center gap-1 border-zinc-700`}
            onClick={() => setActiveTab(name)}
          >
            <Icon size={22} /> {label}
          </button>
        ))}
      </nav>

      <main className="py-8 flex items-start gap-4 w-full h-full">
        {employeeDataLoading ? <Loading /> : employeeDataError?.status === 500 ? <InternalServerError /> : renderTabContent()}
      </main>
    </DashboardLayouts>
  );
};

export default EmployeeDetails;
