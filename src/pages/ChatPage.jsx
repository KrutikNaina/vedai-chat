import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "🙏 Namaste! I am VedAI, your AI Guru. Ask me anything and I’ll guide you with wisdom from the Bhagavad Gita.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetch("http://localhost:5000/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : Promise.reject("Invalid token")))
        .then(() => setLoading(false))
        .catch(() => {
          localStorage.removeItem("token");
          navigate("/login");
        });
    }
  }, [navigate]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      const botReply = data.reply || "Sorry, I couldn't respond.";

      let currentText = "";
      setMessages((prev) => [...prev, { role: "bot", content: "" }]);
      for (let i = 0; i < botReply.length; i++) {
        await new Promise((r) => setTimeout(r, 20));
        currentText += botReply[i];
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content = currentText;
          return updated;
        });
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error: Could not fetch response." },
      ]);
    } finally {
      setTyping(false);
    }
  };

  if (loading) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      {/* ===== Multi-layer Galaxy Background ===== */}
      {/* Stars */}
      {[...Array(100)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute rounded-full bg-orange-500/40"
          style={{
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            filter: "blur(0.5px)",
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Nebula Clouds */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`nebula-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${300 + Math.random() * 300}px`,
            height: `${200 + Math.random() * 200}px`,
            background: `radial-gradient(circle at center, rgba(255,140,0,0.1) 0%, transparent 80%)`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            filter: "blur(120px)",
          }}
          animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }}
          transition={{
            repeat: Infinity,
            duration: 30 + Math.random() * 20,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Constellation Lines */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute bg-orange-400/20"
          style={{
            width: `${Math.random() * 100 + 20}px`,
            height: 1,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{ rotate: [0, 360] }}
          transition={{
            repeat: Infinity,
            duration: 40 + Math.random() * 20,
            ease: "linear",
          }}
        />
      ))}

      {/* Chat area */}
      <div className="pb-28 overflow-y-auto p-6 md:p-10 space-y-6 scrollbar-thin scrollbar-thumb-orange-500/40 z-10 relative">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-5 py-4 text-sm md:text-base rounded-2xl shadow-lg ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-br-none"
                  : "bg-white/10 border border-white/20 text-gray-200 rounded-bl-none backdrop-blur-md"
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-white/10 border border-white/20 text-gray-200 px-5 py-3 rounded-2xl rounded-bl-none backdrop-blur-md flex items-center gap-2">
              <span className="animate-bounce">●</span>
              <span className="animate-bounce delay-200">●</span>
              <span className="animate-bounce delay-400">●</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Sticky Input */}
      <div className="fixed bottom-0 left-0 w-full p-4 md:p-6 bg-black/40 backdrop-blur-xl border-t border-white/10 flex items-center gap-3 z-50">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="📝 Ask VedAI..."
          className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={sendMessage}
          className="p-3 md:p-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg hover:scale-105 transition"
        >
          <Send size={22} />
        </button>
      </div>
    </div>
  );
}
