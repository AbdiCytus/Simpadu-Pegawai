import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMemo } from "react";

export default function Perkuliahan() {
  // --- PERUBAHAN 1: Ambil data jadwal dari context ---
  const { jadwal } = useAuth();

  // --- PERUBAHAN 2: Proses data jadwal untuk mendapatkan daftar kelas unik ---
  // useMemo digunakan agar proses ini tidak berjalan ulang jika data jadwal tidak berubah
  const daftarKelas = useMemo(() => {
    if (!jadwal || jadwal.length === 0) {
      return [];
    }

    // Gunakan Map untuk memastikan setiap kelas hanya muncul sekali
    const kelasMap = new Map();
    jadwal.forEach((item) => {
      if (!kelasMap.has(item.id_kelas)) {
        kelasMap.set(item.id_kelas, {
          id: item.id_kelas,
          nama: item.nama_kelas,
          // Ambil mata kuliah dari jadwal pertama yang ditemukan untuk kelas ini
          mataKuliah: item.nama_mk,
        });
      }
    });

    return Array.from(kelasMap.values());
  }, [jadwal]);

  const getFormattedDate = () => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    const date = new Date();
    return date.toLocaleDateString("id-ID", options);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Perkuliahan
        </h2>
        <span className="text-base sm:text-lg font-semibold text-gray-600 self-start sm:self-center">
          {getFormattedDate()}
        </span>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-primary p-4">
          <h3 className="text-white font-semibold text-lg">Daftar Kelas</h3>
        </div>

        <div className="p-4 space-y-3">
          {/* --- PERUBAHAN 3: Tampilkan daftar kelas dari data dinamis --- */}
          {daftarKelas.length > 0 ? (
            daftarKelas.map((kelas) => (
              <Link
                key={kelas.id}
                to={`/perkuliahan/${kelas.id}`} // Link sekarang menggunakan id_kelas
                className="flex flex-col sm:flex-row sm:justify-between shadow-md sm:items-center p-4 rounded-lg bg-slate-50 hover:bg-gray-100 transition-colors duration-200">
                <span className="font-semibold text-gray-800">
                  {kelas.nama}
                </span>
                <span className="text-sm sm:text-base text-gray-600">
                  {kelas.mataKuliah}
                </span>
              </Link>
            ))
          ) : (
            // Tampilkan pesan jika tidak ada jadwal mengajar
            <div className="text-center text-gray-500 p-4">
              Anda tidak memiliki jadwal mengajar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
