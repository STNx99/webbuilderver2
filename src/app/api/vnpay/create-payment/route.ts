import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import moment from 'moment';
import { createPaymentUrl, convertUSDtoVND } from '@/lib/vnpay-utils';
import vnpayConfig from '@/lib/vnpay-config';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { planId, billingPeriod, amount, email } = body;


    if (!planId || !billingPeriod || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for existing active subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        UserId: userId,
        Status: 'active',
        EndDate: {
          gt: new Date() // Still valid
        }
      },
      orderBy: {
        CreatedAt: 'desc'
      }
    });

    if (existingSubscription) {
      if (existingSubscription.PlanId === planId && existingSubscription.BillingPeriod === billingPeriod) {
        return NextResponse.json(
          { 
            error: 'Bạn đã có gói đăng ký này đang hoạt động',
            existingSubscription: {
              planId: existingSubscription.PlanId,
              endDate: existingSubscription.EndDate
            }
          },
          { status: 409 }
        );
      }
      console.log('[Payment] User upgrading/downgrading from', existingSubscription.PlanId, 'to', planId);
    }

    // Convert amount from USD to VND
    const amountVND = convertUSDtoVND(amount);

    // Create order ID
    const orderId = `${userId}_${moment().format('DDHHmmss')}`;
    
    // Get IP address
    const ipAddr = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   '127.0.0.1';

    // Create order info
    const orderInfo = `Thanh toan goi ${planId} - ${billingPeriod}`;


    // Create pending transaction in database
    const transaction = await prisma.subscription.create({
      data: {
        UserId: userId,
        PlanId: planId,
        BillingPeriod: billingPeriod,
        Amount: amountVND, // Lưu giá VND thay vì USD
        Status: 'pending',
        Currency: 'VND',
        Email: email || null,
      },
    });

    // Create payment URL
    const paymentUrl = createPaymentUrl({
      amount: amountVND,
      orderId: transaction.Id,
      orderInfo,
      ipAddr,
      returnUrl: vnpayConfig.vnp_ReturnUrl,
      tmnCode: vnpayConfig.vnp_TmnCode,
      hashSecret: vnpayConfig.vnp_HashSecret,
      vnpUrl: vnpayConfig.vnp_Url,
    });

    return NextResponse.json({
      success: true,
      paymentUrl,
      transactionId: transaction.Id,
      orderId: transaction.Id,
    });
  } catch (error) {
    console.error('Error creating VNPay payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
