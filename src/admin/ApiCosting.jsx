// vedai-landing\src\admin\ApiCosting.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function ApiCosting() {
  const [cost, setCost] = useState({ tokens: 0, cost: 0 });

  useEffect(() => {
    axios.get("http://localhost:5000/api/chat/stats").then((res) => {
      const tokens = res.data.totalTokens;
      const price = 0.002; // example ₹ cost per 1000 tokens
      setCost({
        tokens,
        cost: ((tokens / 1000) * price).toFixed(2),
      });
    });
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold text-orange-500 mb-6">API Cost Tracking</h1>

      <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 w-80">
        <p>Total Tokens Used: {cost.tokens}</p>
        <p>Total Cost (₹): {cost.cost}</p>
      </div>
    </div>
  );
}
