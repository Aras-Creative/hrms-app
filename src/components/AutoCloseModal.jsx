import { IconCircleX } from "@tabler/icons-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function AutoCloseModal({
  onClose,
  actionLabel = "Tutup",
  message = "Mohon maaf, sistem mendeteksi ada ketidaksesuaian pada absensi Anda. Silakan coba lagi atau hubungi admin jika membutuhkan bantuan.",
  duration = 5000,
  icon = <IconCircleX className="mx-auto text-red-500 w-16 h-16 mb-4" />,
}) {
  useEffect(() => {
    if (!open) return;
    const timeout = setTimeout(() => onClose(), duration);
    return () => clearTimeout(timeout);
  }, [open, duration, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white max-w-sm w-full rounded-2xl p-6 shadow-xl text-center animate-fade-in-scale">
        {icon}
        <p className="text-sm text-gray-700">{message}</p>
        <button onClick={onClose} className="mt-6 inline-flex items-center px-4 py-2 rounded-md text-sm font-semibold bg-gray-100 hover:bg-gray-200 transition">
          {actionLabel}
        </button>
      </div>
    </div>,
    document.body
  );
}
