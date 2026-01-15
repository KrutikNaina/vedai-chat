import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function ContactView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [contact, setContact] = useState(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API_URL}/api/admin/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setContact(res.data.contact))
      .catch(console.error);
  }, [id, token]);

  const sendReply = async () => {
    if (!reply.trim()) return;

    try {
      setSending(true);

      await axios.post(
        `${API_URL}/api/admin/contacts/${id}/reply`,
        { reply },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setContact((prev) => ({
        ...prev,
        status: "replied",
        adminReply: reply,
      }));

      setReply("");
    } finally {
      setSending(false);
    }
  };

  if (!contact) {
    return (
      <p className="text-neutral-400 text-center mt-10">
        Loading message...
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-orange-500">
            {contact.subject}
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            From {contact.name} · {contact.email}
          </p>
        </div>

        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold ${
            contact.status === "new"
              ? "bg-orange-500 text-black"
              : "bg-green-600 text-white"
          }`}
        >
          {contact.status.toUpperCase()}
        </span>
      </div>

      {/* Message */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-6">
        <p className="text-white leading-relaxed">
          {contact.message}
        </p>
      </div>

      {/* Reply */}
      {contact.status === "replied" ? (
        <div className="bg-green-900/20 border border-green-800 rounded-2xl p-6">
          <p className="text-green-400 font-semibold mb-2">
            Admin Reply
          </p>
          <p className="text-white">{contact.adminReply}</p>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <p className="text-sm text-neutral-400 mb-3">
            Write reply
          </p>

          <textarea
            rows={6}
            placeholder="Type your response..."
            className="w-full p-4 bg-neutral-950 border border-neutral-800 rounded-xl text-white resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            >
              Back
            </button>

            <button
              onClick={sendReply}
              disabled={sending}
              className={`px-6 py-2 rounded-xl font-semibold ${
                sending
                  ? "bg-orange-400 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {sending ? "Sending..." : "Send Reply"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
