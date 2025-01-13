import BCABank from "../assets/bank-logo/bca-bank.webp";
import BNIBank from "../assets/bank-logo/BNI.webp";
import BNISBank from "../assets/bank-logo/bni-syariah.webp";
import BRIBank from "../assets/bank-logo/bri.webp";
import BSIBank from "../assets/bank-logo/bsi.webp";
import BTPNBank from "../assets/bank-logo/btpn.webp";
import CIMBBank from "../assets/bank-logo/cimb.webp";
import CitiBank from "../assets/bank-logo/citibank.webp";
import DanamonBank from "../assets/bank-logo/danamon.webp";
import MandiriBank from "../assets/bank-logo/mandiri.webp";
import OCBCBank from "../assets/bank-logo/ocbc.webp";
import PermataBank from "../assets/bank-logo/permata.webp";
import BPJSLogoKS from "../assets/bpjs_ks.webp";
import BPJSLogoKT from "../assets/bpjs_kt.webp";

// Objek yang menyimpan gambar-gambar bank
const bankImages = {
  BCA: BCABank,
  Mandiri: MandiriBank,
  BNI: BNIBank,
  BNI_Syariah: BNISBank,
  BRI: BRIBank,
  BSI: BSIBank,
  BTPN: BTPNBank,
  CIMB: CIMBBank,
  Citibank: CitiBank,
  Danamon: DanamonBank,
  OCBC: OCBCBank,
  Permata: PermataBank,
};

/**
 * Fungsi untuk mendapatkan gambar bank berdasarkan nama bank.
 * @param {string} bankName - Nama bank
 * @returns {string|null} - URL gambar bank atau null jika tidak ditemukan
 */
export const getBankImage = (bankName) => {
  return bankImages[bankName] || null; // Mengembalikan gambar bank atau null jika tidak ada
};

const bpjsImage = {
  BPJSKT: BPJSLogoKT,
  BPJSKS: BPJSLogoKS,
};

export const getBPJSImage = (bpjsName) => {
  return bpjsImage[bpjsName] || null;
};
