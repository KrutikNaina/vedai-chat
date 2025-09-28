// EKathaModule.jsx
import { Calendar } from "lucide-react";

export default function EKathaModule({ kathas }) {
  return (
    <div className="card">
      <h2 className="card-title flex items-center gap-2">
        <Calendar /> Upcoming Kathas
      </h2>
      <ul>
        {kathas.map((k, i) => (
          <li key={i} className="p-2 border-b">
            <strong>{k.title}</strong> - {k.date}
            <div>
              Checklist: {k.ready ? "✅ Ready" : "❌ Not Ready"}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
