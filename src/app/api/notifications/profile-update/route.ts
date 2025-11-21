import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { description } = body

    // Create notification for profile update
    await prisma.notification.create({
      data: {
        UserId: userId,
        Type: 'settings',
        Title: 'Profile Updated',
        Description: description || 'You updated your profile information.',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating profile update notification:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}
