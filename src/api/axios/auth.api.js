import axios from 'axios'; 
// Correct Axios instance creation
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL+'/auth/' || 'http://localhost:3000/auth/', 
  withCredentials: true              
});

console.log("Axios instance created with base URL:", import.meta.env.VITE_API_BASE_URL);

export const loginApi = async ({email, password}) => { 
   const response =await api.post('/login', { email_login: email,password_login : password }); 
    return response; 
};

export const FAloginApi = async ({otp}) => { 
    const response =await api.post('/2fa/verify-login', { otp: otp }); 
     return response; 
 };

export const get2FAOtpApi = async () => {
    const response = await api.post('/2fa/resend-otp', {});
    return response
}

export const refreshapi = async () => {
    const response = await api.post('/refreshtoken', {});
    return response
};

export const logoutapi = async () => {
    const response=await api.get('/logout',{}) 
    return response;
}

export const getOtpApi = async (email) => {
    const response = await api.post('/forgetpasswod', { email_login: email });
    return response;
}

export const verifyOtpApi = async ({ email, otp }) => {
    const response = await api.post('/verifyotp', { email_login: email, otp });
    return response;
}

export const resetPasswordApi = async (password) => {
    const response = await api.patch('/resetpassword', { new_password: password });
    return response;
}