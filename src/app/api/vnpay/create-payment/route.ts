import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import moment from 'moment';
import { createPaymentUrl, convertUSDtoVND } from '@/lib/vnpay-utils';
import vnpayConfig from '@/lib/vnpay-config';
import { subscriptionDAL } from '@/data/subscription';

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

    // Check for existing active subscription using DAL
    const subscriptionStatus = await subscriptionDAL.getSubscriptionStatus(userId);

    if (subscriptionStatus.hasActiveSubscription) {
      const existingSub = subscriptionStatus.subscription!;
      if (existingSub.planId === planId && existingSub.billingPeriod === billingPeriod) {
        return NextResponse.json(
          {
            error: 'Bạn đã có gói đăng ký này đang hoạt động',
            existingSubscription: {
              planId: existingSub.planId,
              endDate: existingSub.endDate
            }
          },
          { status: 409 }
        );
      }
      console.log('[Payment] User upgrading/downgrading from', existingSub.planId, 'to', planId);
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

    // Create pending transaction in database using DAL
    const transaction = await subscriptionDAL.createSubscription({
      userId,
      planId,
      billingPeriod,
      amount: amountVND,
      email,
      startDate: new Date(),
      endDate: new Date(), // Will be updated when payment is confirmed
    });

    // Update status to pending
    await subscriptionDAL.updateSubscription(transaction.Id, { status: 'pending' });

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