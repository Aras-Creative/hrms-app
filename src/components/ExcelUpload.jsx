// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import { IconFileImport, IconFileUpload, IconTrash, IconX } from "@tabler/icons-react";
// import useFetch from "../hooks/useFetch";
// import { validateHeaders } from "../utils/excelValidations";
// import Toast from "./Toast";

// const ExcelUpload = ({ expectedHeaders, postUrl, columns, validate }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [excelData, setExcelData] = useState([]);
//   const [fileName, setFileName] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [headerValidation, setHeaderValidation] = useState(null);
//   const [toast, setToast] = useState({ text: "", type: "" });
//   const excelColumns = columns(excelData);
//   const [sheets, setSheets] = useState([]);
//   const [selectedSheet, setSelectedSheet] = useState(0);

// const headers = excelData[1]?.map((h) => h?.replace(/\s+/g, " ").trim()).filter(Boolean);
// const rows = excelData?.slice(2).filter((row) => row.some((cell) => cell)) || [];

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const file = e.dataTransfer.files[0];
//     if (file) processFile(file);
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) processFile(file);
//   };

//   const processFile = (file) => {
//     setFileName(file.name);
//     const reader = new FileReader();

//     reader.onload = (e) => {
//       const abuf = e.target.result;
//       const wb = XLSX.read(abuf, { type: "array" });
//       const ws = wb.Sheets[wb.SheetNames[selectedSheet]];
//       const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
//       setExcelData(data);
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   const loadSheet = (wb, sheetName) => {
//     const ws = wb.Sheets[sheetName];
//     const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
//     setExcelData(data);
//   };

//   const handleSheetChange = (e) => {
//     const sheetName = e.target.value;
//     setSelectedSheet(sheetName);

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const abuf = e.target.result;
//       const wb = XLSX.read(abuf, { type: "array" });
//       loadSheet(wb, sheetName);
//     };
//     reader.readAsArrayBuffer(document.getElementById("fileInput").files[0]);
//   };

//   const { submitData: uploadFile, loading } = useFetch(postUrl, { method: "POST" });

//   const handleUpload = async () => {
//     try {
//       const data = excelData
//         .slice(2)
//         .filter((row) => row.some((cell) => cell !== undefined && cell !== ""))
//         .map((row) => {
//           return headers.reduce((obj, header, index) => {
//             let value = row[index];

//             if (typeof value === "number") {
//               value = parseFloat(value.toFixed(0));
//             }

//             obj[header] = value !== undefined ? value : "";
//             return obj;
//           }, {});
//         });

//       const { success, error } = await uploadFile(data);
//       if (success) {
//         setToast({ type: "success", text: "File berhasil diunggah." });
//         setIsModalOpen(false);
//       } else {
//         setToast({ type: "error", text: "Error saat mengimport file" });
//       }
//     } catch (err) {
//       setToast({ type: "error", text: "Error saat mengimport file" });
//     }
//   };

//   const resetFileInput = () => {
//     setFileName(null);
//     setExcelData([]);
//     setHeaderValidation(null);
//     const fileInput = document.getElementById("fileInput");
//     if (fileInput) {
//       fileInput.value = "";
//     }
//   };

// const formatValue = (value) => {
//   if (typeof value === "number") {
//     if (value >= 1000) {
//       return new Intl.NumberFormat("id-ID", {
//         style: "currency",
//         currency: "IDR",
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 0,
//       }).format(value);
//     } else if (value > 0 && value < 1) {
//       return `${(value * 100).toFixed(1)}%`;
//     }
//   }
//   return value || "-";
// };

//   console.log(sheets);

//   return (
//     <>
//       <button
//         onClick={() => setIsModalOpen(true)}
//         className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700"
//       >
//         <IconFileImport />
//         Upload Excel
//       </button>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-6xl shadow-lg relative">
//             <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
//               <IconX />
//             </button>
//             <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload Excel File</h2>
//             <div
//               className={`border-2 rounded-md border-dashed ${
//                 isDragging ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-gray-100"
//               } p-6 flex flex-col items-center justify-center mb-4`}
//               onDragOver={handleDragOver}
//               onDragLeave={handleDragLeave}
//               onDrop={handleDrop}
//             >
//               <IconFileUpload size={40} className="text-gray-500 mb-2" />
//               <p className="text-sm text-gray-600">{fileName ? `File: ${fileName}` : "Drag and drop your file here"}</p>
//               <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="hidden" id="fileInput" />
//               <label htmlFor="fileInput" className="mt-2 px-4 py-2 bg-emerald-700 text-white rounded-md cursor-pointer hover:bg-emerald-700">
//                 Browse
//               </label>
//             </div>

//             {sheets.length > 0 && (
//               <div className="mt-4">
//                 <label className="text-sm font-semibold">Pilih Sheet:</label>
//                 <select value={selectedSheet} onChange={handleSheetChange} className="ml-2 p-2 border rounded-md">
//                   {sheets.map((sheet, idx) => (
//                     <option key={idx} value={sheet}>
//                       {sheet}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}

// {excelData.length > 0 && (
//   <div className="overflow-auto max-h-60 border rounded-md mb-4">
//     <table className="w-full border-collapse text-sm">
//       <thead>
//         <tr>
//           {headers.map((header, idx) => (
//             <th key={idx} style={{ padding: "8px", background: "#f4f4f4" }}>
//               {header}
//             </th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {rows.map((row, rowIndex) => (
//           <tr key={rowIndex} className="hover:bg-yellow-200">
//             {headers.map((header, colIndex) => (
//               <td key={colIndex} className="p-2 text-center border">
//                 {formatValue(row[colIndex])}
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// )}
//             <div className="flex justify-between items-center">
//               <button onClick={resetFileInput} className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
//                 <IconTrash size={16} className="mr-2" />
//                 Clear
//               </button>
//               <button
//                 onClick={handleUpload}
//                 disabled={!fileName || loading}
//                 className={`px-4 py-2 rounded-md text-white ${
//                   !fileName || loading ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-700 hover:bg-emerald-800"
//                 }`}
//               >
//                 {loading ? "Uploading..." : "Upload"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {toast.text !== "" && <Toast text={toast.text} type={toast.type || "error"} onClick={() => setToast({ text: "", type: "" })} />}
//     </>
//   );
// };

// export default ExcelUpload;

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { IconFileImport, IconFileUpload, IconTrash, IconX } from "@tabler/icons-react";
import useFetch from "../hooks/useFetch";
import Toast from "./Toast";

const ExcelUpload = ({ postUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [toast, setToast] = useState({ text: "", type: "" });
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [workbook, setWorkbook] = useState(null); // Simpan workbook setelah file dibaca\

  const formatValue = (value) => {
    if (typeof value === "number") {
      if (value >= 1000) {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      } else if (value > 0 && value < 1) {
        return `${(value * 100).toFixed(1)}%`;
      }
    }
    return value || "-";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

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

      setWorkbook(wb); // Simpan workbook agar bisa dipakai untuk ganti sheet
      setSheets(wb.SheetNames); // Simpan daftar sheet
      setSelectedSheet(wb.SheetNames[0]); // Pilih sheet pertama

      loadSheet(wb, wb.SheetNames[0]); // Load sheet pertama sebagai default
    };

    reader.readAsArrayBuffer(file);
  };

  const loadSheet = (wb, sheetName) => {
    const ws = wb.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    setExcelData(data);
  };

  const handleSheetChange = (e) => {
    const sheetName = e.target.value;
    setSelectedSheet(sheetName);
    if (workbook) {
      loadSheet(workbook, sheetName);
    }
  };

  const { submitData: uploadFile, loading } = useFetch(postUrl, { method: "POST" });

  const handleUpload = async () => {
    if (!excelData.length) {
      setToast({ type: "error", text: "Tidak ada data yang bisa diunggah." });
      return;
    }

    try {
      const headers = excelData[1]?.map((h) => h?.replace(/\s+/g, " ").trim()).filter(Boolean);
      const rows = excelData?.slice(2).filter((row) => row.some((cell) => cell)) || [];
      const data = rows.map((row) =>
        headers.reduce((obj, header, index) => {
          obj[header] = row[index] || "";
          return obj;
        }, {})
      );

      const { success } = await uploadFile(data);
      if (success) {
        setToast({ type: "success", text: "File berhasil diunggah." });
        setIsModalOpen(false);
      } else {
        setToast({ type: "error", text: "Gagal mengunggah file." });
      }
    } catch (err) {
      setToast({ type: "error", text: "Terjadi kesalahan saat mengunggah file." });
    }
  };

  const resetFileInput = () => {
    setFileName(null);
    setExcelData([]);
    setSheets([]);
    setSelectedSheet("");
    setWorkbook(null);
    const fileInput = document.getElementById("fileInput");
    if (fileInput) fileInput.value = "";
  };

  const headers = excelData[1]?.map((h) => h?.replace(/\s+/g, " ").trim()).filter(Boolean);
  const rows = excelData?.slice(2).filter((row) => row.some((cell) => cell)) || [];

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700"
      >
        <IconFileImport />
        Upload Excel
      </button>

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
              <label htmlFor="fileInput" className="mt-2 px-4 py-2 bg-emerald-700 text-white rounded-md cursor-pointer hover:bg-emerald-800">
                Browse
              </label>
            </div>

            {sheets.length > 0 && (
              <div className="mt-4">
                <label className="text-sm font-semibold">Pilih Sheet:</label>
                <select value={selectedSheet} onChange={handleSheetChange} className="ml-2 p-2 border rounded-md">
                  {sheets.map((sheet, idx) => (
                    <option key={idx} value={sheet}>
                      {sheet}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {excelData.length > 0 && (
              <div className="overflow-auto max-h-60 border rounded-md mb-4">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      {headers.map((header, idx) => (
                        <th key={idx} style={{ padding: "8px", background: "#f4f4f4" }}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-yellow-200">
                        {headers.map((header, colIndex) => (
                          <td key={colIndex} className="p-2 text-center border">
                            {formatValue(row[colIndex])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-between items-center">
              <button onClick={resetFileInput} className="px-4 whitespace-nowrap py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                <IconTrash size={16} className="mr-2" />
                Clear
              </button>
              <button onClick={handleUpload} disabled={!fileName || loading} className="px-4 py-2 bg-emerald-700 text-white rounded-md">
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast.text && <Toast text={toast.text} type={toast.type} onClick={() => setToast({ text: "", type: "" })} />}
    </>
  );
};

export default ExcelUpload;
