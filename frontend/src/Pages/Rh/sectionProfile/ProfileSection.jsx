import { useContext, useEffect, useState } from "react";
import TopBanner from "../../../components/TopBar";
import { getEnterpriseById } from "../../../service/Contact";
import { useParams, useSearchParams } from "react-router-dom";
import { Mail, Phone, User, Briefcase, MessageSquareHeart, MapPin, DollarSign, Clock, ShieldCheck } from "lucide-react";
import {FiBriefcase,FiMapPin,FiPhone,FiGlobe,FiStar,FiCheckCircle,FiAlertCircle,FiFileText,FiCalendar,FiFile,} from "react-icons/fi";
import { FaFilePdf, FaCalendarAlt, FaBuilding } from "react-icons/fa";
import { getJobOffersByEnterprise } from "../../../service/jobOffer";
import { format } from "date-fns";
import { getDocumentsByEnterprise } from "../../../service/document";
import { createFeedback, getFeedbacksByEnterprise } from "../../../service/feedback";
import { AuthContext } from "../../../components/AuthProvider";
import { getEnterprisesById } from "../../../service/interprise";
const ProfileSection = () => {
    const {id} = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState("profile");
    const [contactInfo, setContactInfo] = useState(null);
    const [loadingContact, setLoadingContact] = useState(true);
    const [error, setError] = useState(null);
    const [jobOffers, setJobOffers] = useState([]);
    const [loadingOffers, setLoadingOffers] = useState(true);
    const [enterpriseInfo, setEnterpriseInfo] = useState(null);
    const [loadingEnterprise, setLoadingEnterprise] = useState(true);
    const [documents, setDocuments] = useState([]);
    const [loadingDocuments, setLoadingDocuments] = useState(true);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
    const IMAGE_BASE_URL = 'http://localhost:3000/uploads/';
    const [showForm, setShowForm] = useState(false);
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5);
    const BACKEND_URL = process.env.REACT_APP_API_URL;
    const { user } = useContext(AuthContext);
    const enterpriseId = enterpriseInfo?._id;

    useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await getEnterpriseById(id);
        setContactInfo(response.data);
      } catch (error) {
        setError(error.message || "Failed to load contact info");
      } finally {
        setLoadingContact(false);
      }
    };

    if (id) fetchContact();
 
}, [id]);

  useEffect(() =>{
    const fetchJobOffers = async () =>{
      try{
        const response = await getJobOffersByEnterprise(id);
        setJobOffers(response);
      }catch(error){
        setError(error.message || "failed to load contact joboffer info ")
      }finally{
        setLoadingOffers(false);
      }
    }
    if(id) fetchJobOffers();
  }, [id]);
  useEffect(() => {
  const fetchEnterprise = async () => {
    try {
      const response = await getEnterprisesById(id);
      console.log("response:", response);
      setEnterpriseInfo(response.findEnterpriseById);
      console.log("response.findEnterpriseById:", response.findEnterpriseById);
    } catch (error) {
      setEnterpriseInfo(null);
      setError(error.message || "Failed to load enterprise info");
    } finally {
      setLoadingEnterprise(false);
    }
  };
  if (id) {
    fetchEnterprise();
  }
}, [id]);
useEffect(() => {
  const fetchDocuments = async () => {
    try {
      setLoadingDocuments(true);
      const response = await getDocumentsByEnterprise(id);
      if (response.documents) {
        setDocuments(response.documents);
      } else {
        setDocuments([]);
      }
    } catch (error) {
      console.error("Error fetching documents", error);
      setDocuments([]);
    } finally {
      setLoadingDocuments(false);
    }
  };

  if (id) fetchDocuments();
}, [id]);
const getUserImageSrc = (image) => {
  if (!image || image === 'null' || image === 'undefined') {
    return '/image/profile.png';
  }
  return `${IMAGE_BASE_URL}/${image}?v=${Date.now()}`;
};
useEffect(() => {
  const tabFromUrl = searchParams.get('tab');
  if (tabFromUrl) {
    setActiveTab(tabFromUrl);
  } else {
    setActiveTab('profile');
  }
}, [searchParams]);
useEffect(() => {
  const fetchFeedbacks = async () => {
    try {
      setLoadingFeedbacks(true);
      const response = await getFeedbacksByEnterprise(id); 
      if (Array.isArray(response)) {
        setFeedbacks(response);
      } else if (Array.isArray(response.feedbacks)) {
        setFeedbacks(response.feedbacks);
      } else {
        setFeedbacks([]);
      }
    } catch (error) {
      setFeedbacks([]);
    } finally {
      setLoadingFeedbacks(false);
    }
  };
  
  if (id) fetchFeedbacks();
}, [id]);
  const handleSubmit = async () => {
  if (!enterpriseId || !user || !user.id) {
    console.error("Missing enterpriseId or user info");
    return;
  }

  try {
    const newFeedback = {
      content,
      rating,
      isActive: true,
      enterpriseId,
    };
    const created = await createFeedback(newFeedback, user.id);

    setFeedbacks(prev => [created, ...prev]);
    setContent("");
    setRating(5);
    setShowForm(false);
  } catch (error) {
    console.error("Error creating feedback:", error);
    const errorMessage = error.response?.data?.message || "Failed to submit feedback.";
     setError(errorMessage);
  }
};
  const renderContent = () => {
    if(loadingContact) return <div>Loading Contact Info....</div>;
    if(error) return <div className="text-red-500">{error}</div>;
    if(!contactInfo) return <div>No Contact Found Yet</div>;
    switch (activeTab) {
      case "profile":
        return   <div className="px-6 py-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">📇 Contacts</h2>

      {contactInfo && contactInfo.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contactInfo.map((contact) => (
            <div
              key={contact._id}
              className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl border p-5 space-y-3"
            >
              <div className="flex items-center gap-2 text-lg font-semibold text-indigo-600">
                <User className="w-5 h-5" />
                {contact.name || "No Name"}
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4" />
                 <a className="block text-blue-500 hover:underline" href={`mailto:${contact.email}`}> <span>{contact.email || "No Email"}</span> </a>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4" />
                 <a
              href={`tel:${contact.phone}`}
              className="block text-green-500 hover:underline"
            > <span>{contact.phone || "No Phone"}</span> </a>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Briefcase className="w-4 h-4" />
                <span>{contact.position || "No Position"}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <MessageSquareHeart className="w-4 h-4" />
                <span className="bg-indigo-100 text-indigo-600 text-sm px-3 py-1 rounded-full">
                  {contact.preferedContactMethod || "Not Specified"}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic mt-4">No contacts found.</p>
      )}
    </div>
      case "document":

  return      <div className="p-4 bg-white rounded-lg shadow-md outline-none text-decoration-none max-w-3xl mx-auto">
    {loadingDocuments ? (
      <p className="text-gray-600 italic text-center">Loading documents...</p>
    ) : documents.length === 0 ? (
      <p className="text-gray-600 italic text-center">No documents available for this enterprise.</p>
    ) : (
      <ul className="space-y-4">
        {documents.map((doc) => (
          <li
            key={doc._id}
            className="flex items-center justify-between p-4 border rounded hover:shadow-lg transition-shadow  outline-none text-decoration-none duration-300"
          >
            <a
  href={`${BACKEND_URL}${doc.url}`}
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-3 text-blue-600"
>
              <FaFilePdf className="w-6 h-6 text-red-600" />
              <div>
                <p className="font-semibold text-lg">{doc.name}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt />
                    Created: {format(new Date(doc.createdAt), "PPP")}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt />
                    Updated: {format(new Date(doc.updatedAt), "PPP")}
                  </span>
                  {doc.enterpriseId?.name && (
                    <span className="flex items-center gap-1">
                      <FaBuilding />
                      {doc.enterpriseId.name}
                    </span>
                  )}
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    )}
    </div>
      case "jobOffers":
        return <div className="p-6 bg-gradient-to-br from-green-50 to-white rounded-xl">
  <h2 className="text-3xl font-extrabold mb-6 text-green-700 flex items-center gap-2">
    <Briefcase className="w-7 h-7 text-green-600" />
    Job Offers
  </h2>

  {loadingOffers ? (
    <p className="text-gray-500">Loading job offers...</p>
  ) : jobOffers.length > 0 ? (
    jobOffers.map((offer) => (
      <div
        key={offer._id}
        className="mb-6 p-6 border border-green-100 rounded-2xl shadow-md hover:shadow-xl transition duration-300 bg-white relative"
      >
        <h3 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <ShieldCheck className="text-green-500 w-5 h-5" />
          {offer.title}
        </h3>

        <p className="text-gray-600 mb-3 whitespace-pre-line">
          {offer.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
          <p className="flex items-center gap-2 text-gray-700">
            <MapPin className="w-4 h-4 text-blue-500" />
            <strong>Location:</strong> {offer.location || "Not specified"}
          </p>

          <p className="flex items-center gap-2 text-gray-700">
            <DollarSign className="w-4 h-4 text-yellow-500" />
            <strong>Salary:</strong> ${offer.salary}
          </p>

          <p className="flex items-center gap-2 text-gray-700">
            <Clock className="w-4 h-4 text-purple-500" />
            <strong>Status:</strong>{" "}
            <span
              className={`capitalize font-semibold ${
                offer.status === "open"
                  ? "text-green-600"
                  : offer.status === "paused"
                  ? "text-yellow-600"
                  : "text-red-500"
              }`}
            >
              {offer.status}
            </span>
          </p>

          {offer.expiryDate && (
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4 text-gray-400" />
              Expires on: {new Date(offer.expiryDate).toLocaleDateString()}
            </p>
          )}
        </div>

        {offer.requirements?.length > 0 && (
          <div className="mt-3">
            <p className="font-medium text-gray-800 mb-1">Requirements:</p>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              {offer.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ))
  ) : (
    <p className="text-gray-600 italic">No job offers found for this enterprise.</p>
  )}
    </div>
      case "feedbacks":
        return  <div>
  <div className="mb-4 flex justify-end">
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
      onClick={() => setShowForm(prev => !prev)}
    >
      {showForm ? "Cancel" : "+ Add Feedback"}
    </button>
  </div>

  {showForm && (
    <form
      onSubmit={e => {
        e.preventDefault();
        handleSubmit();
      }}
      className="mb-6 p-4 border rounded bg-gray-50"
    >
      <label className="block mb-2 font-semibold text-gray-700" htmlFor="content">
        Feedback:
      </label>
      <textarea
        id="content"
        className="w-full p-2 border rounded resize-y"
        rows={4}
        value={content}
        onChange={e => setContent(e.target.value)}
        required
        placeholder="Write your feedback here..."
      />

      <label className="block mt-4 mb-2 font-semibold text-gray-700" htmlFor="rating">
        Rating:
      </label>
      <select
        id="rating"
        value={rating}
        onChange={e => setRating(Number(e.target.value))}
        className="p-2 border rounded"
        required
      >
        {[5, 4, 3, 2, 1].map(num => (
          <option key={num} value={num}>
            {num} Star{num > 1 ? "s" : ""}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
      >
        Submit Feedback
      </button>
    </form>
  )}

  {loadingFeedbacks ? (
    <p>Loading feedbacks...</p>
  ) : feedbacks && feedbacks.length === 0 ? (
    <p>No feedbacks found.</p>
  ) : (
    <ul className="space-y-4">
      {feedbacks.map(fb => (
        <li
          key={fb._id}
          className="p-4 bg-gray-100 rounded-lg shadow flex items-center gap-4"
        >
          <img
            src={getUserImageSrc(fb.user?.image)}
            alt={fb.user?.name || "User"}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="text-lg font-semibold text-gray-800">"{fb.content}"</p>
            <p className="text-yellow-500">⭐ Rating: {fb.rating}</p>
            <p className="text-sm text-gray-500">
              By <strong>{fb.user?.name || "Unknown"}</strong> (
              {fb.user?.role || "N/A"}) on{" "}
              {new Date(fb.createdAt).toLocaleDateString()}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )}
    </div>
      case "enterpriseInfo":
  return (
  <div className="p-6 bg-gradient-to-br from-sky-50 to-white rounded-xl shadow-md mx-auto max-w-4xl">
    <h2 className="text-3xl font-extrabold text-blue-700 mb-6 flex items-center gap-3">
      <FiBriefcase className="text-blue-600 w-8 h-8" />
      Enterprise Details
    </h2>
    {loadingEnterprise ? (
      <p className="text-gray-500">Loading enterprise information...</p>
    ) : enterpriseInfo ? ( 
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {enterpriseInfo.name} 
          </h3>
          <p className="text-gray-600 italic flex items-center gap-2">
            <FiBriefcase className="text-gray-500" />
            Sector: {enterpriseInfo.secteur} 
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <p className="flex items-center gap-2">
            <FiMapPin className="text-blue-500" />
            <strong>Address:</strong> {enterpriseInfo.address} 
          </p>
          {enterpriseInfo.phone && (
            <p className="flex items-center gap-2">
              <FiPhone className="text-blue-500" />
              <strong>Phone:</strong>{" "}
              <a
                href={`tel:${enterpriseInfo.phone}`} 
                className="text-blue-600 hover:underline"
              >
                {enterpriseInfo.phone} 
              </a>
            </p>
          )}
          {enterpriseInfo.website && (
            <p className="flex items-center gap-2">
              <FiGlobe className="text-blue-500" />
              <strong>Website:</strong>{" "}
              <a
                href={
                  enterpriseInfo.website.startsWith("http") 
                    ? enterpriseInfo.website
                    : `https://${enterpriseInfo.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {enterpriseInfo.website} 
              </a>
            </p>
          )}
          {enterpriseInfo.rating && (
            <p className="flex items-center gap-2">
              <FiStar className="text-yellow-400" />
              <strong>Rating:</strong> {enterpriseInfo.rating} / 5 
            </p>
          )}
          {enterpriseInfo.industryCode && (
            <p className="flex items-center gap-2">
              <FiFile className="text-blue-500" />
              <strong>Industry Code:</strong> {enterpriseInfo.industryCode} 
            </p>
          )}
          {enterpriseInfo.createdAt && (
            <p className="flex items-center gap-2">
              <FiCalendar className="text-blue-500" />
              <strong>Created At:</strong>{" "}
              {format(new Date(enterpriseInfo.createdAt), "PPP")} 
            </p>
          )}
          <p className="flex items-center gap-2">
            <strong>Status:</strong>
            {enterpriseInfo.isApproved ? ( 
              <span className="font-medium text-green-600 flex items-center gap-1">
                <FiCheckCircle /> Approved
              </span>
            ) : (
              <span className="font-medium text-yellow-600 flex items-center gap-1">
                <FiAlertCircle /> Pending Approval
              </span>
            )}
          </p>
        </div>
        {enterpriseInfo.notes && ( 
          <div className="bg-gray-50 border-l-4 border-blue-200 p-4 rounded-md">
            <p className="text-gray-700 whitespace-pre-line flex gap-2">
              <FiFileText className="text-blue-500 mt-1" />
              <span>
                <strong>Notes:</strong>
                <br />
                {enterpriseInfo.notes}
              </span>
            </p>
          </div>
        )}
      </div>
    ) : (
      <p className="text-gray-500 italic">No enterprise information available.</p>
    )}
  </div>
);
      default:
        return <div>No added information yet</div>;
    }
  };
  const tabButton = (label, tabKey) => (
    <button
      onClick={() => {
        setActiveTab(tabKey);
        setSearchParams({ tab: tabKey });
      }}
      className={`px-4 py-2 border-b-2 transition font-medium ${
        activeTab === tabKey
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-600"
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
    <TopBanner/>
    <div className="p-6">
      <div className="flex gap-4 border-b mb-6">
        {tabButton("Profile", "profile")}
        {tabButton("Job Offers", "jobOffers")}
        {tabButton("Enterprise Info", "enterpriseInfo")}
        {tabButton("Documents", "document")}
        {tabButton("Feedbacks", "feedbacks")}

      </div>

      <div className="bg-white p-6 rounded-xl shadow border min-h-[200px]">
        {renderContent()}
      </div>
    </div>
    </>
  );
};

export default ProfileSection;
