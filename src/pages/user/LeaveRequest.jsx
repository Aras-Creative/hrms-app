import React, { useEffect, useState } from "react";
import Layouts from "./profile/Layouts";
import FormInput from "../../components/FormInput";
import Datepicker from "../../components/Datepicker";
import FileUpload from "../../components/FileUpload";
import useFetch from "../../hooks/useFetch";
import useAuth from "../../hooks/useAuth";
import Snackbar from "../../components/Snackbar";
import { useNavigate } from "react-router-dom";

const leaveOptions = [
  { label: "Cuti Sakit", value: "sakit", maxDays: 30 },
  { label: "Cuti Tahunan", value: "cuti_tahunan", maxDays: 11 },
  { label: "Cuti Menikah", value: "cuti_menikah", maxDays: 2 },
  { label: "Cuti Menikahkan Anak", value: "menikahkan_anak", maxDays: 1 },
  { label: "Cuti Khitanan Anak", value: "cuti_khitanan", maxDays: 1 },
  { label: "Cuti Istri Melahirkan", value: "istri_melahirkan", maxDays: 1 },
  { label: "Cuti Keluarga Meninggal", value: "keluarga_meninggal", maxDays: 0 },
  { label: "Izin Berangkat Siang", value: "berangkat_siang", maxDays: 0 },
  { label: "Izin Pulang Awal", value: "pulang_awal", maxDays: 0 },
  { label: "Lainnya", value: "lainnya", maxDays: 0 },
];

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
  const [maxDate, setMaxDate] = useState(null);

  useEffect(() => {
    if (leaveType) {
      const selectedLeave = leaveOptions.find((option) => option.value === leaveType.value);
      if (selectedLeave) {
        const today = new Date(startDate);
        const newMaxDate = new Date();
        newMaxDate.setDate(today.getDate() + selectedLeave.maxDays);
        setMaxDate(newMaxDate);
        setEndDate(startDate);
        setErrors({
          endDate: selectedLeave.maxDays === 0 ? "*Batas maksimal cuti adalah 1 hari" : `*Batas maksimal cuti adalah ${selectedLeave.maxDays + 1} hari.`,
        });
      }
    }
  }, [leaveType]);

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

    const { success, error } = await requestLeave(formData);
    if (success) {
      setToast({ text: "Izin cuti kamu sudah diajukan!, cek notifikasi untuk melihat statusnya", show: true });
      setErrors({});
      navigate("/leave/success");
    } else {
      if (Array.isArray(error) && error.length > 0) {
        let mappedErrors = {};

        if (typeof error[0] === "object" && !Array.isArray(error[0])) {
          mappedErrors = error.reduce((acc, errorObj) => {
            for (let field in errorObj) {
              const message = errorObj[field];
              acc[field] = Array.isArray(message) ? message[0] : message;
            }
            return acc;
          }, {});
        }

        if (typeof error[0] === "string") {
          mappedErrors.general = error[0]; // bisa kamu ubah jadi "message" atau "alert"
        }

        console.log(mappedErrors);
        setToast({
          text: "Pengajuan cuti gagal" + ": " + Object.values(mappedErrors).join(", "),
          show: true,
        });

        setErrors(mappedErrors);
      }
    }
  };

  setTimeout(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, 5000);

  return (
    <Layouts title={"Buat Izin Cuti"} backUrl={"/homepage"}>
      <form onSubmit={handleSubmit} className="bg-white mt-14">
        <div className="w-full px-5 py-3">
          <FormInput type="select" options={leaveOptions} placeholder={"Pilih Jenis Cuti"} label={"Jenis Cuti"} onChange={(e) => setLeaveType(e)} errors={errors.leaveType} />
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
                  maxDate={maxDate}
                />
                <p className="text-xs text-red-500 mt-1 px-2">{errors.endDate}</p>
              </div>
            </div>
          </div>
          <FormInput type="textarea" height={"36"} label={"Alasan"} placeholder={"Alasan"} value={reason} errors={errors.reason} onChange={(e) => setReason(e.target.value)} />
          <div className="mt-3">
            <h1 className="mb-2 text-sm px-2">Lampiran (Maksimal 10MB file)</h1>
            <FileUpload label="Attach Your Letter" updateFilesCb={handleFileUpdate} error={errors.attachment} />
          </div>
        </div>

        <div className="w-full mt-6 px-5">
          <button
            type="submit"
            disabled={loading || !leaveType || !startDate || !endDate || !reason}
            className={`bg-slate-800 hover:bg-slate-700 transition-all duration-300 ease-in-out text-white font-bold py-2 w-full rounded-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}>
            Buat Izin Cuti
          </button>
        </div>
      </form>

      {toast.show && <Snackbar text={toast.text} show={toast.show} />}
    </Layouts>
  );
};

export default LeaveRequest;
