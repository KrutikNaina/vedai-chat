import React, { useRef, useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { Zap } from "lucide-react";
import { Link } from "react-router-dom";


export default function VedAICosmicHero() {
  const panelRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const glowControls = useAnimation();

  // Mouse parallax
  const handleMove = (e) => {
    const rect = panelRef.current.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width;
    const ry = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (rx - 0.5) * 15, y: (ry - 0.5) * 15 });
    setMousePos({ x: e.clientX, y: e.clientY });
  };
  const handleLeave = () => setTilt({ x: 0, y: 0 });

  // Glow pulse
  useEffect(() => {
    const pulse = async () => {
      while (true) {
        await glowControls.start({ boxShadow: "0 0 80px rgba(255,165,0,0.5)" });
        await glowControls.start({ boxShadow: "0 0 40px rgba(255,165,0,0.3)" });
      }
    };
    pulse();
  }, [glowControls]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);


  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden px-6 lg:px-20 -mt-10 lg:-mt-24">

      {/* ======= Multi-layer Galaxy Background ======= */}
      {/* Stars Layer */}
      {[...Array(100)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/60"
          style={{
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            filter: "blur(0.5px)",
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Nebula Clouds */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${300 + Math.random() * 300}px`,
            height: `${200 + Math.random() * 200}px`,
            background: `radial-gradient(circle at center, rgba(255,140,0,0.1) 0%, transparent 80%)`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            filter: "blur(120px)",
          }}
          animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }}
          transition={{
            repeat: Infinity,
            duration: 30 + Math.random() * 20,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Constellation Lines */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-orange-400/20"
          style={{
            width: `${Math.random() * 100 + 20}px`,
            height: 1,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{ rotate: [0, 360] }}
          transition={{
            repeat: Infinity,
            duration: 40 + Math.random() * 20,
            ease: "linear",
          }}
        />
      ))}

      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center z-10">
        {/* Left Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-400/30 text-xs text-orange-200 bg-orange-500/10">
            <Zap className="h-3.5 w-3.5" /> Cosmic AI Wisdom
          </div>

          <h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-tight tracking-tight bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">
            VedAI — Cosmic Portal
          </h1>

          <p className="mt-5 text-orange-100 text-lg leading-relaxed">
            Step into a cosmic AI portal for spiritual guidance. Ask questions and receive insights from the Bhagavad Gita, Vedas, and shlokas.
          </p>

          <motion.h2
            className="mt-4 text-lg md:text-xl font-medium text-orange-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Helping you{' '}
            <span className="text-white font-semibold">
              <Typewriter
                words={['find purpose', 'gain clarity', 'connect spiritually']}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={40}
                delaySpeed={1200}
              />
            </span>
          </motion.h2>

          <motion.button
            animate={glowControls}
            whileHover={{ scale: 1.05, rotate: 1 }}
            className="mt-6 px-8 py-4 rounded-3xl bg-gradient-to-r from-orange-500 to-orange-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all"
          ><Link to="/chatpage">
              🌟 Ask VedAI
            </Link>
          </motion.button>
        </motion.div>

        {/* Right Cosmic Panel */}
        <motion.div
          ref={panelRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative w-full md:w-auto h-[400px] md:h-[600px] flex items-center justify-center
             -mr-4 sm:-mr-6 md:mr-0" // Negative margin-right on small screens
        >
          <motion.div
            className="relative w-72 sm:w-80 md:w-96 h-72 sm:h-80 md:h-96 bg-neutral-900/60 border border-orange-400/20 rounded-3xl backdrop-blur-xl shadow-[0_0_100px_rgba(255,140,0,0.3)] overflow-hidden"
            style={{ transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)` }}
            transition={{ type: "spring", stiffness: 140, damping: 16 }}
          >
            {/* Orbiting Keyword Orbs */}
            {["Clarity", "Peace", "Purpose", "Focus", "Wisdom", "Energy"].map(
              (text, i) => {
                const offsetX = (mousePos.x / window.innerWidth - 0.5) * 20;
                const offsetY = (mousePos.y / window.innerHeight - 0.5) * 20;
                return (
                  <motion.div
                    key={i}
                    className="absolute w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-orange-500/20 border border-orange-400/50 flex items-center justify-center text-xs sm:text-sm text-white font-semibold shadow-lg"
                    style={{
                      top: `${10 + i * 12 + offsetY}%`,
                      left: `${10 + (i * 15) % 60 + offsetX}%`,
                    }}
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      repeat: Infinity,
                      duration: 6 + i * 1.5,
                      ease: "linear",
                    }}
                  >
                    {text}
                  </motion.div>
                );
              }
            )}

            {/* Flowing Energy Streams */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-[1.5px] w-full bg-orange-400/30 rounded-full"
                style={{ top: `${Math.random() * 100}%` }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 4 + Math.random() * 3,
                  ease: "linear",
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
