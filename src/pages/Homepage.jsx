import { Icon } from "@iconify/react/dist/iconify.js";
import HomepageLayouts from "../layouts/HomepageLayouts";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <HomepageLayouts>
      <div className="bg-indigo-500 h-44 rounded-b-2xl relative flex justify-center px-5">
        <div className="h-12 flex jutify-between items-center w-full py-12">
          <div className="w-1/2 flex items-center gap-2">
            <img src="/image/avatar.png" className="w-10 h-10" alt="avatar" />
            <div className="flex flex-col gap-0">
              <h1 className="text-xs text-white">Halo, Selamat Siang!</h1>
              <h1 className="text-sm font-bold text-white">Rifki Maulana</h1>
            </div>
          </div>
          <div className="w-1/2 flex justify-end items-center gap-3 px-2">
            <button className="bg-transparent">
              <Icon icon="wpf:message" fontSize={22} className="text-white" />
            </button>
          </div>
        </div>
        <div className="absolute w-[90%] transfrom translate-y-1/2 bg-white bottom-0 rounded-xl mx-24 p-3 shadow-md">
          <div className="flex flex-col gap-4 border-b pb-3 border-gray-300">
            <div class="grid grid-cols-2 divide-x">
              <div className="flex flex-col justify-center gap-0 items-start">
                <h1 className="text-xs font-bold">Kantor Cabang A</h1>
                <h1 className="text-xs text-gray-500">Software Developer</h1>
              </div>
              <div className="flex flex-col justify-center gap-0 items-end">
                <h1 className="text-xs font-bold">Jam Kerja</h1>
                <h1 className="text-xs text-gray-500">08.00 - 16.30</h1>
              </div>
            </div>
          </div>
          <div class="flex justify-between items-center w-full px-6 pt-6 pb-3">
            <div className="flex flex-col gap-2 items-center">
              <Link to="/" className="p-3 bg-gray-100 rounded-full ">
                <img src="/image/payroll.png" className="w-10" alt="payroll-icon" />
              </Link>
              <p className="text-xs text-gray-800 font-semibold">Payroll</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <Link to="/" className="p-3 bg-gray-100 rounded-full ">
                <img src="/image/history.png" className="w-10" alt="payroll-icon" />
              </Link>
              <p className="text-xs text-gray-800 font-semibold ">History Absen</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <Link to="/" className="p-3 bg-gray-100 rounded-full ">
                <img src="/image/payroll.png" className="w-10" alt="payroll-icon" />
              </Link>
              <p className="text-xs text-gray-800 font-semibold">Payroll</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24 px-5 w-full">
        <div className="w-full py-4 rounded-xl flex flex-col bg-white">
          <h1 className="text-sm font-bold text-gray-800 mb-6">Layanan</h1>
          <div className="grid grid-cols-4 gap-8">
            <div className="flex flex-col gap-2 items-center">
              <Link to="/" className="p-3 bg-gray-100 rounded-full ">
                <img src="/image/payroll.png" className="w-10" alt="payroll-icon" />
              </Link>
              <p className="text-xs text-gray-800 font-semibold">Payroll</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <Link to="/" className="p-3 bg-gray-100 rounded-full ">
                <img src="/image/payroll.png" className="w-10" alt="payroll-icon" />
              </Link>
              <p className="text-xs text-gray-800 font-semibold">Payroll</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <Link to="/" className="p-3 bg-gray-100 rounded-full ">
                <img src="/image/payroll.png" className="w-10" alt="payroll-icon" />
              </Link>
              <p className="text-xs text-gray-800 font-semibold">Payroll</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <Link to="/" className="p-3 bg-gray-100 rounded-full ">
                <img src="/image/payroll.png" className="w-10" alt="payroll-icon" />
              </Link>
              <p className="text-xs text-gray-800 font-semibold">Payroll</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <Link to="/" className="p-3 bg-gray-100 rounded-full ">
                <img src="/image/payroll.png" className="w-10" alt="payroll-icon" />
              </Link>
              <p className="text-xs text-gray-800 font-semibold">Payroll</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <Link to="/" className="p-3 bg-gray-100 rounded-full ">
                <img src="/image/payroll.png" className="w-10" alt="payroll-icon" />
              </Link>
              <p className="text-xs text-gray-800 font-semibold">Payroll</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <Link to="/" className="p-3 bg-gray-100 rounded-full ">
                <img src="/image/payroll.png" className="w-10" alt="payroll-icon" />
              </Link>
              <p className="text-xs text-gray-800 font-semibold">Payroll</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <Link to="/" className="p-3 bg-gray-100 rounded-full ">
                <img src="/image/payroll.png" className="w-10" alt="payroll-icon" />
              </Link>
              <p className="text-xs text-gray-800 font-semibold">Payroll</p>
            </div>
          </div>
        </div>
      </div>
    </HomepageLayouts>
  );
};

export default Homepage;
