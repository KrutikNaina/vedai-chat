import { useState } from "react";
import TopBar from "./components/TopBar";
import StatCards from "./components/StatCards";
import UserGrowthChart from "./components/UserGrowthChart";
import FeatureUsageChart from "./components/FeatureUsageChart";
import TokenUsageCard from "./components/TokenUsageCard";
import FeedbackTable from "./components/FeedbackTable";
import BlogManager from "./components/BlogManager";

export default function AdminDashboard() {
  // Fake data (replace later with API calls)
  const [stats] = useState({
    totalUsers: 1250,
    dau: 320,
    mau: 800,
    newSignups: 45,
    apiCalls: 230,
    cost: 120,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white">
      {/* <TopBar /> */}

      {/* Stats */}
      <StatCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <UserGrowthChart />
        <FeatureUsageChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <TokenUsageCard stats={stats} />
        <FeedbackTable />
      </div>

      <div className="p-6">
        <BlogManager />
      </div>
    </div>
  );
}
