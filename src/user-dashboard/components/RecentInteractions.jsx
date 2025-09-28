// RecentInteractions.jsx
import { MessageCircle } from "lucide-react";

export default function RecentInteractions({ history }) {
  return (
    <div className="card">
      <h2 className="card-title flex items-center gap-2">
        <MessageCircle /> Recent Interactions
      </h2>
      <ul>
        {history.slice(0, 3).map((h, i) => (
          <li key={i} className="p-2 border-b">
            <strong>Q:</strong> {h.question} <br />
            <span className="text-gray-600"><strong>A:</strong> {h.answer}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
