// src/admin/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import useSessionTimeout from "../hooks/useSessionTimeout";

export default function AdminLayout() {

  useSessionTimeout(() => {
    localStorage.removeItem("token");
    window.location.replace("/login");
  }, 15 * 60 * 1000); // 15 min

  return (
    <div className="flex h-screen bg-neutral-950 text-white">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <AdminHeader />

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
