import { useState, useMemo } from "react";

const useMonthRange = (initialMonth) => {
  const currentDate = useMemo(() => new Date(), []);
  const MAX_MONTH = useMemo(() => currentDate.getMonth() + 1, [currentDate]);
  const MIN_MONTH = useMemo(() => currentDate.getMonth(), [currentDate]);

  const [selectedMonth, setSelectedMonth] = useState(initialMonth);

  const changeMonth = (action) => {
    let [year, month] = selectedMonth.split("-").map(Number);

    if (action === "nextMonth" && month < MAX_MONTH) {
      month++;
    } else if (action === "prevMonth" && month > MIN_MONTH) {
      month--;
    }

    const newMonth = `${year}-${month.toString().padStart(2, "0")}`;
    setSelectedMonth(newMonth);
  };

  return { selectedMonth, changeMonth, MAX_MONTH, MIN_MONTH };
};

export default useMonthRange;
