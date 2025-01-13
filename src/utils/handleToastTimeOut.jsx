export const handleToastTimeout = (toastText, setToast) => {
  if (toastText) {
    const timer = setTimeout(() => setToast({ text: "", type: "" }), 3000);
    return () => clearTimeout(timer);
  }
};
