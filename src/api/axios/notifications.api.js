import mainapi from './main.api.js'


export const fetchNotifications = async () => {

  const response = await mainapi.get('/notification/');
    return response.data?.data ?? [];

}
export const markNotificationAsRead = async (notificationId) => {

    const response = await mainapi.patch(`/notification/${notificationId}`);
    return response;
}

export const markAllNotificationsAsRead = async () => {

    const response = await mainapi.patch('/notification/markallread');
    return response;

}