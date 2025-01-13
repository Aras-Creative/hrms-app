import React from "react";
import FormInput from "../../../components/FormInput";

const Account = () => {
  return (
    <div className="flex flex-col items-start">
      {[
        {
          title: "Account settings",
          description: "Update and manage your account credentials, including email address and password, to ensure secure access.",
          content: (
            <div className="w-full">
              <FormInput type="text" label={"Email address"} value={"admin@aras.creative"} />
              <div className="mt-4 mb-4">
                <h1 className="text-sm font-bold">Update Password</h1>
              </div>
              <FormInput type="password" label={"Current Password"} value={"CV ARAS CREATIVE"} />
              <div className="grid grid-cols-2 gap-4 mt-4 items-start whitespace-nowrap">
                <FormInput type="password" label={"New Password"} />
                <FormInput type="password" label={"Confirm New Password"} />
              </div>
              <div className="mt-4">
                <button
                  className="px-4 py-2 bg-emerald-700 text-white rounded hover:bg-emerald-600 transition"
                  onClick={() => console.log("Settings reset to default.")}
                >
                  Update Password
                </button>
              </div>
            </div>
          ),
        },
        {
          title: "Danger zone",
          description: "Proceed with caution. These actions may have significant consequences for your account.",
          content: (
            <div className="grid grid-cols-2 gap-4 mt-4 items-start whitespace-nowrap">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={() => console.log("Settings reset to default.")}
              >
                Log Out
              </button>
            </div>
          ),
        },

        // {
        //   title: "Date & Time",
        //   description: "Set your preferred date and time format.",
        //   content: (
        //     <div className="flex gap-4 items-start">
        //       <FormInput
        //         type="select"
        //         label={"Date Format"}
        //         value={settings.dateFormat}
        //         options={[
        //           { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
        //           { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
        //           { label: "YYYY/MM/DD", value: "YYYY/MM/DD" },
        //         ]}
        //         onChange={(value) => handleSettingChange("dateFormat", value)}
        //       />
        //       <FormInput
        //         type="select"
        //         label={"Time Format"}
        //         value={settings.timeFormat}
        //         options={[
        //           { label: "HH:mm:ss", value: "HH:mm:ss" },
        //           { label: "hh:mm A", value: "hh:mm A" },
        //           { label: "HH:mm", value: "HH:mm" },
        //         ]}
        //         onChange={(value) => handleSettingChange("timeFormat", value)}
        //       />
        //     </div>
        //   ),
        // },
        // {
        //   title: "Backup Frequency",
        //   description: "Set how often the app should back up your data.",
        //   content: (
        //     <FormInput
        //       type="select"
        //       label={"Frequency"}
        //       value={settings.backupFrequency}
        //       options={[
        //         { label: "Hourly", value: "hourly" },
        //         { label: "Daily", value: "daily" },
        //         { label: "Weekly", value: "weekly" },
        //         { label: "Monthly", value: "monthly" },
        //       ]}
        //       onChange={(value) => handleSettingChange("backupFrequency", value)}
        //     />
        //   ),
        // },
        // {
        //   title: "Reset Settings",
        //   description: "Reset all settings to their default values.",
        //   content: (
        //     <button
        //       className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        //       onClick={() => console.log("Settings reset to default.")}
        //     >
        //       Reset to Default
        //     </button>
        //   ),
        // },
        // {
        //   title: "App Info",
        //   description: "Learn more about the app and its configuration.",
        //   content: (
        //     <div className="flex flex-col gap-2">
        //       <p className="text-sm">
        //         <span className="font-bold">Version:</span> 1.0.0
        //       </p>
        //       <p className="text-sm">
        //         <span className="font-bold">Last Update:</span> Dec 15, 2024
        //       </p>
        //       <NavLink to="/privacy-policy" className="text-blue-500 hover:underline text-sm">
        //         Privacy Policy
        //       </NavLink>
        //       <NavLink to="/terms-of-service" className="text-blue-500 hover:underline text-sm">
        //         Terms of Service
        //       </NavLink>
        //     </div>
        //   ),
        // },
      ].map((section, index) => (
        <div key={index} className="flex 2xl:gap-36 gap-16 items-center w-full border-b border-zinc-300 py-6">
          <div className="w-1/2">
            <h1 className="text-lg font-bold text-slate-800">{section.title}</h1>
            <p className="text-sm">{section.description}</p>
          </div>
          <div className="w-1/2">{section.content}</div>
        </div>
      ))}
    </div>
  );
};

export default Account;
