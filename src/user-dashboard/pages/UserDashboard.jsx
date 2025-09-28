import { motion } from "framer-motion";
import { Sun, Calendar, Star, BookOpen, Flame, CheckCircle2, XCircle, MessageSquare } from "lucide-react";

export default function UserDashboard() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white flex flex-col">
      {/* Top Bar */}
      {/* <header className="w-full px-6 py-4 bg-neutral-900/60 backdrop-blur-lg flex justify-between items-center border-b border-neutral-800">
        <h1 className="text-2xl font-bold text-orange-500">VedAI User</h1>
        <button className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition">
          Logout
        </button>
      </header> */}

      {/* Dashboard Content */}
      <main className="flex-1 p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Daily Guidance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 rounded-2xl bg-neutral-900/70 shadow-lg border border-neutral-800"
        >
          <h2 className="flex items-center gap-2 text-lg font-semibold text-orange-400">
            <Sun className="w-5 h-5" /> Daily Guidance
          </h2>
          <p className="mt-3 text-neutral-300 text-lg">
            ♐ <span className="font-medium">Today’s Rashi Advice:</span>  
            <span className="text-orange-200"> Focus on balance and avoid overthinking.</span>
          </p>
          <p className="mt-4 italic text-orange-300 text-sm border-l-4 border-orange-500 pl-3">
            “Man is made by his belief. As he believes, so he is.” – Bhagavad Gita
          </p>
        </motion.div>

        {/* Choghadiya */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-6 rounded-2xl bg-neutral-900/70 shadow-lg border border-neutral-800"
        >
          <h2 className="flex items-center gap-2 text-lg font-semibold text-orange-400">
            <Calendar className="w-5 h-5" /> Choghadiya (Today’s Auspicious Times)
          </h2>
          <div className="mt-3 space-y-3">
            <div className="flex justify-between items-center bg-neutral-800/40 p-3 rounded-lg">
              <span>🌅 Morning</span>
              <span className="text-green-400 font-semibold">Shubh ✅</span>
            </div>
            <div className="flex justify-between items-center bg-neutral-800/40 p-3 rounded-lg">
              <span>☀️ Afternoon</span>
              <span className="text-green-400 font-semibold">Labh ✅</span>
            </div>
            <div className="flex justify-between items-center bg-neutral-800/40 p-3 rounded-lg">
              <span>🌙 Evening</span>
              <span className="text-blue-400 font-semibold">Amrit 🌟</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Interactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="p-6 rounded-2xl bg-neutral-900/70 shadow-lg border border-neutral-800"
        >
          <h2 className="flex items-center gap-2 text-lg font-semibold text-orange-400">
            <MessageSquare className="w-5 h-5" /> Recent Interactions
          </h2>
          <div className="mt-3 space-y-3">
            <div className="bg-neutral-800/40 p-3 rounded-lg">
              <p className="text-orange-300 font-medium">❓ What is my life purpose?</p>
              <p className="text-neutral-300">🕉️ Meditate daily for clarity.</p>
            </div>
            <div className="bg-neutral-800/40 p-3 rounded-lg">
              <p className="text-orange-300 font-medium">❓ Suggest baby name</p>
              <p className="text-neutral-300">🌸 Aarav (based on Rashi)</p>
            </div>
            <div className="bg-neutral-800/40 p-3 rounded-lg">
              <p className="text-orange-300 font-medium">❓ Daily mantra?</p>
              <p className="text-neutral-300">🙏 Om Namah Shivaya</p>
            </div>
          </div>
        </motion.div>

        {/* E-Katha Module */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="p-6 rounded-2xl bg-neutral-900/70 shadow-lg border border-neutral-800"
        >
          <h2 className="flex items-center gap-2 text-lg font-semibold text-orange-400">
            <BookOpen className="w-5 h-5" /> E-Katha Module
          </h2>
          <p className="mt-2 text-neutral-300">
            📖 Upcoming: <span className="font-semibold text-orange-300">Bhagavad Gita Chapter 2</span>  
            <br />🕖 Tomorrow at 7 PM
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-neutral-300">
              <CheckCircle2 className="text-green-400 w-5 h-5" /> Notebook
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <XCircle className="text-red-400 w-5 h-5" /> Incense sticks
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <CheckCircle2 className="text-green-400 w-5 h-5" /> Headphones
            </div>
          </div>
        </motion.div>

        {/* Favorites / Saved Wisdom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="p-6 rounded-2xl bg-neutral-900/70 shadow-lg border border-neutral-800"
        >
          <h2 className="flex items-center gap-2 text-lg font-semibold text-orange-400">
            <Star className="w-5 h-5" /> Saved Wisdom
          </h2>
          <ul className="mt-3 space-y-2 text-neutral-300">
            <li className="bg-neutral-800/40 p-3 rounded-lg italic">“Om Namah Shivaya” mantra</li>
            <li className="bg-neutral-800/40 p-3 rounded-lg italic">
              Shloka 2.47 – Do your duty without attachment.
            </li>
          </ul>
        </motion.div>

        {/* Progress / Streak Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="p-6 rounded-2xl bg-neutral-900/70 shadow-lg border border-neutral-800 text-center"
        >
          <h2 className="flex items-center justify-center gap-2 text-lg font-semibold text-orange-400">
            <Flame className="w-5 h-5" /> Daily Streak
          </h2>
          <p className="mt-3 text-4xl font-bold text-orange-500">🔥 7 Days</p>
          <p className="mt-1 text-neutral-400">Keep going! Don’t break the streak.</p>
        </motion.div>

      </main>
    </div>
  );
}
