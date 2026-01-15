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
      .then((res) => {
        const data = res.data;

        // 🔒 SAFE NORMALIZATION (NO UI CRASH)
        setStats({
          ...data,

          blogs: {
            total: data.blogs?.total ?? 0,
            published: data.blogs?.published ?? 0,
            totalViews: data.blogs?.totalViews ?? 0,
            usersFromBlog: data.blogs?.usersFromBlog ?? 0,
            seoScore: data.blogs?.seoScore ?? 0,
            seoStatus: data.blogs?.seoStatus ?? "Unknown",
            topBlog: data.blogs?.topBlog ?? { title: "N/A", views: 0 },
          },

          apiHealth: {
            window: data.apiHealth?.window ?? "N/A",
            totalCalls: data.apiHealth?.totalCalls ?? 0,
            errors: data.apiHealth?.errors ?? 0,
            errorRate: data.apiHealth?.errorRate ?? 0,
            avgResponseTime: data.apiHealth?.avgResponseTime ?? 0,
            maxResponseTime: data.apiHealth?.maxResponseTime ?? 0,
            slowResponses: data.apiHealth?.slowResponses ?? 0,
            fastResponses: data.apiHealth?.fastResponses ?? 0,
            timeoutCount: data.apiHealth?.timeoutCount ?? 0,
          },
        });
      });

    axios
      .get("http://localhost:5000/api/admin/api-logs/per-user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsage(res.data.usage || []));
  }, []);

  const Card = ({ title, value, danger, warning }) => (
    <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800">
      <h3 className="text-neutral-400">{title}</h3>
      <p
        className={`text-3xl font-bold ${danger
            ? "text-red-500"
            : warning
              ? "text-yellow-400"
              : "text-orange-500"
          }`}
      >
        {value}
      </p>
    </div>
  );

  if (!stats) return <p className="text-neutral-400">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-orange-500">
        Admin Dashboard
      </h1>

      {/* CORE STATS */}
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

      {/* BLOG ANALYTICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card title="Total Blogs" value={stats.blogs.total} />
        <Card title="Published Blogs" value={stats.blogs.published} />
        <Card title="Blog Views" value={stats.blogs.totalViews} />
        <Card title="Users from Blog (SEO)" value={stats.blogs.usersFromBlog} />
      </div>

      {/* SEO HEALTH */}
      <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl mb-8">
        <h2 className="text-lg font-semibold text-orange-400 mb-4">
           Blog SEO Health
        </h2>

        <div className="flex items-center gap-6">
          <div className="text-4xl font-bold text-orange-500">
            {stats.blogs.seoScore}%
          </div>

          <p className="text-neutral-300">
            SEO Strength:{" "}
            <span
              className={`font-bold ${stats.blogs.seoStatus === "Strong"
                  ? "text-green-500"
                  : stats.blogs.seoStatus === "Medium"
                    ? "text-yellow-400"
                    : "text-red-500"
                }`}
            >
              {stats.blogs.seoStatus}
            </span>
          </p>
        </div>
      </div>

      {/* API HEALTH */}
      <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl mb-8">
        <h2 className="text-lg font-semibold text-orange-400 mb-4">
          Chatbot API Health (Last 7 Days)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
          <Card title="Total Calls" value={stats.apiHealth.totalCalls} />
          <Card title="Errors" value={stats.apiHealth.errors} danger />
          <Card title="Timeouts" value={stats.apiHealth.timeoutCount} danger />
          <Card
            title="Error Rate (%)"
            value={`${stats.apiHealth.errorRate}%`}
            danger={stats.apiHealth.errorRate > 5}
            warning={
              stats.apiHealth.errorRate > 2 &&
              stats.apiHealth.errorRate <= 5
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card
            title="Avg Response (ms)"
            value={stats.apiHealth.avgResponseTime}
          />
          <Card
            title="Max Response (ms)"
            value={stats.apiHealth.maxResponseTime}
          />
          <Card
            title="Fast Responses"
            value={stats.apiHealth.fastResponses}
          />
          <Card
            title="Slow Responses"
            value={stats.apiHealth.slowResponses}
            warning
          />
        </div>
      </div>

      {/* PIE CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-orange-400 mb-4">
             Token Usage by User
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={usage}
                dataKey="totalTokens"
                nameKey="email"
                outerRadius={110}
                label
              >
                {usage.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

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
                outerRadius={110}
                label
              >
                {usage.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TOP BLOG */}
      <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl mb-6">
        🔥 Top Blog:{" "}
        <span className="text-orange-500 font-bold">
          {stats.blogs.topBlog.title}
        </span>
        <span className="text-neutral-400 ml-2">
          ({stats.blogs.topBlog.views} views)
        </span>
      </div>

      {/* EXPORT */}
      <a
        href="http://localhost:5000/api/admin/export/api-logs"
        className="inline-block mt-4 px-4 py-2 bg-orange-600 rounded-md text-white"
      >
        Export API Logs CSV
      </a>
    </div>
  );
}
