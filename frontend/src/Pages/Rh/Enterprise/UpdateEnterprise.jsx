import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEnterprisesById, updateEnterprise } from "../../../service/interprise";
import {BuildingOfficeIcon,GlobeAltIcon,MapPinIcon,PhoneIcon,StarIcon,PencilIcon,ClipboardDocumentIcon,DocumentTextIcon,InboxStackIcon
} from "@heroicons/react/24/outline";
  const UpdateEnterprise = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    secteur: "",
    address: "",
    website: "",
    industryCode: "",
    notes: "",
    rating: 0,
    documents: [],
    phone: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchEnterprise = async () => {
      try {
        const response = await getEnterprisesById(id);
        if (response.findEnterpriseById) {
          setFormData(response.findEnterpriseById);
        }
      } catch (err) {
        setError("Failed to load enterprise data");
      } finally {
        setLoading(false);
      }
    };

    fetchEnterprise();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const {
      name,
      secteur,
      address,
      website,
      industryCode,
      notes,
      rating,
      documents,
      phone,
      isActive
    } = formData;

    const updatePayload = {
      name,
      secteur,
      address,
      website,
      industryCode,
      notes,
      rating: Number(rating),
      documents,
      phone,
      isActive
    };

    await updateEnterprise(id, updatePayload);
    navigate(`/Enterprise-info/${id}`);
  } catch (err) {
    setError("Update failed");
    console.error(err);
  }
};
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
 return (
  <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl mt-10">
  <h2 className="text-3xl font-bold text-blue-600 mb-6 flex items-center gap-2">
    <PencilIcon className="h-6 w-6 text-blue-500" />
    Update Enterprise
  </h2>

  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <div className="relative">
        <BuildingOfficeIcon className="h-5 w-5 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enterprise Name"
          className=" border border-gray-300 rounded-md input input-bordered w-full pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="relative">
        <ClipboardDocumentIcon className="h-5 w-5 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          name="secteur"
          value={formData.secteur}
          onChange={handleChange}
          placeholder="Sector"
          className=" border border-gray-300 rounded-md input input-bordered w-full pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="relative">
        <MapPinIcon className="h-5 w-5 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className=" border border-gray-300 rounded-md input input-bordered w-full pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="relative">
        <GlobeAltIcon className="h-5 w-5 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleChange}
          placeholder="Website"
          className=" border border-gray-300 rounded-md input input-bordered w-full pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="relative">
        <InboxStackIcon className="h-5 w-5 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          name="industryCode"
          value={formData.industryCode}
          onChange={handleChange}
          placeholder="Industry Code"
          className=" border border-gray-300 rounded-md input input-bordered w-full pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="relative">
        <DocumentTextIcon className="h-5 w-5 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notes"
          className=" border border-gray-300 rounded-md input input-bordered w-full pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="relative">
        <StarIcon className="h-5 w-5 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        <input
          type="number"
          name="rating"
          min="0"
          max="5"
          value={formData.rating}
          onChange={handleChange}
          placeholder="Rating"
          className=" border border-gray-300 rounded-md input input-bordered w-full pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="relative">
        <PhoneIcon className="h-5 w-5 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className=" border border-gray-300 rounded-md input input-bordered w-full pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="md:col-span-2 flex justify-end">
        <button type="submit" className="btn btn-primary w-full md:w-auto">
          Update Enterprise
        </button>
      </div>

    </form>
  </div>
);

};
export default UpdateEnterprise;
