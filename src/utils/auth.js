export const getUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
  
    const res = await fetch("http://localhost:5000/auth/user", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  
    if (!res.ok) return null;
    return res.json();
  };
  