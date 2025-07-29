import { useContext, useEffect, useRef, useState } from 'react';
import useNotificationSocket from '../../../service/socket';
import { AuthContext } from '../../../components/AuthProvider';

export function useNotifications() {
  const { user } = useContext(AuthContext);
  const socket = useNotificationSocket();
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [hasNew, setHasNew] = useState(false);

  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
  if (!user) {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    return;
  }
  return () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };
}, [user]);


  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      setNotifications((prev) => {
        const isDuplicate = prev.some(
          (n) => n._id === notification._id || n.message === notification.message
        );
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

  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = (users) => {
      console.log('users: notification',users);
      setOnlineUsers(users); 
    };

    socket.on('onlineUsers', handleOnlineUsers);

    return () => {
      socket.off('onlineUsers', handleOnlineUsers);
    };
  }, [socket]);

  
  return {
    notifications,
    setNotifications,
    hasNew,
    setHasNew,
    onlineUsers,  
  };
}
