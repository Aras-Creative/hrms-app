import React, { useEffect, useState } from "react";
import FormInput from "../../../components/FormInput";
import useAuth from "../../../hooks/useAuth";
import useFetch from "../../../hooks/useFetch";
import companyLogo from "../../../assets/logo.png";

const CompanyAdm = () => {
  const { settingsPreference, SettingsRefetch } = useAuth();
  const [settings, setSettings] = useState({});
  const [initialSettings, setInitialSettings] = useState({});

  useEffect(() => {
    if (settingsPreference && Array.isArray(settingsPreference)) {
      const allowedKeys = [
        "company_name",
        "company_email",
        "company_phone",
        "late_penalty",
        "region",
        "city",
        "address",
        "postal_code",
        "bpjs_ks_allowance",
        "bpjs_ks_company_amount",
        "bpjs_ks_employee_amount",
        "bpjs_kt_jht_allowance",
        "bpjs_kt_jkk_allowance",
        "bpjs_kt_jp_allowance",
        "bpjs_kt_jkk_amount",
        "bpjs_kt_jht_company_amount",
        "bpjs_kt_jht_employee_amount",
        "bpjs_kt_jp_employee_amount",
        "bpjs_kt_jp_company_amount",
        "bonus_target_allowance",
        "bonus_target_allowance_amount",
        "late_penalty",
        "late_penalty_amount",
      ];

      const formattedSettings = settingsPreference.reduce((acc, { key, value }) => {
        if (allowedKeys.includes(key)) {
          acc[key] = value || "";
        }
        return acc;
      }, {});

      setSettings((prevSettings) => ({
        ...prevSettings,
        ...formattedSettings,
      }));
      setInitialSettings((prevSettings) => ({
        ...prevSettings,
        ...formattedSettings,
      }));
    }
  }, [settingsPreference]);

  const { submitData: updateSetting, loading: updateSettingLoading } = useFetch("/dashboard/settings/update", { method: "POST" });

  const handleSettingChange = async (setting, event) => {
    let value;

    if (typeof event === "boolean") {
      value = event ? "1" : "0";
    } else {
      value = event?.target?.value || "";
    }
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSubmit = async () => {
    const changedData = Object.keys(settings).reduce((acc, key) => {
      if (settings[key] !== initialSettings[key]) {
        acc.push({ key, value: settings[key] });
      }
      return acc;
    }, []);

    if (Object.keys(changedData).length > 0) {
      console.log("Sending changed data:", changedData);
      const { success } = await updateSetting(changedData);
      if (success) {
        SettingsRefetch();
      }
    } else {
      console.log("No changes detected.");
    }
  };
  return (
    <div className="flex flex-col items-start">
      {[
        {
          title: "Company Profile",
          description: "Manage your company’s primary identification and communication details.",
          content: (
            <div className="w-full gap-12 justify-between flex items-start">
              <div className="w-full">
                <FormInput
                  type="text"
                  label={"Company Name"}
                  value={settings?.company_name}
                  onChange={(event) => handleSettingChange("company_name", event)}
                />
                <div className="grid grid-cols-2 gap-4 mt-4 items-start whitespace-nowrap">
                  <FormInput
                    type="text"
                    label={"Email Address"}
                    value={settings?.company_email}
                    onChange={(event) => handleSettingChange("company_email", event)}
                  />
                  <FormInput
                    type="text"
                    label={"Phone"}
                    value={settings?.company_phone}
                    onChange={(event) => handleSettingChange("company_phone", event)}
                  />
                </div>
                <div className="flex justify-start mt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-emerald-700 text-white font-semibold rounded-xl px-3 py-2 hover:bg-emerald-900 transition-all duration-200 ease-in-out"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
              <img className="w-56 rounded-xl" src={companyLogo} alt="Company Logo" />
            </div>
          ),
        },
        {
          title: "Address Information",
          description: "Define and manage the physical location details of your company.",
          content: (
            <div>
              <div className="grid grid-cols-2 gap-4 mt-4 items-start whitespace-nowrap">
                <FormInput type="text" label={"Region/State"} value={settings?.region} onChange={(event) => handleSettingChange("region", event)} />
                <FormInput type="text" label={"City"} value={settings?.city} onChange={(event) => handleSettingChange("city", event)} />
                <FormInput
                  type="text"
                  label={"Address Details"}
                  value={settings?.address}
                  onChange={(event) => handleSettingChange("address", event)}
                />
                <FormInput
                  type="text"
                  label={"Postal Code"}
                  value={settings?.postal_code}
                  onChange={(event) => handleSettingChange("postal_code", event)}
                />
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-emerald-700 text-white font-semibold rounded-xl px-3 py-2 hover:bg-emerald-900 transition-all duration-200 ease-in-out"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ),
        },
        {
          title: "Payroll Settings",
          description:
            "Configure payroll-related preferences and default values to streamline employee salary processing and ensure compliance with company policies and government regulation.",
          content: (
            <div className="w-full flex items-start gap-24">
              <div>
                <h1 className="text-sm font-bold">BPJS and Health Insurance Inclusion</h1>
                <div className="grid grid-cols-2 gap-4 mt-4 items-start whitespace-nowrap">
                  <FormInput
                    type="switch"
                    label={"BPJS Kesehatan"}
                    value={settings?.bpjs_ks_allowance === "0" ? false : true}
                    onChange={(event) => handleSettingChange("bpjs_ks_allowance", event)}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      type="text"
                      label={"Company "}
                      value={settings?.bpjs_ks_company_amount}
                      disabled={settings?.bpjs_ks_allowance === "0"}
                      onChange={(event) => handleSettingChange("bpjs_ks_company_amount", event)}
                    />
                    <FormInput
                      type="text"
                      label={"Employee "}
                      value={settings?.bpjs_ks_employee_amount}
                      disabled={settings?.bpjs_ks_allowance === "0"}
                      onChange={(event) => handleSettingChange("bpjs_ks_employee_amount", event)}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <h1 className="text-sm font-bold">Other Allowances</h1>
                  <div className="grid grid-cols-2 gap-4 mt-4 items-start whitespace-nowrap">
                    <FormInput
                      type="switch"
                      label={"Bonus Target"}
                      value={settings?.bonus_target_allowance === "0" ? false : true}
                      onChange={(event) => handleSettingChange("bonus_target_allowance", event)}
                    />
                    <FormInput
                      type="text"
                      label={"Default amount"}
                      value={settings?.bonus_target_allowance_amount}
                      disabled={settings?.bonus_target_allowance === "0"}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <h1 className="text-sm font-bold mt-4">Other Salary Deductions</h1>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 items-start whitespace-nowrap">
                  <FormInput
                    type="switch"
                    label={"Late Penalty"}
                    value={settings?.late_penalty === "0" ? false : true}
                    onChange={(event) => handleSettingChange("late_penalty", event)}
                  />
                  <FormInput
                    type="text"
                    label={"Default amount"}
                    value={settings?.late_penalty_amount}
                    onChange={(event) => handleSettingChange("late_penalty_amount", event)}
                    disabled={settings?.late_penalty === "0"}
                  />
                </div>
              </div>
              <div>
                <h1 className="text-sm font-bold">BPJS Ketenagakerjaan Insurance Inclusion</h1>
                <div className="grid grid-cols-2 gap-4 mt-4 items-start whitespace-nowrap">
                  <FormInput
                    type="switch"
                    label={"Jaminan Hari Tua (JHT)"}
                    value={settings?.bpjs_kt_jht_allowance === "0" ? false : true}
                    onChange={(event) => handleSettingChange("bpjs_kt_jht_allowance", event)}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      type="text"
                      label={"Company "}
                      value={settings?.bpjs_kt_jht_company_amount}
                      disabled={settings?.bpjs_kt_jht_allowance === "0"}
                      onChange={(event) => handleSettingChange("bpjs_kt_jht_company_amount", event)}
                    />
                    <FormInput
                      type="text"
                      label={"Employee "}
                      value={settings?.bpjs_kt_jht_employee_amount}
                      disabled={settings?.bpjs_kt_jht_allowance === "0"}
                      onChange={(event) => handleSettingChange("bpjs_kt_jht_employee_amount", event)}
                    />
                  </div>
                  <FormInput
                    type="switch"
                    label={"Jaminan Pensiun (JP)"}
                    value={settings?.bpjs_kt_jp_allowance === "0" ? false : true}
                    onChange={(event) => handleSettingChange("bpjs_kt_jp_allowance", event)}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      type="text"
                      label={"Company "}
                      value={settings?.bpjs_kt_jp_company_amount}
                      disabled={settings?.bpjs_kt_jp_allowance === "0"}
                      onChange={(event) => handleSettingChange("bpjs_kt_jp_company_amount", event)}
                    />
                    <FormInput
                      type="text"
                      label={"Employee "}
                      value={settings?.bpjs_kt_jp_employee_amount}
                      disabled={settings?.bpjs_kt_jp_allowance === "0"}
                      onChange={(event) => handleSettingChange("bpjs_kt_jp_employee_amount", event)}
                    />
                  </div>
                  <FormInput
                    type="switch"
                    label={"Jaminan Keselamatan Kerja (JKK)"}
                    value={settings?.bpjs_kt_jkk_allowance === "0" ? false : true}
                    onChange={(event) => handleSettingChange("bpjs_kt_jkk_allowance", event)}
                  />
                  <FormInput
                    type="text"
                    label={"Amount (percentage)"}
                    value={settings?.bpjs_kt_jkk_amount}
                    disabled={settings?.bpjs_kt_jkk_allowance === "0"}
                    onChange={(e) => handleSettingChange("bpjs_kt_jkk_amount", e)}
                  />
                </div>

                <div className="flex justify-end mt-12">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-emerald-700 text-white font-semibold rounded-xl px-3 py-2 hover:bg-emerald-900 transition-all duration-200 ease-in-out"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          ),
        },
      ].map((section, index) => (
        <div key={index} className="flex 2xl:gap-36 gap-16 items-center w-full border-b border-zinc-300 py-6">
          <div className="w-full">
            <h1 className="text-lg font-bold text-slate-800">{section.title}</h1>
            <div className="w-full mt-4 px-4">{section.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompanyAdm;
