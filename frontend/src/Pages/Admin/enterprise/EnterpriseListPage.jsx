import { useEffect, useState } from "react";
import { getAllEnterprises } from "../../../service/interprise";
import EnterpriseTable from "./EnterpriseTable";
import { BarChart } from "lucide-react";


const EnterpriseListPage = () => {
  const [enterprises, setEnterprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnterprises = async () => {
      try {
        const data = await getAllEnterprises();
        setEnterprises(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch enterprises.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnterprises();
  }, []);

  if (loading) return <p className="p-4"> Loading enterprises...</p>;
  if (error) return <p className="p-4 text-red-500">❌ {error}</p>;

  return (
    <div className="p-6">
<h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
  <BarChart className="w-6 h-6 text-blue-600" />
  All Enterprises
</h1>      <EnterpriseTable enterprises={enterprises} />
    </div>
  );
};

export default EnterpriseListPage;
