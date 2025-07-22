import { Link, useNavigate } from "react-router-dom";
import { useCallback, useContext, useState } from "react";
import { useNotifications } from "../hooks/useNotification";
import { deleteNotification } from "../../../service/notification";
import { AuthContext } from "../../../components/AuthProvider";
import { FaRegBell, FaSearch, FaTrash } from "react-icons/fa";

const Header = () => {


    const [showNotifications, setShowNotifications] = useState(false);
    const { notifications, setNotifications, hasNew, setHasNew } = useNotifications();
    const { user, logout } = useContext(AuthContext); 
    const navigate = useNavigate();
    const [open, setOpen] =useState(true);
    const IMAGE_BASE_URL = 'http://localhost:3000/uploads';
    const getUserImageSrc = (image) => {
      if (!image || image === 'null' || image === 'undefined') {
        return '/image/Profile.png';
      }
      return `${IMAGE_BASE_URL}${image}`;
    };



 const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  const handleDeleteNotif = useCallback(
  async (notifId) => {
    try {
      await deleteNotification(notifId);
      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notifId)
      );
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  },
  [ setNotifications ]
);
    return(
        <>
         <div
      className={` flex-1 bg-zinc-100 min-h-screen transition-all  duration-300 ease-in-out ${
        open ? "ml-72" : "ml-20"
      }`}
    >
      <div className="w-full h-[8ch] px-12 bg-zinc-50 shadow-md flex items-center justify-between ">
        <div className="w-96 border border-zinc-300 rounded-full h-11 flex items-center justify-center">
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 h-full rounded-full outline-none border-none bg-zinc-50 px-4"
          />
          <button className="px-4 h-full flex items-center justify-center text-base text-zinc-600 border-l border-zinc-300">
            <FaSearch />
          </button>
        </div>

        <div className="flex items-center gap-x-8">
  <div
  className="relative inline-block"
  onMouseEnter={() => setShowNotifications(true)}
  onMouseLeave={() => setShowNotifications(false)}
  title="Notifications"
>
  {/* Bell Icon */}
  <div className="cursor-pointer">
    <FaRegBell
      size={22}
      className="text-zinc-700 hover:text-indigo-600 transition-colors"
    />

    {hasNew && (
      <>
        <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-red-500"></span>
        <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold">
          {notifications.length}
        </span>
      </>
    )}
  </div>

  {showNotifications && (
  <div className="absolute top-5 right-0 w-60 bg-white border border-zinc-200 rounded-lg shadow-lg z-50">
    <ul className="py-2">
      <li className="px-4 py-2 text-sm text-zinc-800 font-semibold border-b border-zinc-200">
        Notifications
      </li>

      {notifications.length === 0 ? (
        <li className="px-4 py-2 text-sm text-gray-500">No notifications</li>
      ) : (
        notifications.map((notif, index) => (
          <li
            key={notif._id || index}
            className="px-4 py-2 text-sm text-zinc-700 flex items-center justify-between hover:bg-zinc-100"
          >
            <span>{notif.message || 'New notification!'}</span>

            <button
              onClick={() => handleDeleteNotif(notif._id)}
              className="text-red-500 hover:text-red-700 ml-2"
              title="Delete notification"
            >
              <FaTrash size={14} />
            </button>
          </li>
        ))
      )}
    </ul>
  </div>
)}

</div>


  <div className="relative group">
          <img
            src={getUserImageSrc(user?.image)}
            alt="Profile"
            className="w-11 h-11 rounded-full object-cover object-center cursor-pointer"
          />
          
          <ul
            className="absolute right-0 w-48 bg-white border border-zinc-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50"
          >
            
            <li>
              <Link
                to={`/user-profile`}
                className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
              >
                Profile
              </Link>
            </li>
            <li>
              <a
                href="/settings"
                className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
              >
                Settings
              </a>
            </li>
            <li>
              <hr className="my-1 border-zinc-200" />
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
</div>


      </div>

      
    </div>
        </>
    )
}


export default Header;