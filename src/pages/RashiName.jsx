// src/pages/RashiName.jsx
import { useState, useEffect } from "react";
import { Baby, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function RashiName() {
  const [gender, setGender] = useState("boy");
  const [rashi, setRashi] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // redirect if no token
    } else {
      fetch("http://localhost:5000/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Invalid token");
          return res.json();
        })
        .then(() => setAuthLoading(false))
        .catch(() => {
          localStorage.removeItem("token");
          navigate("/login");
        });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Suggest 5 unique ${gender} baby names based on Rashi "${rashi}" with short meanings.`,
        }),
      });

      const data = await response.json();
      setSuggestions(data.result?.split("\n").filter(Boolean) || []);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  if (authLoading) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 flex flex-col items-center justify-center px-6 py-16">
      {/* Heading */}
      <motion.h1
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl md:text-6xl font-extrabold text-center bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-lg"
      >
        Rashi Based Baby Name Suggestions
      </motion.h1>

      <p className="text-gray-300 mt-4 text-center max-w-2xl">
        Select gender, enter your baby’s Rashi, and get{" "}
        <span className="text-purple-300">Gemini AI</span> powered names with
        beautiful meanings ✨
      </p>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mt-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-full max-w-2xl space-y-6"
      >
        {/* Gender Buttons */}
        <div className="flex justify-center gap-6">
          <button
            type="button"
            onClick={() => setGender("boy")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              gender === "boy"
                ? "bg-red-500 text-white shadow-lg"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            <Baby className="w-5 h-5" /> Boy
          </button>
          <button
            type="button"
            onClick={() => setGender("girl")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              gender === "girl"
                ? "bg-orange-500 text-white shadow-lg"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            <Baby className="w-5 h-5" /> Girl
          </button>
        </div>

        {/* Rashi Input */}
        <div>
          <label className="block text-gray-300 mb-2">Enter Rashi</label>
          <input
            type="text"
            value={rashi}
            onChange={(e) => setRashi(e.target.value)}
            placeholder="e.g. Mesh, Vrishabha, Karka..."
            className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-purple-400"
            required
          />
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg hover:scale-105 transition-transform disabled:opacity-50 mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            {loading ? "Finding Names..." : "Get Suggestions"}
          </button>
        </div>
      </motion.form>

      {/* Results */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {suggestions.map((name, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 hover:border-purple-400 transition-all"
            >
              <h3 className="text-xl font-bold text-purple-300">
                {name.split("-")[0].trim()}
              </h3>
              <p className="text-gray-300 mt-2 text-sm">
                {name.split("-")[1] || "Meaning coming from Gemini ✨"}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
