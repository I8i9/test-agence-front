import { useMutation } from '@tanstack/react-query';
import { logoutapi } from '../../axios/auth.api.js';
import { useStore } from '../../../store/store.js';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
export function useLogout() {
    const navigate = useNavigate();
    const logout = useStore((state) => state.logout);
    return useMutation({
        mutationFn: (logoutapi),
        onError: (error) => {
            // Handle error during logout/ Handle error during logout
            console.error("Logout error:", error);
        },
        onSuccess: () => {
            logout();
            // clear old toasts
            toast.dismiss();
            toast("À bientôt ! Vous avez été déconnecté.");
            navigate('/login', { replace: true });
        },
    });
}