import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser } from "../utils/auth";

export default function AdminGuard({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    getUser().then(user => {
      setAllowed(user?.isAdmin === true);
    });
  }, []);

  if (allowed === null) return <p>Checking access...</p>;

  return allowed ? children : <Navigate to="/" />;
}
