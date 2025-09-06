// src/components/Footer.jsx
import { FaLinkedinIn, FaGithub, FaEnvelope, FaGlobe } from "react-icons/fa";
import vedai from "../assets/VedAI.png"
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <footer className="border-t border-zinc-700 py-6 md:py-8 text-zinc-300 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 max-w-7xl mx-auto px-6">
        {/* Left Section */}
        <div className="flex flex-col items-center md:items-start">
          <img
            src={vedai}
            alt="Logo"
            className="w-20 md:w-24 block cursor-pointer transition-transform duration-300 hover:scale-105 hover:drop-shadow-[0_0_5px_#ff6a00]"
          />
          <div className="flex gap-4 md:gap-6 flex-wrap justify-center md:justify-start text-sm md:text-base mt-3">
            <Link to="/faq" className="hover:text-white transition">FAQ</Link>
            <Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-white transition">Terms of Service</Link>
            <Link to="/donate" className="hover:text-white transition">Donate</Link>
          </div>
        </div>

        {/* Right Section (Socials) */}
        {/* Right Section (Socials) */}
        <div className="flex gap-5 md:gap-6">
          <a
            href="https://www.linkedin.com/in/krutik-naina/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-orange-500 transition-transform duration-200 hover:scale-110"
          >
            <FaLinkedinIn size={20} />
          </a>

          <a
            href="https://github.com/krutiknaina"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-orange-500 transition-transform duration-200 hover:scale-110"
          >
            <FaGithub size={20} />
          </a>

          <a
            href="mailto:krutiknaina2004@example.com"
            aria-label="Email"
            className="hover:text-orange-500 transition-transform duration-200 hover:scale-110"
          >
            <FaEnvelope size={20} />
          </a>

          <a
            href="https://krutiknaina.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Portfolio"
            className="hover:text-orange-500 transition-transform duration-200 hover:scale-110"
          >
            <FaGlobe size={20} />
          </a>
        </div>

      </div>

      {/* Bottom */}
      <div className="text-center mt-6 md:mt-8 text-xs md:text-sm text-zinc-400">
        © 2025{" "}
        <b className="text-orange-400 hover:text-orange-500 transition cursor-pointer">
          VedAI
        </b>{" "}
        All rights reserved. 🚀 Powered by Ancient Wisdom ✨ & Future Intelligence 🤖
      </div>
    </footer>

  );
};

export default Footer;
