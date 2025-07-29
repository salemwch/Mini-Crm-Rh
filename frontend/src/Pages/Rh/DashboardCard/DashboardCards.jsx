import React, { useEffect, useState } from "react";
import { getRecentEnterprises } from "../../../service/interprise";
import dayjs from "dayjs";
import { getLastFiveJobOffers } from "../../../service/jobOffer";
import { Link } from "react-router-dom";
import { getLastFiveFeedbacks } from "../../../service/feedback";
const DashboardCards = () => {
    const [enterprises, setEnterprises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [jobOffers, setJobOffers] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLastFiveFeedbacks();
        console.log('data:', data);
        setFeedbacks(data);
      } catch (error) {
        console.error('Error fetching last 5 feedbacks:', error);
      }
    };

    fetchData();
  }, []);

    useEffect(() => {
    const fetchEnterprises = async () => {
    try {
        setLoading(true);
        const data = await getRecentEnterprises(5);
        
        setEnterprises(data);
    } catch (err) {
        setError("Failed to load enterprises.");
    } finally {
        setLoading(false);
    }
    };
    fetchEnterprises();
}, []);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await getLastFiveJobOffers();
        setJobOffers(data);
      } catch (err) {
        console.error('Failed to fetch job offers:', err);
      }
    };
    fetchOffers();
  }, []);

return(
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-md p-4">
    <h2 className="text-xl font-bold mb-4 text-gray-500">Last 5 Enterprises</h2>
    {enterprises.length === 0 && (
  <p className="text-gray-400">No enterprises found.</p>
)}

{enterprises.map((enterprise) => (
  <Link  className="w-full" to={`/entreprises/${enterprise._id}`} key={enterprise._id}>
    <div className="p-2 rounded-lg transition duration-200 hover:bg-gray-100 cursor-pointer">
      <p className="text-gray-400 font-semibold">{enterprise.name}</p>
      <p className="text-gray-500 text-sm">
        Added by{" "}
        <span className="italic">
          {enterprise.addBy?.[0]?.name || "unknown"}
        </span>{" "}
        on {dayjs(enterprise.createdAt).format("MMM D, YYYY")}
      </p>
    </div>
  </Link>
))}


    </div>
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-md p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-500">Last Job Offers</h2>
      {jobOffers.length === 0 && (
  <p className="text-gray-400">No job offers found.</p>
)}

{jobOffers.map(({ title, enterpriseId, createdAt }, index) => (
  <Link
to={`/entreprises/${enterpriseId._id}?tab=jobOffers`}
    key={index}
    className="block p-2 rounded-lg transition duration-200 hover:bg-gray-100 cursor-pointer"
  >
    <p className="text-gray-400 font-semibold">{title}</p>
    <p className="text-gray-500 text-sm">
      Enterprise: <span className="italic">{enterpriseId?.name || 'N/A'}</span> |{" "}
      {dayjs(createdAt).format('MMM D, YYYY')}
    </p>
  </Link>
))}

    </div>
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-md p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-500">Last Feedbacks</h2>
      {feedbacks.length === 0 && (
  <p className="text-gray-400">No Feedback Found.</p>
)}

{feedbacks.map((fb, index) => (
  <Link
    to={`/entreprises/${fb.enterpriseId._id}?tab=feedbacks`}
    key={index}
    className="block p-2 rounded-lg transition duration-200 hover:bg-gray-100 cursor-pointer"
  >
    <p className="text-gray-400 font-semibold">{fb.content}</p>
    <p className="text-gray-500 text-sm">
      Enterprise: <span className="italic">{fb.enterpriseId.name || 'N/A'}</span> |{" "}
      {dayjs(fb.createdAt).format('MMM D, YYYY')} | Rating:{" "}
      <span className="font-bold">{fb.rating}</span>
      <span className="font-bold"> By {fb.user?.name}</span>
      
    </p>
  </Link>
))}


    </div>
    

    </div>
);
};

export default DashboardCards;
