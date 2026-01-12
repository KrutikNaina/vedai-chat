// vedai-landing\src\admin\AdminSidebar.jsx
import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `block px-4 py-2 rounded-lg mb-2 ${
      pathname === path
        ? "bg-orange-500 text-black"
        : "bg-neutral-900 hover:bg-neutral-800"
    }`;

  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 p-4">
      <h1 className="text-xl font-bold text-orange-500 mb-6">VedAI Admin</h1>

      <Link to="/admin" className={linkClass("/admin")}>Dashboard</Link>
      <Link to="/admin/users" className={linkClass("/admin/users")}>Users</Link>
      <Link to="/admin/katha" className={linkClass("/admin/katha")}>Katha Manager</Link>
      <Link to="/admin/blog" className={linkClass("/admin/blogs")}>Blog Manager</Link>
      <Link to="/admin/api-logs" className={linkClass("/admin/api-logs")}>API Logs</Link>
    </aside>
  );
}
