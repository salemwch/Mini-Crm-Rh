import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import { useNotifications } from "../Pages/Admin/hooks/useNotification";
import { getUsersByRole } from "../service/user";

export default function EquipmentStatus() {
  const { user } = useContext(AuthContext);
  const { onlineUsers } = useNotifications();
  const [rhUsers, setRhUsers] = useState([]);
  const IMAGE_BASE_URL = 'http://localhost:3000/uploads/';

  useEffect(() => {
    const fetchRhUsers = async () => {
      if (!user) {
        return;
      }
      try {
        const users = await getUsersByRole('rh');
        setRhUsers(users);
      } catch (error) {
        console.error('Failed to fetch RH users:', error);
      }
    };
    fetchRhUsers();
  }, [user]);
  const getUserImageSrc = (image, updatedAt) => {
  if (!image || image === 'null' || image === 'undefined') {
    return '/image/Profile.png';
  }

  const version = updatedAt ? new Date(updatedAt).getTime() : '';
  return `${IMAGE_BASE_URL}${image}${version ? `?v=${version}` : ''}`;
};
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h4 className="font-semibold mb-2">RH Users</h4>
      <div className="flex flex-wrap gap-3 mt-2">
        {rhUsers.map((u) => {
          const userId = u._id?.toString() || u.id?.toString();
          const isOnline = onlineUsers.some(
            (onlineId) => onlineId.toString() === userId
          );
          return (
            <div key={userId} className="relative">
            <img
  className="w-10 h-10 rounded-full border border-gray-300"
  src={getUserImageSrc(u?.image, u?.updatedAt)}
  alt="user-profile"
  style={{
    width: '50px',
    height: '50px',
    objectFit: 'cover',
  }}
/>
              {isOnline && (
                <span className="absolute right-0 bottom-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
