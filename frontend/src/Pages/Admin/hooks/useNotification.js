import { useContext, useEffect, useState } from 'react';
 import useNotificationSocket from '../../../service/socket';
import { getNotificationsByUser } from '../../../service/notification';
import { AuthContext } from '../../../components/AuthProvider';

export function useNotifications() {
  const { user } = useContext(AuthContext);
  const socket = useNotificationSocket();
  const [notifications, setNotifications] = useState([]);
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const fetch = async () => {
      try {
        const data = await getNotificationsByUser(user.id);
        setNotifications(data);
        const hasUnread = data.some((n) => !n.read);
        setHasNew(hasUnread);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    fetch();
  }, [user]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      setNotifications((prev) => {
        const isDuplicate = prev.some((n) => n._id === notification._id || n.message === notification.message);
        if (isDuplicate) return prev;
        return [notification, ...prev];
      });
      setHasNew(true);
    };

    socket.on('newNotification', handleNewNotification);

    return () => {
      socket.off('newNotification', handleNewNotification);
    };
  }, [socket]);

  return {
    notifications,
    setNotifications,
    hasNew,
    setHasNew,
  };
}
