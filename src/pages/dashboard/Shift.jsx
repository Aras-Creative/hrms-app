import React, { useEffect, useMemo, useReducer } from "react";
import DashboardLayouts from "../../layouts/DashboardLayouts";
import { IconBallpen, IconClockPlay, IconClockStop, IconDots, IconPlus, IconTrash } from "@tabler/icons-react";
import useFetch from "../../hooks/useFetch";
import Modal from "../../components/Modal";
import FormInput from "../../components/FormInput";
import Toast from "../../components/Toast";
import Table from "../../components/Table";
import axiosInstance from "../../utils/axiosInstance";
import { NotFound } from "../../components/Errors";

const ShiftReducer = (state, action) => {
  switch (action.type) {
    case "SET_FORM_DATA":
      return { ...state, formData: action.payload };
    case "SET_TOAST":
      return { ...state, toast: action.payload };
    case "TOGGLE_MODAL":
      return { ...state, isModalOpen: !state.isModalOpen };
    default:
      return state;
  }
};

const Shift = () => {
  const initialState = {
    isModalOpen: false,
    formData: { clockIn: "08:00", clockOut: "16:30", name: "" },
    toast: { text: "", type: "success" },
  };
  const [state, dispatch] = useReducer(ShiftReducer, initialState);
  const { submitData: shiftCreate, loading } = useFetch("/shift/create", { method: "POST" });
  const { responseData: shiftData, refetch } = useFetch(`/shift`);

  useEffect(() => {
    if (state.toast.text) {
      const timer = setTimeout(() => {
        dispatch({ type: "SET_TOAST", payload: { text: "", type: "success" } });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.toast.text]);

  const handleSubmitData = async (event) => {
    event.preventDefault();
    const { success, error, data } = await shiftCreate(state.formData);
    if (success) {
      dispatch({ type: "SET_TOAST", payload: { text: data.message, type: "success" } });
      dispatch({ type: "TOGGLE_MODAL" });
      refetch();
    } else {
      dispatch({ type: "SET_TOAST", payload: { text: error || "An Error Occurred", type: "error" } });
    }
  };

  const handleDeleteShift = async (id) => {
    try {
      const response = await axiosInstance.delete(`/shift/delete/${id}`);
      if (response.data.code === 200) {
        refetch();
        dispatch({ type: "SET_TOAST", payload: { text: response.data.message, type: "success" } });
      }
    } catch {
      dispatch({ type: "SET_TOAST", payload: { text: "Failed to delete jam kerja", type: "error" } });
    }
  };

  const tableColumns = useMemo(
    () => [
      { key: "name", label: "Nama Shift", icon: <IconBallpen size={20} />, render: (value) => value || "-" },
      { key: "clockIn", label: "Jam Masuk", icon: <IconClockPlay size={20} />, render: (value) => value || "-" },
      { key: "clockOut", label: "Jam Pulang", icon: <IconClockStop size={20} />, render: (value) => value || "-" },
      {
        key: "id",
        label: "",
        icon: <IconDots size={20} />,
        render: (value) => (
          <div className="flex items-center justify-start">
            <button
              onClick={() => handleDeleteShift(value)}
              type="button"
              className="text-red-500 hover:text-red-700 transition-all duration-300 ease-out"
            >
              <IconTrash size={20} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <DashboardLayouts>
      <div className="flex flex-col gap-6 px-5">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex w-full justify-between items-center">
            <div className="flex flex-col w-1/2">
              <h1 className="text-2xl font-bold text-gray-800">Jam Kerja</h1>
              <p className="text-sm text-gray-600 mb-2">Mengelola dan mengatur jam kerja dengan mudah.</p>
            </div>
            <div className="flex items-center gap-4 w-1/2 justify-end">
              <button
                onClick={() => dispatch({ type: "TOGGLE_MODAL" })}
                className="px-5 mt-1 py-2 flex items-center gap-3 text-white bg-emerald-700 rounded-lg shadow-md hover :bg-emerald-800 transition duration-300"
              >
                <IconPlus />
                Tambah Jam Kerja
              </button>
            </div>
          </div>
        </div>

        <div>
          {shiftData?.length > 0 ? (
            <>
              <Table columns={tableColumns} data={shiftData || []} />
            </>
          ) : (
            <NotFound />
          )}
        </div>

        {state.isModalOpen && (
          <Modal isOpen={state.isModalOpen} width="1/3">
            <Modal.Header>Tambah Jam Kerja Baru</Modal.Header>
            <form onSubmit={handleSubmitData}>
              <Modal.Body>
                <div className="flex flex-col gap-4">
                  <FormInput
                    type="text"
                    label="Nama Shift"
                    value={state.formData?.name}
                    onChange={(e) => dispatch({ type: "SET_FORM_DATA", payload: { ...state.formData, name: e.target.value } })}
                  />
                </div>
                <div className="flex flex-col gap-4 mt-4">
                  <FormInput
                    type="time"
                    label="Jam Masuk"
                    value={state.formData?.clockIn}
                    onChange={(e) => dispatch({ type: "SET_FORM_DATA", payload: { ...state.formData, clockIn: e.target.value } })}
                  />
                </div>

                <div className="flex flex-col gap-4 mt-4">
                  <FormInput
                    type="time"
                    label="Jam Keluar"
                    value={state.formData?.clockOut}
                    onChange={(e) => dispatch({ type: "SET_FORM_DATA", payload: { ...state.formData, clockOut: e.target.value } })}
                  />
                </div>
              </Modal.Body>

              <Modal.Footer>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "TOGGLE_MODAL" })}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-200"
                >
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
              </Modal.Footer>
            </form>
          </Modal>
        )}

        {state.toast.text && (
          <Toast
            type={state.toast.type || "error"}
            text={state.toast.text}
            onClick={() => dispatch({ type: "SET_TOAST", payload: { text: "", type: "success" } })}
          />
        )}
      </div>
    </DashboardLayouts>
  );
};

export default Shift;
