import { useEffect, useState } from "react";
import api from ".././utils/api";

export default function ApiLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/api/admin/api-logs");
      const logsData = Array.isArray(res.data?.logs)
        ? res.data.logs
        : Array.isArray(res.data)
        ? res.data
        : [];

      setLogs(logsData);
    } catch (err) {
      console.error("Failed to load API logs:", err);

      //  Handle auth / permission errors cleanly
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("You are not authorized to view API logs.");
      } else {
        setError("Failed to load API logs.");
      }

      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
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
            {/*  LOADING */}
            {loading && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-neutral-500">
                  Loading API logs…
                </td>
              </tr>
            )}

            {/*  ERROR */}
            {!loading && error && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-red-400">
                  {error}
                </td>
              </tr>
            )}

            {/*  DATA */}
            {!loading &&
              !error &&
              logs.map((log) => (
                <tr
                  key={log._id}
                  className="border-t border-neutral-800 hover:bg-neutral-800/40 transition"
                >
                  <td className="p-4 text-neutral-200">
                    {log.userId?.email || "System"}
                  </td>

                  <td className="p-4 font-mono text-neutral-300">
                    {log.endpoint || "-"}
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        log.method === "GET"
                          ? "bg-blue-500/10 text-blue-400"
                          : log.method === "POST"
                          ? "bg-green-500/10 text-green-400"
                          : log.method === "DELETE"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-orange-500/10 text-orange-400"
                      }`}
                    >
                      {log.method || "-"}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <span className="px-3 py-1 rounded-md bg-orange-500/10 text-orange-400 font-medium">
                      {log.tokensUsed ?? 0}
                    </span>
                  </td>

                  <td className="p-4 text-neutral-400">
                    {log.createdAt
                      ? new Date(log.createdAt).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}

            {/* EMPTY */}
            {!loading && !error && logs.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-neutral-500">
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
