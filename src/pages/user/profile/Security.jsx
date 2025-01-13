import React from "react";
import Layouts from "./Layouts";
import { IconAddressBook, IconChevronRight, IconPasswordUser } from "@tabler/icons-react";
import { NavLink } from "react-router-dom";

const Security = () => {
  return (
    <Layouts title={"Kemanan dan Privasi"} backUrl={"/settings"}>
      <div className="w-full h-screen bg-white">
        <div className="w-full pt-16 bg-white flex felx-col">
          <NavLink
            to={"/security/contacts"}
            className="flex w-full justify-between items-center px-6 py-4 hover:bg-zinc-100 transition-all duration-300 ease-in-out"
          >
            <div className="flex gap-3 items-center">
              <IconAddressBook />
              <h1 className="text-sm font-semibold text-slate-800">Privasi dan Informasi Kontak</h1>
            </div>

            <IconChevronRight />
          </NavLink>
        </div>

        <div className="w-full bg-white flex felx-col">
          <NavLink
            to={"/security/password"}
            className="flex w-full justify-between items-center px-6 py-4 hover:bg-zinc-100 transition-all duration-300 ease-in-out"
          >
            <div className="flex gap-3 items-center">
              <IconPasswordUser />
              <h1 className="text-sm font-semibold text-slate-800">Kata sandi dan Keamanan</h1>
            </div>

            <IconChevronRight />
          </NavLink>
        </div>
      </div>
    </Layouts>
  );
};

export default Security;
