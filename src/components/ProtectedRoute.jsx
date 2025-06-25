import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ roles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // Jika user tidak terautentikasi (tidak punya token),
    // arahkan paksa ke halaman login.
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Jika user terautentikasi tapi tidak punya hak akses yang sesuai,
    // arahkan ke halaman dashboard atau halaman lain yang sesuai.
    return <Navigate to="/dashboard" replace />;
  }

  // Jika user terautentikasi, tampilkan halaman yang diminta (dasbor, dll).
  return <Outlet />;
}
