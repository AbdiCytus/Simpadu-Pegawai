import { useState, useEffect } from "react";
import { FaPlayCircle } from "react-icons/fa";

export default function StartLectureModal({ classData, onClose, onConfirm }) {
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
        <div className="flex items-center mb-4">
          <FaPlayCircle className="text-primary mr-3" size={22} />
          <h3 className="text-lg font-bold text-gray-900">
            Konfirmasi Mulai Perkuliahan
          </h3>
        </div>
        <div className="text-sm text-gray-700 space-y-2 border-t pt-4">
          <p>Anda akan memulai sesi perkuliahan untuk:</p>
          <div className="bg-slate-50 p-3 rounded-md">
            <p>
              <strong>Mata Kuliah:</strong> {classData.mataKuliah}
            </p>
            <p>
              <strong>Kelas:</strong> {classData.kelas}
            </p>
            <p>
              <strong>Pertemuan:</strong> {classData.pertemuan}
            </p>
            <p>
              <strong>Waktu:</strong>{" "}
              {new Date().toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              WITA
            </p>
          </div>
          <p className="pt-2">Apakah Anda yakin ingin melanjutkan?</p>
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
            className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover font-semibold">
            Ya, Mulai
          </button>
        </div>
      </div>
    </div>
  );
}
