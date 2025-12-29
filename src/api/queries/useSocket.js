// src/hooks/useSocket.js
import { useEffect } from 'react';
import { useStore } from '../../store/store';

export function useSocket() {
  const token = useStore((state) => state.user.token);
  const socket = useStore((state) => state.socket);
  const initializeSocket = useStore((state) => state.initializeSocket);
  const disconnectSocket = useStore((state) => state.disconnectSocket);

  useEffect(() => {
    if (token && !socket) {
      initializeSocket(token);
      console.log('Socket initialized');
    }

    return () => {
      if (socket) {
        disconnectSocket();
      }
    };
  }, [token, socket, initializeSocket, disconnectSocket]);

  return socket;
}