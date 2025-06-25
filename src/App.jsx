import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Presensi from "./pages/Presensi";
import DataPegawai from "./pages/DataPegawai";
import TambahPegawai from "./pages/TambahPegawai";
import EditPegawai from "./pages/EditPegawai";
import Perkuliahan from "./pages/Perkuliahan";
import Kelas from "./pages/Kelas";
import EditPresensiMhs from "./pages/EditPresensiMhs";
import RiwayatPresensiMhs from "./pages/RiwayatPresensiMhs";

const router = createBrowserRouter(
  [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      // Gunakan DashboardLayout sebagai layout utama untuk semua halaman setelah login
      element: <DashboardLayout />,
      children: [
        // --- Grup Rute Umum (untuk semua role yang sudah login) ---
        {
          element: <ProtectedRoute />, // Tanpa prop `roles`, semua role boleh akses
          children: [
            { path: "dashboard", element: <Dashboard /> },
            { path: "profile", element: <Profile /> },
            { path: "presensi", element: <Presensi /> },
          ],
        },
        // --- Grup Rute Khusus Admin ---
        {
          element: <ProtectedRoute roles={["Admin"]} />, // Hanya role 'Admin' yang boleh
          children: [
            { path: "data-pegawai", element: <DataPegawai /> },
            { path: "data-pegawai/tambah-pegawai", element: <TambahPegawai /> },
            { path: "data-pegawai/:pegawaiId", element: <EditPegawai /> },
          ],
        },
        // --- Grup Rute Khusus Dosen ---
        {
          element: <ProtectedRoute roles={["Dosen"]} />, // Hanya role 'Dosen' yang boleh
          children: [
            { path: "perkuliahan", element: <Perkuliahan /> },
            { path: "perkuliahan/:idkelas", element: <Kelas /> },
            {
              path: "perkuliahan/:idkelas/edit-presensi",
              element: <EditPresensiMhs />,
            },
            {
              path: "riwayat-presensi-mahasiswa",
              element: <RiwayatPresensiMhs />,
            },
          ],
        },
        // Redirect dari path root ke dashboard
        { index: true, element: <Navigate to="/dashboard" replace /> },
      ],
    },
  ],
  {
    basename: "/simpeg",
  }
);

export default function App() {
  return <RouterProvider router={router} />;
}
