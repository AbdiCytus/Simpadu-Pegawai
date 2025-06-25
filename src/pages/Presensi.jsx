import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import usePaginationRange from "../hooks/usePaginationRange";
import StatCard from "../components/ForPresensi/StatCard";
import PresensiBanner from "../components/ForPresensi/PresensiBanner";
import ThePages from "../components/ThePages";

export default function Presensi() {
  const { token, baseURL } = useAuth();
  const [presensiData, setPresensiData] = useState({
    present: false,
    presensi: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const sortedPresensi = useMemo(() => {
    return [...presensiData.presensi].sort(
      (a, b) => new Date(b.tgl) - new Date(a.tgl)
    );
  }, [presensiData.presensi]);

  const totalPages = Math.ceil(sortedPresensi.length / itemsPerPage);
  const paginationRange = usePaginationRange(currentPage, totalPages);
  const currentItems = sortedPresensi.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCheckIn = async () => {
    const now = new Date();
    if (now.getHours() >= 9) {
      alert("Waktu presensi sudah lewat.");
      window.location.reload();
      return;
    }
    setIsCheckingIn(true);
    try {
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const getTime = `${hours}:${minutes}`;
      const getDate = now.toISOString().split("T")[0];

      await axios.post(
        `${baseURL}/api/update-presensi`,
        { getTime, getDate },
        { headers: { Authorization: token } }
      );

      alert("Berhasil melakukan presensi!");
      startGetPresensi();
    } catch (error) {
      console.error("Gagal melakukan presensi:", error);
      alert("Gagal melakukan presensi. Silakan coba lagi.");
    } finally {
      setIsCheckingIn(false);
    }
  };

  const startGetPresensi = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/data/presensi`, {
        headers: { Authorization: token },
      });
      setPresensiData(response.data);
    } catch (error) {
      console.error("Gagal mengambil data presensi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) startGetPresensi();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [token]);

  if (isLoading) return <div>Memuat data presensi...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Presensi
        </h2>
        <span className="text-base sm:text-lg font-semibold text-gray-600">
          {currentTime.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      <PresensiBanner
        handleCheckIn={handleCheckIn}
        isCheckingIn={isCheckingIn}
        presensiData={presensiData}
        currentTime={currentTime}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          color="bg-blue-600"
          title="Total Presensi"
          value={presensiData.presensi.length}
        />
        <StatCard
          color="bg-green-600"
          title="Hadir"
          value={
            presensiData.presensi.filter((p) => p.status === "Hadir").length
          }
        />
        <StatCard
          color="bg-red-600"
          title="Alfa"
          value={
            presensiData.presensi.filter((p) => p.status === "Alfa").length
          }
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Riwayat Presensi
        </h3>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="p-3 text-center font-semibold tracking-wide">
                    Jam Masuk
                  </th>
                  <th className="p-3 text-center font-semibold tracking-wide">
                    Status
                  </th>
                  <th className="p-3 text-center font-semibold tracking-wide">
                    Tanggal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.map((item) => (
                  <tr
                    key={item.id_presensi}
                    className={item.status === "Alfa" ? "bg-red-50" : ""}>
                    <td className="p-3 text-center text-gray-700">
                      {item.waktu_masuk || "-"}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${
                          item.status === "Hadir"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-center text-gray-700">
                      {new Date(item.tgl).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
