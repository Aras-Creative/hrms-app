import React, { useEffect } from "react";
import BCAIcon from "../assets/bca-bank.png";
import MandiriIcon from "../assets/mandiri.png";
import BNIIcon from "../assets/bni.png";
import BRIIcon from "../assets/bri.png";
import CitiBankIcon from "../assets/citibank.png";
import DanamonIcon from "../assets/danamon.png";
import PermataIcon from "../assets/permata.png";
import BTPNIcon from "../assets/btpn.png";
import OCBCIcon from "../assets/ocbc.png";
import BNISyariahIcon from "../assets/bni-syariah.png";
import BSIIcon from "../assets/bsi.png";
import CIMBNiagaIcon from "../assets/cimb.png";
import { IconContract, IconFileTime, IconGenderFemale, IconGenderMale, IconHourglass } from "@tabler/icons-react";
import axiosInstance from "./axiosInstance";

export const religionOptions = [
  { label: "Islam", value: "Islam" },
  { label: "Protestan", value: "Protestan" },
  { label: "Katolik", value: "Katolik" },
  { label: "Hindu", value: "Hindu" },
  { label: "Buddha", value: "Buddha" },
  { label: "Khonghucu", value: "Khonghucu" },
];

export const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

export const bankOptions = [
  {
    label: (
      <div className="flex items-center gap-2">
        <img src={BCAIcon} alt="BCA" className="w-12" />
        Bank BCA
      </div>
    ),
    value: "BCA",
  },
  {
    label: (
      <div className="flex items-center gap-2">
        <img src={MandiriIcon} alt="Mandiri" className="w-12" />
        Mandiri
      </div>
    ),
    value: "Mandiri",
  },
  {
    label: (
      <div className="flex items-center gap-2">
        <img src={BNIIcon} alt="BNI" className="w-12" />
        BNI
      </div>
    ),
    value: "BNI",
  },
  {
    label: (
      <div className="flex items-center gap-2">
        <img src={BRIIcon} alt="BRI" className="w-12" />
        BRI
      </div>
    ),
    value: "BRI",
  },
  {
    label: (
      <div className="flex items-center gap-2">
        <img src={CitiBankIcon} alt="CitiBank" className="w-12" />
        CitiBank
      </div>
    ),
    value: "CitiBank",
  },
  {
    label: (
      <div className="flex items-center gap-2">
        <img src={DanamonIcon} alt="Bank Danamon" className="w-12" />
        Bank Danamon
      </div>
    ),
    value: "Danamon",
  },
  {
    label: (
      <div className="flex items-center gap-2">
        <img src={PermataIcon} alt="Bank Permata" className="w-12" />
        Bank Permata
      </div>
    ),
    value: "Permata",
  },
  {
    label: (
      <div className="flex items-center gap-2">
        <img src={BTPNIcon} alt="BTPN" className="w-12" />
        BTPN
      </div>
    ),
    value: "BTPN",
  },
  {
    label: (
      <div className="flex items-center gap-2">
        <img src={OCBCIcon} alt="OCBC NISP" className="w-12" />
        OCBC NISP
      </div>
    ),
    value: "OCBC",
  },
  {
    label: (
      <div className="flex items-center gap-2">
        <img src={BNISyariahIcon} alt="BNI Syariah" className="w-12" />
        Bank Negara Indonesia (BNI Syariah)
      </div>
    ),
    value: "BNI Syariah",
  },
  {
    label: (
      <div className="flex items-center gap-2">
        <img src={BSIIcon} alt="BSI" className="w-12" />
        Bank Syariah Indonesia (BSI)
      </div>
    ),
    value: "BSI",
  },
  {
    label: (
      <div className="flex items-center gap-2">
        <img src={CIMBNiagaIcon} alt="CIMB Niaga" className="w-12" />
        CIMB Niaga
      </div>
    ),
    value: "CIMB Niaga",
  },
];

export const genderFilterOptions = [
  {
    label: (
      <div className="flex items-center gap-1">
        <IconGenderMale size={18} />
        <span className="text-sm text-zinc-800">Male</span>
      </div>
    ),
    value: "Male",
  },
  {
    label: (
      <div className="flex items-center gap-1">
        <IconGenderFemale size={18} />
        <span className="text-sm text-zinc-800">Female</span>
      </div>
    ),
    value: "Female",
  },
];

export const fetchJobRoles = async (filter, dispatch, departmentId) => {
  if (filter) {
    let url = `/jobrole`;
    if (departmentId) {
      url = `/jobrole?dept=${departmentId}`;
    }
    try {
      const result = await axiosInstance.get(url);
      if (result.data.code === 200) {
        const jobRoleOptions = result.data.content.map((jobRole) => ({
          label: jobRole.jobRoleTitle,
          value: jobRole.jobRoleId,
        }));
        dispatch({ type: "SET_JOB_ROLE_OPTIONS", payload: jobRoleOptions });
      }
    } catch (error) {
      console.error("Error fetching job roles:", error);
    }
  }
};

export const fetchDepartment = async (filter, dispatch) => {
  if (filter) {
    try {
      const result = await axiosInstance.get("/department");
      if (result.data.code === 200) {
        const departmentOptions = result.data.content.map((department) => ({
          label: department?.departmentName,
          value: department.departmentId,
        }));
        dispatch({ type: "SET_DEPARTMENT_OPTIONS", payload: departmentOptions });
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }
};

export const LabelEmployementStatus = ({ label }) => {
  return (
    <div className="flex items-center gap-3">
      {label === "Full Time" ? <IconFileTime /> : label === "Contract" ? <IconContract /> : <IconHourglass />}
      <p className="text-slate-800">{label}</p>
    </div>
  );
};

export const employementStatusOptions = [
  {
    label: <LabelEmployementStatus label="Full Time" />,
    value: "Fulltime",
  },
  {
    label: <LabelEmployementStatus label={"Contract"} />,
    value: "Contract",
  },
  {
    label: <LabelEmployementStatus label={"Part Time"} />,
    value: "Part Time",
  },
];
