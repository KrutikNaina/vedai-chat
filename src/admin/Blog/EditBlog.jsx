import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import MarkdownEditor from "./MarkdownEditor";
import BlogEditor from "./BlogEditor";

const API_URL = import.meta.env.VITE_API_URL;

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/blogs/id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setForm({
          ...res.data,
          tags: res.data.tags.join(", "),
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load blog");
        setLoading(false);
      });
  }, [id, token]);

  const save = async () => {
    try {
      await axios.put(
        `${API_URL}/api/blogs/${id}`,
        {
          ...form,
          tags: form.tags.split(",").map((t) => t.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/admin/blog");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }

    const uploadCover = async (file) => {
      const data = new FormData();
      data.append("image", file);

      const res = await axios.post(
        `${API_URL}/api/upload/image`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setForm({ ...form, coverImage: res.data.url });
    };

  };

  if (loading) return <p>Loading...</p>;
  if (!form) return <p>Blog not found</p>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-orange-500">
          ✏️ Edit Blog Post
        </h1>
        <p className="text-neutral-400 mt-1">
          Update and refine your published content
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6 shadow-xl">

        {/* Title */}
        <div>
          <label className="label">Blog Title</label>
          <input
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="input"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="label">SEO Slug</label>
          <input
            value={form.slug}
            onChange={(e) =>
              setForm({ ...form, slug: e.target.value })
            }
            className="input"
          />
          <p className="text-xs text-neutral-500 mt-1">
            URL: /blog/{form.slug}
          </p>
        </div>

        {/* Cover Image */}
        <div>
          <label className="label">Cover Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => uploadCover(e.target.files[0])}
            className="input"
          />

          {form.coverImage && (
            <img
              src={form.coverImage}
              alt="preview"
              className="mt-3 rounded-xl max-h-64 object-cover border border-neutral-800"
            />
          )}
        </div>


        {/* Category + Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Category</label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className="input"
            >
              <option>General</option>
              <option>Bhagavad Gita</option>
              <option>Vedas</option>
              <option>Meditation</option>
              <option>Astrology</option>
            </select>
          </div>

          <div>
            <label className="label">Status</label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
              className="input"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="label">Excerpt</label>
          <textarea
            value={form.excerpt}
            onChange={(e) =>
              setForm({ ...form, excerpt: e.target.value })
            }
            className="input h-24"
          />
        </div>

        {/* ✅ MARKDOWN EDITOR */}
        <div>
          <label className="label">Blog Content</label>
          <MarkdownEditor
            value={form.content}
            onChange={(val) =>
              setForm({ ...form, content: val })
            }
          />
        </div>
      </div>

      {/* SEO CARD */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-orange-400">
          🔍 SEO Settings
        </h2>

        <input
          placeholder="SEO Title"
          value={form.seoTitle || ""}
          onChange={(e) =>
            setForm({ ...form, seoTitle: e.target.value })
          }
          className="input"
        />

        <textarea
          placeholder="SEO Description"
          value={form.seoDescription || ""}
          onChange={(e) =>
            setForm({ ...form, seoDescription: e.target.value })
          }
          className="input h-20"
        />

        <input
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) =>
            setForm({ ...form, tags: e.target.value })
          }
          className="input"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate("/admin/blog")}
          className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700"
        >
          Cancel
        </button>

        <button
          onClick={save}
          className="px-6 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 font-semibold"
        >
          Update Blog
        </button>
      </div>
    </div>
  );
}
