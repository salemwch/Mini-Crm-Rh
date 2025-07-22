import React from 'react';

const NotificationsDropdown = ({ notifications, onClose }) => {
  return (
    <div className="absolute top-16 right-12 w-80 bg-white border border-zinc-200 rounded-lg shadow-lg z-50">
      <div className="p-4 font-semibold border-b">Notifications</div>
      <ul className="max-h-64 overflow-y-auto">
        {notifications.length === 0 ? (
          <li className="p-4 text-zinc-500 text-sm">No notifications</li>
        ) : (
          notifications.map((notif, index) => (
            <li key={index} className="px-4 py-2 hover:bg-zinc-100 cursor-pointer text-sm">
              {notif.message}
            </li>
          ))
        )}
      </ul>
      <div className="text-right p-2 border-t">
        <button
          onClick={onClose}
          className="text-indigo-600 hover:underline text-sm font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationsDropdown;
