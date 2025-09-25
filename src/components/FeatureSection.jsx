import { motion } from "framer-motion";
import { Cog, Circle, Book, Moon, Star, User } from "lucide-react";

const features = [
  {
    title: "AI-Powered Bhagavad Gita Guidance",
    description:
      "Get life solutions through relevant shlokas and their meanings.",
    icon: <Cog className="w-10 h-10 text-orange-500" />,
  },
  {
    title: "Four Vedas Knowledge Hub",
    description:
      "Get insights from the Rig Veda, Sama Veda, Yajur Veda, and Atharva Veda for holistic wisdom.",
    icon: <Circle className="w-10 h-10 text-orange-500" />,
  },
  {
    title: "Hindu Dream Interpretation",
    description:
      "Understand the spiritual meaning of dreams with AI-powered insights from the Vedas.",
    icon: <Moon className="w-10 h-10 text-orange-500" />,
  },
  {
    title: "Personalized Bhagavad Gita Learning Path",
    description:
      "Step-by-step Gita study recommendations tailored to your spiritual progress.",
    icon: <Book className="w-10 h-10 text-orange-500" />,
  },
  {
    title: "Personalized Puja Guide",
    description:
      "AI suggests step-by-step puja rituals based on family traditions.",
    icon: <Star className="w-10 h-10 text-orange-500" />,
  },
  {
    title: "Spiritual Name Suggestion",
    description:
      "AI generates Hindu baby names and spiritual names based on Nakshatra and Rashi.",
    icon: <User className="w-10 h-10 text-orange-500" />,
  },
];

const FeatureSection = () => {
  return (
    <section className="relative w-full py-20 overflow-hidden bg-gradient-to-b ">
      {/* Floating cosmic particles */}
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
            x: [0, 8, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Background connecting lines */}
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

      {/* Section Content */}
      <div className="max-w-7xl mx-auto text-center relative z-10 px-4 sm:px-6 lg:px-20">
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          Powerful <span className="text-orange-500">VedAI Features</span>
        </h2>
        <p className="mt-4 text-lg text-neutral-400">
          Explore the blend of ancient scriptures and modern AI technology.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="mt-16 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 relative z-10 px-4 sm:px-6 lg:px-20">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: idx * 0.2 }}
            className="bg-neutral-900/80 backdrop-blur-md border border-orange-800/40 rounded-2xl p-6 shadow-[0_0_40px_rgba(255,140,0,0.15)] hover:shadow-[0_0_70px_rgba(255,140,0,0.35)] hover:scale-[1.03] transition-all duration-300 group"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-white group-hover:text-orange-400 transition">
              {feature.title}
            </h3>
            <p className="mt-2 text-neutral-400">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
