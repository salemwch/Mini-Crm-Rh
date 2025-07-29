import React, { useState } from 'react';
import { DateRange } from 'react-date-range';
import { addDays } from 'date-fns';
import { createAbsence } from '../service/absence';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import RhSidebar from './RhSidebar';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
export default function AddAbsenceModal({ closeModal, isOpen, setOpen, defaultStartDate = new Date() }) {
  const [selectionRange, setSelectionRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection',
    },
  ]);
const [currentMonth, setCurrentMonth] = useState(new Date());

const handlePrevMonth = () => {
  setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
};

const handleNextMonth = () => {
  setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
};


  const [reason, setReason] = useState('');

  const handleSelect = (ranges) => {
    setSelectionRange([ranges.selection]);
  };

  const handleSubmit = async () => {
  const startDate = selectionRange[0].startDate.toISOString();
  const endDate = selectionRange[0].endDate.toISOString();

  if (!reason.trim()) {
    alert('Please provide a reason for your absence.');
    return;
  }

  try {
    await createAbsence({ startDate, endDate, reason });
    alert('Absence request sent!');
    closeModal();
  } catch (error) {
    console.error('Submit error:', error);
    alert(
      'Request failed: ' +
        (error?.response?.data?.message || error.message || 'Unknown error')
    );
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Request Absence</h2>
        

        <div className="mb-4">
          <label className="block mb-2 font-medium text-sm text-gray-700">Select Absence Period:</label>
         <div className="flex items-center justify-between mb-4">
  <button onClick={handlePrevMonth}>
    <FaChevronLeft />
  </button>
  <span className="font-bold text-lg">
    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
  </span>
  <button onClick={handleNextMonth}>
    <FaChevronRight />
  </button>
</div>
         
          <DateRange
            editableDateInputs={true}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            shownDate={currentMonth}
            ranges={selectionRange}
            className="rounded border"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-sm text-gray-700">Reason:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="e.g. Family emergency, vacation..."
          />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded">
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
}
