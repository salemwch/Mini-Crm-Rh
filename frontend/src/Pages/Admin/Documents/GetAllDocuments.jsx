import React, { useEffect, useState } from 'react';
import { getAllDocuments, getDocumentsByName } from '../../../service/document';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
    const BACKEND_URL = process.env.REACT_APP_API_URL;

  const fetchDocuments = async () => {
    try {
    const docs = searchTerm.trim()
        ? await getDocumentsByName(searchTerm)
        : await getAllDocuments();
        console.log("docs:", docs);
        setDocuments(docs);
    } catch (error) {
        console.log("error:", error);
        console.error('Error fetching documents:', error);
    }
};

    useEffect(() => {
    fetchDocuments();
    }, []);

    const handleSearch = () => {
    fetchDocuments();
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={searchTerm}
          placeholder="Search by name..."
          className="border p-2 rounded"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      <div>
  <h3 className="text-xl font-semibold mb-2">Documents</h3>
  <ul className="space-y-3">
    {documents.map((doc) => (
      <li key={doc._id} className="bg-white p-4 rounded shadow-md border flex justify-between items-center">
        <div>
          <p className="font-medium text-gray-800">{doc.name}</p>
          <p className="text-sm text-gray-500">
            Uploaded by: {doc.uploadedBy?.name || 'Unknown'}
          </p>
        </div>
        <a
  href={`${BACKEND_URL}${doc.url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline font-medium"
        >
          View PDF
        </a>
      </li>
    ))}
  </ul>
</div>

    </div>
  );
};

export default DocumentList;
