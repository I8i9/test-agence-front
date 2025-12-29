import { io } from 'socket.io-client';

export const createSocketSlice = (set, get) => ({
  socket: null,
 
  initializeSocket: (token) => {
    const newSocket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000', {
      auth: { token },
      reconnection: true,               // default: true
      reconnectionAttempts: 5,          // max number of attempts
      reconnectionDelay: 1000,
    });
    
    newSocket.on('connect_error', async (err) => {
      if (err.message.includes('Token expired')) {
        newSocket.disconnect();
      }
    });

    newSocket.connect();
    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  }
});