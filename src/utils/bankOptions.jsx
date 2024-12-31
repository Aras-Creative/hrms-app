import React from "react";
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

const bankOptions = [
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

export default bankOptions;
