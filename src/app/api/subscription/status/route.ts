import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the most recent active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        UserId: userId,
        Status: 'active',
        EndDate: {
          gt: new Date() // Still valid
        }
      },
      orderBy: {
        CreatedAt: 'desc',
      },
    })

    if (!subscription) {
      return NextResponse.json({ 
        hasActiveSubscription: false,
        plan: 'hobby' // Default to free plan
      })
    }

    // Check if subscription is expiring soon (within 7 days)
    const daysUntilExpiry = Math.ceil(
      (new Date(subscription.EndDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )

    return NextResponse.json({
      hasActiveSubscription: true,
      subscription: {
        id: subscription.Id,
        planId: subscription.PlanId,
        billingPeriod: subscription.BillingPeriod,
        startDate: subscription.StartDate,
        endDate: subscription.EndDate,
        status: subscription.Status,
        daysUntilExpiry,
        canRenew: daysUntilExpiry <= 30
      }
    })
  } catch (error) {
    console.error('Error fetching subscription status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
