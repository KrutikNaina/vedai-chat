import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser } from "../utils/auth";

export default function AdminGuard({ children }) {
  const [allowed, setAllowed] = useState(null);
  const location = useLocation();

  useEffect(() => {
    getUser().then((user) => {
      setAllowed(user?.isAdmin === true);
    });
  }, []);

  // 🔒 PREVENT BACK NAVIGATION INSIDE ADMIN
  useEffect(() => {
    if (allowed) {
      window.history.pushState(null, "", location.pathname);

      const blockBack = () => {
        window.history.pushState(null, "", location.pathname);
      };

      window.addEventListener("popstate", blockBack);

      return () => {
        window.removeEventListener("popstate", blockBack);
      };
    }
  }, [allowed, location.pathname]);

  if (allowed === null) {
    return (
      <div className="p-6 text-neutral-400">
        Checking admin access…
      </div>
    );
  }

  return allowed ? children : <Navigate to="/" replace />;
}
