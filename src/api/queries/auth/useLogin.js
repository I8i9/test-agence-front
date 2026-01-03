import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../../axios/auth.api.js';
import { useStore } from '../../../store/store.js';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
export function useLogin(onStepChange) {
    const navigate = useNavigate();
    const setUser = useStore((state) => state.setUser);
    const initializeSocket = useStore((state) => state.initializeSocket);
    return useMutation({
        mutationFn: (loginApi),
        onError: (error) => {
            console.log(error.response);
            if (error.response) {
                if( error.response.status === 429) {

                    // get retry time from headers
                    const retryAfter = error.response.headers['ratelimit-reset'] || error.response.data.retry_after || null;
                    const retryAfterMinutes = retryAfter ? Math.ceil(Number(retryAfter) / 60) : null;

                    // show error with retry time
                    toast.error(`Trop de tentatives de connexion. Veuillez réessayer dans ${retryAfterMinutes ? retryAfterMinutes>1 ? retryAfterMinutes + ' minutes' : retryAfterMinutes + ' minute' : 'quelques minutes'}.`);


                }else if (error.response.status !== 500) {

                    if( error.response.status === 404) {

                    // handle erros  and get remaining attempts to show if udner 3 attempts left
                    const remainingAttempts = error.response.headers['ratelimit-remaining'] || null;
                    if (remainingAttempts <= 2) {
                        toast.error(error.response.data.message + `  ${parseInt(remainingAttempts)+1 } Tentatives restantes`);
                    }else{
                         toast.error(error.response.data.message || "Oups ! Une erreur s’est produite. Veuillez réessayer.");
                    }
                    }else{
                        toast.error(error.response.data.message || "Oups ! Une erreur s’est produite. Veuillez réessayer.");
                    }

                }else {
                    toast.error("Impossible de se connecter. Veuillez réessayer plus tard.");

                }
   
            }else if(error.request){
              toast.error('Impossible de se connecter. Veuillez réessayer plus tard.');
              navigate('/down', { replace: true });
            } 
            else{
                console.log(error.message)
            }
        },
        onSuccess: ({ data }) => { 

            // Check if backend requires 2FA
            if ( data.requires2FA ) {
                if (onStepChange) {
                    // Switch to OTP step and pass the email
                    onStepChange('loginOtp', data.email); 
                }
                return; // do not redirect to dashboard
            }
            setUser( data.data );
            initializeSocket(data.data.token); // Initialize socket after login
            toast.dismiss();
            toast.success("Connexion réussie. Bienvenue !");
            navigate('/dashboard', { replace: true }); // Redirect to dashboard on successful login
        },
    });
}