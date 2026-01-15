import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  BookOpen
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function KathaList() {
  const [kathas, setKathas] = useState([]);
  const token = localStorage.getItem("token");

  const loadKathas = async () => {
    const res = await axios.get(`${API_URL}/api/ekatha`);
    setKathas(res.data);
  };

  const deleteKatha = async (id) => {
    if (!confirm("Are you sure you want to delete this Katha?")) return;

    await axios.delete(`${API_URL}/api/ekatha/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    loadKathas();
  };

  useEffect(() => {
    loadKathas();
  }, []);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-orange-500">
            eKatha Manager
          </h1>
          <p className="text-sm text-neutral-400">
            Manage spiritual kathas, steps & media
          </p>
        </div>

        <Link
          to="/admin/katha/add"
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg font-medium transition"
        >
          <Plus size={18} />
          Add Katha
        </Link>
      </div>

      {/* EMPTY STATE */}
      {kathas.length === 0 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center">
          <BookOpen className="mx-auto text-neutral-500 mb-3" size={40} />
          <p className="text-neutral-400">No Kathas created yet</p>
        </div>
      )}

      {/* KATHA LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {kathas.map((k) => (
          <div
            key={k._id}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-orange-500/40 transition group"
          >
            <div className="flex gap-4">

              {/* THUMBNAIL */}
              {k.image ? (
                <img
                  src={k.image}
                  alt={k.title}
                  className="w-24 h-24 rounded-xl object-cover border border-neutral-700"
                />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-500">
                  <BookOpen />
                </div>
              )}

              {/* CONTENT */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-white">
                  {k.title}
                </h2>

                <p className="text-sm text-neutral-400 line-clamp-2 mt-1">
                  {k.description}
                </p>

                <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500">
                  <span>📖 Steps: {k.steps.length}</span>
                  <span>🌐 {k.language?.join(", ")}</span>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 mt-4 opacity-90 group-hover:opacity-100 transition">
              <Link
                to={`/admin/katha/view/${k._id}`}
                className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700"
                title="View"
              >
                <Eye size={18} />
              </Link>

              <Link
                to={`/admin/katha/edit/${k._id}`}
                className="p-2 rounded-lg bg-blue-600/80 hover:bg-blue-600"
                title="Edit"
              >
                <Pencil size={18} />
              </Link>

              <button
                onClick={() => deleteKatha(k._id)}
                className="p-2 rounded-lg bg-red-600/80 hover:bg-red-600"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
