import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function VedAI404() {
  const navigate = useNavigate();

  // Zodiac signs for the spinning wheel
  const zodiacSigns = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center bg-neutral-900 text-white overflow-hidden">
      {/* Floating Cosmic Particles */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-orange-500/20"
          style={{
            width: 2 + Math.random() * 6,
            height: 2 + Math.random() * 6,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            filter: "blur(1px)",
          }}
          animate={{
            y: [0, 12, 0],
            x: [0, 8, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{ duration: 5 + Math.random() * 3, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Background Connecting Lines */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 bg-orange-500/20"
          style={{
            top: `${10 + i * 15}%`,
            left: `${20 + i * 12}%`,
            height: "70%",
            rotate: `${Math.random() * 20 - 10}deg`,
          }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Spinning Zodiac Wheel */}
      <motion.div
        className="absolute w-72 h-72 rounded-full border-2 border-orange-500/50 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {zodiacSigns.map((sign, idx) => {
          const angle = (360 / zodiacSigns.length) * idx;
          return (
            <div
              key={idx}
              className="absolute text-orange-400 text-2xl font-bold"
              style={{
                transform: `rotate(${angle}deg) translate(140px) rotate(-${angle}deg)`,
              }}
            >
              {sign}
            </div>
          );
        })}
      </motion.div>

      {/* Main 404 Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center px-4"
      >
        <h1 className="text-6xl md:text-8xl font-bold text-orange-500 mb-4">404</h1>
        <p className="text-xl md:text-2xl text-neutral-300 mb-6">
          Oops! The page you are looking for is lost in the cosmic realm.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-orange-500 text-white rounded-2xl font-semibold hover:bg-orange-600 transition"
        >
          Return Home
        </button>
      </motion.div>
    </section>
  );
}
