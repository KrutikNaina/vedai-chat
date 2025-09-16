import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "../assets/VedAI.png";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Chat", href: "/chatpage" },
  { label: "Baby Name", href: "/rashiname" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:5000/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Hide navbar on specific pages
  const hideNavbarPaths = ["/login", "/signup"];
  if (hideNavbarPaths.includes(location.pathname)) return null;

  const toggleNavbar = () => setMobileDrawerOpen(!mobileDrawerOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setDropdownOpen(false);
    navigate("/");
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
                <Link to={item.href} className="hover:text-orange-500 transition">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop auth buttons */}
          <div className="hidden lg:flex justify-center space-x-4 items-center relative">
            {!loading && (
              !user ? (
                <>
                  <Link
                    to="/login"
                    className="py-2 px-3 border rounded-md hover:border-orange-500"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="py-2 px-3 border rounded-md bg-gradient-to-r from-orange-500 to-orange-800 text-white hover:from-orange-600 hover:to-orange-900 transition"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="py-2 px-3 border rounded-md bg-orange-600 text-white hover:bg-orange-700 transition"
                  >
                    Welcome, {user.displayName || user.email}
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-neutral-900 border border-neutral-700 rounded-md shadow-lg z-50">
                      <button
                        onClick={handleLogout}
                        className="w-full py-2 px-3 text-left text-white hover:bg-red-600 rounded-md transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )
            )}
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
              {!loading && (
                !user ? (
                  <>
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
                  </>
                ) : (
                  <div className="relative w-3/4">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="w-full py-3 rounded-md bg-orange-600 text-white hover:bg-orange-700 transition"
                    >
                      Welcome, {user.displayName || user.email}
                    </button>
                    {dropdownOpen && (
                      <div className="mt-2 w-full bg-neutral-900 border border-neutral-700 rounded-md shadow-lg z-50">
                        <button
                          onClick={() => {
                            handleLogout();
                            setMobileDrawerOpen(false);
                          }}
                          className="w-full py-2 px-3 text-left text-white hover:bg-red-600 rounded-md transition"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
