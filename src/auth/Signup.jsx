// auth/Signup.jsx
import { FcGoogle } from "react-icons/fc";

export default function Signup() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-500/10 via-neutral-900 to-orange-800/20">
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-500 to-orange-800 bg-clip-text text-transparent">
          Create an Account
        </h2>
        <p className="text-gray-300 text-center mt-2 mb-6">Join <span className="font-semibold text-white">VirtualR</span> today</p>

        {/* Form */}
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-800 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-600" />
          <span className="px-2 text-gray-400 text-sm">OR</span>
          <hr className="flex-1 border-gray-600" />
        </div>

        {/* Google Button */}
        <button
          className="flex items-center justify-center gap-2 w-full border border-white/20 bg-white/5 text-white py-3 rounded-xl hover:bg-white/10 transition"
        >
          <FcGoogle size={24} />
          <span>Sign up with Google</span>
        </button>

        {/* Redirect */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-orange-400 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
