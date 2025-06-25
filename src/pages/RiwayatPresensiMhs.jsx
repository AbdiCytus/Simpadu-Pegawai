import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import ThePages from "../components/ThePages";
import usePaginationRange from "../hooks/usePaginationRange";

export default function RiwayatPresensiMhs() {
  const { token, jadwal, baseURL } = useAuth(); // Ambil data jadwal dan token dari context

  // State
  const [allMahasiswa, setAllMahasiswa] = useState([]); // Menyimpan semua mhs dari API
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Membuat opsi filter kelas secara dinamis dari data jadwal
  const kelasOptions = useMemo(() => {
    if (!jadwal || jadwal.length === 0) return [];
    const classMap = new Map();
    jadwal.forEach((item) => {
      if (!classMap.has(item.id_kelas)) {
        classMap.set(item.id_kelas, {
          id: item.id_kelas,
          nama: item.nama_kelas,
          mataKuliah: item.nama_mk,
        });
      }
    });
    return Array.from(classMap.values());
  }, [jadwal]);

  // Mengambil data dan mengatur filter awal
  useEffect(() => {
    // Set filter awal ke kelas pertama yang dimiliki dosen
    if (kelasOptions.length > 0 && !selectedClass) {
      setSelectedClass(kelasOptions[0].id);
    }

    const fetchMahasiswa = async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const response = await axios.get(`${baseURL}/api/data/mahasiswa`, {
          headers: { Authorization: token },
        });
        setAllMahasiswa(response.data.dataMhs);
      } catch (error) {
        console.error("Gagal mengambil data mahasiswa:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMahasiswa();
  }, [token, kelasOptions]); // Jalankan ulang jika opsi kelas berubah

  // Logika untuk memfilter data berdasarkan pilihan dropdown
  const filteredData = useMemo(() => {
    // Saat filter berubah, selalu reset ke halaman pertama
    setCurrentPage(1);
    if (!selectedClass) return [];
    // Untuk sekarang, kita hanya filter berdasarkan kelas.
    // Anda bisa tambahkan logika filter pertemuan di sini jika API riwayat sudah ada.
    return allMahasiswa.filter((item) => item.id_kelas === selectedClass);
  }, [allMahasiswa, selectedClass, selectedMeeting]);

  // Logika untuk pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginationRange = usePaginationRange(currentPage, totalPages);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Riwayat Presensi Mahasiswa
        </h2>
        <span className="text-base sm:text-lg font-semibold text-gray-600 self-start sm:self-center">
          {new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="bg-white px-4 py-3 rounded-lg shadow-md flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h4 className="text-lg font-bold text-gray-700 self-start md:self-center">
          Daftar Mahasiswa
        </h4>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-sm bg-white w-full md:w-auto">
            {kelasOptions.length > 0 ? (
              kelasOptions.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama} ({k.mataKuliah})
                </option>
              ))
            ) : (
              <option>Memuat kelas...</option>
            )}
          </select>
          <select
            value={selectedMeeting}
            onChange={(e) => setSelectedMeeting(Number(e.target.value))}
            className="border border-gray-300 rounded-md p-2 text-sm bg-white w-full md:w-auto">
            <option value={1}>Pertemuan 1</option>
            <option value={2}>Pertemuan 2</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-10 text-center">Memuat data...</div>
          ) : (
            <table className="w-full text-sm table-fixed min-w-[700px]">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="p-3 text-center w-14">No</th>
                  <th className="p-3 text-left w-36">NIM</th>
                  <th className="p-3 text-left w-56">Nama</th>
                  <th className="p-3 text-left w-24">Status</th>
                  <th className="p-3 text-left w-36">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr
                      key={item.nim}
                      className={`border-b border-gray-100 ${
                        index % 2 !== 0 ? "bg-sky-50" : "bg-white"
                      }`}>
                      <td className="p-3 text-center">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="p-3 text-left truncate">{item.nim}</td>
                      <td className="p-3 text-left truncate">
                        {item.nama_mhs}
                      </td>
                      <td className="p-3 text-left">Hadir</td>
                      <td className="p-3 text-left">
                        {new Date().toLocaleDateString("id-ID")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-4 text-gray-500">
                      Tidak ada data untuk filter yang dipilih.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="bg-white p-3 rounded-lg shadow-md">
          <div className="flex justify-end items-center">
            <div className="flex items-center gap-2">
              <ThePages
                paginationRange={paginationRange}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
