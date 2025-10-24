import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'

export interface Subscription {
  Id: string
  UserId: string
  PlanId: string
  BillingPeriod: string
  Status: string
  StartDate: string
  EndDate: string | null
  Amount: number
  Currency: string
  CreatedAt: string
  UpdatedAt: string
}

export function useSubscription() {
  const { userId, isLoaded } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded || !userId) {
      setLoading(false)
      return
    }

    const fetchSubscription = async () => {
      try {
        setLoading(true)
        setError(null)

        // For now, we'll create a simple API to get current subscription
        // In production, you might want to get the most recent active subscription
        const response = await fetch('/api/subscription')

        if (response.ok) {
          const data = await response.json()
          setSubscription(data.subscription)
        } else if (response.status === 404) {
          // No subscription found
          setSubscription(null)
        } else {
          throw new Error('Failed to fetch subscription')
        }
      } catch (err) {
        console.error('Error fetching subscription:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [userId, isLoaded])

  return {
    subscription,
    loading,
    error,
    isSubscribed: subscription?.Status === 'active',
    planId: subscription?.PlanId,
    billingPeriod: subscription?.BillingPeriod,
  }
}