"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { notificationService } from "@/services/notification"
import type { NotificationFilters, UpdateNotificationPayload } from "@/interfaces/notification.interface"
import { toast } from "sonner"

export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (filters?: NotificationFilters) => [...notificationKeys.lists(), filters] as const,
}

export function useNotifications(filters?: NotificationFilters) {
  return useQuery({
    queryKey: notificationKeys.list(filters),
    queryFn: () => notificationService.getNotifications(filters),
    staleTime: 1000 * 30, // 30 seconds
  })
}

export function useUpdateNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateNotificationPayload) => 
      notificationService.updateNotification(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
    onError: (error) => {
      toast.error("Failed to update notification")
      console.error("Error updating notification:", error)
    },
  })
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
      toast.success("All notifications marked as read")
    },
    onError: (error) => {
      toast.error("Failed to mark all as read")
      console.error("Error marking all as read:", error)
    },
  })
}

export function useCreateProfileUpdateNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { description: string }) => {
      const response = await fetch('/api/notifications/profile-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create notification')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
    onError: (error) => {
      console.error("Error creating profile update notification:", error)
    },
  })
}
