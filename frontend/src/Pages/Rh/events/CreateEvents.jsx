import { useEffect, useState } from "react";
import { createEvent } from "../../../service/event";
import { toast } from "react-toastify";
import useNotificationSocket from "../../../service/socket";

const CreateRhEvents =  () => {
      const socket = useNotificationSocket();
      const [events, setEvents] = useState([]);

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
        const [showModal, setShowModal] = useState(false);
            const [title, setTitle] = useState('');
          const [description, setDescription] = useState('');
          const [date, setDate] = useState('');
          const [time, setTime] = useState('');
          const [image, setImage] = useState(null);
        const handleSubmit = async (e) => {
          e.preventDefault();
          const formData = new FormData();
          formData.append('title', title);
          formData.append('description', description);
          formData.append('date', date);
          formData.append('time', time);
          formData.append('image', image);
        
          try {
            await createEvent(formData);
            setTitle('');
            setDescription('');
            setDate('');
            setTime('');
            setImage(null);
          } catch (err) {
            toast.error('Failed to create event');
            console.error(err);
          }
        };




    return(
        <div className="flex items-center justify-center min-h-[60vh]">
  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
    <div className="flex flex-col items-center gap-4">
      <div className="text-4xl text-gray-300 p-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 2m6-6a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-gray-200">Nothing in Sight</h2>
      <p className="text-md text-gray-400">Stay tuned for upcoming events!</p>
      <button
        onClick={() => setShowModal(true)}
        className="mt-4 inline-flex items-center gap-2 bg-white/10 border border-white/20 text-gray-900 px-6 py-2 rounded-full hover:bg-white/20 transition duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add Event
      </button>
    </div>
  </div>
      {showModal && (
  <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
    <div className="bg-white rounded-xl w-full max-w-lg p-6 relative">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Create Event</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-600 mb-1">Event Image</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border rounded px-3 py-2"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Title</label>
          <input
            type="text"
            placeholder="Event Title"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Date</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Start Time</label>
          <input
            type="time"
            className="w-full border rounded px-3 py-2"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Description</label>
          <textarea
            placeholder="Event Description"
            rows="3"
            className="w-full border rounded px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>

      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        onClick={() => setShowModal(false)}
      >
        ✕
      </button>
    </div>
  </div>
)}
        </div>
    )
}
export default CreateRhEvents