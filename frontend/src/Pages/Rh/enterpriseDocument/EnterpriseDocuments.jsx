import { useEffect, useState } from "react";
import { getDocumentsByEnterprise } from "../../../service/document";

function EnterpriseDocuments({ enterpriseId }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDocs() {
      try {
        const data = await getDocumentsByEnterprise(enterpriseId);
        console.log(data);
        setDocuments(data.documents || []);
      } catch (err) {
        setError(err.message || 'Failed to load documents');
      } finally {
        setLoading(false);
      }
    }
    if (enterpriseId) fetchDocs();
  }, [enterpriseId]);

  if (loading) return <p>Loading documents...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (documents.length === 0) return <p>No documents found for this enterprise.</p>;

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div key={doc._id} className="p-3 border rounded shadow-sm flex items-center justify-between">
          <div>
            <p className="font-semibold">{doc.name}</p>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View PDF
            </a>
          </div>
          <div className="text-gray-500 text-sm">Uploaded on: {new Date(doc.createdAt).toLocaleDateString()}</div>
        </div>
      ))}
    </div>
  );
}
export default EnterpriseDocuments;