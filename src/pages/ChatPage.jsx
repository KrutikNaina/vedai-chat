import { useState, useEffect, useRef } from "react";
import { Send, Menu, X, History, Plus, ChevronsLeft, ChevronsRight, Crown } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "🙏 Namaste! I am VedAI, your AI Guru. Ask me anything and I'll guide you with wisdom from the Bhagavad Gita.",
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

  // ===== Authenticate user =====
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchUserData(token);
    }
  }, [navigate]);

  // ===== Fetch user data and subscription status =====
  const fetchUserData = async (token) => {
    try {
      // Get user profile
      const userRes = await fetch("http://localhost:5000/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (userRes.ok) {
        const userData = await userRes.json();
        setUserRole(userData.role || "free");

        // Get subscription details
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

  // ===== Fetch chat history and user count =====
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

        // Remaining chats (if backend sends)
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
    if (limitReached && userRole === "free") return;

    // Ensure it's always string
    const userMessage = (msg || input || "").toString().trim();
    if (!userMessage) return;

    const updatedMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(updatedMessages);
    setInput("");
    setTyping(true);
    setStopTyping(false);

    try {
      const API_KEY = "AIzaSyBy_V3isORfHKus4Rg-jinxIFzNXyWgBa0";// Replace with real key
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            role: "system",
            parts: [
              { text: "Respond using Bhagavad Gita Shloka, Transliteration, and Meaning..." },
            ],
          },
          contents: [{ role: "user", parts: [{ text: userMessage }] }],
        }),
      });

      const data = await res.json();
      const botReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "🙏 VedAI is unavailable. Please try again later.";

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

  // ===== Payment Integration =====
  const handleUpgradeClick = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setUserRole("premium");
    setLimitReached(false);
    setChatCount(0);

    // Refresh user data
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData(token);
    }
  };

  // ===== Razorpay Payment Handler =====
  const initiatePayment = async (plan) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        return;
      }

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Payment system is loading, please try again.");
        return;
      }

      // Create order
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

      // Razorpay options
      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "VedAI Premium",
        description: `Premium ${plan === "yearly" ? "Yearly" : "Monthly"} Subscription`,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            // Verify payment
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
          name: "User", // You can get this from user context
          email: "user@example.com", // You can get this from user context
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
                {chat.messages?.[1]?.content || "Conversation"}
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
        <div className="hidden md:flex items-center justify-between px-6 py-3 bg-black/40 border-b border-white/10">
          <h1 className="text-xl font-bold">VedAI</h1>
          {userRole === "free" && (
            <button
              onClick={handleUpgradeClick}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
            >
              <Crown size={16} />
              Upgrade to Premium
            </button>
          )}
          {userRole === "premium" && (
            <span className="flex items-center gap-2 bg-green-600 px-3 py-1 rounded-full text-sm">
              <Crown size={14} />
              Premium User
            </span>
          )}
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6">
          {limitReached && userRole === "free" && (
            <div className="text-yellow-400 text-center mb-2 p-4 bg-yellow-900/20 rounded-lg">
              ⚠️ Free chat limit reached.
              <button
                onClick={handleUpgradeClick}
                className="ml-2 underline font-semibold hover:text-yellow-200"
              >
                Upgrade to Premium for unlimited access
              </button>
              {countdown && ` • Next message in: ${countdown}`}
            </div>
          )}

{/* Messages rendering */}
{/* Chat messages */}
<div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6">
  {limitReached && (
    <div className="text-yellow-400 text-center mb-2">
      ⚠️ Free chat limit reached. Next message available in: {countdown}
    </div>
  )}

  {messages.map((msg, idx) => {
    const isUser = msg.role === "user";

    // Always split assistant response into 📜, 🔤, 💬 sections
    let parts = [];
    if (!isUser) {
      const regex = /(📜|🔤|💬)/g;
      const splitContent = msg.content.split(regex).filter(Boolean);
      for (let i = 0; i < splitContent.length; i += 2) {
        const marker = splitContent[i];
        const text = splitContent[i + 1] || "";
        const paragraphs = text
          .split(/\n\n|\r\n\r\n/)
          .map((p) => p.trim())
          .filter(Boolean);
        parts.push({ marker, paragraphs });
      }
    }

    return (
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
      >
        <div
          className={`max-w-[75%] px-5 py-4 rounded-2xl shadow-lg ${
            isUser
              ? "bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-br-none"
              : "bg-transparent"
          }`}
        >
          {isUser ? (
            msg.content
          ) : (
            <div className="space-y-3">
              {parts.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2, duration: 0.4 }}
                  className={`p-3 rounded-md shadow-md ${
                    p.marker === "📜"
                      ? "bg-[#3b1d15] text-orange-200"
                      : p.marker === "🔤"
                      ? "bg-[#3a3215] text-yellow-100"
                      : "bg-[#1e1e1e] text-gray-200"
                  }`}
                >
                  <span className="font-semibold text-base">{p.marker}</span>
                  {p.paragraphs.map((para, j) => (
                    <motion.p
                      key={j}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: j * 0.1 }}
                      className="mt-1 whitespace-pre-line leading-relaxed"
                    >
                      {para}
                    </motion.p>
                  ))}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  })}
</div>

          
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
            placeholder={
              userRole === "premium"
                ? "💫 Ask VedAI anything (Premium)"
                : limitReached
                  ? "⏳ Upgrade for unlimited access"
                  : `📝 Ask VedAI... (${FREE_CHAT_LIMIT - chatCount} left today)`
            }
            className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            disabled={limitReached && userRole === "free"}
          />
          <button
            onClick={sendMessage}
            className="p-3 md:p-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg hover:scale-105 transition"
            disabled={(limitReached && userRole === "free") || !input.trim()}
          >
            <Send size={22} />
          </button>
          <button onClick={toggleTheme} className="ml-2">{theme === "dark" ? "🌞" : "🌙"}</button>
          <button onClick={deleteChats} className="ml-2 text-red-400">🗑️</button>
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
                className="p-4 border-2 border-orange-500 rounded-xl cursor-pointer hover:border-orange-600 transition-all bg-orange-50"
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