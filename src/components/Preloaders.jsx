import React from "react";

export const Loading = () => {
  return (
    <div className="w-full flex justify-center items-center mt-56">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600"></div>
    </div>
  );
};
