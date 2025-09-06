import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../assets/VedAI.png";
import { Link } from "react-router-dom";

// Updated nav items
const navItems = [
  { label: "Home", href: "/" },
  { label: "Chat", href: "/chatpage" },
  { label: "Baby Name", href: "/rashiname" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" }, // ✅ fixed from "#blog"
];

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/">
              <img
                className="h-24 -mt-6 -mb-6 mr-2 cursor-pointer hover:scale-105 hover:drop-shadow-[0_0_5px_#ff6a00]"
                src={logo}
                alt="Logo"
              />
            </Link>
          </div>

          {/* Desktop nav links */}
          <ul className="hidden lg:flex ml-14 space-x-8">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  className="hover:text-orange-500 transition"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop buttons */}
          <div className="hidden lg:flex justify-center space-x-4 items-center">
            <Link
              to="/login"
              className="py-2 px-3 border rounded-md hover:border-orange-500"
            >
              Login
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="lg:hidden flex items-center">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed top-0 right-0 z-20 bg-neutral-900 w-full h-screen p-12 flex flex-col justify-center items-center lg:hidden">
            <ul className="space-y-6 text-2xl">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.href}
                    onClick={() => setMobileDrawerOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col space-y-4 mt-10 w-full items-center">
              <Link
                to="/login"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-3/4 text-center py-3 border rounded-md hover:border-orange-500"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-3/4 text-center py-3 rounded-md bg-gradient-to-r from-orange-500 to-orange-800 hover:from-orange-600 hover:to-orange-900 transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
