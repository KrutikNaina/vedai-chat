// Favorites.jsx
import { Star } from "lucide-react";

export default function Favorites({ saved }) {
  return (
    <div className="card">
      <h2 className="card-title flex items-center gap-2">
        <Star /> Saved Wisdom
      </h2>
      <ul>
        {saved.map((item, i) => (
          <li key={i} className="p-2 border-b">
            <em>{item}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
