import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

const Signup = () => {
  const navigate = useNavigate();
  const [warning, setWarning] = useState("");

  const handleGoogleSignup = () => {
    alert("Google Signup Clicked!");
  };

  return (
    <section className="relative flex items-center justify-center min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black text-white px-6">
      {/* Background glow effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute w-[500px] h-[500px] bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-full blur-3xl"
      />

      {/* Main Signup Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-neutral-900/70 backdrop-blur-md border border-neutral-800 rounded-2xl shadow-[0_0_40px_rgba(255,140,0,0.3)]">
        
        {/* Close Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 text-white hover:text-orange-500 transition text-2xl"
        >
          <IoMdClose />
        </button>

        <h1 className="text-3xl font-bold text-center mb-6">
          Join{" "}
          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
            VedAI
          </span>
        </h1>
        <p className="text-center text-neutral-400 mb-10">
          Create your account to start your Vedic wisdom journey
        </p>

        {warning && (
          <p className="mb-4 text-center text-yellow-400 font-medium">{warning}</p>
        )}

        {/* Google Signup Button */}
        <button
          onClick={handleGoogleSignup}
          className="flex items-center justify-center w-full py-3 px-5 rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 transition shadow-lg hover:shadow-[0_0_25px_rgba(255,165,0,0.3)] mb-6"
        >
          <FcGoogle className="text-2xl mr-3" />
          <span className="text-lg font-medium">Sign up with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-neutral-700" />
          <span className="mx-4 text-neutral-500 text-sm">OR</span>
          <hr className="flex-grow border-neutral-700" />
        </div>

        {/* Name + Email + Password */}
        <form className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:border-orange-500 focus:ring focus:ring-orange-500/40 outline-none transition"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:border-orange-500 focus:ring focus:ring-orange-500/40 outline-none transition"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:border-orange-500 focus:ring focus:ring-orange-500/40 outline-none transition"
          />
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-lg font-semibold text-white shadow-lg hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-neutral-500 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-orange-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </section>
  );
};

export default Signup;
