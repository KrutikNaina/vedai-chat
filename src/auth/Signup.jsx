import { FcGoogle } from "react-icons/fc";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [warning, setWarning] = useState("");
  const [comingSoon, setComingSoon] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const shakeAnim = {
    x: [-8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.4 }
  };

  // GOOGLE SIGNUP POPUP
  const handleGoogleSignup = () => {
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      "http://localhost:5000/auth/google",
      "GoogleSignup",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    const messageHandler = (event) => {
      if (event.origin !== "http://localhost:5000") return;

      if (event.data?.type === "oauth-success") {
        localStorage.setItem("token", event.data.token);
        window.dispatchEvent(new Event("tokenUpdated"));
        popup?.close();
        navigate("/");
      }

      if (event.data?.type === "oauth-failure") {
        setWarning("Google Signup Failed. Try Again.");
      }
    };

    window.addEventListener("message", messageHandler);

    const timer = setInterval(() => {
      if (popup?.closed) {
        clearInterval(timer);
        window.removeEventListener("message", messageHandler);
      }
    }, 500);
  };

  // FORM SUBMIT HANDLER
  const handleSubmit = (e) => {
    e.preventDefault();

    setWarning("");
    setNameError("");
    setEmailError("");
    setPassError("");
    setConfirmError("");

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const confirm = e.target.confirmPassword.value.trim();

    let valid = true;

    if (!name) {
      setNameError("Full name is required.");
      valid = false;
    }
    if (!email) {
      setEmailError("Email is required.");
      valid = false;
    }
    if (!password) {
      setPassError("Password is required.");
      valid = false;
    } else if (password.length < 6) {
      setPassError("Password must be at least 6 characters.");
      valid = false;
    }
   

    if (!valid) return;

    // LOADING → COMING SOON
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setComingSoon(true);
    }, 1500);
  };

  return (
    <section className="relative flex items-center justify-center min-h-screen bg-black/70 backdrop-blur-xl px-6">

      {/* SAME GLOW AS LOGIN */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute w-[450px] h-[450px] bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl"
      />

      {/* SAME CARD SIZE AS LOGIN */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md p-8 bg-neutral-900/80 backdrop-blur-md 
        border border-neutral-700 rounded-2xl shadow-[0_0_40px_rgba(255,140,0,0.3)]"
      >

        {/* CLOSE BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition"
        >
          <X size={28} />
        </button>

        <h1 className="text-3xl font-bold text-center mb-6">
          Create Your{" "}
          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
            VedAI
          </span>{" "}
          Account
        </h1>

        {warning && (
          <p className="mb-4 text-center text-yellow-400 font-medium">{warning}</p>
        )}

        {/* GOOGLE SIGNUP */}
        <button
          onClick={handleGoogleSignup}
          className="flex items-center justify-center w-full py-3 px-5 rounded-lg border border-neutral-700 
          bg-neutral-800 hover:bg-neutral-700 transition shadow-lg hover:shadow-[0_0_25px_rgba(255,165,0,0.3)] mb-6"
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

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* NAME */}
          <motion.div animate={nameError ? shakeAnim : {}}>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              className={`w-full px-4 py-3 rounded-lg bg-neutral-800 border 
              ${nameError ? "border-red-500" : "border-neutral-700"}
              focus:border-orange-500 focus:ring focus:ring-orange-500/40 outline-none transition`}
            />
            {nameError && <p className="text-red-400 text-sm mt-1">{nameError}</p>}
          </motion.div>

          {/* EMAIL */}
          <motion.div animate={emailError ? shakeAnim : {}}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              className={`w-full px-4 py-3 rounded-lg bg-neutral-800 border 
              ${emailError ? "border-red-500" : "border-neutral-700"}
              focus:border-orange-500 focus:ring focus:ring-orange-500/40 outline-none transition`}
            />
            {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
          </motion.div>

          {/* PASSWORD */}
          <motion.div animate={passError ? shakeAnim : {}}>
            <div className="relative">
              <input
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="Password"
                className={`w-full px-4 py-3 rounded-lg bg-neutral-800 border 
                ${passError ? "border-red-500" : "border-neutral-700"}
                focus:border-orange-500 focus:ring focus:ring-orange-500/40 outline-none transition`}
              />
              <span
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-3 cursor-pointer text-neutral-400 hover:text-orange-400"
              >
                {showPass ? "Hide" : "Show"}
              </span>
            </div>
            {passError && <p className="text-red-400 text-sm mt-1">{passError}</p>}
          </motion.div>

         
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading || comingSoon}
            className={`w-full py-3 rounded-lg text-lg font-semibold text-white 
            shadow-lg transition flex justify-center
            ${(loading || comingSoon)
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-[0_0_30px_rgba(255,165,0,0.5)]"
            }`}
          >
            {loading ? (
              <motion.div className="w-6 h-6 border-4 border-white/40 border-t-white rounded-full animate-spin" />
            ) : comingSoon ? (
              "Coming Soon"
            ) : (
              "Sign Up"
            )}
          </button>

        </form>

        {/* LOGIN LINK */}
        <p className="mt-6 text-center text-neutral-500 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-orange-500 hover:underline">Login</a>
        </p>

      </motion.div>
    </section>
  );
};

export default Signup;
