import React, { useEffect, useState,   useContext, useMemo } from 'react';
import { debounce } from 'lodash';
import { fetchAuditLogs, getAllAuditLogs } from '../../../service/auditLog';
import { AuthContext } from '../../../components/AuthProvider';

const AuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [searchAction, setSearchAction] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadAllLogs();
  }, []);
  const loadAllLogs = async () => {
    try {
      setLoading(true);
      const data = await getAllAuditLogs();
      setAuditLogs(data);
    } catch (err) {
      console.error('Error loading logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useMemo(() => 
  debounce(async (value) => {
    try {
      const filters = {};
      if (value.trim()) {
        filters.action = value.trim();
        const data = await fetchAuditLogs(filters);
        console.log("data:", data);
        setAuditLogs(data);
      } else {
        loadAllLogs(); // Make sure this function is memoized or stable
      }
    } catch (err) {
      console.error('Error fetching filtered logs:', err);
    }
  }, 400),
[], // ← only empty if no dependencies inside the callback
);


  const handleSearchChange = (e) => {
  const value = e.target.value;
  setSearchAction(value);
  if (!value.trim()) {
    loadAllLogs();
  }
  debouncedSearch(value);
};
useEffect(() => {
  return () => {
    debouncedSearch.cancel();
  };
}, [debouncedSearch]);


  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-4">Audit Logs</h2>

      <div className="mb-4">
        <input
  type="text"
  placeholder="Search by action..."
  value={searchAction}
  onChange={handleSearchChange}
  className="border border-gray-300 px-4 py-2 rounded w-full max-w-md"
/>
{console.log("search Action :", searchAction)}
      </div>

      {loading ? (
        <p className="text-gray-600">Loading audit logs...</p>
      ) : auditLogs.length === 0 ? (
        <p className="text-gray-500">No audit logs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Action</th>
                <th className="px-4 py-2 text-left">Entity</th>
                <th className="px-4 py-2 text-left">IP</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log._id} className="border-t">
                  <td className="px-4 py-2">{log.userId?.name || 'Unknown'}</td>
                  <td className="px-4 py-2">{log.action}</td>
                  <td className="px-4 py-2">{log.entityType || '-'}</td>
                  <td className="px-4 py-2">{log.ipAdress || '-'}</td>
                  <td className="px-4 py-2">{log.description}</td>
                  <td className="px-4 py-2">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
