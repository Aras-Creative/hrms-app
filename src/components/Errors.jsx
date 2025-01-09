import React from "react";
import NoData from "../assets/error/no-data.webp";
import ServerError from "../assets/error/500.webp";

export const NotFound = () => (
  <div className="flex mt-48 items-center justify-center">
    <img src={NoData} alt="No Data" className="w-96 h-auto" />
  </div>
);

export const InternalServerError = () => (
  <div className="flex mt-48 items-center justify-center">
    <img src={ServerError} alt="Server Error" className="w-96 h-auto" />
  </div>
);
