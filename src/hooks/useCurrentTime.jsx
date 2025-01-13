import { useEffect, useState } from "react";
import dayjs from "dayjs";

export const useCurrentTime = (interval = 60000) => {
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    setCurrentTime(dayjs());

    const now = dayjs();
    const delay = (60 - now.second()) * 1000;

    const timer = setTimeout(() => {
      setCurrentTime(dayjs());
      setInterval(() => {
        setCurrentTime(dayjs());
      }, interval);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [interval]);

  return currentTime;
};
