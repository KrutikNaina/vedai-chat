import { useState, useEffect, useRef } from "react";
import { Send, Menu, X, History, Plus, ChevronsLeft, ChevronsRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "🙏 Namaste! I am VedAI, your AI Guru. Ask me anything and I’ll guide you with wisdom from the Bhagavad Gita.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chatCount, setChatCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [stopTyping, setStopTyping] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarMini, setSidebarMini] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const FREE_CHAT_LIMIT = 3;

  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // ===== Authenticate user =====
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetch("http://localhost:5000/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : Promise.reject("Invalid token")))
        .then(() => {
          setLoading(false);
          fetchHistory();
        })
        .catch(() => {
          localStorage.removeItem("token");
          navigate("/login");
        });
    }
  }, [navigate]);

  // ===== Fetch chat history and user count =====
  const fetchHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/chat/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setChatHistory(Array.isArray(data.chats) ? data.chats : []);

        // Remaining chats (if backend sends)
        if (data.remainingChats !== undefined) {
          setChatCount(FREE_CHAT_LIMIT - data.remainingChats);
          setLimitReached(data.remainingChats <= 0);
        }
      } else {
        setChatHistory([]);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
      setChatHistory([]);
    }
  };

  // ===== Save chat =====
  const saveChatToDB = async (allMessages) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });
      fetchHistory();
    } catch (err) {
      console.error("Error saving chat:", err);
    }
  };

  // ===== Send message =====
  const sendMessage = async (msg = null) => {
    if (limitReached) return;

    const userMessage = msg || input;
    if (!userMessage.trim()) return;

    const updatedMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(updatedMessages);
    setInput("");
    setTyping(true);
    setStopTyping(false);

    const API_KEY = "APIKey";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            role: "system",
            parts: [
              {
                text:
                  "Respond using Bhagavad Gita Shloka, Transliteration, and Meaning. Format: 📜 Sanskrit Shloka, 🔤 Transliteration, 💬 Meaning & Solution.",
              },
            ],
          },
          contents: [{ role: "user", parts: [{ text: userMessage }] }],
        }),
      });

      const data = await res.json();
      const botReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "🙏 Sorry, I couldn't respond.";

      // Typing effect
      let currentText = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      for (let i = 0; i < botReply.length; i++) {
        if (stopTyping) break;
        await new Promise((r) => setTimeout(r, 20));
        currentText += botReply[i];
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content = currentText;
          return updated;
        });
      }

      await saveChatToDB([...updatedMessages, { role: "assistant", content: botReply }]);
      setChatCount((prev) => prev + 1);

      if (chatCount + 1 >= FREE_CHAT_LIMIT) {
        setLimitReached(true);
        startCountdown();
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: Could not fetch response." },
      ]);
    } finally {
      setTyping(false);
    }
  };

  // ===== Countdown for next allowed message =====
  const startCountdown = () => {
    const endTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24h
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;
      if (distance <= 0) {
        clearInterval(interval);
        setLimitReached(false);
        setChatCount(0);
        setCountdown(null);
      } else {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
  };

  // ===== Load chat from history =====
  const loadChat = (chat) => {
    setMessages(chat.messages || []);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  // ===== Helpers =====
  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  const deleteChats = () => setMessages([]);
  const newChat = () => setMessages([]);

  // ===== Auto-scroll =====
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className={`min-h-screen flex ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} fixed md:static top-0 left-0 h-full ${sidebarMini ? "w-20" : "w-64"} bg-black/90 backdrop-blur-lg border-r border-white/10 transition-all duration-300 z-50`}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/20">
          {!sidebarMini && (
            <h2 className="text-lg font-bold flex items-center gap-2">
              <History size={18} /> History
            </h2>
          )}
          <div className="flex gap-2">
            <button className="hidden md:block" onClick={() => setSidebarMini(!sidebarMini)}>
              {sidebarMini ? <ChevronsRight size={22} /> : <ChevronsLeft size={22} />}
            </button>
            <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
              <X size={22} />
            </button>
          </div>
        </div>

        {/* New Chat */}
        <div className="p-4 border-b border-white/20">
          <button onClick={newChat} className="flex items-center gap-2 bg-orange-500/20 hover:bg-orange-500/40 px-3 py-2 rounded-md w-full text-sm">
            <Plus size={16} /> {!sidebarMini && "New Chat"}
          </button>
        </div>

        {/* History list */}
        <div className="overflow-y-auto h-[calc(100%-7rem)] p-4 space-y-3">
          {Array.isArray(chatHistory) && chatHistory.length === 0 && (
            <p className="text-gray-400 text-sm">{!sidebarMini && "No chats yet."}</p>
          )}
          {Array.isArray(chatHistory) &&
            chatHistory.map((chat, i) => (
              <div key={i} onClick={() => loadChat(chat)} className="cursor-pointer bg-white/10 hover:bg-orange-500/40 p-3 rounded-lg text-sm line-clamp-2">
                {chat.messages?.[0]?.content || "Conversation"}
              </div>
            ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 relative flex flex-col">
        {/* Top bar (mobile) */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/40 border-b border-white/10 md:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <h1 className="text-lg font-bold">VedAI</h1>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6">
          {limitReached && (
            <div className="text-yellow-400 text-center mb-2">
              ⚠️ Free chat limit reached. Next message available in: {countdown}
            </div>
          )}
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";

            // Split assistant message for readability
            let parts = [];
            if (!isUser) {
              const regex = /(📜|🔤|💬)/g;
              const splitContent = msg.content.split(regex).filter(Boolean);
              for (let i = 0; i < splitContent.length; i += 2) {
                const marker = splitContent[i];
                const text = splitContent[i + 1] || "";
                parts.push({ marker, text });
              }
            }

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-5 py-4 text-sm md:text-base rounded-2xl shadow-lg ${
                    isUser
                      ? "bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-br-none"
                      : "bg-white/10 border border-white/20 text-gray-200 rounded-bl-none backdrop-blur-md"
                  }`}
                >
                  {isUser
                    ? msg.content
                    : parts.map((p, i) => (
                        <div key={i} className="mb-2">
                          <span
                            className={`font-bold ${
                              p.marker === "📜"
                                ? "text-orange-400"
                                : p.marker === "🔤"
                                ? "text-yellow-300"
                                : "text-gray-200"
                            }`}
                          >
                            {p.marker}
                          </span>{" "}
                          <span className="whitespace-pre-line">{p.text}</span>
                        </div>
                      ))}
                </div>
              </motion.div>
            );
          })}
          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-white/10 border border-white/20 text-gray-200 px-5 py-3 rounded-2xl rounded-bl-none backdrop-blur-md flex items-center gap-2">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-200">●</span>
                <span className="animate-bounce delay-400">●</span>
                <button onClick={() => setStopTyping(true)} className="ml-2 text-sm">
                  Stop
                </button>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Sticky Input */}
        <div className="sticky bottom-0 p-4 md:p-6 bg-black/40 backdrop-blur-xl border-t border-white/10 flex items-center gap-3 z-50">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={limitReached ? "⏳ Limit reached, wait for next message" : "📝 Ask VedAI..."}
            className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            disabled={limitReached}
          />
          <button
            onClick={sendMessage}
            className="p-3 md:p-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg hover:scale-105 transition"
            disabled={limitReached}
          >
            <Send size={22} />
          </button>
          <button onClick={toggleTheme} className="ml-2">{theme === "dark" ? "🌞" : "🌙"}</button>
          <button onClick={deleteChats} className="ml-2 text-red-400">🗑️</button>
        </div>
      </div>
    </div>
  );
}
