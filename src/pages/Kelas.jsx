import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useClassSession } from "../context/ClassSessionContext";
import axios from "axios";
import StartLectureModal from "../components/Modals/StartLectureModal";
import usePaginationRange from "../hooks/usePaginationRange";
import ThePages from "../components/ThePages";

export default function Kelas() {
  const { idkelas } = useParams();
  const navigate = useNavigate();
  const { token, user, jadwal, baseURL } = useAuth();

  const {
    activeSessionId,
    isAttendanceClosing,
    timer,
    startSession,
    endSession,
    skipTimer,
  } = useClassSession();

  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [namaKelas, setNamaKelas] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const isSessionActiveForThisClass = activeSessionId === idkelas;

  const classInfo = useMemo(() => {
    if (!jadwal) return null;
    return jadwal.find((j) => j.id_kelas === idkelas);
  }, [jadwal, idkelas]);

  const isTodayTheScheduledDay = useMemo(() => {
    if (!classInfo) return false;
    const dayNameMap = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const todayDayIndex = new Date().getDay();
    return classInfo.hari === dayNameMap[todayDayIndex];
  }, [classInfo]);

  useEffect(() => {
    if (jadwal && user && user.role === "Dosen") {
      const isAllowed = jadwal.some((j) => j.id_kelas === idkelas);
      if (isAllowed) {
        setIsAuthorized(true);
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [idkelas, jadwal, user, navigate]);

  useEffect(() => {
    const fetchMahasiswa = async () => {
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
        if (filteredMahasiswa.length > 0) {
          setNamaKelas(filteredMahasiswa[0].nama_kelas);
        }
      } catch (error) {
        console.error("Gagal mengambil data mahasiswa:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (isAuthorized) {
      fetchMahasiswa();
    }
  }, [idkelas, token, isAuthorized]);

  const totalPages = Math.ceil(mahasiswaList.length / itemsPerPage);
  const paginationRange = usePaginationRange(currentPage, totalPages);
  const currentItems = mahasiswaList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStartLecture = () => {
    startSession(idkelas);
    setIsModalOpen(false);
  };

  if (!isAuthorized || isLoading) {
    return (
      <div className="p-10 text-center">
        Memverifikasi akses dan memuat data...
      </div>
    );
  }

  return (
    <div className="space-y-5">
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

      <div className="bg-primary p-4 rounded-lg text-white font-semibold text-lg">
        {namaKelas || idkelas} (Pertemuan 1)
      </div>

      {/* --- PERUBAHAN DI SINI: Tata letak grid dibuat dinamis --- */}
      <div
        className={`grid grid-cols-1 gap-4 ${
          isSessionActiveForThisClass ? "sm:grid-cols-3" : "sm:grid-cols-2"
        }`}
      >
        {/* Tombol 1: Mulai Perkuliahan */}
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={activeSessionId !== null || !isTodayTheScheduledDay}
          className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Mulai Perkuliahan
        </button>

        {/* Tombol 2: Edit Presensi */}
        <button
          onClick={() => navigate(`/perkuliahan/${idkelas}/edit-presensi`)}
          disabled={isSessionActiveForThisClass && isAttendanceClosing}
          className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Edit Presensi
        </button>

        {/* Tombol 3: Muncul saat sesi aktif untuk kelas ini, dan tidak ada placeholder jika tidak muncul */}
        {isSessionActiveForThisClass &&
          (isAttendanceClosing ? (
            <button
              onClick={skipTimer}
              className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md animate-pulse"
            >
              Tutup Presensi ({timer}s)
            </button>
          ) : (
            <button
              onClick={endSession}
              className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md"
            >
              Tutup Kelas
            </button>
          ))}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-bold text-gray-700">
            Daftar Kehadiran Mahasiswa
          </h3>
        </div>
        <div className="overflow-x-auto text-sm">
          <table className="w-full">
            <thead className="bg-primary text-white">
              <tr>
                <th className="py-3 px-4 text-center w-16">No</th>
                <th className="py-3 px-4 text-left">NIM</th>
                <th className="py-3 px-4 text-left">Nama</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((mhs, index) => (
                <tr
                  key={mhs.nim}
                  className={index % 2 !== 0 ? "bg-sky-100" : "bg-white"}
                >
                  <td className="py-3 px-4 text-center align-middle">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="py-3 px-4 text-left align-middle">
                    {mhs.nim}
                  </td>
                  <td className="py-3 px-4 text-left align-middle">
                    {mhs.nama_mhs}
                  </td>
                  <td className="py-3 px-4 text-left align-middle">Hadir</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="bg-white p-3 rounded-lg shadow-md flex flex-wrap justify-center sm:justify-between items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md text-sm"
          >
            Kembali
          </button>
          <div className="flex items-center gap-2">
            <ThePages
              paginationRange={paginationRange}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      )}

      {isModalOpen && (
        <StartLectureModal
          classData={{
            kelas: classInfo?.nama_kelas,
            mataKuliah: classInfo?.nama_mk || "Memuat...",
            pertemuan: 1,
          }}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleStartLecture}
        />
      )}
    </div>
  );
}
