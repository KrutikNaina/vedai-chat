import React from "react";
import { motion } from "framer-motion";

export default function KathaCompletion({ katha, onRestart }) {
  if (!katha) return null;
  return (
    <div className="pt-20 max-w-3xl mx-auto px-6 py-8">
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded p-6 bg-neutral-900/60 border text-center">
        <h1 className="text-3xl font-bold text-orange-400">🎉 Katha Completed!</h1>
        <p className="mt-3 text-neutral-300">🙏 You have successfully performed <span className="text-orange-300">{katha.title}</span> with VedAI.</p>
        <p className="mt-2 italic text-orange-200">✨ Blessings: Peace, prosperity, and harmony in family life.</p>

        <div className="mt-6 space-y-3">
          <button className="w-full px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition font-medium">🔖 Save this Katha in My Rituals</button>
          <button onClick={onRestart} className="w-full px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition font-medium">📤 Restart / Share Experience</button>
        </div>
      </motion.div>
    </div>
  );
}
