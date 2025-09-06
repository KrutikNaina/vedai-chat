// src/pages/About.jsx
import { motion } from "framer-motion";
import { BookOpen, Brain, Sparkles, Flower2 } from "lucide-react";

export default function About() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br  text-white overflow-hidden">
      {/* Floating stars/particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-orange-400/20"
          style={{
            width: 2 + Math.random() * 5,
            height: 2 + Math.random() * 5,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            filter: "blur(1.5px)",
          }}
          animate={{
            y: [0, 20, 0],
            opacity: [0.3, 0.9, 0.3],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Content wrapper */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-extrabold text-center text-gray-200 "
        >
          💼 About – VedAI
        </motion.h1>

        {/* What is VedAI */}
        <motion.section
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-12 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold flex items-center gap-2">
            🕉️ What is VedAI
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-200">
            VedAI blends the timeless wisdom of ancient Hindu scriptures with
            the intelligence of modern AI to guide you through life’s
            challenges, spiritual growth, and daily rituals. Drawing from the
            profound teachings of the Vedas, Upanishads, Bhagavad Gita, and
            other sacred texts, VedAI acts as your personal spiritual advisor
            available at your fingertips. It bridges the gap between ancient
            insight and contemporary life, offering practical answers rooted in
            eternal truths.
          </p>
        </motion.section>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-2 gap-10">
          {/* Spiritual Guidance */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Brain className="text-orange-400" />
              <h3 className="text-xl font-semibold">🔮 Spiritual Guidance</h3>
            </div>
            <p className="mt-3 text-gray-300">
              Ask VedAI any question about your life from stress, anxiety,
              relationships, to karma, purpose, and spiritual awakening. It will
              respond with shlokas, their deep meanings, and how to apply that
              wisdom practically.
            </p>
          </motion.div>

          {/* Daily Practices */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Flower2 className="text-green-400" />
              <h3 className="text-xl font-semibold">🧘‍♂️ Daily Practices</h3>
            </div>
            <ul className="mt-3 text-gray-300 space-y-2 list-disc list-inside">
              <li>
                Personalized mantras and affirmations based on your mental state.
              </li>
              <li>
                Vedic rituals to align your energy with cosmic rhythms.
              </li>
            </ul>
          </motion.div>

          {/* Scripture Exploration */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4 }}
            className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-lg md:col-span-2"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="text-indigo-400" />
              <h3 className="text-xl font-semibold">📜 Scripture Exploration</h3>
            </div>
            <p className="mt-3 text-gray-300">
              Access teachings from the Bhagavad Gita, Upanishads, and Vedas.
              Explore shlokas with easy-to-understand meanings and life
              applications.
            </p>
          </motion.div>
        </div>

        {/* Final Thought */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            🙏 You don’t need to be a Sanskrit scholar or spiritual master. Just
            bring your questions, your heart, and your curiosity. Let VedAI be
            your guide to a life of peace, purpose, and connection rooted in
            Vedic wisdom, powered by AI.
          </p>
          <p className="mt-4 text-sm text-gray-400">
            Page last updated on: <span className="text-orange-400">April 20, 2025</span>
          </p>
        </motion.section>
      </div>
    </div>
  );
}
