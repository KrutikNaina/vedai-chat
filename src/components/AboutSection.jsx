import { useEffect, useState } from "react";
import aboutImage1 from "../assets/engineer.svg";
import aboutImage2 from "../assets/genius.svg";
import { useNavigate } from "react-router-dom";

const AboutSection = () => {
  const images = [aboutImage1, aboutImage2];
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full min-h-screen py-20relative overflow-hidden px-4 sm:px-6 lg:px-20 flex items-center justify-center">
      {/* Subtle cosmic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-950/20 pointer-events-none" />

      <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        {/* LEFT IMAGE SECTION */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src={images[currentImage]}
            alt="About VedAI"
            className="w-full max-w-md transition-all duration-700 ease-in-out drop-shadow-[0_0_40px_rgba(255,140,0,0.35)]"
          />
        </div>

        {/* RIGHT TEXT SECTION */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Why <span className="text-orange-500">VedAI</span>?
          </h2>
          <p className="mt-6 text-lg text-neutral-300">
            VedAI isn’t just a chatbot — it’s your AI-powered spiritual guide.  
            Get daily wisdom from the Bhagavad Gita, explore the Vedas, and find
            clarity in life’s toughest questions.
          </p>
          <ul className="mt-6 space-y-3 text-neutral-300 list-disc list-inside">
            <li>📖 Daily Shlokas with meanings</li>
            <li>🔮 Rashi-based insights & predictions</li>
            <li>🌸 Personalized puja & rituals guidance</li>
            <li>👶 Baby names from Rashi & Nakshatra</li>
          </ul>

          {/* CTA BUTTON */}
          <button
            onClick={() => navigate("/chat")} // redirect to chat
            className="mt-8 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-[0_0_40px_rgba(255,140,0,0.45)] transition"
          >
            🙏 Explore VedAI
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
