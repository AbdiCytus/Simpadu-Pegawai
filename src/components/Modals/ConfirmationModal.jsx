import { useState, useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

export default function ConfirmationModal({ pegawai, onClose, onConfirm }) {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShowing(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsShowing(false);
    setTimeout(onClose, 300);
  };

  const handleConfirm = () => {
    setIsShowing(false);
    setTimeout(onConfirm, 300);
  };

  if (!pegawai) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm flex justify-center items-start pt-20 z-50">
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-md mx-4 transform transition-all duration-300 ease-out
                   p-4 sm:p-6
                   ${
                     isShowing
                       ? "opacity-100 translate-y-0"
                       : "opacity-0 -translate-y-10"
                   }`}>
        <div className="flex items-start">
          <div className="mr-4 flex-shrink-0 bg-red-100 rounded-full p-3">
            <FaExclamationTriangle className="text-red-600" size={24} />
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-bold text-gray-900">
              Konfirmasi Hapus Data
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Apakah Anda yakin ingin menghapusnya?
              <br />
              <strong className="text-gray-800">
                Tindakan ini tidak dapat dibatalkan.
              </strong>
            </p>
          </div>
        </div>

        {/* --- PERUBAHAN DI SINI: Tombol dibuat responsif --- */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold">
            Batal
          </button>
          <button
            onClick={handleConfirm}
            className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold">
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
