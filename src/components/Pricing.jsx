// src/components/Pricing.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, X } from "lucide-react";
import { motion } from "framer-motion";
import { pricingOptions } from "../constants";
import Payment from "./Payment";

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

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

  const handleSubscribe = (plan) => {
    if (!token) {
      navigate("/login");
      return;
    }
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  return (
    <section className="relative mt-20 min-h-[900px] overflow-hidden text-white">
      {/* Background Particles */}
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
          animate={{ y: [0, 20, 0], x: [0, 10, 0], opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 5 + Math.random() * 3, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
        />
      ))}

      {/* Section Title */}
      <div className="text-center relative z-10">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl my-8 tracking-wide">Pricing</h2>
      </div>

      {/* Pricing Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-20">
        {pricingOptions.map((option, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: index * 0.3 }}>
            <div
              className="cursor-pointer flex flex-col justify-between h-full p-10 border border-neutral-800 rounded-3xl bg-neutral-900/80 backdrop-blur-md shadow-[0_0_40px_rgba(255,140,0,0.2)] hover:shadow-[0_0_80px_rgba(255,165,0,0.35)] transition-all duration-500"
            >
              <p className="text-4xl mb-4 font-bold flex items-center justify-center">
                {option.title}
                {option.title === "Pro" && <span className="ml-3 bg-gradient-to-r from-orange-500 to-red-400 text-transparent bg-clip-text text-xl font-semibold">(Most Popular)</span>}
              </p>

              <p className="mb-8 flex justify-center items-baseline gap-2">
                <span className="text-5xl font-extrabold">{option.price}</span>
                <span className="text-neutral-400 text-lg tracking-tight">/Month</span>
              </p>

              <ul className="space-y-4 flex-1">
                {option.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-neutral-200">
                    <CheckCircle2 className="text-orange-500 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(option)}
                className="mt-10 inline-flex justify-center items-center text-center w-full h-14 p-5 tracking-tight text-xl font-semibold text-neutral-900 bg-gradient-to-r from-orange-500 to-orange-700 rounded-xl shadow-lg hover:shadow-[0_0_40px_rgba(255,165,0,0.45)] transition duration-300"
              >
                {option.title === "Free" ? "Get Started" : "Subscribe Now"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Payment Modal */}
      {showPayment && selectedPlan && token && user && (
        <Payment plan={selectedPlan} user={user} token={token} onClose={() => setShowPayment(false)} onSuccess={() => setShowPayment(false)} />
      )}
    </section>
  );
};

export default Pricing;
