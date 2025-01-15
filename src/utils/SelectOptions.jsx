import React from "react";
import BCAIcon from "../assets/bank-logo/bca-bank.webp";
import MandiriIcon from "../assets/bank-logo/mandiri.webp";
import BNIIcon from "../assets/bank-logo/bni.webp";
import BRIIcon from "../assets/bank-logo/bri.webp";
import CitiBankIcon from "../assets/bank-logo/citibank.webp";
import DanamonIcon from "../assets/bank-logo/danamon.webp";
import PermataIcon from "../assets/bank-logo/permata.webp";
import BTPNIcon from "../assets/bank-logo/btpn.webp";
import OCBCIcon from "../assets/bank-logo/ocbc.webp";
import BNISyariahIcon from "../assets/bank-logo/bni-syariah.webp";
import BSIIcon from "../assets/bank-logo/bsi.webp";
import CIMBNiagaIcon from "../assets/bank-logo/cimb.webp";
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
  { label: "Laki-laki", value: "Laki-laki" },
  { label: "Perempuan", value: "Perempuan" },
  { label: "Lainnya", value: "Lainnya" },
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
        <span className="text-sm text-zinc-800">Laki-laki</span>
      </div>
    ),
    value: "Laki-laki",
  },
  {
    label: (
      <div className="flex items-center gap-1">
        <IconGenderFemale size={18} />
        <span className="text-sm text-zinc-800">Perempuan</span>
      </div>
    ),
    value: "Perempuan",
  },
];

export const fetchJobRoles = async (filter, dispatch) => {
  if (filter) {
    let url = `/jobrole`;
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
      dispatch({ type: "SET_JOB_ROLE_ERROR", payload: "Failed to fetch job roles." });
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

export const SalaryTypeOptions = [
  {
    label: "Monthly",
    value: "Monthly",
  },
  { label: "Weekly", value: "Weekly" },
  { label: "Daily", value: "Daily" },
  { label: "Hourly", value: "Hourly" },
];

export const attendanceFilter = [
  { label: "Pilih Filter", value: null },
  { label: "Terlambat", value: "Terlambat" },
  { label: "Hadir", value: "Hadir" },
  { label: "Istirahat", value: "Istirahat" },
  { label: "Pulang Awal", value: "Pulang Awal" },
  { label: "Cuti/Izin", value: "Izin Cuti" },
  { label: "Tidak Masuk", value: "Tidak Masuk" },
];

export const statusOptions = [
  {
    label: "Aktif",
    value: "aktif",
  },
  {
    label: "Nonaktif",
    value: "nonaktif",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Peringatan",
    value: "peringatan",
  },
  {
    label: "Kontrak Berakhir",
    value: "kontrak_berakhir",
  },
  {
    label: "Tanpa Kontrak",
    value: "tanpa_kontrak",
  },
];
