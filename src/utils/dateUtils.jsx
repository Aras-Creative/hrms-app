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
