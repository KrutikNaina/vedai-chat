export default function StatCards({ stats }) {
    const cardData = [
      { label: "Total Users", value: stats.totalUsers },
      { label: "DAU", value: stats.dau },
      { label: "MAU", value: stats.mau },
      { label: "New Signups", value: stats.newSignups },
      { label: "API Calls Today", value: stats.apiCalls },
      { label: "Cost (₹)", value: stats.cost },
    ];
  
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-6">
        {cardData.map((card, i) => (
          <div
            key={i}
            className="bg-neutral-800/80 p-4 rounded-2xl shadow hover:scale-105 transition"
          >
            <p className="text-sm text-gray-400">{card.label}</p>
            <h2 className="text-xl font-bold text-orange-400">{card.value}</h2>
          </div>
        ))}
      </div>
    );
  }
  