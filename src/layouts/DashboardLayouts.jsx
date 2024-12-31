import React from "react";
import { Link } from "react-router-dom"; // Pastikan Anda mengimpor Link jika menggunakan react-router-dom
import Sidebar from "../components/Sidebar";
import { IconBell, IconMail } from "@tabler/icons-react";

const DashboardLayouts = ({ children }) => {
  const toggleDropdown = (event) => {
    const dropdownMenu = document.getElementById("dropdownMenu");
    dropdownMenu.classList.toggle("hidden");
  };

  const NavbarItems = [];

  return (
    <div className="flex h-screen flex-col relative w-full mx-auto">
      <header className="px-8 w-full py-3 flex justify-between items-center bg-slate-800 shadow">
        <div className="flex gap-3 items-center">
          <img className="w-44" src="/image/aras-logo.webp" alt="Aras Creative Logo" />
        </div>

        <div className="flex gap-3 items-center">
          <button className="rounded-xl p-3 bg-slate-600 hover:bg-slate-700 transition-all duration-300 ease-in-out text-slate-200">
            <div className="relative">
              <IconBell />
              <div className="absolute bg-red-500 h-2 w-2 top-0 right-0.5 rounded-full"></div>
            </div>
          </button>
          <button className="rounded-xl p-3 bg-slate-600 hover:bg-slate-700 transition-all duration-300 ease-in-out text-slate-200">
            <div className="relative">
              <IconMail />
              <div className="absolute bg-red-500 h-2 w-2 top-0 right-0 rounded-full"></div>
            </div>
          </button>

          <div className="relative items-center mt-1">
            <button className="rounded-full focus:outline-none" onClick={toggleDropdown}>
              <img className="w-10 h-10 rounded-full" src="/img/avatar.png" alt="User Avatar" />
            </button>

            <div id="dropdownMenu" className="hidden absolute right-0 mt-2 w-48 bg-slate shadow-lg rounded-lg py-2 z-10">
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Profile
              </a>
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Settings
              </a>
              <form action="/logout" method="POST">
                <button type="submit" className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-col h-screen overflow-y-auto scrollbar-none">
        <div className="flex flex-1 overflow-hidden">
          <aside>
            <nav id="sidebar" className="sidebar w-full h-full bg-white text-zinc-700 shadow-md relative">
              <Sidebar />
            </nav>
          </aside>
          <main className="w-full flex-1 overflow-y-auto h-full flex flex-col">
            <div className="w-full bg-zinc-100 flex-1">
              <section className="main-content flex-1 2xl:p-6 p-4">{children}</section>
            </div>
            <footer className="mt-4 text-center text-gray-600 w-full text-sm py-4">© 2024 Aras Creative. All rights reserved.</footer>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayouts;
