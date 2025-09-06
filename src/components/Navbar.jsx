import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../assets/logo.png";

// Updated nav items
const navItems = [
  { label: "Home", href: "#" },
  { label: "Chat", href: "/chatpage" },
  { label: "Baby Name", href: "#baby-name" },
  { label: "About", href: "#about" },
  { label: "Blog", href: "#blog" },
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
            <img className="h-10 w-10 mr-2" src={logo} alt="Logo" />
            <span className="text-xl tracking-tight">VirtualR</span>
          </div>

          {/* Desktop nav links */}
          <ul className="hidden lg:flex ml-14 space-x-8">
            {navItems.map((item, index) => (
              <li key={index}>
                <a href={item.href} className="hover:text-orange-500 transition">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop buttons */}
          <div className="hidden lg:flex justify-center space-x-4 items-center">
            <a href="/login" className="py-2 px-3 border rounded-md hover:border-orange-500">
              Login
            </a>
           
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
                  <a href={item.href} onClick={() => setMobileDrawerOpen(false)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex flex-col space-y-4 mt-10 w-full items-center">
              <a
                href="/login"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-3/4 text-center py-3 border rounded-md hover:border-orange-500"
              >
                Login
              </a>
              <a
                href="/login"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-3/4 text-center py-3 rounded-md bg-gradient-to-r from-orange-500 to-orange-800 hover:from-orange-600 hover:to-orange-900 transition"
              >
                Sign Up
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
