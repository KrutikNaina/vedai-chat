import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const data = [
  { day: "Mon", users: 200 },
  { day: "Tue", users: 250 },
  { day: "Wed", users: 320 },
  { day: "Thu", users: 290 },
  { day: "Fri", users: 400 },
  { day: "Sat", users: 380 },
  { day: "Sun", users: 420 },
];

export default function UserGrowthChart() {
  return (
    <div className="bg-neutral-800/80 p-6 rounded-2xl shadow">
      <h3 className="text-lg font-bold mb-4">📈 User Growth (DAU)</h3>
      <LineChart width={400} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#555" />
        <XAxis dataKey="day" stroke="#aaa" />
        <YAxis stroke="#aaa" />
        <Tooltip />
        <Line type="monotone" dataKey="users" stroke="#f97316" strokeWidth={2} />
      </LineChart>
    </div>
  );
}
