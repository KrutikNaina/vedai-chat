import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/blogs/${slug}`).then(res => setBlog(res.data));
  }, []);

  if (!blog) return <p>Loading...</p>;

  return (
    <>
      <Helmet>
        <title>{blog.seoTitle || blog.title}</title>
        <meta name="description" content={blog.seoDescription || blog.excerpt} />
      </Helmet>

      <article className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-orange-500">{blog.title}</h1>

        {blog.coverImage && (
          <img src={blog.coverImage} className="rounded-xl" />
        )}

        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
    </> 
  );
}
