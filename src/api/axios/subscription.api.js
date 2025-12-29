import mainapi from './main.api.js'


export const fetchSubscription = async () => {
    const response = await mainapi.get('/abonnement/');
    return response.data.data;

}