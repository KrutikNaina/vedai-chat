// vedai-landing\src\admin\Katha\ViewKatha.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function ViewKatha() {
  const { id } = useParams();
  const [katha, setKatha] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/ekatha/${id}`).then((res) => {
      setKatha(res.data);
    });
  }, []);

  if (!katha) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-orange-500 mb-2">
        {katha.title}
      </h1>
      <p className="text-neutral-400 mb-4">{katha.description}</p>

      {katha.image && (
        <img
          src={katha.image}
          alt=""
          className="rounded-xl mb-6 max-w-xl"
        />
      )}

      <div className="space-y-6">
        {katha.steps.map((s, i) => (
          <div
            key={s._id}
            className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl"
          >
            <h2 className="font-semibold text-orange-400">
              Step {i + 1}
            </h2>

            <p className="mt-2">{s.text}</p>

            {s.mantra && (
              <p className="mt-2 text-green-400">
                🕉 {s.mantra}
              </p>
            )}

            {s.meaning && (
              <p className="text-neutral-400 mt-1">{s.meaning}</p>
            )}

            {s.audioUrl && (
              <audio controls className="mt-2 w-full">
                <source src={s.audioUrl} />
              </audio>
            )}

            {s.videoUrl && (
              <video controls className="mt-2 w-full rounded">
                <source src={s.videoUrl} />
              </video>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
