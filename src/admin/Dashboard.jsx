import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [usage, setUsage] = useState([]);

  const COLORS = ["#f97316", "#22c55e", "#3b82f6", "#e11d48"];

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data));

    axios
      .get("http://localhost:5000/api/admin/api-logs/per-user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsage(res.data.usage));
  }, []);

  const Card = ({ title, value }) => (
    <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800">
      <h3 className="text-neutral-400">{title}</h3>
      <p className="text-3xl font-bold text-orange-500">{value}</p>
    </div>
  );

  if (!stats) return <p className="text-neutral-400">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-orange-500">
        Admin Dashboard
      </h1>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card title="Total Users" value={stats.users} />
        <Card title="API Queries" value={stats.queries} />
        <Card title="Total Cost (₹)" value={stats.totalCost} />
        <Card title="Total Kathas" value={stats.kathas} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card title="Active Users (24h)" value={stats.activeUsers} />
        <Card title="Today's Calls" value={stats.todayCalls} />
        <Card title="Today's Cost (₹)" value={stats.todayCost} />
        <Card title="Avg Tokens / Call" value={stats.avgTokens} />
      </div>

      {/* PIE CHART SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* TOKEN USAGE PIE */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-orange-400 mb-4">
            🧠 Token Usage by User
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={usage}
                dataKey="totalTokens"
                nameKey="email"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label
              >
                {usage.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* COST DISTRIBUTION PIE */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-orange-400 mb-4">
            💰 API Cost Distribution
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={usage}
                dataKey="totalCost"
                nameKey="email"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label
              >
                {usage.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TOP USER */}
      <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl">
        🔥 Top User:{" "}
        <span className="text-orange-500 font-bold">
          {stats.topUser}
        </span>
      </div>

      {/* EXPORT */}
      <a
        href="http://localhost:5000/api/admin/export/api-logs"
        className="inline-block mt-6 px-4 py-2 bg-orange-600 rounded-md text-white"
      >
        Export API Logs CSV
      </a>
    </div>
  );
}
