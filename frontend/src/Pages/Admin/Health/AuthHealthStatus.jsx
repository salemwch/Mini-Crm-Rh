import { useEffect, useState } from "react";
import { getAuthServiceHealth } from "../../../service/auth";

const AuthHealthStatus = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      const data = await getAuthServiceHealth();
      setHealth(data);
      setLoading(false);
    };

    fetchHealth();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-xl shadow text-sm text-zinc-500">
        Checking Auth Service Health...
      </div>
    );
  }

  if (health.status === "error") {
    return (
      <div className="bg-white p-4 rounded-xl shadow text-red-600 text-sm">
         AuthService is unreachable
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow text-sm text-zinc-800">
      <h2 className="text-base font-semibold mb-2"> Auth Service Status</h2>
      <p> Status: {health.status}</p>
      <p> Database: {health.database}</p>
      <p> Checked: {new Date(health.timestamp).toLocaleString()}</p>
    </div>
  );
};

export default AuthHealthStatus;
