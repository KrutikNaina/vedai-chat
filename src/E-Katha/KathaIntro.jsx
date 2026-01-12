import React from "react";
import { motion } from "framer-motion";

export default function KathaIntro({ katha, onStart }) {
  if (!katha) return null;

  const requirements = [
    { name: "Kalash 🪔", url: "https://www.amazon.in/s?k=kalash" },
    { name: "Coconut 🥥", url: "https://www.amazon.in/s?k=coconut" },
    { name: "Flowers 🌸", url: "https://www.amazon.in/s?k=flowers" },
    { name: "Sweets 🍬", url: "https://www.amazon.in/s?k=prasad+sweets" },
    { name: "Rice 🍚", url: "https://www.amazon.in/s?k=puja+rice" },
    { name: "Incense sticks 🕯️", url: "https://www.amazon.in/s?k=incense+sticks" },
    { name: "Betel leaves 🍃", url: "https://www.amazon.in/s?k=betel+leaves" },
    { name: "Lamp 🪔", url: "https://www.amazon.in/s?k=brass+diya" }
  ];

  return (
    <div className="pt-20 max-w-4xl mx-auto px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-neutral-900/70 p-6 border border-neutral-800 shadow-lg overflow-hidden"
      >
        {katha.image && (
          <div className="relative">
            <img src={katha.image} alt={katha.title} className="w-full aspect-[3/2] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <h1 className="absolute bottom-4 left-6 text-3xl font-bold text-orange-400 drop-shadow-lg">
              {katha.title} 🪔
            </h1>
          </div>
        )}

        <div className="p-6 space-y-5">
          <p className="text-neutral-300">
            📖 <span className="font-semibold text-orange-400">About:</span> 
            {katha.description || "This sacred ritual brings peace, prosperity, and divine blessings to your home."}
          </p>

          <h2 className="text-lg font-semibold text-orange-400">🛒 Requirements (Buy directly):</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-neutral-300">
            {requirements.map((item, i) => (
              <motion.a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="p-2 bg-neutral-800/50 rounded-lg text-center text-sm border border-neutral-700 hover:border-orange-500 transition"
              >
                {item.name}
              </motion.a>
            ))}
          </div>
          
          {/* <motion.a
  href="https://www.amazon.in/gp/cart/view.html?ref_=nav_cart"
  target="_blank"
  rel="noopener noreferrer"
  whileHover={{ scale: 1.03 }}
  className="block mt-6 w-full px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-lime-500 text-black font-semibold shadow-lg text-center"
>
  🛒 Buy Full Pooja Kit (All Items)
</motion.a> */}



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
