import React, { useEffect, useState,useRef, useContext, useCallback } from "react";
import { MdSpaceDashboard } from "react-icons/md";
import { BiBuilding, BiChat } from "react-icons/bi";
import { RiFileList2Line } from "react-icons/ri";
import { HiDocumentText } from "react-icons/hi";
import { FaSearch, FaTrash} from "react-icons/fa";
import { MdOutlineHeadsetMic } from "react-icons/md";
import { FaChevronRight, FaGears, FaRegBell } from "react-icons/fa6";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand} from 'react-icons/tb';
import '../../../App.css';
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../components/AuthProvider";
import { deleteNotification } from "../../../service/notification";
import {useNotifications} from "../hooks/useNotification"
const SideBar = () =>{
const IMAGE_BASE_URL = 'http://localhost:3000/uploads/';
const { user, logout } = useContext(AuthContext); 
    const [open, setOpen] =useState(true);
    const [activeMenuKey, setActiveMenuKey] = useState(null);
    const submenuRef = useRef(null);
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const { notifications, setNotifications, hasNew } = useNotifications();

  const getUserImageSrc = (image) => {
  if (!image || image === 'null' || image === 'undefined') {
    return '/image/Profile.png';
  }
  return `${IMAGE_BASE_URL}${image}`;
};
  useEffect(() => {
  if (!open) {
    setActiveMenuKey(null);
  }
}, [open]);
    const toggleSubMenu = (key) => {
      setActiveMenuKey((prevKey) => (prevKey === key ? null : key));
    };
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (submenuRef.current && !submenuRef.current.contains(event.target)) {
          setActiveMenuKey(null);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
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
    const menus = [
      { title: "Dashboard",
        icon: <MdSpaceDashboard />,
        path: "/Admin-Dashboard",
      },
      {
        title: "RH Users",
        icon: <FaGears />,
        subMenu: [{title: "User List", path: "/user-list"},
                  {title: "Create User", path: "/create-user"}
        ],
        key: "users",
        gap: true
      },
      {
        title: "Contacts",
        icon: <BiChat />,
        subMenu: [{title: "Create Contacts", path:"/Contacts"},
                  {title: "Get Contacts", path:"/All-Contacts"}
        ],
        key: "contacts",
        gap: true,
      },
      {
        title: "HR Feedback",
        icon: <MdOutlineHeadsetMic />,
        subMenu: [{title: "Create Feedback", path:"/Create-feedback"},
                  {title: "Get Feedbacks", path:"/All-Feedbacks"},
        ],
        key: "feedback",
        gap: true,
      },
      {
        title: "Documents",
        icon: <HiDocumentText />,
        subMenu: [{title: "Create Documents", path:"/create-documents"},
                  {title: "See Documents", path:"/See-documents"},
        ],
        key: "documents",
                gap: true,
      },
      {
        title: "Partner Companies",
        icon: <BiBuilding />,
        subMenu: [{ title: "Company List", path: "/enterprises-documents"},
                  {title: "Create Events", path: "/admin-events"}
        ],
        key: "enterprises",
        gap: true,
      },
      {
        title: "Audit Log",
        icon: <RiFileList2Line />,
        subMenu: [{title: "Audit Log", path:"/audit-log"}],
        key: "auditlog",
        gap: true,
      },
      
    ];
    return (
  <div className="w-full min-h-screen flex">
    <div
      className={`fixed top-0 left-0 bg-zinc-900 h-screen pt-8 z-50 transition-all duration-300 ease-in-out ${
        open ? "w-72 p-5" : "w-20 p-4"
      }`}
    >
      <div
        className="absolute top-11 -right-5 w-9 h-9 bg-zinc-50 border-2 border-zinc-200 rounded-full text-xl flex items-center justify-center z-50 transition-transform duration-300 ease-in-out cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {open ? <TbLayoutSidebarLeftCollapse /> : <TbLayoutSidebarLeftExpand />}
      </div>

      <div className="flex gap-x-4 items-center -ml-4 -mt-2 min-h-[44px]">
        <img
          src="https://cdn.pixabay.com/photo/2017/02/18/19/20/logo-2078018_640.png"
          alt="logo"
          className={`w-10 h-10 rounded-full object-cover object-center cursor-pointer transition-transform duration-700 ${
            open ? "rotate-[360deg]" : "rotate-0"
          }`}
        />
        <h1
          className={`text-zinc-50 font-semibold text-xl transition-all duration-300 ease-in-out origin-left ${
            open
              ? "opacity-100 scale-100 translate-x-0"
              : "opacity-0 scale-95 -translate-x-4"
          } whitespace-nowrap overflow-hidden text-ellipsis`}
        >
          Admin Dashboard
        </h1>
      </div>

      <ul className="pt-6 space-y-0.5">
        {menus.map((menu, index) => (
          <li
            key={index}
            className={`flex flex-col rounded-md py-3 px-2 cursor-pointer hover:text-white text-zinc-50 hover:bg-zinc-800/50 transition-all duration-300 ease-in-out ${
              menu.gap ? "mt-9" : "mt-2"
            } ${index === 0 ? "bg-zinc-800/40" : ""}`}
            onClick={() => {
              if (menu.subMenu) {
                toggleSubMenu(menu.key);
              } else if (menu.path) {
                navigate(menu.path);
              }
            }}
          >
            <div className="flex items-center justify-between gap-x-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">{menu.icon}</span>

                {open && (
                  <div className="flex items-center transition-all duration-300 ease-in-out">
                    <span className="whitespace-nowrap">{menu.title}</span>

                    {menu.subMenu && (
                      <FaChevronRight
                        className={`ml-2 text-xs transition-transform duration-300 ease-in-out ${
                          activeMenuKey === menu.key ? "rotate-90" : ""
                        }`}
                      />
                    )}
                  </div>
                )}
              </div>

              {menu.subMenu && (
                <div className="relative">
                  {activeMenuKey === menu.key && (
                    <ul
                      ref={submenuRef}
                      className="absolute left-full top-0 ml-2 w-48 bg-zinc-800 text-zinc-300 rounded-md shadow-lg z-[9999] transition-all"
                    >
                      {menu.subMenu.map((subMenu, subIndex) => (
                        <Link
                          to={subMenu.path}
                          key={subIndex}
                          className="text-sm flex items-center gap-x-2 py-3 px-2 hover:bg-zinc-700 rounded-md"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaChevronRight className="text-xs" />
                          {subMenu.title}
                        </Link>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>

    <div
  className={`flex-1 bg-zinc-100 min-h-screen transition-all duration-300 ease-in-out pt-[8ch] ${
    open ? "ml-72" : "ml-20"
  }`}
>

<div
  className={`fixed top-0 transition-all duration-300 ease-in-out z-40 h-[8ch] px-12 bg-zinc-50 shadow-md flex items-center justify-between ${
    open ? "left-72 w-[calc(100%-18rem)]" : "left-20 w-[calc(100%-5rem)]"
  }`}
>
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
                to="/user-profile"
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
      <div className="w-full min-h-screen">
        <Outlet />
      </div>
    </div>
  </div>
);


}
export default SideBar;