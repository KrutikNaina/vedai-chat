import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
    company: "", // 🛑 honeypot
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!form.name || !form.email || !form.message) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/contact", form);

      setSuccess(true);
      setForm({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: "",
        company: "",
      });
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full py-24 overflow-hidden bg-gradient-to-b">
      {/* Floating particles */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-orange-500/20"
          style={{
            width: 2 + Math.random() * 4,
            height: 2 + Math.random() * 4,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            filter: "blur(1.5px)",
          }}
          animate={{
            y: [0, 12, 0],
            x: [0, 8, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 6 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-20 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Contact <span className="text-orange-500">VedAI</span>
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            Have a question, issue, or feedback?  
            We’re here to guide you on your spiritual journey.
          </p>
        </div>

        {/* Card */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-neutral-900/80 backdrop-blur-xl border border-orange-800/40 rounded-3xl p-8 shadow-[0_0_80px_rgba(255,140,0,0.25)] space-y-6"
        >
          {/* Honeypot (hidden) */}
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            className="hidden"
          />

          <input
            type="text"
            name="name"
            placeholder="Your Full Name *"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address *"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <select
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option>General Inquiry</option>
            <option>Technical Issue</option>
            <option>Billing / Subscription</option>
            <option>Feedback / Suggestion</option>
            <option>Partnership</option>
            <option>Report a Bug</option>
          </select>

          <textarea
            name="message"
            rows={5}
            placeholder="Write your message here... We usually reply within 24 hours."
            value={form.message}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-500 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          {/* Status */}
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {success && (
            <p className="text-green-400 text-sm">
              🙏 Thank you for contacting VedAI. We’ll reply soon.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold hover:scale-[1.02] transition-all disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
