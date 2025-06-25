import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ClassSessionProvider } from "../context/ClassSessionContext";

export default function DashboardLayout() {
  // State untuk mengontrol visibilitas sidebar di layar kecil
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex h-screen bg-gray-100">
      {/* Sidebar sekarang menerima props untuk visibilitasnya */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header sekarang menerima props untuk bisa membuka sidebar */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-4 sm:px-6 py-8">
            <ClassSessionProvider>
              <Outlet />
            </ClassSessionProvider>
          </div>
        </main>
      </div>
    </div>
  );
}
