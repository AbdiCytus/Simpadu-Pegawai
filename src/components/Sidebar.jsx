import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  generalMenu,
  adminMenu,
  dosenMenu,
  GenerateMenu,
} from "./ForSidebar/GenerateMenu";

import logo from "../assets/logo.png";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth(); // Ambil data user dari context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <aside
        className={`w-64 flex-shrink-0 
           text-white flex flex-col bg-primary drop-shadow-2xl fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
                   ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-16 flex items-center justify-start gap-4 px-4">
          <img src={logo} alt="logo-poliban" className="w-10 h-10" />
          <span className="text-xl lg:text-2xl font-bold">SIMPEG</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-indigo-200 hover:text-white"
          >
            <svg
              className="w-6 h-6 ml-15"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-grow p-2">
          <ul className="space-y-2">
            {generalMenu.map((m) => GenerateMenu(m.menu, m.nav, m.icon))}

            {/* Menu Khusus Admin */}
            {user?.role === "Admin" &&
              adminMenu.map((m) => GenerateMenu(m.menu, m.nav, m.icon))}

            {/* Menu Khusus Dosen */}
            {user?.role === "Dosen" &&
              dosenMenu.map((m) => GenerateMenu(m.menu, m.nav, m.icon))}
          </ul>
        </nav>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm z-40 lg:hidden"
        ></div>
      )}
    </>
  );
}
