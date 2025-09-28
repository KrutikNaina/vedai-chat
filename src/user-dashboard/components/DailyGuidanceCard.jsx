// DailyGuidanceCard.jsx
import { Sun, Clock, BookOpen } from "lucide-react";

export default function DailyGuidanceCard({ rashi, choghadiya, quote }) {
  return (
    <div className="card">
      <h2 className="card-title flex items-center gap-2">
        <Sun /> Today’s Guidance
      </h2>
      <p><strong>Rashi Advice:</strong> {rashi}</p>
      <p><Clock /> <strong>Choghadiya:</strong> {choghadiya}</p>
      <p><BookOpen /> <em>“{quote}”</em></p>
    </div>
  );
}
