import React, { useState } from "react";
import Layouts from "./profile/Layouts";
import FormInput from "../../components/FormInput";
import Datepicker from "../../components/Datepicker";
import FileUpload from "../../components/FileUpload";
import useFetch from "../../hooks/useFetch";
import useAuth from "../../hooks/useAuth";
import Snackbar from "../../components/Snackbar";
import { useNavigate } from "react-router-dom";

const LeaveRequest = () => {
  const { profile } = useAuth();
  const [leaveType, setLeaveType] = useState("");
  const [errors, setErrors] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reason, setReason] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [toast, setToast] = useState({
    text: "",
    show: false,
  });

  const handleFileUpdate = (files) => {
    setUploadedFiles(files);
  };

  const { submitData: requestLeave, loading } = useFetch(`/employee/${profile?.fullName}/leave`, { method: "POST" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("leaveType", leaveType.value);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("reason", reason);
    formData.append("fullName", profile.fullName);
    formData.append("employeeId", profile.employeeId);
    uploadedFiles.forEach((file) => {
      formData.append("leaves_attachment", file);
    });

    const { success, error, data } = await requestLeave(formData);
    if (success) {
      setToast({ text: "Izin cuti kamu sudah diajukan!, cek notifikasi untuk melihat statusnya", show: true });
      setErrors({});
      navigate("/leave/success");
    } else {
      if (error && error.length > 0) {
        const mappedErrors = error.reduce((acc, errorObj) => {
          for (let field in errorObj) {
            acc[field] = errorObj[field][0];
          }
          return acc;
        }, {});
        setErrors(mappedErrors);
      }
    }
  };

  return (
    <Layouts title={"Buat Izin Cuti"} backUrl={"/homepage"}>
      <form onSubmit={handleSubmit} className="bg-white mt-14">
        <div className="w-full px-5 py-3">
          <FormInput
            type="select"
            options={[
              { label: "Sakit", value: "sakit" },
              { label: "Keluarga", value: "keluarga" },
              { label: "Liburan", value: "liburan" },
              { label: "Mendesak", value: "mendesak" },
              { label: "Pulang Awal", value: "pulang_awal" },
              { label: "Lainnya", value: "lainnya" },
            ]}
            placeholder={"Pilih Jenis Cuti"}
            label={"Jenis Cuti"}
            onChange={(e) => setLeaveType(e)}
            errors={errors.leaveType}
          />
          <div className="w-full grid grid-cols-1 gap-6 mt-4 mb-6">
            <div className="relative">
              <label className="block text-gray-700 text-sm font-medium mb-1 px-2">Tanggal Mulai</label>
              <div className="relative">
                <Datepicker
                  className="w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  defaultDate={startDate}
                  onChange={setStartDate}
                />
                <p className="text-xs text-red-500 mt-1 px-2">{errors.startDate}</p>
              </div>
            </div>

            <div className="relative">
              <label className="block text-gray-700 text-sm font-medium mb-1 px-2">Tanggal Selesai</label>
              <div className="relative">
                <Datepicker
                  className="w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  defaultDate={endDate}
                  onChange={setEndDate}
                />
                <p className="text-xs text-red-500 mt-1 px-2">{errors.endDate}</p>
              </div>
            </div>
          </div>
          <FormInput
            type="textarea"
            height={"36"}
            label={"Alasan"}
            placeholder={"Alasan"}
            value={reason}
            errors={errors.reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="mt-3">
            <h1 className="mb-2 text-sm px-2">Lampiran</h1>
            <FileUpload label="Attach Your Letter" updateFilesCb={handleFileUpdate} error={errors.attachment} />
          </div>
        </div>

        <div className="w-full mt-6 px-5">
          <button
            type="submit"
            disabled={loading}
            className={`bg-slate-800 hover:bg-slate-700 transition-all duration-300 ease-in-out text-white font-bold py-2 w-full rounded-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Buat Izin Cuti
          </button>
        </div>
      </form>

      {toast.show && <Snackbar text={toast.text} show={toast.show} />}
    </Layouts>
  );
};

export default LeaveRequest;
