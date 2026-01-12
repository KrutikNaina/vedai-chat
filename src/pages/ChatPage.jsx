// vedai-landing\src\pages\ChatPage.jsx
import { useState, useEffect, useRef } from "react";
import { Send, Menu, X, History, Plus, ChevronsLeft, ChevronsRight, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "🙏 Namaste! I am VedAI, your AI Guru. Ask me anything and I'll guide you with wisdom from the Bhagavad Gita.",
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
  const [userRole, setUserRole] = useState("free");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const FREE_CHAT_LIMIT = 3;

  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // Authenticate user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchUserData(token);
    }
  }, [navigate]);

  // Fetch user data and subscription status
  const fetchUserData = async (token) => {
    try {
      const userRes = await fetch("http://localhost:5000/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (userRes.ok) {
        const userData = await userRes.json();
        setUserRole(userData.role || "free");

        const subRes = await fetch("http://localhost:5000/api/payment/subscription", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (subRes.ok) {
          const subData = await subRes.json();
          if (subData.isActive) {
            setUserRole("premium");
            setLimitReached(false);
          }
        }

        setLoading(false);
        fetchHistory(token);
      } else {
        throw new Error("Invalid token");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  // Fetch chat history and user count
  const fetchHistory = async (token = null) => {
    const authToken = token || localStorage.getItem("token");
    if (!authToken) return;
    try {
      const res = await fetch("http://localhost:5000/api/chat/history", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setChatHistory(Array.isArray(data.chats) ? data.chats : []);

        if (data.remainingChats !== undefined) {
          const remaining = data.remainingChats;
          setChatCount(remaining === "unlimited" ? 0 : FREE_CHAT_LIMIT - remaining);
          setLimitReached(remaining === "unlimited" ? false : remaining <= 0);
        }
      } else {
        setChatHistory([]);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
      setChatHistory([]);
    }
  };

  // Save chat
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

  // Send message
  const sendMessage = async (msg = null) => {
    if (limitReached && userRole === "free") return;

    const userMessage = (msg || input || "").toString().trim();
    if (!userMessage) return;

    const updatedMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(updatedMessages);
    setInput("");
    setTyping(true);
    setStopTyping(false);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/chat/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      const botReply =
        data?.reply ||
        "🙏 VedAI is unavailable. Please try again later.";

      // typing effect (UNCHANGED)
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

      await saveChatToDB([
        ...updatedMessages,
        { role: "assistant", content: botReply },
      ]);

      if (userRole === "free") {
        setChatCount((prev) => prev + 1);
        if (chatCount + 1 >= FREE_CHAT_LIMIT) {
          setLimitReached(true);
          startCountdown();
        }
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

  // Countdown for next allowed message
  const startCountdown = () => {
    const endTime = new Date().getTime() + 24 * 60 * 60 * 1000;
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

  // Load chat from history
  const loadChat = (chat) => {
    setMessages(chat.messages || []);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  // Payment Integration
  const handleUpgradeClick = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setUserRole("premium");
    setLimitReached(false);
    setChatCount(0);

    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData(token);
    }
  };

  // Razorpay Payment Handler
  const initiatePayment = async (plan) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Payment system is loading, please try again.");
        return;
      }

      const orderResponse = await fetch("http://localhost:5000/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ plan: plan })
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message);
      }

      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "VedAI Premium",
        description: `Premium ${plan === "yearly" ? "Yearly" : "Monthly"} Subscription`,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            const verifyResponse = await fetch("http://localhost:5000/api/payment/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              alert("🎉 Payment successful! Welcome to VedAI Premium!");
              handlePaymentSuccess();
            } else {
              alert("❌ Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            alert("❌ Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "User",
          email: "user@example.com",
        },
        theme: {
          color: "#f97316"
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

    } catch (err) {
      console.error("Payment error:", err);
      alert(err.message || "Payment failed. Please try again.");
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Helpers
  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  const newChat = () => setMessages([]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className={`min-h-screen flex ${theme === "dark" ? "bg-[#0f0f0f] text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} fixed md:static top-0 left-0 h-full ${sidebarMini ? "w-20" : "w-64"} bg-[#1a1a1a] border-r border-gray-800 transition-all duration-300 z-50`}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
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
        <div className="p-4 border-b border-gray-800">
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
                {chat.messages?.[1]?.content || "Conversation"}
              </div>
            ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 relative flex flex-col">
        {/* Top bar (mobile) */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-gray-800 md:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <h1 className="text-lg font-bold">VedAI</h1>
          {userRole === "free" && (
            <button
              onClick={handleUpgradeClick}
              className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-600 px-3 py-1 rounded-lg text-xs font-semibold"
            >
              <Crown size={12} />
              Upgrade
            </button>
          )}
        </div>

        {/* Desktop Upgrade Button */}
        <div className="hidden md:flex items-center justify-between px-6 py-4 bg-[#1a1a1a] border-b border-gray-800">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
              <span className="text-white font-bold">V</span>
            </div>
            VedAI
          </h1>
          {userRole === "free" && (
            <button
              onClick={handleUpgradeClick}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
            >
              <Crown size={16} />
              Upgrade to Premium
            </button>
          )}
          {userRole === "premium" && (
            <span className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-700 px-4 py-2 rounded-full text-sm">
              <Crown size={14} />
              Premium User
            </span>
          )}
        </div>

        {/* Chat messages container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Limit reached warning */}
          {limitReached && userRole === "free" && (
            <div className="mx-auto max-w-3xl mb-4">
              <div className="bg-gradient-to-r from-amber-900/20 to-amber-800/10 border border-amber-700/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="text-amber-500">⚠️</div>
                  <div className="flex-1">
                    <p className="text-amber-300 font-medium">Free chat limit reached</p>
                    <p className="text-amber-400/80 text-sm mt-1">
                      Upgrade to Premium for unlimited access
                      {countdown && ` • Next message in ${countdown}`}
                    </p>
                  </div>
                  <button
                    onClick={handleUpgradeClick}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-700 rounded-md text-sm font-medium transition-colors"
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((msg, idx) => {
              const isUser = msg.role === "user";

              // Parse assistant response into structured sections
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

                // If no markers found, treat as regular response
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
                  <div
                    className={`max-w-[85%] ${isUser ? "w-fit" : "w-full"}`}
                  >
                    {isUser ? (
                      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="text-xs">👤</span>
                          </div>
                          <span className="text-sm font-medium opacity-90">You</span>
                        </div>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl rounded-tl-none shadow-xl overflow-hidden">
                        {/* Assistant header */}
                        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                            <span className="text-white font-bold">V</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-100">VedAI</h3>
                            <p className="text-xs text-gray-400">AI Spiritual Guide</p>
                          </div>
                        </div>

                        {/* Content sections */}
                        <div className="p-4 space-y-4">
                          {sections.map((section, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className={`bg-gradient-to-br ${section.color} border ${section.border} rounded-xl p-4`}
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-xl">{section.icon}</span>
                                <h4 className={`font-semibold ${section.textColor}`}>{section.title}</h4>
                                <div className="flex-1 h-px bg-gradient-to-r from-current opacity-20 ml-2"></div>
                              </div>

                              <div className="space-y-3">
                                {section.content.split('\n\n').map((paragraph, pIdx) => (
                                  paragraph.trim() && (
                                    <motion.p
                                      key={pIdx}
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: pIdx * 0.05 }}
                                      className="text-gray-200 leading-relaxed whitespace-pre-wrap"
                                    >
                                      {paragraph}
                                    </motion.p>
                                  )
                                ))}
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 bg-gray-900/50 border-t border-gray-800">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              <span>Source: Bhagavad Gita</span>
                            </div>
                            <div className="text-xs text-gray-500">
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="max-w-[85%] w-full bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl rounded-tl-none shadow-xl overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                      <span className="text-white font-bold">V</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-100">VedAI</h3>
                      <p className="text-xs text-gray-400">AI Spiritual Guide</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-300"></div>
                      </div>
                      <span className="text-gray-400 ml-2">Thinking...</span>
                      <button
                        onClick={() => setStopTyping(true)}
                        className="ml-auto text-sm text-gray-500 hover:text-gray-300 px-3 py-1 rounded-md hover:bg-gray-800 transition-colors"
                      >
                        Stop
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 p-4 bg-gradient-to-t from-[#0f0f0f] to-transparent backdrop-blur-lg border-t border-gray-800">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder={
                    userRole === "premium"
                      ? "💫 Ask VedAI anything (Premium User)"
                      : limitReached
                        ? "⏳ Upgrade to Premium for unlimited access"
                        : `Ask your spiritual question... (${FREE_CHAT_LIMIT - chatCount} left today)`
                  }
                  className="w-full px-5 py-3.5 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={limitReached && userRole === "free"}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {!input.trim() ? "⏎" : "⌘⏎"}
                </div>
              </div>

              <button
                onClick={sendMessage}
                disabled={(limitReached && userRole === "free") || !input.trim()}
                className="p-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg hover:shadow-orange-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
              >
                <Send size={20} />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  {theme === "dark" ? "🌞" : "🌙"}
                </button>
                <button
                  onClick={() => setMessages([])}
                  className="p-2.5 rounded-lg bg-gray-800 hover:bg-red-900/30 text-red-400 hover:text-red-300 transition-colors"
                  title="Clear conversation"
                >
                  🗑️
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
              <span>Press Enter to send</span>
              <span>•</span>
              <span>Shift + Enter for new line</span>
              <span>•</span>
              <span>Esc to cancel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-md bg-gradient-to-br from-orange-50 to-amber-100 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-r from-orange-500 to-red-600 text-white">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-4 right-4 text-white hover:text-orange-200"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-2">🚀 Upgrade to Premium</h2>
              <p className="text-orange-100">Unlock unlimited spiritual guidance</p>
            </div>

            {/* Plans */}
            <div className="p-6 space-y-4">
              <div
                onClick={() => initiatePayment("monthly")}
                className="p-4 border-2 border-orange-300 rounded-xl cursor-pointer hover:border-orange-500 transition-all bg-white"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">Monthly Plan</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-orange-600">₹299</span>
                  <span className="text-gray-500 line-through">₹499</span>
                  <span className="text-green-600 text-sm font-bold">40% off</span>
                </div>
                <p className="text-gray-600 text-sm">per month</p>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  <li>✓ Unlimited AI chats</li>
                  <li>✓ Daily Bhagavad Gita guidance</li>
                  <li>✓ Personalized horoscope</li>
                  <li>✓ Priority support</li>
                </ul>
              </div>

              <div
                onClick={() => initiatePayment("yearly")}
                className="p-4 border-2 border-orange-500 rounded-xl cursor-pointer hover:border-orange-600 transition-all bg-orange-50 relative"
              >
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    BEST VALUE
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Yearly Plan</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-orange-600">₹2999</span>
                  <span className="text-gray-500 line-through">₹5988</span>
                  <span className="text-green-600 text-sm font-bold">50% off</span>
                </div>
                <p className="text-gray-600 text-sm">per year</p>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  <li>✓ Everything in Monthly</li>
                  <li>✓ Yearly savings</li>
                  <li>✓ Exclusive content access</li>
                  <li>✓ Early feature access</li>
                </ul>
              </div>
            </div>

            {/* Security Note */}
            <div className="p-4 text-center text-gray-600 text-sm border-t">
              🔒 Secure payment powered by Razorpay
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}