import { motion } from "framer-motion";
import { testimonials } from "../constants";

const Testimonials = () => {
  return (
    <section className="relative w-full min-h-screen py-20 overflow-hidden bg-gradient-to-b ">
      {/* Cosmic floating particles */}
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

      {/* Content */}
      <div className="max-w-7xl mx-auto text-center relative z-10 px-4 sm:px-6 lg:px-20">
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          What <span className="text-orange-500">People Say</span>
        </h2>
        <p className="mt-4 text-lg text-neutral-400">
          Hear from real users who experienced the wisdom of VedAI.
        </p>
      </div>

      {/* Testimonial Cards */}
      <div className="mt-16 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 relative z-10 px-4 sm:px-6 lg:px-20">
        {testimonials.map((testimonial, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: idx * 0.2 }}
            className="bg-neutral-900/80 backdrop-blur-md border border-orange-800/40 rounded-2xl p-6 shadow-[0_0_40px_rgba(255,140,0,0.15)] hover:shadow-[0_0_70px_rgba(255,140,0,0.35)] hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <img
                src={testimonial.image}
                alt={testimonial.user}
                className="w-14 h-14 rounded-full object-cover border-2 border-orange-500"
              />
              <div>
                <h4 className="text-lg font-semibold text-white">
                  {testimonial.user}
                </h4>
                <p className="text-sm text-neutral-400 italic">
                  {testimonial.company}
                </p>
              </div>
            </div>
            <p className="mt-4 text-neutral-300 italic">
              "{testimonial.text}"
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
