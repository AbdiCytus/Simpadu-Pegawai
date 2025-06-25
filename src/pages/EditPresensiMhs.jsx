import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import ThePages from "../components/ThePages";
import usePaginationRange from "../hooks/usePaginationRange";
import StatusButton from "../components/ForPerkuliahan/StatusButton";

// Komponen dan fungsi helper tidak berubah

export default function EditPresensiMhs() {
  const { idkelas } = useParams();
  const navigate = useNavigate();
  // Ambil user, jadwal, dan token dari context
  const { token, user, jadwal, baseURL } = useAuth();

  // State untuk data dan UI
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [namaKelas, setNamaKelas] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false); // State untuk otorisasi
  const [presensi, setPresensi] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // --- 1. useEffect untuk Pengecekan Otorisasi ---
  useEffect(() => {
    if (jadwal && user) {
      if (user.role === "Dosen") {
        const isAllowed = jadwal.some((j) => j.id_kelas === idkelas);
        if (isAllowed) setIsAuthorized(true);
        else navigate("/perkuliahan", { replace: true });
      }
    }
  }, [idkelas, jadwal, user, navigate]);

  // --- 2. useEffect untuk Fetch Data (hanya berjalan jika terotorisasi) ---
  useEffect(() => {
    const fetchMahasiswaData = async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const response = await axios.get(`${baseURL}/api/data/mahasiswa`, {
          headers: { Authorization: token },
        });

        const filteredMahasiswa = response.data.dataMhs.filter(
          (mhs) => mhs.id_kelas === idkelas
        );
        setMahasiswaList(filteredMahasiswa);

        const initialStatus = filteredMahasiswa.reduce((acc, mhs) => {
          acc[mhs.nim] = "Hadir";
          return acc;
        }, {});
        setPresensi(initialStatus);

        if (filteredMahasiswa.length > 0) {
          setNamaKelas(filteredMahasiswa[0].nama_kelas);
        }
      } catch (error) {
        console.error("Gagal mengambil data mahasiswa:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthorized) fetchMahasiswaData();
  }, [idkelas, token, isAuthorized]);

  // Logika Pagination
  const totalPages = Math.ceil(mahasiswaList.length / itemsPerPage);
  const paginationRange = usePaginationRange(currentPage, totalPages);
  const currentItems = mahasiswaList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = (nim, status) => {
    setPresensi((prev) => ({ ...prev, [nim]: status }));
  };

  // Tampilan loading atau verifikasi akses
  if (!isAuthorized || isLoading) {
    return (
      <div className="p-10 text-center">
        Memverifikasi akses dan memuat data...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Perkuliahan
        </h2>
        <span className="text-base sm:text-lg font-semibold text-gray-600 self-start sm:self-center">
          {new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="bg-primary p-3 rounded-lg text-white font-semibold">
        {namaKelas || idkelas} &gt; Edit Presensi
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-3 border-b">
          <h3 className="text-lg font-bold text-gray-700">Daftar Mahasiswa</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <thead className="bg-primary text-white">
              <tr>
                <th className="py-2 px-4 text-center w-12">No</th>
                <th className="py-2 px-4 text-left">NIM</th>
                <th className="py-2 px-4 text-left">Nama</th>
                <th className="py-2 px-4 text-left">Presensi</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((mhs, index) => (
                <tr
                  key={mhs.nim}
                  className={`border-b border-gray-100 ${
                    index % 2 !== 0 ? "bg-sky-50" : "bg-white"
                  }`}>
                  <td className="py-2 px-4 text-center align-middle truncate">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="py-2 px-4 text-left align-middle truncate">
                    {mhs.nim}
                  </td>
                  <td className="py-2 px-4 text-left align-middle truncate">
                    {mhs.nama_mhs}
                  </td>
                  <td className="py-2 px-4 align-middle">
                    <div className="flex items-center justify-start gap-3 flex-wrap">
                      <StatusButton
                        char="H"
                        label="Hadir"
                        isSelected={presensi[mhs.nim] === "Hadir"}
                        onClick={() => handleStatusChange(mhs.nim, "Hadir")}
                        color="bg-green-500"
                      />
                      <StatusButton
                        char="I"
                        label="Izin"
                        isSelected={presensi[mhs.nim] === "Izin"}
                        onClick={() => handleStatusChange(mhs.nim, "Izin")}
                        color="bg-blue-500"
                      />
                      <StatusButton
                        char="S"
                        label="Sakit"
                        isSelected={presensi[mhs.nim] === "Sakit"}
                        onClick={() => handleStatusChange(mhs.nim, "Sakit")}
                        color="bg-orange-500"
                      />
                      <StatusButton
                        char="A"
                        label="Alfa"
                        isSelected={presensi[mhs.nim] === "Alfa"}
                        onClick={() => handleStatusChange(mhs.nim, "Alfa")}
                        color="bg-red-500"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="relative bg-white p-3 rounded-lg shadow-md flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md text-sm">
          Kembali
        </button>

        {totalPages > 1 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
            <ThePages
              paginationRange={paginationRange}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        )}

        <button className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md text-sm">
          Simpan
        </button>
      </div>
    </div>
  );
}
