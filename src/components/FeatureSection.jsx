import { motion } from "framer-motion";
import { Cog, Circle, Book, Moon, Star, User } from "lucide-react";

const features = [
  {
    icon: <Cog />,
    text: "AI-Powered Bhagavad Gita Guidance",
    description: "Get life solutions through relevant shlokas and their meanings.",
  },
  {
    icon: <Circle />,
    text: "Four Vedas Knowledge Hub",
    description:
      "Get insights from the Rig Veda, Sama Veda, Yajur Veda, and Atharva Veda for holistic wisdom.",
  },
  {
    icon: <Cog />,
    text: "Hindu Dream Interpretation",
    description:
      "Understand the spiritual meaning of dreams with AI-powered insights from the Vedas.",
  },
  {
    icon: <Book />,
    text: "Personalized Bhagavad Gita Learning Path",
    description: "Step-by-step Gita study recommendations tailored to your spiritual progress.",
  },
  {
    icon: <Star />,
    text: "Personalized Puja Guide",
    description: "AI suggests step-by-step puja rituals based on family traditions.",
  },
  {
    icon: <User />,
    text: "Spiritual Name Suggestion",
    description:
      "AI generates Hindu baby names and spiritual names based on Nakshatra and Rashi.",
  },
];

const FeatureSection = () => {
  return (
    <section className="relative mt-20 border-b border-neutral-800 min-h-[1000px] overflow-hidden">
      {/* Cosmic background particles */}
      {[...Array(40)].map((_, i) => (
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
            x: [0, 10, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="text-center relative z-10">
        <span className="bg-neutral-900 text-orange-500 rounded-full h-6 text-sm font-medium px-3 py-1 uppercase tracking-wider">
          Feature
        </span>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl mt-10 lg:mt-20 tracking-wide">
          Easily Build Your{" "}
          <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
            AI-Powered Vedic Wisdom Journey
          </span>
        </h2>
      </div>

      {/* Features Grid */}
      <div className="flex flex-wrap justify-center mt-10 lg:mt-20 relative z-10 gap-12">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.08, y: -8 }}
            className="w-full sm:w-1/2 lg:w-1/3 px-4 relative"
          >
            {/* Orbiting mini-orbs */}
            {[...Array(3)].map((_, orbIndex) => (
              <motion.div
                key={orbIndex}
                className="absolute rounded-full bg-orange-400/50"
                style={{
                  width: 6 + Math.random() * 4,
                  height: 6 + Math.random() * 4,
                  top: "50%",
                  left: "50%",
                  translateX: "-50%",
                  translateY: "-50%",
                }}
                animate={{
                  rotate: [0, 360],
                  x: [20 + orbIndex * 8, -20 - orbIndex * 8],
                  y: [-20 - orbIndex * 6, 20 + orbIndex * 6],
                }}
                transition={{
                  duration: 6 + orbIndex,
                  repeat: Infinity,
                  ease: "linear",
                  delay: orbIndex * 0.2,
                }}
              />
            ))}

            {/* Feature Card */}
            <div className="flex gap-4 p-6 bg-neutral-900/60 rounded-3xl shadow-[0_0_60px_rgba(255,140,0,0.25)] hover:shadow-[0_0_100px_rgba(255,165,0,0.45)] transition-all duration-500 relative z-10">
              {/* Spinning glowing icon */}
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="flex h-14 w-14 p-3 bg-gradient-to-br from-orange-500 to-orange-700 justify-center items-center rounded-full text-white text-2xl shadow-lg"
              >
                {feature.icon}
              </motion.div>

              <div>
                <h5 className="text-xl font-semibold text-white">{feature.text}</h5>
                <p className="text-md mt-2 text-neutral-400">{feature.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cosmic connecting lines */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 bg-orange-500/30"
          style={{
            top: `${10 + i * 15}%`,
            left: `${15 + i * 10}%`,
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
    </section>
  );
};

export default FeatureSection;
