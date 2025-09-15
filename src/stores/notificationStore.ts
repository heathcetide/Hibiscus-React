import { create } from 'zustand'
import { 
  getUnreadNotificationCount, 
  getNotifications, 
  markAllNotificationsAsRead, 
  markNotificationAsRead, 
  deleteNotification,
  type Notification,
  type UnreadCountResponse,
  type NotificationListResponse
} from '../api/notification'

interface NotificationState {
  unreadCount: number
  notifications: Notification[]
  isLoading: boolean
  isUnreadCountLoading: boolean
  
  // Actions
  fetchUnreadCount: () => Promise<void>
  fetchNotifications: (params?: { page?: number; pageSize?: number; type?: string; isRead?: boolean }) => Promise<void>
  markAllAsRead: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  setUnreadCount: (count: number) => void
  clearNotifications: () => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  unreadCount: 0,
  notifications: [],
  isLoading: false,
  isUnreadCountLoading: false,

  fetchUnreadCount: async () => {
    set({ isUnreadCountLoading: true })
    try {
      const response = await getUnreadNotificationCount()
      if (response.code === 200) {
        set({ unreadCount: response.data })
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    } finally {
      set({ isUnreadCountLoading: false })
    }
  },

  fetchNotifications: async (params = {}) => {
    set({ isLoading: true })
    try {
      const response = await getNotifications(params)
      if (response.code === 200) {
        set({ notifications: response.data.list || [] })
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      set({ notifications: [] })
    } finally {
      set({ isLoading: false })
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await markAllNotificationsAsRead()
      if (response.code === 200) {
        set({ 
          unreadCount: 0,
          notifications: get().notifications.map(n => ({ ...n, read: true }))
        })
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  },

  markAsRead: async (id: string | number) => {
    try {
      const response = await markNotificationAsRead(id)
      if (response.code === 200) {
        const { notifications, unreadCount } = get()
        const updatedNotifications = notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        )
        const newUnreadCount = Math.max(0, unreadCount - 1)
        
        set({ 
          notifications: updatedNotifications,
          unreadCount: newUnreadCount
        })
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  },

  deleteNotification: async (id: string | number) => {
    try {
      const response = await deleteNotification(id)
      if (response.code === 200) {
        const { notifications, unreadCount } = get()
        const notification = notifications.find(n => n.id === id)
        const updatedNotifications = notifications.filter(n => n.id !== id)
        const newUnreadCount = notification && !notification.read 
          ? Math.max(0, unreadCount - 1) 
          : unreadCount
        
        set({ 
          notifications: updatedNotifications,
          unreadCount: newUnreadCount
        })
      }
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  },

  setUnreadCount: (count: number) => {
    set({ unreadCount: count })
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 })
  }
}))
