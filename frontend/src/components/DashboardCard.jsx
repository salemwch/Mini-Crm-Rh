import React from 'react';
import { FaChevronRight } from 'react-icons/fa';

export default function DashboardCard({ title, actions, children, onChevronClick }) {
  return (
    <div className="bg-transparent transition hover:shadow-lg min-w-[250px] flex-col items-stretch rounded-xl border border-solid bg-f1-background-inverse-secondary p-4 shadow relative flex gap-3 border-f1-border-secondary">
      
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-1">
          <h2 className="text-md font-serif text-gray-800">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <div
            onClick={onChevronClick}
            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition duration-200"
          >
            <FaChevronRight className="text-gray-600 hover:text-gray-900" size={12} />
          </div>

          {actions && <div>{actions}</div>}
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
}
