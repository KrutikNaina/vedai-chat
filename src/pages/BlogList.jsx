import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/blogs`);
        setBlogs(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Failed to load blogs", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-orange-500">
        VedAI Blog
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {blogs.map((b) => (
          <Link
            key={b._id}
            to={`/blog/${b.slug}`}
            className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-orange-500 transition"
          >
            {b.coverImage && (
              <img
                src={b.coverImage}
                alt={b.title}
                className="h-40 w-full object-cover"
              />
            )}

            <div className="p-4">
              <span className="text-xs text-orange-400">
                {b.category}
              </span>

              <h2 className="font-semibold mt-1">
                {b.title}
              </h2>

              <p className="text-sm text-neutral-400 mt-2 line-clamp-3">
                {b.excerpt}
              </p>
            </div>
          </Link>
        ))}

        {!loading && blogs.length === 0 && (
          <p className="text-neutral-500">
            No blogs available.
          </p>
        )}
      </div>
    </div>
  );
}
