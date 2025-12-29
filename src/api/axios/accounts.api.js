import mainapi from "./main.api";

export const getAccounts = async () => {
    const response = await mainapi.get('/compte/');
    console.log("Accounts data:", response.data);
    return response.data.data ?? [];
}

export const addAccount = async (accountPaylaod) => {
    const response = await mainapi.post('/compte/', accountPaylaod);
    return response.data;
}   

export const deleteAccount = async (accountId) => {
    const response = await mainapi.delete(`/compte/${accountId}`);
    return response.data;
}