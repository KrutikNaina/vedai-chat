import { motion } from "framer-motion";
import { testimonials } from "../constants";

const Testimonials = () => {
  return (
    <section className="relative -mt-20 tracking-wide min-h-[900px] overflow-hidden">
      {/* Background cosmic particles */}
      {[...Array(30)].map((_, i) => (
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

      <div className="text-center relative z-10">
        <span className="bg-neutral-900 text-orange-500 rounded-full h-6 text-sm font-medium px-3 py-1 uppercase tracking-wider">
          Testimonials
        </span>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl my-10 lg:my-20">
          What People Are Saying
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-8 relative z-10">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.3 }}
            className="w-full sm:w-1/2 lg:w-1/3 px-4"
          >
            <div className="bg-neutral-900/80 backdrop-blur-md rounded-3xl p-6 border border-neutral-800 shadow-[0_0_40px_rgba(255,140,0,0.2)] hover:shadow-[0_0_80px_rgba(255,165,0,0.35)] transition-all duration-500 relative">
              {/* Decorative floating orbs */}
              {[...Array(3)].map((_, orbIndex) => (
                <motion.div
                  key={orbIndex}
                  className="absolute rounded-full bg-orange-400/30"
                  style={{
                    width: 6 + Math.random() * 4,
                    height: 6 + Math.random() * 4,
                    top: `${10 + orbIndex * 25}%`,
                    right: `${5 + orbIndex * 20}%`,
                  }}
                  animate={{
                    y: [0, -6, 0],
                    x: [0, 4, 0],
                  }}
                  transition={{
                    duration: 4 + orbIndex,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: orbIndex * 0.2,
                  }}
                />
              ))}

              <p className="text-md text-neutral-300">{testimonial.text}</p>

              <div className="flex mt-6 items-start">
                <img
                  className="w-14 h-14 mr-4 rounded-full border border-neutral-700 shadow-sm"
                  src={testimonial.image}
                  alt={testimonial.user}
                />
                <div>
                  <h6 className="text-white font-semibold">{testimonial.user}</h6>
                  <span className="text-sm font-normal italic text-neutral-500">
                    {testimonial.company}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Background connecting lines */}
      {[...Array(5)].map((_, i) => (
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
    </section>
  );
};

export default Testimonials;
