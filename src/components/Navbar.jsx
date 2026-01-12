import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "../assets/VedAI.png";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Chat", href: "/chatpage" },
  { label: "Ekatha", href: "/ekatha" },
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
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const hideNavbarPaths = ["/login", "/signup"];
  if (hideNavbarPaths.includes(location.pathname)) return null;

  const toggleNavbar = () => setMobileDrawerOpen(!mobileDrawerOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setDropdownOpen(false);
    navigate("/");
  };

  const getInitial = (nameOrEmail) =>
    nameOrEmail ? nameOrEmail.charAt(0).toUpperCase() : "U";

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">

          {/* LOGO */}
          <Link to="/">
            <img
              className="h-24 -mt-6 -mb-6 cursor-pointer hover:scale-105 hover:drop-shadow-[0_0_5px_#ff6a00]"
              src={logo}
              alt="Logo"
            />
          </Link>

          {/* DESKTOP NAV */}
          <ul className="hidden lg:flex ml-14 space-x-8">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link to={item.href} className="hover:text-orange-500 transition">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* AUTH / PROFILE SECTION */}
          <div className="hidden lg:flex items-center space-x-4 relative">

            {!loading && !user && (
              <>
                <Link to="/login" className="py-2 px-3 border rounded-md">
                  Login
                </Link>
                {/* <Link
                  to="/signup"
                  className="py-2 px-3 rounded-md bg-gradient-to-r from-orange-500 to-orange-800 text-white"
                >
                  Sign Up
                </Link> */}
              </>
            )}

            {!loading && user && (
              <div className="relative">
                {/* Avatar + Welcome Name */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-800 transition"
                >

                  {/* Welcome Message */}
                  <span className="flex items-center gap-2 text-white font-medium">
                    Welcome, {user.displayName || user.email}

                    {user.isAdmin && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-black shadow-md">
                        ADMIN
                      </span>
                    )}
                  </span>

                  {/* Avatar Circle */}
                  <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
                    {getInitial(user.displayName || user.email)}
                  </div>

                </button>

                {/* DROPDOWN */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl p-2">

                    <Link
                      to="/user"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-3 py-2 rounded-md hover:bg-neutral-800"
                    >
                      Profile Dashboard
                    </Link>

                    {user.isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-3 py-2 rounded-md hover:bg-neutral-800"
                      >
                        Admin Panel
                      </Link>
                    )}

                    <button
                      onClick={() => alert("Settings Coming Soon")}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-neutral-800"
                    >
                      Settings
                    </button>

                    <hr className="my-2 border-neutral-700" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-600/30 rounded-md"
                    >
                      Logout
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button className="lg:hidden" onClick={toggleNavbar}>
            {mobileDrawerOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>

        {/* MOBILE DRAWER */}
        {mobileDrawerOpen && (
          <div className="fixed top-0 right-0 w-full h-screen bg-neutral-900 p-12 flex flex-col items-center space-y-8">
            <ul className="space-y-6 text-2xl">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} onClick={() => setMobileDrawerOpen(false)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {!loading && user && (
              <div className="mt-8 text-center">
                <div className="w-14 h-14 rounded-full bg-orange-600 text-white flex items-center justify-center text-xl font-bold mx-auto">
                  {getInitial(user.displayName || user.email)}
                </div>

                <p className="text-white mt-2">Welcome, {user.displayName || user.email}</p>

                <button
                  onClick={handleLogout}
                  className="mt-4 w-40 py-2 bg-red-600 rounded-md text-white"
                >
                  Logout
                </button>
              </div>
            )}

            {!loading && !user && (
              <>
                <Link to="/login" className="w-40 py-3 border rounded-md text-center">
                  Login
                </Link>
                {/* <Link
                  to="/signup"
                  className="w-40 py-3 rounded-md bg-gradient-to-r from-orange-500 to-orange-800 text-center"
                >
                  Sign Up
                </Link> */}
              </>
            )}
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
