import { IconCake, IconDeviceMobile, IconDots, IconGenderBigender, IconGridScan, IconMail, IconMapPin } from "@tabler/icons-react";
import React from "react";
import { NavLink } from "react-router-dom";
import NoData from "../assets/error/no-data.webp";

const Grid = ({ data }) => {
  return (
    <>
      {data?.length > 0 ? (
        <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 gap-4">
          {data?.map((item, index) => (
            <div
              key={index}
              className={`bg-white h-full rounded-lg border shadow-sm border-b-4 ${
                item.status === "active" ? "border-b-emerald-700" : "border-b-red-500"
              }`}
            >
              <div className="flex justify-end px-6 py-4">
                <NavLink to={`/dashboard/employee/${item.user?.userId}/details`}>
                  <IconDots />
                </NavLink>
              </div>
              <div className="w-full flex justify-center flex-col items-center gap-4 my-6 px-8">
                <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-slate-800 text-3xl font-bold">
                  {item.fullName[0]}
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-lg font-bold text-slate-800 whitespace-nowrap">{item.fullName}</div>
                  <p className="text-sm whitespace-nowrap">{item?.jobRole?.jobRoleTitle || "Not Assigned"}</p>
                </div>

                <div className="mt-4 bg-zinc-100 rounded-lg p-4 shadow-md w-full">
                  <h2 className="font-semibold text-gray-800 whitespace-nowrap">Detail Karyawan</h2>
                  <div className="mt-2">
                    <div className="flex justify-between py-2 border-b border-gray-300">
                      <span className="text-sm font-medium text-gray-600 flex gap-1 items-center whitespace-nowrap">
                        <IconGridScan size={18} />
                        ID Karyawan:
                      </span>
                      <span className="text-sm text-gray-800 whitespace-nowrap">{item?.employeeId}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-300">
                      <span className="text-sm font-medium text-gray-600 flex gap-1 items-center whitespace-nowrap">
                        <IconGenderBigender size={18} />
                        Jenis Kelamin
                      </span>
                      <span className="text-sm text-gray-800 whitespace-nowrap">{item.gender}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-300">
                      <span className="text-sm font-medium text-gray-600 flex gap-1 items-center whitespace-nowrap">
                        <IconMail size={18} />
                        Email
                      </span>
                      <span className="text-sm text-gray-800 whitespace-nowrap">{item.email || "-"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-gray-300">
                      <span className="text-sm font-medium text-gray-600 flex gap-1 items-center whitespace-nowrap">
                        <IconDeviceMobile size={18} />
                        Nomor Handphone
                      </span>
                      <span className="text-gray-800 whitespace-nowrap">{item.phoneNumber || "-"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex mt-48 items-center justify-center">
          <img src={NoData} alt="No Data" className="w-96 h-auto" />
        </div>
      )}
    </>
  );
};

export default Grid;
