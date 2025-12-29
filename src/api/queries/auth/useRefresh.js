import { useMutation } from '@tanstack/react-query';
import { refreshapi } from '../../axios/auth.api.js';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/store.js';
import { logoutapi } from '../../axios/auth.api.js';
export function useRefresh() {
    const setUser = useStore((state) => state.setUser);
    const initializeSocket = useStore((state) => state.initializeSocket);
    const disconnectSocket = useStore((state) => state.disconnectSocket);
    const socket = useStore((state) => state.socket);
    const logout = useStore((state) => state.logout);
    const navigate = useNavigate();
    return useMutation({
        mutationFn: (refreshapi),
        onError: async (error) => {
            try {
                // Attempt to logout if refresh fails
                if(error.response){
                    console.error("Refresh token error:");
                    await logoutapi();

                    navigate('/login', { replace: true });
                }
                else if (error.request) {
                    console.error("Refresh token error in request");

                    navigate('/down', { replace: true });
                }
                

            } catch (error) {
                console.error("Logout error:", error);
            }

            
            logout();
            
        },
        onSuccess: ({ data }) => {
            setUser( data );
            if (socket) { 
                    // Disconnect old socket first
                    disconnectSocket();
                    // Update token and reconnect
                    initializeSocket(data.token);
            }else{ 
                initializeSocket(data.token);
            }
        },
    });
}