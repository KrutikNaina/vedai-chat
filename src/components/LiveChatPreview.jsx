import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function LiveChatFull() {
    const [messages, setMessages] = useState([
        { role: "bot", text: "🙏 Namaste! I am VedAI, your spiritual AI guide." },
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg = { role: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        setTimeout(() => {
            let botResponse = "I see. Can you tell me more?";
            if (input.toLowerCase().includes("baby name")) {
                botResponse = "Absolutely! How about 'Aarav' based on your Rashi?";
            } else if (input.toLowerCase().includes("mantra")) {
                botResponse = "Today’s mantra is: ‘Om Namah Shivaya’ 🕉️";
            } else if (input.toLowerCase().includes("purpose")) {
                botResponse = "Focus on self-awareness and meditate daily for clarity.";
            }

            setMessages((prev) => [...prev, { role: "bot", text: botResponse }]);
        }, 1200);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b  lg:px-20 py-10">
            {/* Chat Box */}
            <div className="relative z-10 flex flex-col w-full max-w-3xl h-[80vh] bg-neutral-900/80 backdrop-blur-xl rounded-3xl shadow-[0_0_80px_rgba(255,140,0,0.3)] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-orange-500/20 backdrop-blur-md text-white font-bold text-xl">
                    VedAI Live Chat
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-6 flex flex-col gap-3 overflow-y-auto">
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: msg.role === "bot" ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`px-4 py-2 rounded-xl max-w-[75%] break-words ${msg.role === "bot"
                                    ? "bg-orange-500/20 text-orange-100 self-start"
                                    : "bg-neutral-800 text-white self-end"
                                }`}
                        >
                            {msg.text}
                        </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="px-6 py-4 bg-neutral-800/70 backdrop-blur-md flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Type your question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 px-4 py-2 rounded-2xl bg-neutral-900/70 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                        onClick={handleSend}
                        className="px-6 py-2 bg-orange-500 rounded-2xl font-semibold hover:bg-orange-600 transition"
                    >
                        Send
                    </button>
                </div>
            </div>
        </section>
    );
}
