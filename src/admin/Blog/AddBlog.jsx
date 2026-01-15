import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MarkdownEditor from "./MarkdownEditor";
import BlogEditor from "./BlogEditor";

const API_URL = import.meta.env.VITE_API_URL;

export default function AddBlog() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [form, setForm] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        coverImage: "",
        category: "General",
        tags: "",
        seoTitle: "",
        seoDescription: "",
        status: "draft",
    });

    // Auto-generate slug from title
    const handleTitleChange = (value) => {
        setForm({
            ...form,
            title: value,
            slug: value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, ""),
        });
    };

    const submit = async () => {
        try {
            await axios.post(
                `${API_URL}/api/blogs`,
                {
                    ...form,
                    tags: form.tags.split(",").map((t) => t.trim()),
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            navigate("/admin/blog");
        } catch (err) {
            console.error(err);
            alert("Failed to create blog");
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

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-orange-500">
                     Create Blog Post
                </h1>
                <p className="text-neutral-400 mt-1">
                    Write SEO-optimized spiritual content for VedAI
                </p>
            </div>

            {/* MAIN CARD */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6 shadow-xl">

                {/* Title */}
                <div>
                    <label className="label">Blog Title</label>
                    <input
                        value={form.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Enter blog title"
                        className="input"
                    />
                </div>

                {/* Slug */}
                <div>
                    <label className="label">SEO Slug</label>
                    <input
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        className="input"
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                        URL: /blog/{form.slug || "your-slug"}
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
                            <option value="published">Publish</option>
                        </select>
                    </div>
                </div>

                {/* Excerpt */}
                <div>
                    <label className="label">Excerpt (Short Summary)</label>
                    <textarea
                        value={form.excerpt}
                        onChange={(e) =>
                            setForm({ ...form, excerpt: e.target.value })
                        }
                        className="input h-24"
                    />
                </div>

                {/*  MARKDOWN EDITOR (REPLACED TEXTAREA) */}
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
                     SEO Optimization
                </h2>

                <input
                    placeholder="SEO Title"
                    value={form.seoTitle}
                    onChange={(e) =>
                        setForm({ ...form, seoTitle: e.target.value })
                    }
                    className="input"
                />

                <textarea
                    placeholder="SEO Description"
                    value={form.seoDescription}
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
                    onClick={submit}
                    className="px-6 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 font-semibold"
                >
                    Save Blog
                </button>
            </div>
        </div>
    );
}
