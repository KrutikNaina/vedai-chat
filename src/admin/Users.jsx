import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiEye, FiTrash2 } from "react-icons/fi";

export default function Users() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const loadUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data.users);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    loadUsers();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-orange-500 mb-6">
        Users Management
      </h1>

      <div className="overflow-hidden rounded-xl border border-neutral-800">
        <table className="w-full bg-neutral-900">
          <thead className="bg-neutral-800 text-neutral-400 text-sm">
            <tr>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Plan</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="border-t border-neutral-800 hover:bg-neutral-800/40 transition"
              >
                <td className="p-4 text-neutral-200">{u.email}</td>

                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400">
                    {u.role}
                  </span>
                </td>

                <td className="p-4 text-neutral-300">
                  {u.subscription?.plan || "Free"}
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    {/* View */}
                    <button
                      onClick={() => navigate(`/admin/users/${u._id}`)}
                      className="p-2 rounded-lg bg-neutral-800 hover:bg-blue-500/10 text-blue-400 hover:text-blue-300 transition"
                      title="View user"
                    >
                      <FiEye size={18} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="p-2 rounded-lg bg-neutral-800 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition"
                      title="Delete user"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="p-6 text-center text-neutral-500"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
