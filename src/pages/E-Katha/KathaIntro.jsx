// vedai-landing\src\pages\E-Katha\KathaIntro.jsx
import { motion } from "framer-motion";

export default function KathaIntro({ katha, onStart }) {
  const requirements = [
    "Kalash 🪔",
    "Coconut 🥥",
    "Flowers 🌸",
    "Sweets 🍬",
    "Rice 🍚",
    "Incense sticks 🕯️",
    "Betel leaves 🍃",
    "Lamp 🪔",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white p-6 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-3xl rounded-2xl bg-neutral-900/70 border border-neutral-800 shadow-lg overflow-hidden"
      >
        {/* Image Banner */}
        {katha.image && (
          <div className="relative">
            <img
              src={katha.image}
              alt={katha.name}
              className="w-full aspect-[3/2] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <h1 className="absolute bottom-4 left-6 text-3xl font-bold text-orange-400 drop-shadow-lg">
              {katha.name} 🪔
            </h1>
          </div>
        )}

        {/* Katha Details */}
        <div className="p-6 space-y-5">
          <p className="text-neutral-300 leading-relaxed">
            📖 <span className="font-semibold text-orange-400">About:</span>{" "}
            {katha.description ||
              "This sacred ritual brings peace, prosperity, and divine blessings to your home."}
          </p>

          <h2 className="text-lg font-semibold text-orange-400">🛒 Requirements:</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-neutral-300">
            {requirements.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="p-2 bg-neutral-800/50 rounded-lg text-center text-sm border border-neutral-700"
              >
                {item}
              </motion.div>
            ))}
          </div>

          <motion.button
            onClick={onStart}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-semibold shadow-lg hover:shadow-orange-400/20 transition-all duration-300"
          >
            🕉️ Start Katha
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
