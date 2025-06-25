import { FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";

const ScheduleModal = ({
  isOpen,
  onClose,
  schedules,
  setSchedules,
  kelasOptions,
  matkulOptions,
}) => {
  // State untuk animasi
  const [isShowing, setIsShowing] = useState(false);
  // State untuk input di dalam modal
  const [currentSchedule, setCurrentSchedule] = useState({
    id_mk: "",
    id_kelas: "",
    hari: "",
  });
  const [error, setError] = useState("");

  // Efek untuk memicu animasi masuk dan keluar
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsShowing(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsShowing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsShowing(false);
    setTimeout(onClose, 300); // Tunggu animasi selesai sebelum benar-benar menutup
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSchedule((prev) => ({ ...prev, [name]: value }));
    setError(""); // Hapus error saat user mencoba memperbaiki input
  };

  const handleAddSchedule = () => {
    // Validasi dasar
    if (
      !currentSchedule.id_mk ||
      !currentSchedule.id_kelas ||
      !currentSchedule.hari
    ) {
      setError("Semua field jadwal wajib diisi.");
      return;
    }
    if (schedules.filter((s) => s.hari === currentSchedule.hari).length >= 3) {
      setError(
        `Tidak bisa menambah lebih dari 3 kelas di hari ${currentSchedule.hari}.`
      );
      return;
    }
    if (schedules.some((s) => s.id_kelas === currentSchedule.id_kelas)) {
      setError(
        `Kelas ini sudah memiliki jadwal mengajar. Hapus dulu jika ingin mengubah.`
      );
      return;
    }
    // Update state yang ada di komponen parent (TambahPegawai)
    setSchedules((prev) => [...prev, currentSchedule]);
    setCurrentSchedule({ id_mk: "", id_kelas: "", hari: "" }); // Reset form di modal
    setError("");
  };

  const handleRemoveSchedule = (indexToRemove) => {
    setSchedules((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  if (!isOpen) return null;

  return (
    // Latar dengan posisi atas, gelap, dan blur
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm flex justify-center items-start pt-20 z-50 p-4">
      {/* Panel Modal dengan animasi transisi turun */}
      <div
        className={`bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl transform transition-all duration-300 ease-out 
                   ${
                     isShowing
                       ? "opacity-100 translate-y-0"
                       : "opacity-0 -translate-y-10"
                   }`}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Tambah Jadwal Mengajar
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b pb-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Mata Kuliah
            </label>
            <select
              name="id_mk"
              value={currentSchedule.id_mk}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Pilih Matkul</option>
              {matkulOptions.map((mk) => (
                <option key={mk.id_mk} value={mk.id_mk}>
                  {mk.nama_mk}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Kelas
            </label>
            <select
              name="id_kelas"
              value={currentSchedule.id_kelas}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Pilih Kelas</option>
              {kelasOptions.map((k) => (
                <option key={k.id_kelas} value={k.id_kelas}>
                  {k.nama_kelas}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Hari
            </label>
            <select
              name="hari"
              value={currentSchedule.hari}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Pilih Hari</option>
              <option>Senin</option>
              <option>Selasa</option>
              <option>Rabu</option>
              <option>Kamis</option>
              <option>Jumat</option>
            </select>
          </div>
          <button
            type="button"
            onClick={handleAddSchedule}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover h-10 text-md"
          >
            Tambah
          </button>
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

        <div className="mt-4">
          <h4 className="font-semibold text-sm">
            Jadwal Ditambahkan: {schedules.length > 0 ? "" : " (Kosong)"}
          </h4>
          <ul className="mt-2 space-y-2 max-h-40 overflow-y-auto text-sm">
            {schedules.map((schedule, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
              >
                <span>
                  {
                    matkulOptions.find((m) => m.id_mk === schedule.id_mk)
                      ?.nama_mk
                  }{" "}
                  -{" "}
                  {
                    kelasOptions.find((k) => k.id_kelas === schedule.id_kelas)
                      ?.nama_kelas
                  }{" "}
                  ({schedule.hari})
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveSchedule(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 bg-green-600 text-white rounded-md font-semibold text-sm"
          >
            Selesai & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
