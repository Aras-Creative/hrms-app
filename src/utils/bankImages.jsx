import BCABank from "../assets/bca-bank.png";
import BNIBank from "../assets/BNI.png";
import BNISBank from "../assets/bni-syariah.png";
import BRIBank from "../assets/bri.png";
import BSIBank from "../assets/bsi.png";
import BTPNBank from "../assets/btpn.png";
import CIMBBank from "../assets/cimb.png";
import CitiBank from "../assets/citibank.png";
import DanamonBank from "../assets/danamon.png";
import MandiriBank from "../assets/mandiri.png";
import OCBCBank from "../assets/ocbc.png";
import PermataBank from "../assets/permata.png";

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
