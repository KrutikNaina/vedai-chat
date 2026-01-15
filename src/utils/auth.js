export const getUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("getUser failed:", err);
    return null;
  }
};
