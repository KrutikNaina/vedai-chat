export default function TokenUsageCard({ stats }) {
    return (
      <div className="bg-neutral-800/80 p-6 rounded-2xl shadow">
        <h3 className="text-lg font-bold mb-2">💰 AI Token Usage</h3>
        <p>API Calls Today: <span className="text-orange-400">{stats.apiCalls}</span></p>
        <p>Estimated Cost: <span className="text-orange-400">₹{stats.cost}</span></p>
        <p className="mt-2 text-sm text-gray-400">Most Used Module: Daily Guidance</p>
      </div>
    );
  }
  