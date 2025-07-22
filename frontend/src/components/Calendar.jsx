import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import AddAbsenceModal from './AddAbsence';
import SideBar from '../Pages/Admin/sideBar/SideBar';
import RhSidebar from './RhSidebar';

export default function AbsenceCalendar({ isOpen, setOpen }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  return (
    <div className="flex min-h-screen">
             <RhSidebar  isOpen={isOpen} setOpen={setOpen} />

      <div className="w-64 bg-gray-100">

      </div>
      <div className="flex-1 p-6">
        {/* Top Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <button onClick={handlePrevMonth}><FaChevronLeft /></button>
            <span className="font-bold text-lg">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={handleNextMonth}><FaChevronRight /></button>
          </div>

          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md"
            onClick={() => setShowModal(true)}
          >
            Add Absence
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="border p-2 rounded text-center">
              {i + 1}
            </div>
          ))}
        </div>

        {showModal && <AddAbsenceModal closeModal={() => setShowModal(false)} />}
      </div>
    </div>
  );
}
