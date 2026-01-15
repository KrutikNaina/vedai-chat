import { FcGoogle } from "react-icons/fc";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [warning, setWarning] = useState("");
  const [comingSoon, setComingSoon] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const shakeAnimation = {
    x: [-8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.4 }
  };

  // -----------------------------
  // ⭐ GOOGLE LOGIN POPUP HANDLER (FIXED)
  // -----------------------------
  const handleGoogleLogin = () => {
    const API_URL = import.meta.env.VITE_API_URL;

    if (!API_URL) {
      setWarning("Backend URL not configured");
      return;
    }

    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      `${API_URL}/auth/google`,
      "GoogleAuth",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    // ✅ Track if popup is opened successfully
    let popupClosed = false;

    const messageHandler = (event) => {
      // ✅ Validate origin - allow both localhost and production
      const allowedOrigins = [
        'http://localhost:5000',
        'https://vedai-backend.onrender.com'
      ];

      const isAllowedOrigin = allowedOrigins.some(origin => 
        event.origin === origin || event.origin.startsWith(origin)
      );

      if (!isAllowedOrigin) {
        return;
      }

      if (event.data?.type === "oauth-success") {
        localStorage.setItem("token", event.data.token);
        window.dispatchEvent(new Event("tokenUpdated"));
        
        // ✅ Mark as closed to stop polling
        popupClosed = true;
        
        // ✅ Try to close popup safely (wrapped in try-catch)
        try {
          if (popup && !popup.closed) {
            popup.close();
          }
        } catch (err) {
          // Silently handle COOP errors - popup will close itself
          console.log("Popup closed by browser policy");
        }
        
        navigate("/chatpage");
      }

      if (event.data?.type === "oauth-failure") {
        setWarning("Google Authentication Failed. Try Again.");
        popupClosed = true;
        
        try {
          if (popup && !popup.closed) {
            popup.close();
          }
        } catch (err) {
          console.log("Popup closed by browser policy");
        }
      }
    };

    window.addEventListener("message", messageHandler);

    // ✅ FIXED: Safe popup polling without COOP errors
    const timer = setInterval(() => {
      // If we already handled the auth, stop checking
      if (popupClosed) {
        clearInterval(timer);
        window.removeEventListener("message", messageHandler);
        return;
      }

      // ✅ Try-catch to handle COOP errors gracefully
      try {
        if (popup && popup.closed) {
          clearInterval(timer);
          window.removeEventListener("message", messageHandler);
          
          // Only show warning if auth wasn't successful
          if (!popupClosed) {
            setWarning("Authentication cancelled. Please try again.");
          }
        }
      } catch (err) {
        // ✅ Silently handle COOP errors
        // The messageHandler will handle success/failure
        console.log("Cannot check popup status due to browser policy");
      }
    }, 1000); // Check every 1 second instead of 500ms

    // ✅ Cleanup after 5 minutes (in case something goes wrong)
    setTimeout(() => {
      clearInterval(timer);
      window.removeEventListener("message", messageHandler);
    }, 300000);
  };

  // -----------------------------
  // ⭐ EMAIL PASSWORD LOGIN
  // -----------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    let isValid = true;
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    setEmailError("");
    setPassError("");
    setWarning("");
    setComingSoon(false);

    if (!email) {
      setEmailError("Email is required.");
      isValid = false;
    }

    if (!password) {
      setPassError("Password is required.");
      isValid = false;
    } else if (password.length < 6) {
      setPassError("Password must be at least 6 characters.");
      isValid = false;
    }

    if (!isValid) return;

    // ⭐ SHOW "COMING SOON" ON BUTTON
    setComingSoon(true);
  };

  return (
    <section className="relative flex items-center justify-center min-h-screen bg-black/70 backdrop-blur-xl px-6">

      {/* BACKDROP GLOW */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute w-[450px] h-[450px] bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl"
      />

      {/* LOGIN CARD */}
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
          Welcome to{" "}
          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
            VedAI
          </span>
        </h1>

        <p className="text-center text-neutral-400 mb-8">
          Sign in to continue your Vedic wisdom journey
        </p>

        {warning && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-center text-yellow-400 font-medium bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-3"
          >
            {warning}
          </motion.p>
        )}

        {/* ---------------------- */}
        {/* ⭐ GOOGLE LOGIN BUTTON */}
        {/* ---------------------- */}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full py-3 px-5 rounded-lg border border-neutral-700 
            bg-neutral-800 hover:bg-neutral-700 transition shadow-lg hover:shadow-[0_0_25px_rgba(255,165,0,0.3)] mb-6"
        >
          <FcGoogle className="text-2xl mr-3" />
          <span className="text-lg font-medium">Sign in with Google</span>
        </button>

        {/* Divider */}
        {/* <div className="flex items-center my-6">
          <hr className="flex-grow border-neutral-700" />
          <span className="mx-4 text-neutral-500 text-sm">OR</span>
          <hr className="flex-grow border-neutral-700" />
        </div> */}

        {/* FORM */}
        {/* <form onSubmit={handleSubmit} className="space-y-6">

          <motion.div animate={emailError ? shakeAnimation : {}}>
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

          <motion.div animate={passError ? shakeAnimation : {}}>
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
                className="absolute right-4 top-3 cursor-pointer text-neutral-400 hover:text-orange-400 transition"
              >
                {showPass ? "Hide" : "Show"}
              </span>
            </div>

            {passError && <p className="text-red-400 text-sm mt-1">{passError}</p>}
          </motion.div>

          <button
            type="submit"
            disabled={comingSoon}
            className={`w-full py-3 rounded-lg text-lg font-semibold text-white shadow-lg transition flex justify-center
              ${comingSoon
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-[0_0_30px_rgba(255,165,0,0.5)]"
              }`}
          >
            {comingSoon ? "Coming Soon" : "Login"}
          </button>

        </form> */}

        {/* <p className="mt-6 text-center text-neutral-500 text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-orange-500 hover:underline">Sign up</a>
        </p> */}
      </motion.div>
    </section>
  );
};

export default Login;