import { FaLink, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import TopBanner from "../../../components/TopBar";
import { useNavigate } from "react-router-dom";

const EnterpriseInfo = ({ enterprise }) => {
  const navigate = useNavigate();

  if (!enterprise) return console.log(enterprise);

  return (
    <>
    <TopBanner/>
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-sky-800">{enterprise?.name}</h2>
            {console.log(enterprise.name)}

      <div className="flex items-center justify-between">
        <span
          className={`px-3 py-1 text-sm font-semibold rounded-full ${
            enterprise.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {enterprise.isApproved ? 'Approved' : 'Pending Approval'}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4 text-gray-700">
        <p><FaMapMarkerAlt className="inline-block mr-2 text-sky-600" /> Address: {enterprise?.address}</p>
        {console.log(enterprise.address)}
        <p><FaPhone className="inline-block mr-2 text-sky-600" /> Phone: {enterprise.phone}</p>
        <p><FaLink className="inline-block mr-2 text-sky-600" /> Website: <a href={enterprise.website} target="_blank" rel="noreferrer" className="underline text-blue-600">{enterprise.website}</a></p>
        <p>  Industry Code: {enterprise.industryCode}</p>
        <p>Secteur: {enterprise.secteur}</p>
        <p>Rating: <span className="font-semibold text-yellow-600">{enterprise.rating || 0} / 5</span></p>
      </div>

      {enterprise.notes && (
        <div className="text-gray-600 italic border-t pt-3">
          <strong>Notes:</strong> {enterprise.notes}
        </div>
      )}

        <div className=" flex flex-row justify-around pt-6">
        <button onClick={() => navigate(`/job-offer/by-enterprise/${enterprise._id}`)}
         className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow">
          Viw Job Offers By This Enterprise
        </button>
         <button 
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow"
              onClick={() => navigate(`/contacts/create?enterpriseId=${enterprise._id}`)
        }
            >
              ➕ Add Contact
            </button>

        </div>
    </div>
    </>
  );
};

export default EnterpriseInfo;
