
import TopBanner from '../../components/TopBar';
import WelcomeMessage from '../../components/WelcomeMessage';
import EquipmentStatus from '../../components/equipementStatus';
import LinksWidget from '../../components/LinkWidget';
import CommunitiesBanner from '../../components/ComunitiesBanner';
import DashboardCards from './DashboardCard/DashboardCards';
import { useEffect, useState } from 'react';
import { getTodayEvents } from '../../service/event';
import useNotificationSocket from '../../service/socket';
import { toast } from 'react-toastify';

const RhDashboard = () => {
  const socket = useNotificationSocket();
 useEffect(() => {
  if (!socket) return;

  const handleNewEvent = (event) => {
    console.log('📡 New event received via socket:', event);
    setEvents((prevEvents) => [event, ...prevEvents]);
    toast.success('📣 A new event has been added!');
  };
  socket.on('newEventCreated', handleNewEvent);
  return () => {
    socket.off('newEventCreated', handleNewEvent);
  };
}, [socket]);
  const usersToday = [
    {
    name: 'Alejandro Noriega',
    note: 'First day',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    date: 'JUL 15',
    },
    {
    name: 'Amalia Alcalá',
    note: 'First day',
    image: 'https://randomuser.me/api/portraits/women/45.jpg',
    date: 'JUL 15',
    },
  ];
  const [events, setEvents] = useState([]);
  useEffect(() => {
  const fetchEvents = async () => {
    try {
      const data = await getTodayEvents();
      console.log('data:', data);
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

    <WelcomeMessage name={usersToday[0]?.name} />
    <div className="mt-6">
      <DashboardCards
      />
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
    Created by: <span className="font-medium">{event.addBy.fullname}</span>
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
</div>
  );
};

export default RhDashboard;
