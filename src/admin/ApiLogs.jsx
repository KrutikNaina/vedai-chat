// vedai-landing/src/admin/ApiLogs.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function ApiLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:5000/api/admin/api-logs", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setLogs(res.data.logs));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-orange-500 mb-6">
        API Usage Logs
      </h1>

      <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-800 text-neutral-400">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Endpoint</th>
              <th className="p-4 text-center">Method</th>
              <th className="p-4 text-center">Tokens</th>
              <th className="p-4">Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr
                key={log._id}
                className="border-t border-neutral-800 hover:bg-neutral-800/40 transition"
              >
                {/* User */}
                <td className="p-4 text-neutral-200">
                  {log.userId?.email || "System"}
                </td>

                {/* Endpoint */}
                <td className="p-4 font-mono text-neutral-300">
                  {log.endpoint}
                </td>

                {/* Method */}
                <td className="p-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        log.method === "GET"
                          ? "bg-blue-500/10 text-blue-400"
                          : log.method === "POST"
                          ? "bg-green-500/10 text-green-400"
                          : log.method === "DELETE"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-orange-500/10 text-orange-400"
                      }`}
                  >
                    {log.method}
                  </span>
                </td>

                {/* Tokens */}
                <td className="p-4 text-center">
                  <span className="px-3 py-1 rounded-md bg-orange-500/10 text-orange-400 font-medium">
                    {log.tokensUsed}
                  </span>
                </td>

                {/* Time */}
                <td className="p-4 text-neutral-400">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}

            {logs.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="p-6 text-center text-neutral-500"
                >
                  No API logs available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
