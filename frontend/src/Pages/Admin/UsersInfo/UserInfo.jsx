import React, { useEffect, useState } from "react";
import { getEnterpriseByUserId, getUserById } from "../../../service/user";
import { getJobOffersByEnterprise } from "../../../service/jobOffer";
import { getDocumentsByEnterprise } from "../../../service/document";
import { getEnterprisesWithFeedbacks } from "../../../service/interprise";
import { getEnterprisesWithContacts } from "../../../service/Contact";
import { useParams } from "react-router-dom";
import { FaUser, FaEnvelope, FaUserTag, FaCalendarAlt, FaSyncAlt, FaEye, FaBuilding, FaIndustry, FaMapMarkerAlt, FaPhoneAlt, FaStar } from 'react-icons/fa';
import { Briefcase, MapPin, CalendarDays, Eye, DollarSign, Clock } from 'lucide-react';

const TABS = [
  "Personal Info",
  "Enterprises",
  "Job Offers",
  "Feedbacks",
  "Documents",
  "Contacts",
];

const Profile = () => {
      const IMAGE_BASE_URL = 'http://localhost:3000/uploads/';

    const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [user, setUser] = useState(null);
  const [enterprises, setEnterprises] = useState([]);
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState(null);

  const [jobOffers, setJobOffers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
  const fetchUserAndEnterprises = async () => {
    try {
      setLoading(true);
      const user = await getUserById(id);
      console.log("Fetched user:", user);
      setUser(user);

      try {
        const userEnterprises = await getEnterpriseByUserId(id);
console.log("Fetched enterprises:", userEnterprises);
const enterpriseArray = Array.isArray(userEnterprises)
  ? userEnterprises
  : [userEnterprises];

setEnterprises(enterpriseArray);
console.log("user enterprises:", enterpriseArray);

if (enterpriseArray.length > 0) {
  setSelectedEnterpriseId(enterpriseArray[0]._id);
}
      } catch (enterpriseError) {
        console.log("enterprisesError:", enterpriseError);
        console.warn("Enterprise fetch failed (maybe none exist):", enterpriseError);
        setEnterprises([]);
      }
      setError(null);
    } catch (err) {
      console.error("Error loading user data", err);
      setError("Failed to load user profile.");
    } finally {
      setLoading(false);
    }
  };
  fetchUserAndEnterprises();
}, [id]);
useEffect(() => {
  console.log("Enterprises state updated:", enterprises);
}, [enterprises]);
  useEffect(() => {
    if (!selectedEnterpriseId) return;
    const fetchJobOffersAndDocuments = async () => {
      try {
        setLoading(true);
        const [jobs, docs] = await Promise.all([
          getJobOffersByEnterprise(selectedEnterpriseId),
          getDocumentsByEnterprise(selectedEnterpriseId),
        ]);
        setJobOffers(jobs);
        setDocuments(docs);
        setError(null);
      } catch (err) {
        setError(err.message || "Error loading enterprise data");
      } finally {
        setLoading(false);
      }
    };
    fetchJobOffersAndDocuments();
  }, [selectedEnterpriseId]);
  useEffect(() => {
    const fetchFeedbacksAndContacts = async () => {
      try {
        setLoading(true);
        const [fbs, cts] = await Promise.all([
          getEnterprisesWithFeedbacks(),
          getEnterprisesWithContacts(),
        ]);
        setFeedbacks(fbs);
        setContacts(cts);
        setError(null);
      } catch (err) {
        setError(err.message || "Error loading feedbacks or contacts");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacksAndContacts();
  }, []);
  const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
};
  const renderPersonalInfo = () => {
  if (!user) {
    return (
      <div className="text-center text-gray-500 py-4">
        Loading user info...
      </div>
    );
  }
  const getUserImageSrc = (image) => {
    if (!image || image === 'null' || image === 'undefined') {
      return '/image/Profile.png';
    }
    return `${IMAGE_BASE_URL}${image}?v=${Date.now()}`;
  };
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 max-w-md mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">User Info</h3>

      <ul className="space-y-4 text-gray-700">
        {user.image && (
          <li className="flex items-center space-x-3">
            <img
              src={ getUserImageSrc(user?.image)}
              alt={`${user.name || 'User'}'s avatar`}
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-400"
            />
            <span className="text-gray-600">Profile Picture</span>
          </li>
        )}
        <li className="flex items-center space-x-3">
          <FaUser className="text-blue-500" />
          <span><strong>Name:</strong> {user.name || 'N/A'}</span>
        </li>

        <li className="flex items-center space-x-3">
          <FaEnvelope className="text-green-500" />
          <span><strong>Email:</strong> {user.email || 'N/A'}</span>
        </li>

        <li className="flex items-center space-x-3">
          <FaUserTag className="text-purple-500" />
          <span><strong>Role:</strong> {user.role || 'N/A'}</span>
        </li>

        

        <li className="flex items-center space-x-3">
          <FaCalendarAlt className="text-yellow-500" />
          <span><strong>Created At:</strong> {formatDate(user.createdAt)}</span>
        </li>

        <li className="flex items-center space-x-3">
          <FaSyncAlt className="text-indigo-500" />
          <span><strong>Updated At:</strong> {formatDate(user.updatedAt)}</span>
        </li>

        <li className="flex items-center space-x-3">
          <FaEye className="text-red-500" />
          <span><strong>Last Seen:</strong> {formatDate(user.lastSeen)}</span>
        </li>
      </ul>
    </div>
  );
};
  const renderEnterprises = () => (
        <div className="bg-white p-6 rounded-xl shadow-md">
  <h3 className="font-semibold text-2xl text-gray-800 mb-4"> Enterprises</h3>

  {Array.isArray(enterprises) && enterprises.length ? (
    <ul className="space-y-4">
      {enterprises.map((ent) => (
        <li
          key={ent._id}
          onClick={() => setSelectedEnterpriseId(ent._id)}
          className={`p-4 rounded-lg cursor-pointer border transition-all duration-200 ${
            ent._id === selectedEnterpriseId
              ? 'border-blue-500 bg-blue-50 shadow'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaBuilding className="text-blue-500" />
              {ent.name || ent.title || ent._id}
            </h4>
          </div>
          <div className="mt-2 text-sm text-gray-600 space-y-1">
            {ent.secteur && (
              <p className="flex items-center gap-2">
                <FaIndustry className="text-gray-500" />
                Secteur: {ent.secteur}
              </p>
            )}
            {ent.address && (
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-500" />
                Address: {ent.address}
              </p>
            )}
            {ent.industryCode && (
              <p className="flex items-center gap-2">
                <FaIndustry className="text-gray-500" />
                Code: {ent.industryCode}
              </p>
            )}
            {ent.phone && (
              <p className="flex items-center gap-2">
                <FaPhoneAlt className="text-gray-500" />
                Phone: {ent.phone}
              </p>
            )}
            {ent.rating && (
              <p className="flex items-center gap-2">
                <FaStar className="text-yellow-500" />
                Rating: {ent.rating}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500 italic">No enterprises found.</p>
  )}
</div>

  );
  const renderJobOffers = () => (
    <div className="mt-6">
  <h3 className="text-2xl font-bold text-gray-800 mb-4">📄 Job Offers</h3>

  {jobOffers.length ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {jobOffers.map((job) => (
        <div
          key={job._id}
          className="bg-white shadow-md rounded-2xl p-5 border hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-3">
            <Briefcase className="text-blue-600" />
            <h4 className="text-xl font-semibold text-gray-900">{job.title}</h4>
          </div>

          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-500" />
              <span>{job.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-yellow-500" />
              <span>{job.salary}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" />
              <span>Status: {job.status}</span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-blue-400" />
              <span>Created: {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-red-500" />
              <span>Expires: {new Date(job.expiryDate).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-600" />
              <span>Views: {job.viewCount}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500 italic">No job offers found for this enterprise.</p>
  )}
</div>

  );
  const renderFeedbacks = () => (
    <div>
      <h3 className="font-semibold text-xl mb-2">Feedbacks</h3>
      {feedbacks.length ? (
        <ul className="space-y-2">
          {feedbacks.map((fb) => (
            <li key={fb._id} className="border rounded p-3">
              <p><strong>Enterprise:</strong> {fb.enterpriseName || fb.enterpriseId}</p>
              <p><strong>Feedback:</strong> {fb.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No feedbacks available.</p>
      )}
    </div>
  );
  const renderDocuments = () => (
    <div>
      <h3 className="font-semibold text-xl mb-2">Documents</h3>
      {documents.length ? (
        <ul className="list-disc pl-5 space-y-1">
          {documents.map((doc) => (
            <li key={doc._id}>
              <a
                href={doc.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {doc.title || doc.filename || doc._id}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No documents found for this enterprise.</p>
      )}
    </div>
  );
  const renderContacts = () => (
    <div>
      <h3 className="font-semibold text-xl mb-2">Contacts</h3>
      {contacts.length ? (
        <ul className="list-disc pl-5 space-y-1">
          {contacts.map((contact) => (
            <li key={contact._id}>
              <strong>{contact.name}</strong> - {contact.email || contact.phone}
            </li>
          ))}
        </ul>
      ) : (
        <p>No contacts available.</p>
      )}
    </div>
  );
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <div className="mb-6 flex space-x-4 border-b-2 border-gray-200">
        {TABS.map((tabName, idx) => (
          <button
            key={tabName}
            onClick={() => setActiveTab(idx)}
            className={`pb-2 border-b-4 ${
              activeTab === idx
                ? "border-blue-600 font-semibold text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {tabName}
          </button>
        ))}
      </div>

      <div>
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}
        {!loading && !error && (
          <>
            {activeTab === 0 && renderPersonalInfo()}
            {activeTab === 1 && renderEnterprises()}
            {activeTab === 2 && renderJobOffers()}
            {activeTab === 3 && renderFeedbacks()}
            {activeTab === 4 && renderDocuments()}
            {activeTab === 5 && renderContacts()}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
