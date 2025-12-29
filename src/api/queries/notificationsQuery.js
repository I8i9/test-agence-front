import { useQuery, useMutation } from '@tanstack/react-query'
import { fetchNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '../axios/notifications.api.js'

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      // Add artificial delay for testing
      //await new Promise(resolve => setTimeout(resolve, 10000)); // 2 second delay
      return fetchNotifications();
    },
     
  })
}

export const useMarkNotificationAsRead = () => {
  
  return useMutation({
    mutationFn: markNotificationAsRead,
    onError: (error) => {
      console.error('Error marking notification as read:', error)
    }
  })
}

export const useMarkAllNotificationsAsRead = () => {
  
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onError: (error) => {
      console.error('Error marking all notifications as read:', error)
    }
  })
}