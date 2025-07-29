import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEnterprisesById } from '../../../service/interprise';
import EnterpriseInfo from './EnterpriseInfo';
import TopBanner from '../../../components/TopBar';

const EnterpriseInfoPage = () => {
  const { id } = useParams();
  const [enterprise, setEnterprise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnterprise = async () => {
      try {
        const data = await getEnterprisesById(id);
        setEnterprise(data.findEnterpriseById || data);
        setError(null);
      } catch (err) {
        setError('Failed to load enterprise info');
      } finally {
        setLoading(false);
      }
    };

    fetchEnterprise();
  }, [id]);

  if (loading) return <p>Loading enterprise info...</p>;
  if (error) return <p>{error}</p>;
  if (!enterprise) return <p>No enterprise found</p>;

  return (
    <>
    <TopBanner/>
    <div className="max-w-4xl mx-auto p-8 mt-20 bg-white rounded-3xl shadow-md">
  <div className="flex justify-between items-center mb-4 space-x-2">
    <button 
      className="btn btn-sm btn-outline"
      onClick={() => navigate(-1)}
    >
      ← Back
    </button>

   
  </div>
  

  <EnterpriseInfo enterprise={enterprise} />
</div>
</>
  );
};

export default EnterpriseInfoPage;
