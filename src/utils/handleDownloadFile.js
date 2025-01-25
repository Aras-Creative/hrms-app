import axiosInstance from "./axiosInstance";

export const handleDownloadFile = (path, fileName, handleError) => {
  axiosInstance
    .get(path, { method: "GET", responseType: "blob" })
    .then((response) => {
      const blob = new Blob([response.data]);

      // Android: Menggunakan metode native Android
      if (window.Android && typeof window.Android.downloadFile === "function") {
        const reader = new FileReader();
        reader.onload = function () {
          const base64data = reader.result.split(",")[1];
          const mimeType = response.headers["content-type"] || "application/octet-stream";
          window.Android.downloadFile(fileName, base64data, mimeType);
        };
        reader.readAsDataURL(blob);
      }
      // iOS: Membuka file di tab baru menggunakan Data URL
      else if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        const reader = new FileReader();
        reader.onloadend = function () {
          const dataUrl = reader.result;
          const newTab = window.open(dataUrl, "_blank");
          if (!newTab) {
            handleError({
              type: "error",
              message: "Tidak dapat membuka file. Pastikan pop-up diizinkan.",
            });
          }
        };
        reader.readAsDataURL(blob);
      }
      // Browser lainnya: Unduh menggunakan Blob dan <a> element
      else if (typeof window !== "undefined" && (window.location.protocol === "http:" || window.location.protocol === "https:")) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      }
      // Fallback: Platform tidak mendukung
      else {
        handleError({ type: "error", message: "Platform tidak mendukung pengunduhan file." });
      }
    })
    .catch((error) => {
      handleError({ type: "error", message: "Gagal Mengunduh File." });
    });
};
