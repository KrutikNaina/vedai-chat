import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function UserDetail() {
  const { id } = useParams();
  const [usage, setUsage] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/admin/users/${id}/usage`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsage(res.data));
  }, []);

  if (!usage) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold text-orange-500 mb-4">
        User Usage Details
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <Card title="API Calls" value={usage.calls} />
        <Card title="Tokens Used" value={usage.tokens} />
        <Card title="Cost (₹)" value={usage.cost} />
      </div>
    </div>
  );
}

const Card = ({ title, value }) => (
  <div className="p-6 bg-neutral-900 rounded-xl">
    <h3 className="text-neutral-400">{title}</h3>
    <p className="text-3xl text-orange-500 font-bold">{value}</p>
  </div>
);
