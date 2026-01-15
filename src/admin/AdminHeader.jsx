// src/admin/AdminHeader.jsx
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/admin": "Dashboard",
  "/admin/users": "Users",
  "/admin/katha": "Katha Manager",
  "/admin/blog": "Blog Manager",
  "/admin/api-logs": "API Logs",
  "/admin/contacts": "Contact Messages",
};

export default function AdminHeader() {
  const { pathname } = useLocation();

  const title = pageTitles[pathname] || "Admin";

  return (
    <header className="h-14 px-6 flex items-center border-b border-neutral-800 bg-neutral-900">
      <h2 className="text-lg font-semibold text-white">
        {title}
      </h2>
    </header>
  );
}
