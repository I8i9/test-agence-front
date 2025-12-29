import { useMutation } from '@tanstack/react-query';
import { refreshapi } from '../../axios/auth.api.js';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/store.js';
export function useTryRefresh() {
    const setUser = useStore((state) => state.setUser);
    const initializeSocket = useStore((state) => state.initializeSocket);
    const disconnectSocket = useStore((state) => state.disconnectSocket);
    const socket = useStore((state) => state.socket);
    const navigate = useNavigate();
    return useMutation({
        mutationFn: (refreshapi),
        onError: (error) => {
            console.error("Error during token refresh:", error);
            // If error is not a request error, redirect to login
            if (error?.response) {
                navigate('/login', { replace: true });
            }else if(error?.request) {
                // Handle request error, e.g., network issues
                navigate('/down', { replace: true });
            }


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
            navigate('/dashboard', { replace: true }); // Redirect to dashboard on successful refresh
        },
    });
}