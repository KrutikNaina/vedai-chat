// vedai-landing\src\pages\E-Katha\KathaCompletion.jsx
import { motion } from "framer-motion";

export default function KathaCompletion({ katha, onRestart }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="p-8 rounded-2xl bg-neutral-900/70 border border-neutral-800 shadow-2xl text-center max-w-md"
      >
        {/* Optional: Katha image */}

        <motion.h1
          className="text-3xl font-bold text-orange-500 mb-2"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          🎉 Katha Completed!
        </motion.h1>

        <motion.p
          className="mt-2 text-neutral-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          🙏 You have successfully performed <span className="text-orange-300">{katha.title}</span> with VedAI.
        </motion.p>

        <motion.p
          className="mt-2 italic text-orange-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          ✨ Blessings: Peace, prosperity, and harmony in family life.
        </motion.p>

        <motion.div
          className="mt-6 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <button className="w-full px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition font-medium">
            🔖 Save this Katha in My Rituals
          </button>
          <button
            onClick={onRestart}
            className="w-full px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition font-medium"
          >
            📤 Restart / Share Experience
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
