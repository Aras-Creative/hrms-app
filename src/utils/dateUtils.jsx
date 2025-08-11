export const getLastDayOfMonth = (dateString) => {
  const lastDay = new Date(dateString);
  lastDay.setMonth(lastDay.getMonth() + 1);
  lastDay.setDate(0);
  return lastDay.toLocaleDateString("en-CA");
};

export const getGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return "Selamat Pagi";
  } else if (currentHour < 18) {
    return "Selamat Siang";
  } else {
    return "Selamat Malam";
  }
};
export function getMotivation() {
  const quotes = [
    "Setiap langkah kecil mendekatkan kita ke tujuan.",
    "Produktivitas adalah kunci kesuksesan.",
    "Jadilah versi terbaik dirimu.",
    "Fokus pada proses, hasil akan mengikuti.",
    "Gunakan waktu dengan bijak.",
    "Hari ini adalah kesempatan baru.",
    "Kerja keras hari ini, sukses esok.",
    "Ciptakan motivasi sendiri.",
    "Konsistensi adalah kunci.",
    "Bekerja dengan semangat!",
    "Mulai dari mana pun kamu berada, gunakan apa pun yang kamu miliki.",
    "Jangan pernah menyerah pada mimpi.",
    "Sukses bukan akhir, kegagalan bukan fatal.",
    "Cintai apa yang kamu lakukan.",
    "Masa depanmu diciptakan oleh apa yang kamu lakukan hari ini.",
    "Dorong dirimu sendiri.",
    "Kesempatan muncul saat kamu menghancurkan pintu.",
    "Kamu melewatkan 100% tembakan yang tidak kamu ambil.",
    "Percayalah kamu bisa, dan kamu sudah setengah jalan.",
    "Satu-satunya cara menghindari kritik: jangan lakukan apa pun.",
    "Keberanian adalah kunci.",
    "Semakin keras kamu bekerja, semakin besar perasaanmu.",
    "Jangan menghitung hari, buat hari-harimu berarti.",
    "Impian tidak akan bekerja kecuali kamu melakukannya.",
    "Apa yang kita capai di dalam, mengubah realitas di luar.",
    "Cobalah menjadi orang yang bernilai, bukan hanya sukses.",
    "Jangan biarkan kemarin mengambil terlalu banyak hari ini.",
    "Kamu tidak harus hebat untuk memulai.",
    "Hidup itu 10% apa yang terjadi padamu, 90% bagaimana kamu bereaksi.",
    "Pikiran adalah segalanya. Apa yang kamu pikirkan, kamu akan jadi.",
    "Waktu adalah uang.",
    "Berani bermimpi besar, berani berjuang lebih keras.",
    "Kegagalan adalah guru terbaik.",
    "Belajar adalah proses seumur hidup.",
    "Bersyukur atas setiap kemajuan.",
    "Jangan takut mencoba hal baru.",
    "Kembangkan dirimu setiap hari.",
    "Berikan yang terbaik di setiap kesempatan.",
    "Tingkatkan potensimu.",
    "Disiplin diri adalah kebebasan.",
    "Fokus pada solusi, bukan masalah.",
    "Setiap tantangan adalah peluang.",
    "Inovasi adalah kunci kemajuan.",
    "Jadilah proaktif.",
    "Kerja cerdas, bukan hanya keras.",
    "Kelilingi dirimu dengan orang-orang positif.",
    "Visi tanpa eksekusi hanyalah halusinasi.",
    "Bangun kebiasaan baik.",
    "Selalu ada ruang untuk perbaikan.",
    "Hadapi ketakutanmu.",
    "Jangan tunda pekerjaanmu.",
    "Rencanakan harimu.",
    "Prioritaskan tugasmu.",
    "Kualitas lebih penting dari kuantitas.",
    "Pelajari dari kesalahanmu.",
    "Rayakan kemenangan kecil.",
    "Bersabarlah dengan prosesnya.",
    "Percaya pada kemampuanmu.",
    "Kamu lebih kuat dari yang kamu kira.",
    "Buat perbedaan hari ini.",
    "Jadilah inspirasi bagi orang lain.",
    "Berpikir positif, hasil positif.",
    "Jangan bandingkan dirimu.",
    "Fokus pada perjalanan, bukan hanya tujuan.",
    "Setiap pagi adalah awal yang baru.",
    "Jaga kesehatanmu.",
    "Istirahat itu penting.",
    "Delegasikan jika perlu.",
    "Sederhanakan tugasmu.",
    "Jangan takut meminta bantuan.",
    "Berani mengambil risiko.",
    "Keluar dari zona nyamanmu.",
    "Setiap hari adalah pelajaran.",
    "Hargai setiap momen.",
    "Berikan perhatian penuh.",
    "Jangan biarkan gangguan menghalangimu.",
    "Bangun jaringan yang kuat.",
    "Berbagi pengetahuanmu.",
    "Jadilah mentor dan murid.",
    "Fleksibilitas itu kekuatan.",
    "Adaptasi, jangan menyerah.",
    "Selesaikan apa yang kamu mulai.",
    "Keuletan membayar mahal.",
    "Ciptakan dampak positif.",
    "Sambut tantangan dengan antusiasme.",
    "Tetap rendah hati, tetap haus.",
    "Kuasai keterampilan baru.",
    "Jadilah pembelajar seumur hidup.",
    "Jangan biarkan kritik menjatuhkanmu.",
    "Gunakan kritikan untuk tumbuh.",
    "Fokus pada apa yang bisa kamu kontrol.",
    "Lepaskan apa yang tidak bisa kamu kontrol.",
    "Rangkullah ketidakpastian.",
    "Jadilah agen perubahan.",
    "Miliki tujuan yang jelas.",
    "Visualisasikan kesuksesanmu.",
    "Tetap positif dalam kesulitan.",
    "Setiap kegagalan adalah fondasi.",
    "Percayalah pada waktumu.",
    "Kejarlah keunggulan.",
    "Berinovasi terus-menerus.",
    "Jadilah yang pertama untuk berubah.",
    "Berikan nilai lebih.",
    "Bantu orang lain berhasil.",
    "Kembangkan kepemimpinanmu.",
    "Jadilah pendengar yang baik.",
    "Berkomunikasi dengan jelas.",
    "Bangun hubungan yang kuat.",
    "Jadilah otentik.",
    "Kejar passion-mu.",
    "Hidupkan impianmu.",
    "Sekarang adalah waktu terbaik.",
    "Jangan menunggu kesempatan, ciptakanlah.",
    "Hidup untuk menciptakan.",
    "Dapatkan inspirasi dari mana saja.",
    "Bagikan inspirasimu.",
    "Dunia menanti kontribusimu.",
    "Lakukan hal-hal yang menakutkanmu.",
    "Ubah ketakutan menjadi kekuatan.",
    "Tunjukkan inisiatif.",
    "Jadilah solusi.",
    "Fokus pada yang penting.",
    "Kurangi hal yang tidak penting.",
    "Sederhanakan hidupmu.",
    "Temukan bahagiamu dalam proses.",
    "Cintai apa yang kamu lakukan.",
    "Bermimpi besar, bekerja keras, tetap fokus.",
    "Setiap hari adalah kesempatan untuk menjadi lebih baik.",
    "Jangan pernah berhenti belajar.",
    "Tindakan adalah kunci fundamental.",
    "Batasan hanyalah ilusi.",
    "Bangun jembatan, bukan tembok.",
    "Jadilah perubahan yang ingin kamu lihat.",
  ];

  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

export const generateMonthSelection = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  return [
    {
      value: new Date(currentYear, currentMonth, 1).toLocaleDateString("en-CA"),
      label: new Date(currentYear, currentMonth, 1).toLocaleDateString("id-ID", { month: "long" }),
    },
    {
      value: new Date(currentYear, previousMonth, 1).toLocaleDateString("en-CA"),
      label: new Date(currentYear, previousMonth, 1).toLocaleString("id-ID", { month: "long" }),
    },
  ];
};

export const handleDatePick = (setFormData) => (formName) => (field) => (selectedDate) => {
  const formattedDate = new Date(selectedDate).toLocaleDateString("en-CA");

  setFormData((prevData) => {
    const existingDate = prevData[formName]?.[field];
    if (existingDate === formattedDate) return prevData;
    return {
      ...prevData,
      [formName]: {
        ...prevData[formName],
        [field]: formattedDate,
      },
    };
  });
};

export const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", { day: "numeric", weekday: "long", month: "long", year: "numeric" });
};

export const formatTimeOnly = (datetime) => {
  if (!datetime) return "-";
  return new Date(datetime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
};
