// pages/ChatPage.jsx
import { useState } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "🙏 Namaste! I am VedAI, your AI Guru. Share your problem, and I’ll guide you with wisdom from the Bhagavad Gita.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "✨ Here is a guiding verse for your situation: 'Karmanye vadhikaraste, ma phaleshu kadachana' – Focus only on your actions, not the fruits.",
        },
      ]);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-black  to-black text-white">
      {/* Floating cosmic particles */}
      {[...Array(35)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-orange-500/20"
          style={{
            width: 2 + Math.random() * 6,
            height: 2 + Math.random() * 6,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            filter: "blur(1.5px)",
          }}
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
            opacity: [0.2, 0.9, 0.2],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Header */}
      <div className="sticky top-0 z-10 flex justify-between items-center px-6 py-4 bg-black/40 backdrop-blur-lg border-b border-white/10">
        <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          🕉 VedAI – Your Spiritual Guide
        </h1>
        <span className="text-sm opacity-70">Bhagavad Gita • Astrology • Wisdom</span>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 scrollbar-thin scrollbar-thumb-orange-500/40">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
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

        {/* Typing Animation */}
        {typing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white/10 border border-white/20 text-gray-200 px-5 py-3 rounded-2xl rounded-bl-none backdrop-blur-md flex items-center gap-2">
              <span className="animate-bounce">●</span>
              <span className="animate-bounce delay-200">●</span>
              <span className="animate-bounce delay-400">●</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-black/40 backdrop-blur-xl border-t border-white/10 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="📝 Share your problem here..."
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
