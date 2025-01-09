import React from "react";
import Layouts from "./Layouts";
import useAuth from "../../../hooks/useAuth";
import { getBankImage, getBPJSImage } from "../../../utils/bankImages";
import {
  IconChevronRight,
  IconFileDescription,
  IconHelpCircleFilled,
  IconLogout,
  IconShieldHalfFilled,
  IconShieldLockFilled,
  IconUserFilled,
} from "@tabler/icons-react";
import { NavLink } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import { getProfilePicture } from "../../../utils/userUtils";

const SettingsMenu = ({ path, icon, label }) => {
  return (
    <NavLink
      to={path}
      className="flex w-full items-center justify-between hover:bg-zinc-100 transition-all duration-300 ease-in-out rounded-xl px-4 py-3"
    >
      <div className="flex gap-5 items-center">
        <div className="p-2 rounded-full bg-indigo-100 text-sm text-indigo-700">{icon}</div>
        <h1 className="font-semibold text-slate-800">{label}</h1>
      </div>
      <IconChevronRight />
    </NavLink>
  );
};
const Menu = () => {
  const { profile, logout } = useAuth();
  const { responseData: ProfilePicture } = useFetch(`/employee/profile-picture/${profile.userId}`);
  const bankImage = getBankImage(profile?.bankName);
  const handleLogout = () => {
    logout();
  };

  return (
    <Layouts title={"Halaman Profile"} backUrl={"/homepage"}>
      <div className="w-full px-3 pt-16 bg-white">
        <div className="flex items-center mb-4 bg-gradient-to-r from-slate-800 to-slate-600 px-4 rounded-xl py-4">
          {getProfilePicture(ProfilePicture, profile, "20", "20", "border-white")}
          <div className="ml-4 leading-tight">
            <h2 className="text-xl font-bold text-white">{profile?.fullName.split(" ").slice(0, 2).join(" ")}</h2>
            <p className="text-slate-300 text-sm w-[75%] overflow-hidden truncate">{profile?.jobRole?.jobRoleTitle}</p>
            <h1 className="text-xs font-semibold text-slate-200">#{profile?.employeeId}</h1>
          </div>
        </div>

        <div className="w-full bg-white border rounded-xl px-5 mb-3">
          <div className="flex items-center justify-between py-1">
            <div className="flex flex-col gap-1 items-start">
              <h1 className="text-xs text-slate-800">No. Rekening</h1>
              <p className="font-semibold text-sm text-slate-800">{profile?.bankAccountNumber}</p>
            </div>
            {bankImage ? <img src={bankImage} alt={profile?.bankName} className="w-20" /> : <span>No Bank Image</span>}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1 items-start">
              <h1 className="text-xs text-slate-800">No. BPJS Kesehatan</h1>
              <p className="font-semibold text-sm text-slate-800">{profile?.bpjsKesehatanNumber || "-"}</p>
            </div>
            {<img src={getBPJSImage("BPJSKS")} alt={"BPJS Kesehatan logo"} className="w-20" />}
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex flex-col gap-1 items-start">
              <h1 className="text-xs text-slate-800">No. BPJS Ketenagakerjaan</h1>
              <p className="font-semibold text-sm text-slate-800">{profile?.bpjsKetenagakerjaanNumber || "-"}</p>
            </div>
            {<img src={getBPJSImage("BPJSKT")} alt={"BPJS Kesehatan logo"} className="w-20" />}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="w-full bg-white border rounded-xl overflow-hidden">
            <div className="flex flex-col">
              <SettingsMenu
                path={"/me"}
                icon={
                  <>
                    <IconUserFilled size={22} />
                  </>
                }
                label={"Detail Informasi Profile"}
              />

              <SettingsMenu
                path={"/security"}
                icon={
                  <>
                    <IconShieldLockFilled size={22} />
                  </>
                }
                label={"Keamanan Dan Privasi"}
              />
            </div>
          </div>

          <div className="w-full bg-white border rounded-xl overflow-hidden">
            <div className="flex flex-col">
              <SettingsMenu
                path={"/privacy-policy"}
                icon={
                  <>
                    <IconShieldHalfFilled size={22} />
                  </>
                }
                label={"Kebijakan Privasi"}
              />

              <SettingsMenu
                path={"/terms-and-condition"}
                icon={
                  <>
                    <IconFileDescription size={22} />
                  </>
                }
                label={"Syarat dan Ketentuan"}
              />

              <SettingsMenu
                path={"/faq"}
                icon={
                  <>
                    <IconHelpCircleFilled size={22} />
                  </>
                }
                label={"FAQ & Bantuan"}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full bg-white border hover:bg-zinc-100 transition-all duration-300 ease-in-out rounded-xl px-5 py-4 mb-6"
          >
            <div className="flex flex-col gap-4">
              <div className="flex w-full items-center justify-between">
                <div className="flex gap-5 items-center">
                  <div className="p-2 rounded-full bg-red-50 text-sm text-red-700">
                    <IconLogout size={22} />
                  </div>
                  <h1 className="font-semibold text-red-500">Logout</h1>
                </div>
                <IconChevronRight className="text-red-500" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </Layouts>
  );
};

export default Menu;
