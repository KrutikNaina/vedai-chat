import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/blogs").then(res => setBlogs(res.data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-orange-500">VedAI Blog</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {blogs.map(b => (
          <Link
            key={b._id}
            to={`/blog/${b.slug}`}
            className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-orange-500"
          >
            {b.coverImage && (
              <img src={b.coverImage} className="h-40 w-full object-cover" />
            )}

            <div className="p-4">
              <span className="text-xs text-orange-400">{b.category}</span>
              <h2 className="font-semibold mt-1">{b.title}</h2>
              <p className="text-sm text-neutral-400 mt-2 line-clamp-3">
                {b.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
