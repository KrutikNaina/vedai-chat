import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const API_URL = import.meta.env.VITE_API_URL;

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/blogs/${slug}`);
        setBlog(res.data);
      } catch (error) {
        console.error("Failed to load blog", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchBlog();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!blog) return <p>Blog not found</p>;

  return (
    <>
      <Helmet>
        <title>{blog.seoTitle || blog.title}</title>
        <meta
          name="description"
          content={blog.seoDescription || blog.excerpt}
        />
      </Helmet>

      <article className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-orange-500">
          {blog.title}
        </h1>

        {blog.coverImage && (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="rounded-xl"
          />
        )}

        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
    </>
  );
}
