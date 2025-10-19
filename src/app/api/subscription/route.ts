import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth, currentUser } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    const clerkUser = await currentUser()

    if (!userId || !clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user exists in database, if not create them
    let user = await prisma.user.findUnique({
      where: { Id: userId }
    })

    if (!user) {
      // Create user record in database
      user = await prisma.user.create({
        data: {
          Id: userId,
          Email: clerkUser.emailAddresses[0]?.emailAddress || '',
          FirstName: clerkUser.firstName,
          LastName: clerkUser.lastName,
          ImageUrl: clerkUser.imageUrl,
          CreatedAt: new Date(),
          UpdatedAt: new Date(),
        }
      })
    }

    // Get the most recent active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        UserId: userId,
        Status: 'active',
      },
      orderBy: {
        CreatedAt: 'desc',
      },
    })

    if (!subscription) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
    }

    return NextResponse.json({
      subscription,
    })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    const clerkUser = await currentUser()

    if (!userId || !clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { planId, billingPeriod, amount } = body

    if (!planId || !billingPeriod || amount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: planId, billingPeriod, amount' },
        { status: 400 }
      )
    }

    let user = await prisma.user.findUnique({
      where: { Id: userId }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          Id: userId,
          Email: clerkUser.emailAddresses[0]?.emailAddress || '',
          FirstName: clerkUser.firstName,
          LastName: clerkUser.lastName,
          ImageUrl: clerkUser.imageUrl,
          CreatedAt: new Date(),
          UpdatedAt: new Date(),
        }
      })
    }

    const startDate = new Date()
    const endDate = billingPeriod === 'yearly'
      ? new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate())
      : new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate())

    const subscription = await prisma.subscription.create({
      data: {
        UserId: userId,
        PlanId: planId,
        BillingPeriod: billingPeriod,
        Amount: amount,
        EndDate: endDate,
      },
    })

    return NextResponse.json({
      success: true,
      subscription,
    })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}