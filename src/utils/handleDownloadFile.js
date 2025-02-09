import axiosInstance from "./axiosInstance";

export const handleDownloadFile = (path, fileName, handleError) => {
  axiosInstance
    .get(path, { method: "GET", responseType: "blob" })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      handleError({ type: "error", message: "Gagal Mengunduh Laporan Kehadiran" });
    });
};
