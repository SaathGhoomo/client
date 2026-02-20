import { useState } from "react";
import api from "./api/axios";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const testApi = async () => {
    try {
      setLoading(true);
      setError("");
      setData(null);

      const res = await api.post("/test", {
        name: "Frontend Test",
        message: "API Connected",
      });

      setData(res.data);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "API request failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Inter, system-ui, Arial" }}>
      <h2>SaathGhoomo API Connection Test</h2>
      <p>
        Base URL: <code>{import.meta.env.VITE_API_URL}</code>
      </p>

      <button onClick={testApi} disabled={loading} style={{ padding: "10px 14px", cursor: "pointer" }}>
        {loading ? "Calling API..." : "POST /test"}
      </button>

      {error ? (
        <div style={{ marginTop: 16, color: "crimson" }}>
          <strong>Error:</strong> {error}
        </div>
      ) : null}

      {data ? (
        <pre style={{ marginTop: 16, background: "#111", color: "#0f0", padding: 12, borderRadius: 8 }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}

