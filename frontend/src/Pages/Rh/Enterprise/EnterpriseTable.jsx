import React, { useEffect, useState } from 'react';
import {
  getMyEnterprises,
  getAverageEnterpriseRating,
} from '../../../service/interprise';
import { FaSearch } from 'react-icons/fa';
import TopBanner from '../../../components/TopBar';
import EnterpriseInfo from './EnterpriseInfo';
import { Link, useNavigate } from 'react-router-dom';

export default function EnterprisesTable() {
  const [enterprises, setEnterprises] = useState([]);
    const [selectedEnterprise, setSelectedEnterprise] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

const handleUpdateClick = (enterpriseId) => {
  navigate(`/enterprise/update/${enterpriseId}`);
};

  const fetchEnterprises = async () => {
    setLoading(true);
    try {
      const data = await getMyEnterprises();
      setEnterprises(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const rating = await getAverageEnterpriseRating();
      setAverageRating(rating);
    } catch (err) {
        setError(err);
    }
  };
  

    const handleCloseInfo = () => setSelectedEnterprise(null);

  useEffect(() => {
    fetchEnterprises();
    fetchAverageRating();
  }, []);

 return (
    <>
    <TopBanner/>
  <div className="bg-white w-full min-h-screen px-12 py-12 rounded-lg shadow-md space-y-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">My Enterprises</h2>
      <div className="w-96 border border-zinc-300 rounded-full h-11 flex items-center justify-center">
        <input
          type="text"
          placeholder="Search enterprises..."
          className="flex-1 h-full rounded-full outline-none border-none bg-white px-4"
        />
        <button className="px-4 h-full flex items-center justify-center text-base text-zinc-600 border-l border-zinc-300">
          <FaSearch />
        </button>
      </div>
    </div>

    <div className="overflow-x-auto rounded-lg shadow-xl border border-gray-200">
      <table className="table w-full text-base bg-white">
        <thead className="bg-gradient-to-l from-cyan-900 to-sky-500 text-white shadow-md">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">#</th>
            <th className="px-4 py-3 text-left font-semibold">Name</th>
            <th className="px-4 py-3 text-left font-semibold">Sector</th>
            <th className="px-4 py-3 text-left font-semibold">Rating</th>
            <th className="px-4 py-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {enterprises.map((enterprise, index) => (
            <tr key={enterprise._id} className="hover:bg-gray-50 border-b border-gray-100">

              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3 font-semibold">{enterprise.name}</td>
              <td className="px-4 py-3">{enterprise.secteur}</td>
              <td className="px-4 py-3">
                {enterprise.rating || 'N/A'}
              </td>
              <td className="px-4 py-3">
  <div className="flex gap-2 flex-wrap">
    <button className="btn btn-sm btn-outline btn-info hover:bg-info hover:text-white">
  <Link to={`/Enterprise-info/${enterprise._id}`}>View Info</Link>
</button>

    <button
  className="btn btn-sm btn-outline btn-warning hover:bg-warning hover:text-white"
  onClick={() => handleUpdateClick(enterprise._id)}
>
  Update
</button>
    
  </div>

  {loading && <div>Loading enterprise info...</div>}

  {selectedEnterprise && !loading && (
    <div className="mt-6 p-6 border rounded shadow bg-white relative">
      <button
        onClick={handleCloseInfo}
        className="absolute top-2 right-2 btn btn-sm btn-error"
      >
        Close
      </button>
      <EnterpriseInfo enterprise={selectedEnterprise} />
    </div>
  )}
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="flex justify-between items-center mt-4">
      <span className="text-sm text-gray-600">Showing {enterprises.length} enterprises</span>
      {/* Optional: Pagination controls */}
    </div>
  </div>
  </>
);

}
