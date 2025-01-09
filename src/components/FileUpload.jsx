import {
  IconFileTypeDocx,
  IconFileTypeJpg,
  IconFileTypePdf,
  IconFileTypePng,
  IconFileTypeTxt,
  IconFileUnknown,
  IconLink,
  IconTrash,
} from "@tabler/icons-react";
import React, { useRef, useState } from "react";

const FileUpload = ({ label, updateFilesCb, error }) => {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    updateFilesCb(selectedFiles);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const selectedFiles = Array.from(event.dataTransfer.files);
    setFiles(selectedFiles);
    updateFilesCb(selectedFiles);
    setIsDragging(false);
  };

  const getFileIcon = (type) => {
    switch (true) {
      case type.includes("text/plain"):
        return <IconFileTypeTxt className="text-blue-500" />;
      case type.includes("pdf"):
        return <IconFileTypePdf className="text-red-500" />;
      case type.includes("wordprocessingml"):
        return <IconFileTypeDocx className="text-blue-700" />;
      case type.startsWith("image/jpeg"):
        return <IconFileTypeJpg className="text-green-500" />;
      case type.startsWith("image/png"):
        return <IconFileTypePng className="text-green-500" />;
      default:
        return <IconFileUnknown className="text-gray-500" />;
    }
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    updateFilesCb(updatedFiles);
  };

  console.log(error);

  return (
    <>
      <div
        className={`flex items-center px-3 gap-3 border-dashed py-2 w-full border rounded-xl group ${
          isDragging ? "border-indigo-500" : error ? "border-red-500" : "border-gray-400"
        } cursor-pointer`}
      >
        {/* Button and text are conditionally hidden when files are uploaded */}
        {files.length === 0 ? (
          <>
            <button
              onClick={() => fileInputRef.current.click()}
              className="bg-slate-800 rounded-lg text-white py-2 px-4 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-75"
            >
              <IconLink />
            </button>
            <div
              className="w-full"
              onClick={() => fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept=".docx, .pdf, .txt, image/*" />

              <p className="text-sm text-gray-600 w-full">{isDragging ? "Drop files here" : "Drag & drop files or click to upload"}</p>
            </div>
          </>
        ) : (
          <ul className="flex w-full">
            {files.map((file, index) => (
              <li key={index} className="text-sm w-full text-gray-600 flex items-center justify-between">
                <div className="flex items-center gap-2 w-2/3">
                  <div className="h-5 w-5 flex-shrink-0">{getFileIcon(file.type)}</div>
                  <span className="truncate">{file.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{(file.size / 1024).toFixed(2)} KB</span>
                  <button onClick={() => handleRemoveFile(index)} className="text-red-500 hover:text-red-700">
                    <IconTrash size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <div className="text-xs text-red-500 mt-3">{error}</div>}
    </>
  );
};

export default FileUpload;
