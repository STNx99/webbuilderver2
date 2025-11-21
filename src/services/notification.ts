import type { 
  NotificationResponse, 
  UpdateNotificationPayload,
  NotificationFilters 
} from '@/interfaces/notification.interface'

const API_BASE = '/api/notifications'

export const notificationService = {
  getNotifications: async (filters?: NotificationFilters): Promise<NotificationResponse> => {
    const params = new URLSearchParams()
    
    if (filters?.filter) {
      params.append('filter', filters.filter)
    }
    
    if (filters?.search) {
      params.append('search', filters.search)
    }

    const url = params.toString() ? `${API_BASE}?${params.toString()}` : API_BASE
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error('Failed to fetch notifications')
    }
    
    return response.json()
  },

  updateNotification: async (payload: UpdateNotificationPayload): Promise<void> => {
    const response = await fetch(API_BASE, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update notification')
    }
    
    return response.json()
  },

  markAllAsRead: async (): Promise<void> => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to mark all as read')
    }
    
    return response.json()
  },
}
