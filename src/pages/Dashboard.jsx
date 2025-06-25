import { useAuth } from "../context/AuthContext";
import DashDosen from "../components/ForDashboard/DashDosen";

export default function Dashboard() {
  const { user } = useAuth();

  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const data = {
    nama: user?.nama_pegawai,
    level: user?.role,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Dashboard
        </h2>
        <span className="text-base sm:text-lg font-semibold text-gray-600">
          {today}
        </span>
      </div>

      <div className="bg-primary text-white p-5 rounded-lg shadow-md">
        <h3 className="text-xl font-bold">Selamat Datang, {data.nama}</h3>
        <p className="text-indigo-200 mt-1">
          Anda berperan sebagai seorang {data.level}.
        </p>
      </div>
      {data.level === "Dosen" && <DashDosen />}
    </div>
  );
}
