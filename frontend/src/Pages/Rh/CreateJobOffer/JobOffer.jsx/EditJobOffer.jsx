import { useEffect, useState } from "react";
import { getJobOfferById, updateJobOffer } from "../../../../service/jobOffer";
import { useParams } from "react-router-dom";
import TopBanner from "../../../../components/TopBar";


const UpdateJobOffer = () => {
    const {id} = useParams();
  const [jobOfferData, setJobOfferData] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    expiryDate: "",
    salary: '',
    requirements: [],
    status: '',
  });

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchData = async () => {
    try {
        const response = await getJobOfferById(id);
        const jobOffer = response;
        setJobOfferData(jobOffer);
        setFormData({
        title: jobOffer.title || "",
        description: jobOffer.description || "",
        location: jobOffer.location || "",
        expiryDate: jobOffer.expiryDate ? jobOffer.expiryDate.slice(0, 10) : "",
        salary: jobOffer.salary || "",
    requirements: Array.isArray(jobOffer.requirements) ? jobOffer.requirements : [],
    status: jobOffer.status || "",

        });
    } catch (err) {
        setError("Failed to load job offer.");
    } finally {
        setLoading(false);
    }
    };
    fetchData();
}, [id]);

    const handleChange = (e) => {
    setFormData((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
    }));
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    await updateJobOffer(id, formData);
    setSuccess(true);
    } catch (err) {
    setError("Update failed.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!jobOfferData) return <p>No job offer found.</p>;

  return (
    <>
    <TopBanner/>
    
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Update Job Offer</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Job offer updated!</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 border rounded"
        />
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
         <input
          type="text"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
         <input
          type="text"
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
         <input
          type="text"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Update
        </button>
      </form>
    </div>
    </>
  );
};

export default UpdateJobOffer;
