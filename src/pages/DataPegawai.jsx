import { useState, useEffect, useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import ConfirmationModal from "../components/Modals/ConfirmationModal";
import ThePages from "../components/ThePages";
import usePaginationRange from "../hooks/usePaginationRange";

export default function DataPegawai() {
  const navigate = useNavigate();
  const { token, baseURL } = useAuth();

  const [pegawaiList, setPegawaiList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPegawai, setSelectedPegawai] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- 1. STATE BARU UNTUK FILTER DAN PAGINATION ---
  const [roleFilter, setRoleFilter] = useState("*Semua Role");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const fetchPegawai = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/data/pegawai`, {
        headers: { Authorization: token },
      });
      setPegawaiList(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pegawai:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchPegawai();
  }, [token]);

  // --- 2. LOGIKA UNTUK MEMFILTER DATA BERDASARKAN ROLE ---
  const filteredPegawai = useMemo(() => {
    if (roleFilter === "*Semua Role") {
      return pegawaiList; // Jika memilih semua, tampilkan semua data
    }
    return pegawaiList.filter((pegawai) => pegawai.role === roleFilter);
  }, [pegawaiList, roleFilter]);

  // --- 3. PAGINATION SEKARANG BERDASARKAN DATA YANG SUDAH DIFILTER ---
  const totalPages = Math.ceil(filteredPegawai.length / itemsPerPage);
  const paginationRange = usePaginationRange(currentPage, totalPages);
  const currentItems = filteredPegawai.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRowDoubleClick = (pegawai) => navigate(`${pegawai.id_pegawai}`);

  const openDeleteModal = (pegawai) => {
    setSelectedPegawai(pegawai);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedPegawai(null);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const body = {
        id_pegawai: selectedPegawai.id_pegawai,
        id_user: selectedPegawai.id_user,
        role: selectedPegawai.role,
      };

      console.log(body);

      await axios.delete(`${baseURL}/api/delete-pegawai`, {
        headers: { Authorization: token },
        data: body,
      });

      closeDeleteModal();
      alert("Pegawai berhasil dihapus.");
      fetchPegawai();
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      alert("Gagal menghapus data. Silakan coba lagi.");
      closeDeleteModal();
    } finally {
      setIsDeleting(false);
    }
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Data Pegawai
        </h2>
        <span className="text-base sm:text-lg font-semibold text-gray-600 self-start sm:self-center">
          {getFormattedDate()}
        </span>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h4 className="text-lg font-bold text-gray-700 self-start md:self-center">
          Daftar Pegawai
        </h4>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={() => navigate("tambah-pegawai")}
            className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md flex items-center gap-2 text-sm w-full md:w-auto justify-center"
          >
            <FaPlus />
            <span className="text-xs md:text-sm">Tambah Pegawai</span>
          </button>

          {/* --- 4. SELECT DROPDOWN SEKARANG TERHUBUNG DENGAN STATE --- */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1); // Reset ke halaman 1 setiap kali filter berubah
            }}
            className="border border-gray-300 rounded-md py-1 px-2 md:p-1.5 text-sm w-full md:w-auto"
          >
            <option>*Semua Role</option>
            <option>Staff</option>
            <option>Dosen</option>
            <option>Admin</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center p-10">Memuat data pegawai...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="p-3 text-center w-16">No</th>
                  <th className="p-3 text-left">ID Pegawai</th>
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-center w-48">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {/* --- 5. TABEL SEKARANG MENGGUNAKAN `currentItems` (DATA HASIL FILTER & PAGINASI) --- */}
                {currentItems.map((pegawai, index) => (
                  <tr
                    key={pegawai.id_pegawai}
                    className={`border-b border-gray-200 ${
                      index % 2 !== 0 ? "bg-sky-50" : "bg-white"
                    } hover:bg-gray-200 cursor-pointer transition-colors duration-150`}
                    onDoubleClick={() => handleRowDoubleClick(pegawai)}
                  >
                    <td className="p-3 text-center align-middle">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-3 text-left align-middle">
                      {pegawai.id_pegawai}
                    </td>
                    <td className="p-3 text-left align-middle">
                      {pegawai.nama_pegawai}
                    </td>
                    <td className="p-3 text-left align-middle">
                      {pegawai.role}
                    </td>
                    <td className="p-3 text-center align-middle">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(pegawai);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-3 rounded-md text-xs"
                      >
                        Hapus Pegawai
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 text-xs text-gray-500 border-t border-gray-200">
          *Klik 2x ke salah satu data pegawai untuk melihat detail data
          sekaligus mengedit data
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

      {isModalOpen && (
        <ConfirmationModal
          pegawai={selectedPegawai}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
