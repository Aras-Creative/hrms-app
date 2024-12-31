import { useRef } from "react";

const useDebounce = (callback, delay) => {
  const debounceRef = useRef(null);
  return (args) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => callback(args), delay);
  };
};

export default useDebounce;
