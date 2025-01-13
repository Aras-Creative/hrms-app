import React from "react";
import { IconChevronDown, IconFilter } from "@tabler/icons-react";
import FormInput from "./FormInput";
import { genderFilterOptions, statusOptions } from "../utils/SelectOptions";
import { toTitleCase } from "../utils/toTitleCase";

const FilterDropdown = ({ filter, filterParams, jobRoleOptions, dispatch }) => (
  <div className="relative">
    <button
      type="button"
      onClick={() => dispatch({ type: "TOGGLE_FILTER" })}
      className="bg-white border rounded-lg px-4 py-2 flex items-center gap-1"
    >
      <div className="pr-2">
        <div
          className={`h-5 w-5 items-center ${
            !filterParams.gender && !filterParams.jobRole.jobRoleId && !filterParams.status ? "hidden" : "flex"
          } justify-center text-xs text-white rounded-full bg-emerald-700`}
        >
          {[filterParams.gender ? 1 : 0, filterParams.jobRole.jobRoleId ? 1 : 0, filterParams.status ? 1 : 0].reduce((total, num) => total + num, 0)}
        </div>
      </div>
      <IconFilter size={16} />
      Filter
      <div className="pl-2">
        <IconChevronDown size={12} />
      </div>
    </button>
    {filter && (
      <div className="absolute flex items-start top-12 gap-1 w-64 right-0 flex-row-reverse">
        <div className="bg-white rounded-xl shadow w-full px-4 py-3">
          <div className="pb-1 flex justify-between items-center">
            <h1 className="text-sm font-semibold">Pilih Filter</h1>
            <button
              type="button"
              onClick={() => {
                dispatch({
                  type: "SET_FILTER_PARAMS",
                  payload: { gender: "", jobRole: { jobRoleId: "", jobRoleTitle: "" } },
                });
                dispatch({ type: "TOGGLE_FILTER" });
              }}
              className="text-emerald-700 text-xs"
            >
              Bersihkan filter
            </button>
          </div>
          <FormInput
            type="select"
            options={genderFilterOptions}
            placeholder={"Filter jenis kelamin"}
            value={{
              label: filterParams.gender || "Pilih jenis kelamin",
              value: filterParams.gender,
            }}
            onChange={(e) => dispatch({ type: "SET_FILTER_PARAMS", payload: { ...filterParams, gender: e.value } })}
          />
          <FormInput
            type="select"
            options={statusOptions}
            placeholder={"Filter Status"}
            value={{
              label: toTitleCase(filterParams.status) || "Pilih status",
              value: filterParams.status,
            }}
            onChange={(e) => dispatch({ type: "SET_FILTER_PARAMS", payload: { ...filterParams, status: e.value } })}
          />
          <FormInput
            type="select"
            options={jobRoleOptions}
            placeholder={"Filter job role"}
            value={filterParams.jobRole.jobRoleId ? { label: filterParams.jobRole.jobRoleTitle, value: filterParams.jobRole.jobRoleId } : null}
            onChange={(e) =>
              dispatch({
                type: "SET_FILTER_PARAMS",
                payload: { ...filterParams, jobRole: { jobRoleId: e.value, jobRoleTitle: e.label } },
              })
            }
          />
        </div>
      </div>
    )}
  </div>
);

export default FilterDropdown;
