import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { FaPlus } from 'react-icons/fa';
import AddAbsenceModal from './AddAbsence';
import { getAllAbsences } from '../service/absence';
import '../components/calender.css';
import TopBanner from './TopBar';
export default function AbsenceCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [absences, setAbsences] = useState([]);
useEffect(() => {
  const fetchAbsences = async () => {
    try {
      const res = await getAllAbsences();
      setAbsences(res);
    } catch (err) { 
      console.error(err);
    }
  };

  fetchAbsences();
}, []);
  const handleDayClick = (value) => {
    setSelectedDate(value);
    setShowModal(true);
  };

  return (
    <>
    <TopBanner/>
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl mt-5 font-bold text-gray-800">Absence Calendar</h2>
        <button
          className="flex items-center gap-2 bg-indigo-600 text-white mt-5 px-4 py-2 rounded-md hover:bg-indigo-700"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> Add Absence
        </button>
      </div>

      <div className="flex justify-center items-center h-[75vh] w-full">
  <div className="w-full max-w-6xl">
    <Calendar
      onClickDay={handleDayClick}
      value={selectedDate}
      tileClassName={({ date, view }) => {
        const absences = ['2025-07-25', '2025-07-29'];
        if (absences.includes(date.toISOString().slice(0, 10))) {
          return 'bg-red-200 text-red-700 rounded-full';
        }
      }}
      className="w-full text-lg p-4 rounded-lg shadow-md"
    />
  </div>
</div>


      {showModal && (
  <AddAbsenceModal
    selectedDate={selectedDate}
    setOpen={setShowModal}
    isOpen={showModal}
    closeModal={() => setShowModal(false)}
  />
)}

    </div>
    </>
  );
}
