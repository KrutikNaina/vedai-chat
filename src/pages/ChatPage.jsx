// vedai-landing/src/pages/ChatPage.jsx
import { useState, useEffect, useRef } from "react";
import {
  Send,
  Menu,
  X,
  History,
  Plus,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  Copy,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiSun, FiMoon } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL;

export default function ChatPage() {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const authChecked = useRef(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "🙏 Namaste! I am VedAI, your AI Guru. Ask me anything and I'll guide you with wisdom from the Bhagavad Gita.",
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [stopTyping, setStopTyping] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarMini, setSidebarMini] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [chatCount, setChatCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [userRole, setUserRole] = useState("free");
  
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const FREE_CHAT_LIMIT = 3;

  /* ================= AUTH (SAFE) ================= */

  const fetchUserData = async (token) => {
    try {
      const res = await fetch(`${API_URL}/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        throw new Error("Unauthorized");
      }

      if (!res.ok) {
        console.warn("User fetch failed, but token kept");
        return;
      }

      const data = await res.json();
      setUserRole(data.role || "free");
    } catch (err) {
      console.error("Auth error:", err);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  /* ================= CHAT HISTORY ================= */

  const fetchHistory = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/chat/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      const data = await res.json();
      setChatHistory(Array.isArray(data.chats) ? data.chats : []);

      if (data.remainingChats !== undefined) {
        const remaining = data.remainingChats;
        setChatCount(
          remaining === "unlimited" ? 0 : FREE_CHAT_LIMIT - remaining
        );
        setLimitReached(
          remaining === "unlimited" ? false : remaining <= 0
        );
      }
    } catch (err) {
      console.error("History error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= INIT (FIXED) ================= */

  useEffect(() => {
    if (authChecked.current) return;
    authChecked.current = true;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchUserData(token);
    fetchHistory(token);
  }, [navigate]);

  /* ================= THEME ================= */
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* ================= CHAT ACTIONS ================= */

  const saveChatToDB = async (allMessages) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });
      fetchHistory(token);
    } catch (err) {
      console.error("Save chat error:", err);
    }
  };

  const sendMessage = async () => {
    if (limitReached && userRole === "free") return;
    if (!input.trim() || typing) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const userMessage = input.trim();
    setInput("");
    setTyping(true);
    setStopTyping(false);

    // Reset textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const updatedMessages = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(updatedMessages);

    try {
      const res = await fetch(`${API_URL}/api/chat/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      const reply =
        data?.reply ||
        "🙏 VedAI is unavailable. Please try again later.";

      let current = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      for (let i = 0; i < reply.length; i++) {
        if (stopTyping) break;
        await new Promise((r) => setTimeout(r, 20));
        current += reply[i];
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1].content = current;
          return copy;
        });
      }

      await saveChatToDB([
        ...updatedMessages,
        { role: "assistant", content: reply },
      ]);

      if (userRole === "free") {
        setChatCount((c) => c + 1);
        if (chatCount + 1 >= FREE_CHAT_LIMIT) {
          setLimitReached(true);
          startCountdown();
        }
      }
    } catch (err) {
      console.error("Send error:", err);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: "⚠️ An error occurred. Please try again." },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const deleteChat = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`${API_URL}/api/chat/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setChatHistory((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const loadChat = (chat) => {
    if (chat.messages) {
      setMessages(chat.messages);
    }
    setSidebarOpen(false);
  };

  const startCountdown = () => {
    const end = Date.now() + 24 * 60 * 60 * 1000;
    const timer = setInterval(() => {
      const diff = end - Date.now();
      if (diff <= 0) {
        clearInterval(timer);
        setLimitReached(false);
        setChatCount(0);
        setCountdown(null);
      } else {
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setCountdown(`${h}h ${m}m ${s}s`);
      }
    }, 1000);
  };

  const newChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "🙏 Namaste! I am VedAI, your AI Guru. Ask me anything and I'll guide you with wisdom from the Bhagavad Gita.",
      },
    ]);
    setSidebarOpen(false);
  };

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  const handleUpgradeClick = () => {
    navigate("/upgrade");
  };

  // Copy text
  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  /* ================= AUTOSCROLL ================= */

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Scroll to bottom button
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={`min-h-screen flex ${theme === "dark" ? "bg-[#0f0f0f] text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`
                fixed top-0 left-0 h-screen z-50
                ${sidebarMini ? "w-20" : "w-72"}
                bg-[#1a1a1a] border-r border-gray-800
                transition-all duration-300
                md:static
              `}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                  {!sidebarMini && (
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <History size={18} className="text-orange-500" /> History
                    </h2>
                  )}
                  <div className="flex gap-2">
                    <button
                      className="hidden md:block hover:bg-gray-800 p-1.5 rounded-lg transition-colors"
                      onClick={() => setSidebarMini(!sidebarMini)}
                    >
                      {sidebarMini ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
                    </button>
                    <button 
                      className="md:hidden hover:bg-gray-800 p-1.5 rounded-lg transition-colors" 
                      onClick={() => setSidebarOpen(false)}
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* New Chat */}
                <div className="p-4 border-b border-gray-800">
                  <button
                    onClick={newChat}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 px-3 py-2.5 rounded-lg w-full text-sm font-medium transition-all shadow-lg hover:shadow-orange-500/25"
                  >
                    <Plus size={16} /> {!sidebarMini && "New Chat"}
                  </button>
                </div>

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
                  {loading && !sidebarMini && (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-400 text-sm mt-2">Loading...</p>
                    </div>
                  )}

                  {!loading && chatHistory.length === 0 && !sidebarMini && (
                    <p className="text-gray-400 text-sm text-center py-8">No chats yet.</p>
                  )}

                  {chatHistory.map((chat) => (
                    <motion.div
                      key={chat._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => loadChat(chat)}
                      className="group flex justify-between items-center
                      bg-white/5 hover:bg-orange-500/20 active:bg-orange-500/30
                      p-3 rounded-lg cursor-pointer transition-all"
                    >
                      <span className="text-sm line-clamp-2 flex-1">
                        {chat.messages?.[1]?.content || "Conversation"}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(chat._id);
                        }}
                        className="opacity-0 group-hover:opacity-100
                        text-red-400 hover:text-red-500 ml-2 p-1 rounded hover:bg-red-500/10 transition-all"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarMini ? "md:ml-0" : "md:ml-0"
        }`}
      >
        {/* Mobile Header */}
        <div className="sticky top-0 z-30 p-3 md:p-4 border-b border-gray-800 bg-[#0f0f0f]/95 backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 active:scale-95 transition-all md:hidden"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden md:block p-2 rounded-lg bg-gray-800 hover:bg-gray-700 active:scale-95 transition-all"
              >
                <Menu size={20} />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <div>
                  <h1 className="text-sm md:text-base font-bold">VedAI</h1>
                  <p className="text-xs text-gray-400 hidden sm:block">AI Spiritual Guide</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 active:scale-95 transition-all"
              >
                {theme === "dark" ? (
                  <FiSun className="text-yellow-400 text-lg" />
                ) : (
                  <FiMoon className="text-blue-400 text-lg" />
                )}
              </button>
              
              <button
                onClick={newChat}
                className="hidden sm:block p-2 rounded-lg bg-gray-800 hover:bg-red-900/30 text-red-400 hover:text-red-300 active:scale-95 transition-all"
                title="New conversation"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Chat messages container */}
        <div className="flex-1 overflow-y-auto pb-2">
          {/* Limit reached warning */}
          {limitReached && userRole === "free" && (
            <div className="sticky top-0 z-20 p-3 md:p-4">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mx-auto max-w-3xl"
              >
                <div className="bg-gradient-to-r from-amber-900/30 to-amber-800/20 border border-amber-700/40 rounded-xl p-3 md:p-4 shadow-lg">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="text-amber-500 text-xl">⚠️</div>
                    <div className="flex-1">
                      <p className="text-amber-300 font-semibold text-sm md:text-base">Free chat limit reached</p>
                      <p className="text-amber-400/80 text-xs md:text-sm mt-1">
                        {countdown ? `Next message in ${countdown}` : "Upgrade to Premium for unlimited access"}
                      </p>
                    </div>
                    <button
                      onClick={handleUpgradeClick}
                      className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 active:scale-95 rounded-lg text-sm font-semibold transition-all shadow-lg"
                    >
                      Upgrade
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Messages */}
          <div className="mx-auto max-w-3xl px-3 md:px-4 py-4 space-y-4 md:space-y-6">
            {messages.map((msg, idx) => {
              const isUser = msg.role === "user";

              // Parse assistant response
              let sections = [];
              if (!isUser) {
                const content = msg.content;
                const shlokaMatch = content.match(/📜([\s\S]*?)(?=🔤|💬|$)/);
                const transliterationMatch = content.match(/🔤([\s\S]*?)(?=💬|📜|$)/);
                const meaningMatch = content.match(/💬([\s\S]*?)(?=📜|🔤|$)/);

                if (shlokaMatch) sections.push({
                  type: "shloka",
                  title: "Sanskrit Shloka",
                  icon: "📜",
                  content: shlokaMatch[1].trim(),
                  color: "from-amber-900/20 to-amber-950/10",
                  border: "border-amber-800/30",
                  textColor: "text-amber-200"
                });

                if (transliterationMatch) sections.push({
                  type: "transliteration",
                  title: "Transliteration",
                  icon: "🔤",
                  content: transliterationMatch[1].trim(),
                  color: "from-blue-900/20 to-blue-950/10",
                  border: "border-blue-800/30",
                  textColor: "text-blue-200"
                });

                if (meaningMatch) sections.push({
                  type: "meaning",
                  title: "Meaning & Guidance",
                  icon: "💬",
                  content: meaningMatch[1].trim(),
                  color: "from-emerald-900/20 to-emerald-950/10",
                  border: "border-emerald-800/30",
                  textColor: "text-emerald-200"
                });

                if (sections.length === 0 && content) {
                  sections.push({
                    type: "general",
                    title: "Response",
                    icon: "💭",
                    content: content,
                    color: "from-gray-800 to-gray-900",
                    border: "border-gray-700",
                    textColor: "text-gray-200"
                  });
                }
              }

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[90%] md:max-w-[85%] ${isUser ? "w-fit" : "w-full"}`}>
                    {isUser ? (
                      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="text-xs">👤</span>
                          </div>
                          <span className="text-xs md:text-sm font-medium opacity-90">You</span>
                        </div>
                        <p className="whitespace-pre-wrap text-sm md:text-base break-words">{msg.content}</p>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl rounded-tl-none shadow-xl overflow-hidden">
                        {/* Assistant header */}
                        <div className="flex items-center justify-between gap-3 px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-xs md:text-sm">V</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-100 text-sm md:text-base">VedAI</h3>
                              <p className="text-[10px] md:text-xs text-gray-400">AI Spiritual Guide</p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => copyToClipboard(msg.content, idx)}
                            className="p-1.5 md:p-2 rounded-lg hover:bg-gray-700/50 active:scale-95 transition-all"
                          >
                            {copiedIndex === idx ? (
                              <Check size={16} className="text-green-400" />
                            ) : (
                              <Copy size={16} className="text-gray-400" />
                            )}
                          </button>
                        </div>

                        {/* Content sections */}
                        <div className="p-3 md:p-4 space-y-3 md:space-y-4">
                          {sections.map((section, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className={`bg-gradient-to-br ${section.color} border ${section.border} rounded-xl p-3 md:p-4`}
                            >
                              <div className="flex items-center gap-2 mb-2 md:mb-3">
                                <span className="text-lg md:text-xl">{section.icon}</span>
                                <h4 className={`font-semibold text-sm md:text-base ${section.textColor}`}>{section.title}</h4>
                                <div className="flex-1 h-px bg-gradient-to-r from-current opacity-20 ml-2"></div>
                              </div>

                              <div className="space-y-2 md:space-y-3">
                                {section.content.split('\n\n').map((paragraph, pIdx) => (
                                  paragraph.trim() && (
                                    <p
                                      key={pIdx}
                                      className="text-gray-200 leading-relaxed whitespace-pre-wrap text-sm md:text-base break-words"
                                    >
                                      {paragraph}
                                    </p>
                                  )
                                ))}
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="px-3 md:px-4 py-2 md:py-3 bg-gray-900/50 border-t border-gray-800">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                              <span>Source: Bhagavad Gita</span>
                            </div>
                            <div className="text-[10px] md:text-xs text-gray-500">
                              Wisdom • Guidance • Enlightenment
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Typing indicator */}
            {typing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 px-4"
              >
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-xs md:text-sm text-gray-500">VedAI is typing...</span>
              </motion.div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Area - Mobile Optimized */}
        <div className="sticky bottom-0 p-3 md:p-4 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/98 to-transparent backdrop-blur-lg border-t border-gray-800">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  rows={1}
                  placeholder={
                    userRole === "premium"
                      ? "💫 Ask VedAI anything..."
                      : limitReached
                        ? "⏳ Upgrade to continue..."
                        : `Ask your question... (${FREE_CHAT_LIMIT - chatCount} left)`
                  }
                  disabled={(limitReached && userRole === "free") || typing}
                  className="w-full px-4 py-3 md:py-3.5 rounded-xl bg-gray-900 border border-gray-700 
                    text-white placeholder-gray-500 text-sm md:text-base
                    focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
                    disabled:opacity-50 disabled:cursor-not-allowed resize-none overflow-hidden leading-relaxed"
                  style={{ maxHeight: "120px" }}
                />
              </div>

              <button
                onClick={sendMessage}
                disabled={(limitReached && userRole === "free") || !input.trim() || typing}
                className="p-3 md:p-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white 
                  shadow-lg hover:shadow-orange-500/25 active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 
                  transition-all duration-200"
              >
                <Send size={18} className="md:w-5 md:h-5" />
              </button>
            </div>

            <p className="text-[10px] md:text-xs text-gray-500 text-center mt-2">
              Press Enter to send • Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>

      {/* Scroll to bottom FAB - Mobile friendly */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={scrollToBottom}
            className="fixed bottom-24 right-4 md:bottom-28 md:right-8 
              w-12 h-12 md:w-14 md:h-14 
              rounded-full bg-gradient-to-r from-orange-500 to-red-600 
              text-white shadow-2xl hover:shadow-orange-500/50 
              active:scale-90 transition-all z-40
              flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}