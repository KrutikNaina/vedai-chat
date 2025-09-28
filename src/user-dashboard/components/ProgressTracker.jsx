ProgressTracker.jsx// ProgressTracker.jsx
import { Flame } from "lucide-react";

export default function ProgressTracker({ streak }) {
  return (
    <div className="card flex items-center justify-between">
      <h2 className="card-title flex items-center gap-2">
        <Flame /> Daily Streak
      </h2>
      <p className="text-xl font-bold">{streak} 🔥</p>
    </div>
  );
}
