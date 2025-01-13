import React, { useState } from "react";
import * as XLSX from "xlsx";
import { IconFileImport, IconFileUpload, IconTrash, IconX } from "@tabler/icons-react";
import useFetch from "../hooks/useFetch";
import { processExcelData, validateData, validateHeaders } from "../utils/excelValidations";
import Toast from "./Toast";

const ExcelUpload = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [headerValidation, setHeaderValidation] = useState(null);
  const [toast, setToast] = useState({ text: "", type: "" });

  const isValidDate = (cell) => typeof cell === "number" && !isNaN(cell);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const processFile = (file) => {
    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      const abuf = e.target.result;
      const wb = XLSX.read(abuf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      setExcelData(data);
    };

    reader.readAsArrayBuffer(file);
  };

  const { submitData: uploadFile } = useFetch("/document/employee", { method: "POST" });
  const expectedHeaders = ["No", "Nama", "Bagian", "Tempat Lahir", "Tanggal Lahir", "No KTP", "Alamat"];

  const handleUpload = async () => {
    const headerValidation = validateHeaders(excelData[0], expectedHeaders);
    if (headerValidation) {
      setHeaderValidation(headerValidation.errors);
      setToast({ text: headerValidation.error, type: "error" });
      return;
    }
    const processedData = processExcelData(excelData);
    const dataValidation = validateData(processedData);
    if (dataValidation) {
      setToast({ type: "error", text: "Data tidak valid" });
      return;
    }
    const data = { data: processedData };
    try {
      const { success, error } = await uploadFile(data);
      if (success) {
        setToast({ type: "success", text: "File berhasil diunggah." });
      } else {
        setToast({ type: "error", text: "Error saat mengimport file" });
      }
    } catch (err) {
      setToast({ type: "error", text: "Error saat mengimport file" });
    }
  };

  const resetFileInput = () => {
    setFileName(null);
    setExcelData([]);
    setHeaderValidation(null);
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700"
      >
        <IconFileImport />
        Upload Excel
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl shadow-lg relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
              <IconX />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload Excel File</h2>
            <div
              className={`border-2 rounded-md border-dashed ${
                isDragging ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-gray-100"
              } p-6 flex flex-col items-center justify-center mb-4`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <IconFileUpload size={40} className="text-gray-500 mb-2" />
              <p className="text-sm text-gray-600">{fileName ? `File: ${fileName}` : "Drag and drop your file here"}</p>
              <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="hidden" id="fileInput" />
              <label htmlFor="fileInput" className="mt-2 px-4 py-2 bg-emerald-700 text-white rounded-md cursor-pointer hover:bg-emerald-700">
                Browse
              </label>
            </div>

            {excelData.length > 0 && (
              <div className="overflow-auto max-h-60 border rounded-md mb-4">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      {expectedHeaders.map((header, index) => {
                        const receivedHeader = excelData[0][index];
                        const error = headerValidation?.find((err) => err.index === index);
                        return (
                          <th key={index} className={`border px-4 py-2 ${error ? "bg-red-100 text-red-600 border-red-400" : ""} hover:bg-yellow-50`}>
                            <div className="font-semibold">{receivedHeader}</div>
                            {error && (
                              <div className="text-xs text-red-500 mt-2">
                                <span className="block">
                                  Diharapkan: <strong>{error.expected}</strong>
                                </span>
                              </div>
                            )}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {excelData.slice(1).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => {
                          const displayValue = isValidDate(cell)
                            ? new Date(Math.round((cell - 25569) * 864e5)).getFullYear() > 1900
                              ? new Date(Math.round((cell - 25569) * 864e5)).toLocaleDateString("en-CA")
                              : cell
                            : cell;
                          return (
                            <td key={cellIndex} className="border px-2 py-1 text-center">
                              {displayValue}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex justify-between items-center">
              <button onClick={resetFileInput} className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                <IconTrash size={16} className="mr-2" />
                Clear
              </button>
              <button
                onClick={handleUpload}
                disabled={!fileName || isLoading}
                className={`px-4 py-2 rounded-md text-white ${
                  !fileName || isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-700 hover:bg-emerald-800"
                }`}
              >
                {isLoading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
      {toast.text !== "" && <Toast text={toast.text} type={toast.type || "error"} onClick={() => setToast({ text: "", type: "" })} />}
    </>
  );
};

export default ExcelUpload;
