import React, { useEffect, useState } from "react";
import FormInput from "../../../components/FormInput";
import { NavLink } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useFetch from "../../../hooks/useFetch";
import ThemeSelector from "../../../components/ThemeSelector";

const General = () => {
  const { settingsPreference, SettingsRefetch } = useAuth();
  const [settings, setSettings] = useState({});

  useEffect(() => {
    if (settingsPreference && Array.isArray(settingsPreference)) {
      const formattedSettings = settingsPreference.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
      setSettings({
        language: { label: formattedSettings["lang"], value: formattedSettings["lang"] || "en-EN" },
        currency: { label: formattedSettings["currency"], value: formattedSettings["currency"] || "IDR" },
        timezone: { label: formattedSettings["timezone"], value: formattedSettings["timezone"] || "Asia/Jakarta" },
        timeFormat: { label: formattedSettings["time_format"], value: formattedSettings["time_format"] || "HH:mm:ss" },
        dateFormat: { label: formattedSettings["date_format"], value: formattedSettings["date_format"] || "YYYY-MM-DD" },
        backupFrequency: {
          label: formattedSettings["backup_frquency"] || "Monthly",
          value: formattedSettings["backup_frquency"] || "Monthly",
        },
        theme: formattedSettings["theme"] || "light",
        notification: formattedSettings["push_notification"],
        app_version: formattedSettings["app_version"],
        last_update: formattedSettings["last_update"],
      });
    }
  }, [settingsPreference]);
  const { submitData: updateSetting, loading: updateSettingLoading } = useFetch("/dashboard/settings", { method: "POST" });

  const handleSettingChange = async (setting, value) => {
    const { success, error, data } = await updateSetting({ key: setting, value: value?.value || value });
    if (success) {
      SettingsRefetch();
    } else {
    }
  };

  const renderSelectInput = (label, value, options, onChange) => (
    <FormInput type="select" label={label} value={value} options={options} onChange={onChange} />
  );

  const renderSection = (title, description, content, index) => (
    <div key={index} className="flex 2xl:gap-36 gap-16 items-center w-full border-b border-zinc-300 py-6">
      <div className="w-1/2">
        <h1 className="text-lg font-bold text-slate-800">{title}</h1>
        <p className="text-sm">{description}</p>
      </div>
      <div className="w-1/2">{content}</div>
    </div>
  );

  return (
    <div className="flex flex-col items-start">
      {[
        {
          title: "Appearance",
          description: "Chose a preferred theme for the app.",
          content: <ThemeSelector activeTheme={settings?.theme} onThemeChange={handleSettingChange} />,
        },
        {
          title: "Language and Region",
          description: "Chose a preferred language and timezone for the app.",
          content: (
            <div className="flex w-full gap-4 items-center">
              {renderSelectInput(
                "Language",
                settings?.language,
                [
                  { label: "en-EN", value: "en-EN" },
                  { label: "id-ID", value: "id-ID" },
                ],
                (value) => handleSettingChange("lang", value)
              )}
              {renderSelectInput(
                "Currency",
                settings?.currency,
                [
                  { label: "IDR", value: "IDR" },
                  { label: "USD", value: "USD" },
                  { label: "RM", value: "RM" },
                ],
                (value) => handleSettingChange("currency", value)
              )}
              {renderSelectInput(
                "Timezone",
                settings?.timezone,
                [
                  { label: "Asia/Jakarta", value: "Asia/Jakarta" },
                  { label: "Asia/Makassar", value: "Asia/Makassar" },
                  { label: "Asia/Jayapura", value: "Asia/Jayapura" },
                ],
                (value) => handleSettingChange("timezone", value)
              )}
            </div>
          ),
        },
        {
          title: "Notification",
          description: "Chose a preferred notification settings for the app on desktop.",
          content: (
            <FormInput
              type="switch"
              label={"Push Notifications"}
              value={settings?.notification === "0" ? false : true}
              onChange={(newValue) => handleSettingChange("push_notification", newValue)}
            />
          ),
        },
        {
          title: "Date & Time",
          description: "Set your preferred date and time format.",
          content: (
            <div className="flex gap-4 items-start">
              {renderSelectInput(
                "Date Format",
                settings.dateFormat,
                [
                  { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
                  { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
                  { label: "YYYY/MM/DD", value: "YYYY/MM/DD" },
                ],
                (value) => handleSettingChange("date_format", value)
              )}
              {renderSelectInput(
                "Time Format",
                settings.timeFormat,
                [
                  { label: "HH:mm:ss", value: "HH:mm:ss" },
                  { label: "hh:mm A", value: "hh:mm A" },
                  { label: "HH:mm", value: "HH:mm" },
                ],
                (value) => handleSettingChange("timeFormat", value)
              )}
            </div>
          ),
        },
        {
          title: "Backup Frequency",
          description: "Set how often the app should back up your data.",
          content: renderSelectInput(
            "Frequency",
            settings.backupFrequency,
            [
              { label: "Hourly", value: "hourly" },
              { label: "Daily", value: "daily" },
              { label: "Weekly", value: "weekly" },
              { label: "Monthly", value: "monthly" },
            ],
            (value) => handleSettingChange("backupFrequency", value)
          ),
        },
        {
          title: "Reset Settings",
          description: "Reset all settings to their default values.",
          content: (
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              onClick={() => console.log("Settings reset to default.")}
            >
              Reset to Default
            </button>
          ),
        },
        {
          title: "App Info",
          description: "Learn more about the app and its configuration.",
          content: (
            <div className="flex flex-col gap-2">
              <p className="text-sm">
                <span className="font-bold">Version:</span> {settings?.app_version}
              </p>
              <p className="text-sm">
                <span className="font-bold">Last Update:</span>{" "}
                {settings?.last_update?.toLocaleString("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <NavLink to="/privacy-policy" className="text-blue-500 hover:underline text-sm">
                Privacy Policy
              </NavLink>
              <NavLink to="/terms-of-service" className="text-blue-500 hover:underline text-sm">
                Terms of Service
              </NavLink>
            </div>
          ),
        },
      ].map((section, index) => renderSection(section.title, section.description, section.content, index))}
    </div>
  );
};

export default General;
