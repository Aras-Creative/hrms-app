export const formatPhoneNumber = (e) => {
  let input = e.target.value;

  // Hapus karakter non-digit
  input = input.replace(/\D/g, "");

  // Batasi panjang input maksimum 13 digit
  if (input.length > 13) {
    input = input.substring(0, 15);
  }

  // Jika nomor dimulai dengan 0, ubah menjadi 62 (kode negara Indonesia)
  if (input.startsWith("0")) {
    input = "62" + input.substring(1);
  }

  // Format input sesuai panjangnya
  if (input.length <= 2) {
    e.target.value = `(+${input})`; // Format (XX)
  } else if (input.length <= 5) {
    e.target.value = `(+${input.slice(0, 2)}) ${input.slice(2)}`; // Format (XX) XXX
  } else if (input.length <= 8) {
    e.target.value = `(+${input.slice(0, 2)}) ${input.slice(2, 5)}-${input.slice(5)}`; // Format (XX) XXX-XXXX
  } else {
    e.target.value = `(+${input.slice(0, 2)}) ${input.slice(2, 5)}-${input.slice(5, 9)}-${input.slice(9, 15)}`; // Format (XX) XXX-XXX-XXXX
  }
};
