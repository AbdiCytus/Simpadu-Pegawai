import { useAuth } from "../context/AuthContext";
import UserAvatar from "../assets/avatar.jpg";

export default function Header({ setSidebarOpen }) {
  // Ambil data user dari context
  const { user, baseURL } = useAuth();

  return (
    <header className="h-16 bg-primary text-white flex items-center justify-between lg:justify-end px-4 sm:px-6 relative z-10">
      <button
        onClick={() => setSidebarOpen(true)}
        className="text-indigo-200 hover:text-white lg:hidden">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      {/* Tampilkan nama level dan avatar dari data user yang login */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {user && (
          <>
            <span className="font-semibold">{user.nama_pegawai}</span>
            {/* Nantinya src bisa diganti dengan user.foto jika ada */}
            <img
              src={
                user.pfp
                  ? `${baseURL}/tesapi/${user.pfp}`
                  : UserAvatar
              }
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-indigo-400"
            />
          </>
        )}
      </div>
    </header>
  );
}
