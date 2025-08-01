
import TopBanner from '../../components/TopBar';
import WelcomeMessage from '../../components/WelcomeMessage';
import EquipmentStatus from '../../components/equipementStatus';
import LinksWidget from '../../components/LinkWidget';
import CommunitiesBanner from '../../components/ComunitiesBanner';
import DashboardCards from './DashboardCard/DashboardCards';
import {  useContext, useEffect, useState } from 'react';
import { getTodayEvents } from '../../service/event';
import useNotificationSocket from '../../service/socket';
import { toast } from 'react-toastify';
import { createJobOffer } from '../../service/jobOffer';
import { getMyEnterprises } from '../../service/interprise';
import { AuthContext } from '../../components/AuthProvider';

const RhDashboard = () => {
    const [showJobOfferModal, setShowJobOfferModal] = useState(false);
    const {user} = useContext(AuthContext);
    const socket = useNotificationSocket();
 useEffect(() => {
  if (!socket) return;

  const handleNewEvent = (event) => {
    setEvents((prevEvents) => [event, ...prevEvents]);
    toast.success('📣 A new event has been added!');
  };
  socket.on('newEventCreated', handleNewEvent);
  return () => {
    socket.off('newEventCreated', handleNewEvent);
  };
}, [socket]);

  const [formData, setFormData] = useState({
      title: '',
      description: '',
      requirements: '',
      enterpriseId: '',
      location: '',
      salary: '',
      expiryDate: '',
    });
    const [enterprises, setEnterprises] = useState([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
  
    useEffect(() => {
      const fetchUserEnterprises = async () => {
        try {
          setError(null);
          setIsLoading(true);
          const myEnterprises = await getMyEnterprises();
          setEnterprises(myEnterprises);
          if (myEnterprises && myEnterprises.length > 0) {
            setFormData((prevData) => ({
              ...prevData,
              enterpriseId: myEnterprises[0]._id,
            }));
          }
        } catch (err) {
          setError(err.message || 'Failed to fetch your enterprises. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchUserEnterprises();
    }, []);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.enterpriseId) {
          setError("Please select an enterprise.");
          return;
      }
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage('');
      try {
        const createJobOfferDto = {
          ...formData,
          requirements: formData.requirements.split(',').map(req => req.trim()).filter(req => req),
          salary: Number(formData.salary),
          expiryDate: formData.expiryDate ? new Date(formData.expiryDate): undefined,
        };
        const response = await createJobOffer(createJobOfferDto);
        setSuccessMessage(`Successfully created job offer: "${response.title}"!`);
      } catch (err) {
        setError(err.message || 'An unexpected error occurred while creating the job offer.');
      } finally {
        setIsSubmitting(false);
      }
    };
  const [events, setEvents] = useState([]);
  useEffect(() => {
  const fetchEvents = async () => {
    try {
      const data = await getTodayEvents();

      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  fetchEvents();
}, []);

      return (
        <div className="bg-transparent min-h-screen pt-8">
      <TopBanner />

      <div className="max-w-7xl mx-auto px-6 py-6 relative bg-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-gradient-to-bl from-[#5596F6] from-15% via-[#10B881] via-40% to-transparent to-50%" />

        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={() => setShowJobOfferModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            Add JobOffer
          </button>
        </div>

        <WelcomeMessage name={user?.name || "Rh"} />

        <div className="mt-6">
          <DashboardCards />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
          <section className="xl:col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Today in CRM</h2>

            {events.length === 0 ? (
              <p>No events today.</p>
            ) : (
              <ul>
                {events.map((event) => (
                  <li key={event._id} className="mb-4 border-b pb-2">
                    <h3 className="text-md font-bold">{event.title}</h3>
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-40 object-cover rounded-lg mt-2 mb-2"
                    />
                    <p>{event.description}</p>
                    <p className="text-sm text-gray-500">
                      {event.date?.slice(0, 10)} at {event.time}
                    </p>
                    {event?.addBy?.fullname && (
                      <p className="text-sm text-gray-600">
                        Created by:{" "}
                        <span className="font-medium">
                          {event.addBy.fullname}
                        </span>
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <aside className="flex flex-col gap-6">
            <EquipmentStatus />
            <LinksWidget />
          </aside>
        </div>

        <div className="mt-8 px-6">
          <CommunitiesBanner />
        </div>
      </div>

      {showJobOfferModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-8 rounded-xl shadow-lg">
      <button
        onClick={() => setShowJobOfferModal(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
      >
        ✕
      </button>

      <h3 className="text-xl font-semibold mb-6">Create Job Offer</h3>

      <div className="space-y-4">
        {isLoading && <p className="text-center">Loading your enterprises...</p>}

        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        {error && (
          <div className="alert alert-danger text-sm text-red-600">
            {Array.isArray(error)
              ? error.map((e, idx) => (
                  <p key={idx}>
                    {e.constraints ? Object.values(e.constraints).join(', ') : JSON.stringify(e)}
                  </p>
                ))
              : error.toString()}
          </div>
        )}

        {!isLoading && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1" htmlFor="title">Job Title</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1" htmlFor="enterpriseId">Enterprise</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                id="enterpriseId"
                name="enterpriseId"
                value={formData.enterpriseId}
                onChange={handleChange}
                required
                disabled={enterprises.length === 0}
              >
                {enterprises.length === 0 ? (
                  <option>No enterprises found</option>
                ) : (
                  enterprises.map(enterprise => (
                    <option key={enterprise._id} value={enterprise._id}>
                      {enterprise.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1" htmlFor="description">Description</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1" htmlFor="requirements">Requirements</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                id="requirements"
                name="requirements"
                rows="3"
                value={formData.requirements}
                onChange={handleChange}
                required
              />
              <small className="text-gray-500">
                Separate each requirement with a comma (e.g., React, Node.js, 5+ years).
              </small>
            </div>

            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex-1">
                <label className="block text-sm mb-1" htmlFor="location">Location (Optional)</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1" htmlFor="salary">Salary</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  id="salary"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1" htmlFor="expiryDate">Expiry Date (optional)</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                id="expiryDate"
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleChange}
              />
            </div>

            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg w-full"
              type="submit"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? 'Creating...' : 'Create Job Offer'}
            </button>
          </form>
        )}
      </div>
    </div>
  </div>
)}

    </div>

  );
};

export default RhDashboard;
