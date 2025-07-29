import { useEffect, useState, useMemo } from 'react';
import { getEnterprises } from '../../service/interprise';
import TopBanner from '../../components/TopBar';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiEye, FiBriefcase, FiCheck, FiX } from "react-icons/fi";

export default function EnterpriseList() {
  const [enterprises, setEnterprises] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { findAllEnterprise } = await getEnterprises();
        setEnterprises(findAllEnterprise || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!search) return enterprises;
    const q = search.toLowerCase();
    return enterprises.filter(
      e =>
        e.name?.toLowerCase().includes(q) ||
        e.secteur?.toLowerCase().includes(q)
    );
  }, [enterprises, search]);

  return (
    <>
      <TopBanner />
     <div className="p-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <FiBriefcase className="text-blue-600" size={24} />
          Liste des entreprises
        </h2>
      </div>

      <div className="relative mb-6 max-w-md">
        <FiSearch className="absolute top-3 left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par nom ou secteur..."
          className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-gray-500 italic">Chargement...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-sm">
            <thead className="bg-blue-100 text-blue-700">
              <tr>
                <th className="text-left px-4 py-3">Nom</th>
                <th className="text-left px-4 py-3">Secteur</th>
                <th className="text-left px-4 py-3">Actif</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr
                  key={e._id}
                  className="border-b hover:bg-blue-50 transition-all duration-200"
                >
                  <td className="px-4 py-3 text-gray-800 font-medium">{e.name}</td>
                  <td className="px-4 py-3 text-gray-600">{e.secteur}</td>
                  <td className="px-4 py-3">
                    {e.isActive ? (
                      <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                        <FiCheck /> Oui
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-500 font-medium">
                        <FiX /> Non
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/entreprises/${e._id}`)}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition font-semibold"
                    >
                      <FiEye />
                      Voir infos
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-4 text-center text-gray-500 italic">
                    Aucune entreprise trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
}