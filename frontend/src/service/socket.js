import { useEffect, useRef, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from '../components/AuthProvider';

const useNotificationSocket = () => {
  const { user } = useContext(AuthContext);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    if (!socketRef.current) {
      const socket = io('http://localhost:3000', {
        withCredentials: true,
        auth: {
          userId: user.id,
          role: user.role,
        },
      });

      socket.on('connect', () => {
        socket.emit('user-connected', user.id);
      });

      socketRef.current = socket;
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user]);

  return socketRef.current;
};

export default useNotificationSocket;
