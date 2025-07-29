import { useEffect, useState } from 'react';
import { getAllEnterprises } from '../../../service/interprise';
import { uploadDocument } from '../../../service/document';


const CreateDocumentPage = () => {
  const [enterprises, setEnterprises] = useState([]);
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState('');
  const [docName, setDocName] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const response = await getAllEnterprises();
        setEnterprises(response);
      } catch (err) {
      }
    })();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEnterpriseId || !docName || !file) {
      return alert('Please fill all fields.');
    }
    const formData = new FormData();
    formData.append('name', docName);
    formData.append('enterpriseId', selectedEnterpriseId);
    formData.append('file', file);
    try {
      setLoading(true);
      await uploadDocument(formData);
      alert('Document uploaded successfully!');
      setDocName('');
      setFile(null);
      setSelectedEnterpriseId('');
    } catch (err) {
      alert('Upload failed: ' + (err?.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };
    return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow mt-10">
      <h2 className="text-xl font-bold mb-6">Upload Document</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
         <div>
      <label className="block font-medium mb-1">Enterprise</label>
      <select
        value={selectedEnterpriseId}
        onChange={(e) => setSelectedEnterpriseId(e.target.value)}
        className="w-full border p-2 rounded"
        required
      >
        <option value="">Select enterprise</option>
        {enterprises.map((e) => (
          <option key={e._id} value={e._id}>
            {e.name}
          </option>
        ))}
      </select>
    </div>
        <div>
          <label className="block font-medium mb-1">Document Name</label>
          <input
            type="text"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">PDF File</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Document'}
        </button>
      </form>
    </div>
  );
};

export default CreateDocumentPage;
