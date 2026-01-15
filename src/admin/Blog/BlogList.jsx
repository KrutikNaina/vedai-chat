import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import api from "../.././utils/api";

const API_URL = import.meta.env.VITE_API_URL;

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const token = localStorage.getItem("token");

  const loadBlogs = async () => {
    const res = await axios.get(
      `${API_URL}/api/blogs/admin`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setBlogs(res.data);
  };

  const removeBlog = async (id) => {
    if (!confirm("Delete this blog permanently?")) return;
    await axios.delete(`${API_URL}/api/blogs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    loadBlogs();
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-orange-500">
            Blog Manager
          </h1>
          <p className="text-neutral-400 text-sm">
            Create, publish & manage SEO blogs
          </p>
        </div>

        <Link
          to="/admin/blog/add"
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 px-5 py-2.5 rounded-xl text-white font-semibold shadow-lg hover:scale-105 transition"
        >
          <Plus size={18} /> New Blog
        </Link>
      </div>

      {/* Empty State */}
      {blogs.length === 0 && (
        <div className="p-10 bg-neutral-900/60 border border-neutral-800 rounded-2xl text-center">
          <p className="text-neutral-400">No blogs created yet.</p>
        </div>
      )}

      {/* Blog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((b) => (
          <div
            key={b._id}
            className="group relative bg-neutral-900/70 border border-neutral-800 rounded-2xl overflow-hidden hover:border-orange-500/50 transition"
          >
            {/* Cover */}
            {b.coverImage && (
              <img
                src={b.coverImage}
                alt={b.title}
                className="h-44 w-full object-cover group-hover:scale-105 transition"
              />
            )}

            {/* Content */}
            <div className="p-5 space-y-3">
              {/* Title */}
              <h2 className="text-lg font-semibold group-hover:text-orange-400 transition">
                {b.title}
              </h2>

              {/* Meta */}
              <div className="flex items-center gap-3 text-xs">
                <span className="px-2 py-1 rounded-full bg-neutral-800 text-neutral-300">
                  {b.category}
                </span>

                <span
                  className={`px-2 py-1 rounded-full font-semibold ${
                    b.status === "published"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {b.status}
                </span>

                <span className="text-neutral-500">
                  👁 {b.views}
                </span>
              </div>

              {/* Excerpt */}
              {b.excerpt && (
                <p className="text-sm text-neutral-400 line-clamp-2">
                  {b.excerpt}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
              {b.status === "published" && (
                <Link
                  to={`/blog/${b.slug}`}
                  className="icon-btn bg-black/70 hover:bg-orange-600"
                  title="View"
                >
                  <Eye size={16} />
                </Link>
              )}

              <Link
                to={`/admin/blog/edit/${b._id}`}
                className="icon-btn bg-black/70 hover:bg-blue-600"
                title="Edit"
              >
                <Pencil size={16} />
              </Link>

              <button
                onClick={() => removeBlog(b._id)}
                className="icon-btn bg-black/70 hover:bg-red-600"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
