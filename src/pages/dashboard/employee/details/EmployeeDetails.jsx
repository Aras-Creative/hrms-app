import React, { useState } from "react";
import DashboardLayouts from "../../../../layouts/DashboardLayouts";
import { NavLink, useParams } from "react-router-dom";
import {
  IconArrowLeft,
  IconContract,
  IconDotsVertical,
  IconFile,
  IconGridScan,
  IconMail,
  IconReceipt2,
  IconStopwatch,
  IconUserCircle,
} from "@tabler/icons-react";
import useFetch from "../../../../hooks/useFetch";
import PersonalInformation from "./PersonalInformation";
import ContractDetails from "./ContractDetails";
import TimeManagement from "./TimeManagement";

const TABS = [
  { name: "personalInformation", label: "Personal Information", icon: IconUserCircle, component: PersonalInformation },
  { name: "contract", label: "Contract", icon: IconContract, component: ContractDetails },
  { name: "timeManagement", label: "Time Management", icon: IconStopwatch, component: TimeManagement },
  { name: "documents", label: "Documents", icon: IconFile },
];

const EmployeeDetails = () => {
  const { employeeId } = useParams();
  const [activeTab, setActiveTab] = useState("personalInformation");

  const {
    responseData: employeeData,
    loading: employeeDataLoading,
    refetch: employeeDataRefetch,
    error: employeeDataError,
  } = useFetch(`/employee/${employeeId}/details`);

  const profileImage =
    employeeData?.document?.[1]?.documentName &&
    `http://localhost:3000/storage/document/${employeeData?.employeeId}/${employeeData?.document[0]?.documentName}`;

  const renderTabContent = () => {
    const activeTabData = TABS.find((tab) => tab.name === activeTab);
    if (activeTabData?.component) {
      const TabComponent = activeTabData.component;
      return <TabComponent data={employeeData} refetch={employeeDataRefetch} />;
    }
    return null;
  };

  return (
    <DashboardLayouts>
      <header className="w-full flex justify-between items-center">
        <div className="flex items-center gap-6">
          <NavLink to="/dashboard/employee" className="bg-white rounded-full p-1 text-sm border border-zinc-400 hover:bg-zinc-100 transition-all">
            <IconArrowLeft />
          </NavLink>
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center font-bold text-slate-800 text-sm">
            {employeeData?.fullName?.[0]?.toUpperCase() || "?"}
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
              <span className="bg-green-100 text-xs text-green-600 px-2 py-0.5 inline-flex items-center rounded-xl">
                <span className="bg-green-600 w-1.5 h-1.5 rounded-full" /> Active
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <button type="button" className="bg-white rounded-lg p-2 border border-zinc-400 hover:bg-zinc-100 transition-all">
            <IconDotsVertical />
          </button>
          <button type="button" className="bg-green-700 flex gap-2 px-3 py-2 rounded-lg items-center text-white hover:bg-green-800 transition-all">
            <IconMail /> Send Email
          </button>
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

      <main className="py-8 flex items-start gap-4 h-full">{renderTabContent()}</main>
    </DashboardLayouts>
  );
};

export default EmployeeDetails;
