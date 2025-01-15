import {
  IconAlertTriangleFilled,
  IconArrowRight,
  IconClipboard,
  IconClipboardText,
  IconHourglassHigh,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import React, { useEffect, useReducer, useState, useMemo } from "react";
import Card from "./Card";
import { calculateDaysLeft, calculateProgress } from "./utils";
import FormInput from "./FormInput";
import Textarea from "../../../../components/FormInput";
import { useParams } from "react-router-dom";
import useFetch from "../../../../hooks/useFetch";
import Modal from "../../../../components/Modal";
import Datepicker from "../../../../components/Datepicker";
import { employementStatusOptions, fetchJobRoles, LabelEmployementStatus } from "../../../../utils/SelectOptions";
import Toast from "../../../../components/Toast";
import { formatDate, handleDatePick } from "../../../../utils/dateUtils";
import { formatCurrency } from "../../../../utils/formatCurrency";

const filterReducer = (state, action) => {
  switch (action.type) {
    case "SET_JOB_ROLE_OPTIONS":
      return { ...state, jobRoleOptions: action.payload };
    default:
      return state;
  }
};

const ContractDetails = ({ data }) => {
  const { employeeId } = useParams();
  const [state, dispatch] = useReducer(filterReducer, { jobRoleOptions: [], departmentOptions: [] });
  const { updateData } = useFetch(`/employee/contract/${employeeId}/update`, { method: "POST" });
  const [toast, setToast] = useState({ text: "", type: "" });
  const [modalOpen, setModalOpen] = useState({ type: "" });
  const { updateData: extendContract } = useFetch(`/employee/contract/${employeeId}/extends`, { method: "PUT" });
  const { deleteData: terminateContract } = useFetch(`/employee/contract/${employeeId}/terminate`, { method: "DELETE" });

  const [isEditing, setIsEditing] = useState({ contract: false, benefits: false, workingScopes: false });

  const initialFormData = useMemo(
    () => ({
      contract: {
        jobRole: { title: data?.jobRole?.jobRoleTitle, id: data?.jobRole?.jobRoleId },
        employementType: data?.contract?.employementStatus,
        startDate: data?.contract?.startDate,
        endDate: data?.contract?.endDate,
      },
      workingScopes: data?.workingScopes || [],
      benefits: {
        basicSalary: data?.salary?.basicSalary,
        assets: data?.assets,
        adjustments: data?.adjustments,
      },
    }),
    [data]
  );

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchJobRoles(true, dispatch);
  }, []);

  const toggleEdit = async (e, formName) => {
    const isEditingNow = isEditing[formName];
    setIsEditing((prev) => ({ ...prev, [formName]: !isEditingNow }));

    if (isEditingNow) {
      e.preventDefault();
      const { success, data, error } = await updateData(formData[formName]);
      setToast({ text: success ? data.message : error || "An error occurred", type: success ? "success" : "error" });
    }
  };

  const handleCancelEdit = (formName) => {
    setFormData(initialFormData);
    setIsEditing((prev) => ({ ...prev, [formName]: false }));
  };

  const handleExtendContract = async () => {
    const contractData = {
      startDate: formData.contract.startDate,
      endDate: formData.contract.endDate,
      jobRole: formData.contract.jobRole,
    };
    const { success, data, error } = await extendContract(contractData);
    setToast({ text: success ? data.message : error || "An error occurred", type: success ? "success" : "error " });
    setModalOpen({ type: "" });
  };

  const handleSelectChange = (formName, field) => (selectedOption) => {
    setFormData((prev) => {
      const updatedForm = { ...prev };
      if (formName === "contract") {
        updatedForm[formName][field] = field === "jobrole" ? { title: selectedOption.label, id: selectedOption.value } : selectedOption.value;
      } else {
        updatedForm[formName][field] = selectedOption.value;
      }
      return updatedForm;
    });
  };

  const contractProgressBarWidth = useMemo(() => `${calculateProgress(data?.contract?.startDate, data?.contract?.endDate).toFixed(2)}%`, [data]);

  const handleModalOpen = (type) => setModalOpen({ type });

  const handleContractDatePick = handleDatePick(setFormData)("contract");

  const updateWorkingScopes = (index, value) => {
    setFormData((prev) => {
      const updatedScopes = [...prev.workingScopes];
      if (index < updatedScopes.length) {
        if (value) {
          updatedScopes[index].title = value;
        } else {
          updatedScopes.splice(index, 1);
        }
      } else {
        updatedScopes.push({ title: "" });
      }
      return { ...prev, workingScopes: updatedScopes };
    });
  };

  const addWorkingScope = () => updateWorkingScopes(formData.workingScopes.length, { title: "" });

  const handleTerminateContract = async () => {
    const { success, error, data } = await terminateContract();
    if (success) {
      setToast({ text: data.message, type: "success" });
      setModalOpen({ type: "" });
    } else {
      setToast({ text: error || "An error occurred", type: "error" });
    }
  };

  useEffect(() => {
    setTimeout(() => setToast({ type: "", message: "" }), 4000);
  }, [toast.message]);

  return (
    <div className="flex flex-grow gap-4 w-full h-full">
      <div className="flex flex-col gap-4 w-2/3 h-full">
        <div className="bg-white rounded-lg w-full h-full border border-zinc-300 pt-6 pb-6 shadow relative overflow-hidden">
          <div className="flex w-full justify-between px-8 ">
            <div className="flex gap-3 items-center text-zinc-500">
              <IconClipboard />
              <h1 className="text-slate-800 text-lg font-bold">Durasi Kontrak</h1>
            </div>
            <div className="flex gap-2 items-center">
              <button
                type="button"
                onClick={() => handleModalOpen("terminateContract")}
                className="bg-white px-3 flex items-center gap-3 py-2 rounded-xl border border-zinc-400 hover:bg-zinc-100 ease-in-out transition-all duration-300"
              >
                <h1 className="text-slate-800 font-bold text-xs">Akhiri Kontrak</h1>
              </button>
              <button
                type="button"
                onClick={() => handleModalOpen("extendContract")}
                className="bg-slate-800 px-3 flex items-center gap-3 py-2 rounded-xl hover:bg-slate-900 ease-in-out transition-all duration-300"
              >
                <h1 className="text-white font-bold text-xs">Perpanjang Kontrak</h1>
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center px-8 ">
            <div className="mt-6 w-1/3 flex items-center gap-6 pb-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="startDate" className="text-zinc-500 text-sm">
                  Tanggal Mulai
                </label>
                <input type="text" value={formatDate(formData.contract.startDate)} className="outline-none text-sm hover:border-zinc-500" readOnly />
              </div>
              <div className="flex items-center">
                <IconArrowRight />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="endDate" className="text-zinc-500 text-sm">
                  Tanggal Berakhir
                </label>
                <input type="text" value={formatDate(formData.contract.endDate)} className="outline-none text-sm hover:border-zinc-500" readOnly />
              </div>
            </div>
            <div className={`flex items-center gap-2 px-6 ${calculateDaysLeft(formData.contract.endDate) < 30 ? "text-red-400" : "text-slate-800"}`}>
              <IconHourglassHigh />
              <p className="font-semibold text-sm">{calculateDaysLeft(formData.contract.endDate)} Hari hingga berakhir</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-200 rounded">
            <div
              className={`h-1.5 ${calculateDaysLeft(formData.contract.endDate) < 30 ? "bg-red-400" : "bg-green-300"} rounded`}
              style={{ width: contractProgressBarWidth }}
            />
          </div>
        </div>

        <Card
          title="Detail Kontrak"
          icon={<IconClipboardText />}
          isEditable={true}
          onCancel={() => handleCancelEdit("contract")}
          isEditing={isEditing.contract}
          toggleEdit={(e) => toggleEdit(e, "contract")}
        >
          <div className="grid grid-cols-2 gap-6 mt-6">
            <FormInput
              type="select"
              label="Job Role"
              value={{
                label: formData.contract.jobRole.title || "Not Assigned",
                value: formData.contract.jobRole.id || "Not Assigned",
              }}
              options={state.jobRoleOptions}
              onEdit={isEditing.contract}
              onChange={handleSelectChange("contract", "jobRole")}
            />

            <FormInput
              type="select"
              label="Tipe Karyawan"
              value={{
                label: <LabelEmployementStatus label={formData.contract.employementType} /> || "Not Assigned",
                value: formData.contract.employementType,
              }}
              onChange={handleSelectChange("contract", "employementType")}
              options={employementStatusOptions}
              onEdit={isEditing.contract}
            />
          </div>
        </Card>

        <Card title="Kompensasi dan Benefits" icon={<IconClipboardText />} isEditable={false}>
          <div className="grid grid-cols-2 gap-6 mt-6">
            <FormInput type="text" label="Gaji Pokok" value={formatCurrency(formData.benefits.basicSalary)} onEdit={false} />
            {formData.benefits.adjustments
              ?.filter((item) => item.type === "allowance")
              .map((item, index) => (
                <FormInput
                  key={index}
                  type="text"
                  label={item.name}
                  value={item.amountType === "fixed" ? formatCurrency(item.amount) : `${item.amount}%`}
                  onEdit={false}
                />
              ))}
            {formData.benefits.assets?.map((item, index) => (
              <FormInput key={index} type="text" label="Asset" value={item.assetName} onEdit={false} />
            ))}
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-4 w-1/3 h-full flex-grow">
        <Card
          title="Ruang Lingkup Kerja"
          icon={<IconClipboardText />}
          isEditable={true}
          toggleEdit={(e) => toggleEdit(e, "workingScopes")}
          onCancel={() => handleCancelEdit("workingScopes")}
          isEditing={isEditing.workingScopes}
        >
          <div className="w-full mt-6 flex flex-col gap-4">
            {formData.workingScopes.length > 0 ? (
              formData.workingScopes.map((item, index) => (
                <div key={index} className="w-full gap-2 flex flex-col items-start">
                  <div className="w-full flex gap-3 items-center">
                    <div className="w-full">
                      <Textarea
                        placeholder="Enter working scope"
                        label=""
                        value={item.title}
                        onChange={(e) => updateWorkingScopes(index, e.target.value)}
                        className="w-full"
                        disabled={!isEditing.workingScopes}
                      />
                    </div>
                    {isEditing.workingScopes && (
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => updateWorkingScopes(index)}
                          className="mt-1 border flex-shrink-0 flex items-center justify-center hover:bg-zinc- 50 rounded-full h-8 w-8"
                        >
                          <IconTrash size={18} />
                        </button>
                        <button
                          onClick={addWorkingScope}
                          type="button"
                          className="mt-1 border flex-shrink-0 flex items-center justify-center hover:bg-zinc-50 rounded-full h-8 w-8"
                        >
                          <IconPlus size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : isEditing.workingScopes ? (
              <button
                onClick={addWorkingScope}
                type="button"
                className="mt-1 border flex-shrink-0 flex items-center justify-center hover:bg-zinc-50 rounded-full h-8 w-8"
              >
                <IconPlus size={18} />
              </button>
            ) : (
              <p className="text-gray-500 text-sm">Belum ditugaskan</p>
            )}
          </div>
        </Card>
        {toast.text && <Toast text={toast.text} type={toast.type || "error"} onClick={() => setToast({ text: "", type: "" })} />}
      </div>

      {modalOpen.type === "terminateContract" && (
        <Modal width={"[60%]"} isOpen={modalOpen}>
          <Modal.Body>
            <div className="w-full flex flex-col items-center p-9 mt-8">
              <IconAlertTriangleFilled className="text-red-500" size={100} />
              <div className="flex flex-col items-center mt-4">
                <h1 className="text-2xl font-semibold">Apakah Kamu Yakin?</h1>
                <p className="text-center text-gray-600 mt-2">Anda akan mengakhiri kontrak karyawan ini. Tindakan ini tidak dapat dibatalkan.</p>
                <p className="text-center text-gray-600">Harap konfirmasi jika Anda ingin melanjutkan dengan pemutusan kontrak.</p>
              </div>
              <div className="flex justify-center w-full mt-8 gap-4 mb-8">
                <button
                  type="button"
                  onClick={handleTerminateContract}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all duration-300 ease-linear"
                >
                  Konfirmasi
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen({ type: "" })}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-all duration-300 ease-linear"
                >
                  Batal
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}

      {modalOpen.type === "extendContract" && (
        <Modal width={"1/3"} isOpen={modalOpen}>
          <Modal.Header>Opsi Perpanjangan Kontrak</Modal.Header>
          <Modal.Body>
            <div className="w-full flex flex-col items-center p-4">
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className=" w-full relative">
                  <h1 className="text-slate-800 text-sm">Tanggal Mulai</h1>
                  <div className="absolute top-4 w-full">
                    <Datepicker
                      position={"top-30"}
                      label={"Select Start Date"}
                      defaultDate={formData.contract.startDate || undefined}
                      onChange={(date) => handleContractDatePick("startDate")(date)}
                    />
                  </div>
                </div>
                <div className=" w-full relative">
                  <h1 className="text-slate-800 text-sm">Tanggal Berakhir</h1>
                  <div className="absolute top-4 w-full">
                    <Datepicker
                      defaultDate={formData.contract.endDate}
                      position={""}
                      label={"Select Start Date"}
                      onChange={(date) => handleContractDatePick("endDate")(date)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-16 px-4 w-full">
              <FormInput
                type="select"
                label="Job Role"
                value={{ label: formData?.contract?.jobRole?.title, value: formData?.contract?.jobRole?.id }}
                options={state.jobRoleOptions}
                onChange={handleSelectChange("contract", "jobRole")}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex justify-end items-center gap-3">
              <button
                type="button"
                onClick={handleExtendContract}
                className="px-4 py-2 bg-emerald-700 text-white rounded hover:bg-emerald-600 transition-all duration-300 ease-linear"
              >
                Konfirmasi
              </button>
              <button
                type="button"
                onClick={() => setModalOpen({ type: "" })}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-all duration-300 ease-linear"
              >
                Batal
              </button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ContractDetails;
