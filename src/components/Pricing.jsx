import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle2, X } from "lucide-react";
import { motion } from "framer-motion";
import { pricingOptions } from "../constants";

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const location = useLocation();

  // Open modal if URL contains ?plan=XYZ
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const planName = params.get("plan");
    if (planName) {
      const match = pricingOptions.find(
        (option) => option.title.toLowerCase() === planName.toLowerCase()
      );
      if (match) setSelectedPlan(match);
    }
  }, [location]);

  return (
    <section className="relative mt-20 min-h-[900px] overflow-hidden text-white">
      {/* Cosmic background particles */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-orange-500/20"
          style={{
            width: 2 + Math.random() * 6,
            height: 2 + Math.random() * 6,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            filter: "blur(1.5px)",
          }}
          animate={{
            y: [0, 20, 0],
            x: [0, 10, 0],
            opacity: [0.3, 0.9, 0.3],
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

      {/* Section Title */}
      <div className="text-center relative z-10">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl my-8 tracking-wide">
          Pricing
        </h2>
      </div>

      {/* Pricing Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-20">
        {pricingOptions.map((option, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.3 }}
          >
            <div
              onClick={() => setSelectedPlan(option)}
              className="cursor-pointer flex flex-col justify-between h-full p-10 border border-neutral-800 rounded-3xl bg-neutral-900/80 backdrop-blur-md shadow-[0_0_40px_rgba(255,140,0,0.2)] hover:shadow-[0_0_80px_rgba(255,165,0,0.35)] transition-all duration-500"
            >
              {/* Title */}
              <p className="text-4xl mb-4 font-bold flex items-center justify-center">
                {option.title}
                {option.title === "Pro" && (
                  <span className="ml-3 bg-gradient-to-r from-orange-500 to-red-400 text-transparent bg-clip-text text-xl font-semibold">
                    (Most Popular)
                  </span>
                )}
              </p>

              {/* Price */}
              <p className="mb-8 flex justify-center items-baseline gap-2">
                <span className="text-5xl font-extrabold">{option.price}</span>
                <span className="text-neutral-400 text-lg tracking-tight">
                  /Month
                </span>
              </p>

              {/* Features */}
              <ul className="space-y-4 flex-1">
                {option.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-neutral-200">
                    <CheckCircle2 className="text-orange-500 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className="mt-10 inline-flex justify-center items-center text-center w-full h-14 p-5 tracking-tight text-xl font-semibold text-neutral-900 bg-gradient-to-r from-orange-500 to-orange-700 rounded-xl shadow-lg hover:shadow-[0_0_40px_rgba(255,165,0,0.45)] transition duration-300">
                Learn More
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-[90%] max-w-2xl p-8 rounded-3xl bg-neutral-900/90 border border-neutral-700 shadow-[0_0_60px_rgba(255,140,0,0.3)]"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X size={28} />
            </button>

            <h3 className="text-3xl font-bold text-orange-400 mb-4">
              {selectedPlan.title} Plan
            </h3>
            <p className="text-lg text-neutral-300 mb-6">
              Perfect choice for{" "}
              <span className="text-white font-semibold">
                {selectedPlan.title} users
              </span>
              . Unlock premium features and boost your VedAI experience 🚀
            </p>

            <ul className="space-y-3 mb-6">
              {selectedPlan.features.map((f, i) => (
                <li key={i} className="flex items-center text-neutral-200">
                  <CheckCircle2 className="text-orange-500 mr-3" /> {f}
                </li>
              ))}
            </ul>

            <button className="w-full h-14 text-lg font-semibold text-neutral-900 bg-gradient-to-r from-orange-500 to-orange-700 rounded-xl shadow-lg hover:shadow-[0_0_40px_rgba(255,165,0,0.45)] transition duration-300">
              Subscribe Now – {selectedPlan.price}/Month
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Pricing;
