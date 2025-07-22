// components/MenuItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function MenuItem({ icon, label, isOpen, to, onClick }) {
  return (
    <li
      onClick={onClick}
      className="flex items-center  gap-1 rounded-xl py-1 px-3 cursor-pointer
        hover:bg-gray-100 transition-colors
        focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500
        focus-visible:ring-offset-1 focus-visible:ring-inset"
    >

      <Link
  to={to}
  className={`flex cursor-pointer items-center transition-all duration-200 px-2 py-2 rounded-lg 
    hover:bg-zinc-100 w-full
    ${isOpen ? 'justify-start' : 'justify-center'}
  `}
>
  <div className="text-lg cursor-pointer">{icon}</div>
  {isOpen && <span className="ml-3 text-sm text-zinc-800">{label}</span>}
</Link>

    </li>
  );
}
