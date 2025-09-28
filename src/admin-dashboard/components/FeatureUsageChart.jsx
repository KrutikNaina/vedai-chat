import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "VedAI Chat", value: 400 },
  { name: "Daily Rashi", value: 300 },
  { name: "E-Katha", value: 200 },
  { name: "Blog", value: 100 },
];

const COLORS = ["#f97316", "#fb923c", "#fdba74", "#fed7aa"];

export default function FeatureUsageChart() {
  return (
    <div className="bg-neutral-800/80 p-6 rounded-2xl shadow">
      <h3 className="text-lg font-bold mb-4">🔥 Feature Usage</h3>
      <PieChart width={400} height={250}>
        <Pie data={data} dataKey="value" outerRadius={100} label>
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
