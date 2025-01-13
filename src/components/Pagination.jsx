import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 bg-white rounded-b-lg py-1 ">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="text-slate-800 disabled:text-gray-400 px-3 py-1 hover:bg-gray-100 disabled:hover:bg-transparent rounded-md transition"
      >
        <IconChevronLeft />
      </button>
      <span className="text-sm font-medium text-gray-700 px-4 py-1">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="text-slate-800 disabled:text-gray-400 px-3 py-1 hover:bg-gray-100 disabled:hover:bg-transparent rounded-md transition"
      >
        <IconChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
