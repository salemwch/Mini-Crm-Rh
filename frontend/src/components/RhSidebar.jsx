import {  FaChevronLeft, FaChevronRight, FaRegListAlt, FaSignOutAlt, FaUserPlus } from 'react-icons/fa';
import MenuItem from './MenuItem'; 
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { FaBriefcase, FaBuildingShield, FaList, FaRegBuilding, FaRegCalendar,  FaRegSquareMinus, FaRegUser } from 'react-icons/fa6';
import { Outlet, useNavigate } from 'react-router-dom';

export default function RhSidebar({ isOpen, setOpen }) {
  const { logout} = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  return (
    <div className="flex w-full bg-gray-50">
      <aside
        className={`fixed top-0 left-0 h-screen  bg-white shadow-lg transition-all duration-300 ease-in-out z-40 ${
          isOpen ? 'w-60 pt-4' : 'w-16 p-2'
        }`}
      >
        <button
          className="absolute mt-10 -right-3 top-8 w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center focus:outline-none shadow-md z-50"
          onClick={() => setOpen(!isOpen)}
        >
          {isOpen ? <FaChevronLeft size={12} /> : <FaChevronRight size={12} />}
        </button>
        <div className="mt-14">
          <div
            className={`text-xl flex items-center gap-2 font-bold text-zinc-700 mb-6 transition-all duration-300 transform whitespace-nowrap ${
              isOpen ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-95 -translate-x-4'
            }`}
          >
            <FaList size={20} />
            <span className="text-cyan-600">CRM Menu</span>
          </div>
                      <div className="flex flex-col space-y-6 items-start">
 
          <ul className="flex flex-col  space-y-1 w-full">
            <MenuItem icon={<FaRegUser />} label="Profile" to="/Rh-Profile" isOpen={isOpen} />
            <MenuItem icon={<FaRegCalendar />} label="Calendar" to="/calendar" isOpen={isOpen} />
            <MenuItem icon={<FaRegSquareMinus />} label="Dashboard" to="/Rh-Dashboard" isOpen={isOpen} />
          </ul>
            <ul className="flex flex-col space-y-1 w-full">
            <MenuItem icon={<FaRegBuilding />} label="Companies/Partners" to="/rh-enterprises" isOpen={isOpen} />
            <MenuItem icon={<FaBuildingShield />} label="Organizations" to={"/enterprise-list"} isOpen={isOpen} />
<MenuItem
  icon={<FaUserPlus />}
  label="Create Contact"
  isOpen={isOpen}
  to="/contacts/create"
/>
          </ul>
          <ul className="flex flex-col space-y-1 w-full">
            <MenuItem icon={<FaBriefcase />} label="JobOffer" to="/CreateJobOffer" isOpen={isOpen} />
            <MenuItem icon={<FaRegListAlt />} label="List Of Enterprises" to={"/List-enterprises"} isOpen={isOpen} />
            <MenuItem icon={<FaSignOutAlt />} label="Logout" isOpen={isOpen} onClick={handleLogout}
 />
          </ul>
          </div>
        </div>
      </aside>

      <main
        className={`flex-1 min-h-screen bg-gray-100 p-6 ml-16 transition-all duration-300 ease-in-out ${
          isOpen ? 'ml-60' : 'ml-16'
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}




