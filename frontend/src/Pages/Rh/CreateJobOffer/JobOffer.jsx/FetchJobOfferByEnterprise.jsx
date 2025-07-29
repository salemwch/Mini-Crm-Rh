import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { deleteJobOffer, getJobOffersByEnterprise } from "../../../../service/jobOffer";
import TopBanner from "../../../../components/TopBar";

const JobOfferByEnterprise= () =>{
    const {id} = useParams();
    const navigate = useNavigate();
    const [jobOffer, setJobOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() =>{

        const fetchJobOffer = async () =>{

            try{
                const offers = await getJobOffersByEnterprise(id);
                setJobOffers(offers);
            }catch(error){
                setError("failed to load jobOffer info");
                console.error(error);
            }finally{
                setLoading(false);
            }
        }

        fetchJobOffer();
    }, [id]);

    if(loading) return <p>Loading job Offers</p>;
    if(error) return <p className="text-red-600"> {error} </p>


    const handleDelete = async (id) => {
  if (!window.confirm('Are you sure you want to delete this job offer?')) return;

  try {
    await deleteJobOffer(id);
    setJobOffers((prev) => prev.filter((job) => job._id !== id));
  } catch (error) {
    console.error('Failed to delete job offer:', error);
    setError('Failed to delete job offer. Try again.');
  }
};



     return (
        <>
        <TopBanner/>
    <div className="max-w-5xl mx-auto p-6 mt-20 bg-white rounded-xl shadow-md">
      <button
        onClick={() => navigate(-1)}
        className="btn btn-sm btn-outline mb-4"
      >
        ← Back
      </button>
      <h2 className="text-2xl font-bold text-sky-800 mb-4">
        Job Offers by Enterprise
      </h2>

      {jobOffer.length === 0 ? (
  <p className="text-gray-500">No job offers found for this enterprise.</p>
) : (
  <div className="grid gap-6">
    {jobOffer.map((offer) => (
      <div key={offer._id} className="border p-6 rounded-lg shadow-sm bg-white">
        <h3 className="text-xl font-bold text-gray-900">{offer.title}</h3>
        <p className="text-gray-700 mb-2">{offer.description}</p>
        
        <div className="text-sm text-gray-600 mb-2">
          <strong>Posted:</strong> {new Date(offer.createdAt).toLocaleDateString()}
        </div>

        {offer.expiryDate && (
  <div className="text-sm text-gray-600 mb-2">
    <strong>Expires:</strong> {new Date(offer.expiryDate).toLocaleDateString()}
  </div>
)}

        
        <div className="text-sm text-gray-600 mb-2">
          <strong>Location:</strong> {offer.location || 'N/A'}
        </div>
        
        <div className="text-sm text-gray-600 mb-2">
          <strong>Salary:</strong> {offer.salary.toLocaleString()} {offer.salary ? 'USD' : ''}
        </div>
        
        <div className="text-sm text-gray-600 mb-2">
          <strong>Status:</strong> <span className={`capitalize ${offer.status === 'open' ? 'text-green-600' : 'text-red-600'}`}>
            {offer.status}
          </span>
        </div>

        <div className="mb-2">
          <strong>Requirements:</strong>
          <ul className="list-disc list-inside text-gray-700">
            {offer.requirements && offer.requirements.length > 0 ? (
              offer.requirements.map((req, idx) => <li key={idx}>{req}</li>)
            ) : (
              <li>No specific requirements listed</li>
            )}
          </ul>
        </div>
        <div className="text-sm text-gray-500">
          <strong>Views:</strong> {offer.viewCount}
        </div>


<div className="flex gap-2 mt-4">
  <button
  onClick={() => navigate(`/edit-job-offer/${offer._id}`)}
  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
>
  Edit
</button>

  <button
    onClick={() => handleDelete(offer._id)}
    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
  >
    Delete
  </button>
</div>

       
      </div>
    ))}
  </div>
)}

    </div>
    </>
  );
}


export default JobOfferByEnterprise;