import { useEffect, useState } from 'react';
import { getEnterprisesWithFeedbacks } from '../../../service/interprise';
import { Building2, Mail, Star, MessageSquareText, Calendar, User2, MapPin, Phone } from 'lucide-react';

const GetAllFeedbacksByEnterprise = () => {
  const [data, setData] = useState([]);
  const [expandedFeedbacks, setExpandedFeedbacks] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const result = await getEnterprisesWithFeedbacks();
        setData(result);
      } catch (err) {
        console.error('Failed to fetch:', err);
      }
    })();
  }, []);

  const toggleFeedbacks = (id) => {
    setExpandedFeedbacks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 xl:grid-cols-3">
      {data.map((enterprise) => (
        <div
          key={enterprise._id}
          className="rounded-2xl shadow-md border border-gray-200 p-5 bg-white hover:shadow-lg transition"
        >
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-800">
              {enterprise.name}
            </h3>
          </div>

          <div className="text-sm text-gray-600 space-y-1 mb-4 pl-1">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              {enterprise.email || "No email"}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              {enterprise.address || "No address"}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              {enterprise.phone || "No phone"}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700">Feedbacks:</h4>

            {enterprise.feedbacks?.length > 0 ? (
              <>
                {(expandedFeedbacks[enterprise._id]
                  ? enterprise.feedbacks
                  : enterprise.feedbacks.slice(0, 1)
                ).map((fb) => (
                  <div
                    key={fb._id}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquareText className="w-4 h-4 text-blue-500" />
                      <p className="text-sm text-gray-800">{fb.content}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500 text-sm">
                      {[...Array(fb.rating)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-yellow-400" />
                      ))}
                      <span className="text-gray-500 ml-2">({fb.rating}/5)</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                      <User2 className="w-4 h-4" />
                      {fb.user?.name || "Unknown user"} - {fb.user?.role || "Unknown position"}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {enterprise.feedbacks.length > 2 && (
                  <button
                    onClick={() => toggleFeedbacks(enterprise._id)}
                    className="text-sm text-blue-600 hover:underline mt-2"
                  >
                    {expandedFeedbacks[enterprise._id] ? "Show Less" : "Show All Feedbacks"}
                  </button>
                )}
              </>
            ) : (
              <p className="text-gray-400 italic text-sm">No feedback yet.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};


export default GetAllFeedbacksByEnterprise;
