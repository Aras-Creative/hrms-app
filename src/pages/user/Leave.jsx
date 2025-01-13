import React from "react";
import Layouts from "./profile/Layouts";
import { IconActivity } from "@tabler/icons-react";

const Leave = () => {
  return (
    <Layouts title={"Leave Summary"} backUrl={"/homepage"}>
      <div className="bg-white mt-14">
        <div className="flex flex-col items-center justify-center py-3">
          <div className="bg-white rounded-lg w-full ">
            <li className="flex justify-between items-center border-b border-zinc-200 py-4 px-6 transform hover:bg-zinc-50 transition-all duration-300 ease-in-out">
              <div className="flex items-center">
                <span className="mr-2">
                  <IconActivity />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-gray-800">Sick Leave</h2>
                  <p className="text-xs text-gray-500">31 December 2024</p>
                </div>
              </div>
              <span className="bg-green-100 text-green-600 font-semibold py-1 px-2 text-xs rounded-full">Approved</span>
            </li>

            <li className="flex justify-between items-center border-b border-zinc-200 py-4 px-6 transform hover:bg-zinc-50 transition-all duration-300 ease-in-out">
              <div className="flex items-center">
                <span className="mr-2">
                  <IconActivity />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-gray-800">Sick Leave</h2>
                  <p className="text-xs text-gray-500">31 December 2024</p>
                </div>
              </div>
              <span className="bg-green-100 text-green-600 font-semibold py-1 px-2 text-xs rounded-full">Approved</span>
            </li>

            <li className="flex justify-between items-center border-b border-zinc-200 py-4 px-6 transform hover:bg-zinc-50 transition-all duration-300 ease-in-out">
              <div className="flex items-center">
                <span className="mr-2">
                  <IconActivity />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-gray-800">Sick Leave</h2>
                  <p className="text-xs text-gray-500">31 December 2024</p>
                </div>
              </div>
              <span className="bg-green-100 text-green-600 font-semibold py-1 px-2 text-xs rounded-full">Approved</span>
            </li>
          </div>
        </div>
      </div>
    </Layouts>
  );
};

export default Leave;
