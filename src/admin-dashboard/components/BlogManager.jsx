import { useState } from "react";

export default function BlogManager() {
  const [blogs, setBlogs] = useState([{ id: 1, title: "Meditation Benefits" }]);
  const [newBlog, setNewBlog] = useState("");

  const addBlog = () => {
    if (!newBlog.trim()) return;
    setBlogs([...blogs, { id: blogs.length + 1, title: newBlog }]);
    setNewBlog("");
  };

  return (
    <div className="bg-neutral-800/80 p-6 rounded-2xl shadow">
      <h3 className="text-lg font-bold mb-4">📝 Blog Manager</h3>
      <div className="flex gap-3 mb-4">
        <input
          value={newBlog}
          onChange={(e) => setNewBlog(e.target.value)}
          placeholder="New blog title..."
          className="flex-1 px-4 py-2 rounded-lg bg-neutral-900 text-white"
        />
        <button onClick={addBlog} className="px-4 py-2 bg-orange-500 rounded-lg">
          Add
        </button>
      </div>
      <ul className="list-disc pl-6">
        {blogs.map((blog) => (
          <li key={blog.id} className="text-gray-300">{blog.title}</li>
        ))}
      </ul>
    </div>
  );
}
