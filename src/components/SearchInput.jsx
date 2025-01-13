import React from "react";
import { IconSearch } from "@tabler/icons-react";

const SearchInput = ({ searchQuery, handleSearchChange }) => (
  <div className="flex items-center bg-white border rounded-full w-1/3 p-2">
    <IconSearch />
    <input
      type="text"
      onChange={handleSearchChange}
      value={searchQuery}
      placeholder="Search employee name..."
      className="ml-2 w-full bg-transparent border-none focus:outline-none text-sm text-gray-600"
    />
  </div>
);

export default SearchInput;
