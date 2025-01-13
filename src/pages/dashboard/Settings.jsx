import React, { useState } from "react";
import DashboardLayouts from "../../layouts/DashboardLayouts";
import { IconBuilding, IconPalette, IconSettings, IconShieldLock } from "@tabler/icons-react";
import General from "./settings/General";
import CompanyAdm from "./settings/CompanyAdm";
import Account from "./settings/Account";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("General");

  const tabs = [
    { name: "General Settings", value: "General", icon: <IconSettings size={23} /> },
    { name: "Company Administration", value: "companyAdministration", icon: <IconBuilding size={23} /> },
    { name: "Account and Security", value: "Account", icon: <IconShieldLock size={23} /> },
  ];

  return (
    <DashboardLayouts>
      <div className="flex flex-col bg-gray-100 2xl:px-56 px-20">
        <div className="flex justify-between items-center mb-8 py-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800">Settings</h1>
            <p className="text-gray-600 text-sm  mt-2">
              Customize your HR Management System settings to align with company policies. Optimize configurations for efficient human resource
              management.
            </p>
          </div>
        </div>

        <div className="flex gap-8 border-b border-gray-300 mb-8">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`flex hover:text-zinc-700 items-center cursor-pointer py-2 ${
                activeTab === tab.value ? "text-slate-800 border-b-2 border-slate-800" : "text-zinc-600"
              }`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.icon && tab.icon}
              <span className="ml-2">{tab.name}</span>
            </div>
          ))}
        </div>

        <div className=" w-full">
          {activeTab === "General" && <General />}
          {activeTab === "companyAdministration" && <CompanyAdm />}
          {activeTab === "Account" && <Account />}
        </div>
      </div>
    </DashboardLayouts>
  );
};

export default Settings;
