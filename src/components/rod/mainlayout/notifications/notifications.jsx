import { useEffect } from 'react'
import { Separator } from "@/components/ui/separator"
import { Inbox,Clock3, Info} from 'lucide-react'
import { useMarkAllNotificationsAsRead , useNotifications , useMarkNotificationAsRead } from '../../../../api/queries/notificationsQuery'
import { Badge } from "@/components/ui/badge"
import { iconMap , typeColors } from '../../../../utils/notificationConstants'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button" 
import NotificationSkeleton from './notification.sekeleton'
import { useStore } from '../../../../store/store'
import { useQueryClient } from '@tanstack/react-query'
import { formatNotificationTime } from '../../../../utils/dateConverter'

export const Notifications = () => {
  const queryClient = useQueryClient()
  const socket = useStore(state => state.socket)
  const { data: notifications = [], isLoading } = useNotifications()
  const markAsReadMutation = useMarkNotificationAsRead()
  const markAllAsReadMutation = useMarkAllNotificationsAsRead()

  const handleRefetchNotifications = () => {
      queryClient.invalidateQueries(['notifications']) // Use your actual query key
    }
  useEffect(() => {
    // Listen for socket events to refetch notifications
    if (!socket) return
    // Listen for notifications to trigger refetch

    // listen for push updates  
    socket.on('refetchNotifications', handleRefetchNotifications)
    socket.on('notificationRead', handleRefetchNotifications)
    socket.on('allNotificationsRead', handleRefetchNotifications)


  }, [socket, queryClient])


  const handleNotificationClick = (notificationId, isRead) => {
    if (!isRead) {
      markAsReadMutation.mutate(notificationId)
    }
  }

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate()
  }


  // Format notifications
  const formattedNotifications = notifications.map(n => ({
  id: n.id_notification,
  title: n.titre_notification,
  message: n.message_notification,
  read: n.is_read,
  time: formatNotificationTime(n.date_notification),
  object: n.object_notification,
  type: n.type_notification, // Add this
}));


  const unreadCount = formattedNotifications.filter(n => !n.read).length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className='p-3 cursor-pointer hover:bg-rod-foreground rounded-md relative'>
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[448px] max-w-[448px] p-0 font-family-metropolis overflow-y-auto max-h-[400.6px]" align="end" sideOffset={4}>
        <div className="px-4 pt-4 pb-2 flex justify-between items-start">
          <div className='flex flex-col gap-0.5 w-full'>
            <div className='flex justify-between items-center'>
              <h4 className="font-medium leading-none">Notifications</h4>
              {unreadCount > 0 && (
                <Button
                  variant="link"
                  className="text-sm p-0 h-0"
                  onClick={handleMarkAllAsRead}
                  disabled={markAllAsReadMutation.isPending}
                >
                  Tout lu
                </Button>
              )}
            </div>

            <p className="text-gray-500 text-sm">
              {isLoading 
                ? 'Patientez, vos notifications arrivent...'
                :
                notifications.length === 0
                ? 'Rien à signaler pour l’instant.'
                : unreadCount > 0
                ? `Vous avez ${unreadCount} notifications non lues.`
                : 'Toutes les notifications sont lues.'}
            </p>
          </div>
        </div>

      <Separator className="mt-0.5"/>
      {isLoading ? (
          <div className="px-0 py-0 space-y-0">
            <NotificationSkeleton /> 
          </div>
      ) :
      formattedNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 px-4 gap-2">
          <div className='p-2 h-auto w-auto rounded-full bg-rod-foreground'>
            <Inbox className="w-8 h-8 text-gray-500" />
          </div>
          
          <p className="text-sm   text-center text-gray-500">
            Aucune notification pour le moment.
          </p>
        </div>
      ) : (
        <>
          <div className="px-0 py-0 space-y-0 ">
           {formattedNotifications.map((notification) => {
              const colors = typeColors[notification.type] || {
                bg: "bg-rod-foreground",
                color: "text-rod-primary",
              };
              const Icon = iconMap[notification.object] || Info;

              return (
                <div 
                  key={notification.id} 
                  className="flex items-start gap-4 px-4 py-3 cursor-pointer hover:bg-rod-foreground "
                  onClick={() => handleNotificationClick(notification.id, notification.read)}
                >
                  <div 
                    className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full"
                    style={{ backgroundColor: colors.bg, color: colors.color }}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0 ">
                    <h1 className={` text-base mb-1.5 flex items-start leading-none gap-1.5 ${notification.read ? 'text-gray-500 font-medium' : 'text-rod-primary font-medium'}`}>
                      {notification.title}
                      {!notification.read && <span className="w-2 h-2 mt-0.5 rounded-full bg-red-500" />}
                    </h1>
                    <p className="text-sm text-gray-500 mb-1 leading-none break-words w-full">{notification.message}</p>
                    <div className='flex items-center text-gray-500 gap-1'>
                      <Clock3 size={12} />
                      <p className="text-sm leading-tight mt-0.5">{notification.time}</p>
                    </div>
                  </div>
                </div>
              );
            })} 
          </div>
        </>
      )}
      </PopoverContent>         
  </Popover> 
  )
}

export default Notifications