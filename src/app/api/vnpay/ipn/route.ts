import { NextRequest, NextResponse } from 'next/server';
import { verifyReturnUrl } from '@/lib/vnpay-utils';
import vnpayConfig from '@/lib/vnpay-config';
import { subscriptionDAL } from '@/data/subscription';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const vnp_Params: Record<string, any> = {};

    // Extract all query params
    searchParams.forEach((value, key) => {
      vnp_Params[key] = value;
    });

    const transactionId = vnp_Params['vnp_TxnRef'];
    const responseCode = vnp_Params['vnp_ResponseCode'];

    // Verify signature
    const isValid = verifyReturnUrl(vnp_Params, vnpayConfig.vnp_HashSecret);

    if (!isValid) {
      return NextResponse.json({
        RspCode: '97',
        Message: 'Invalid signature'
      });
    }

    // Find the subscription using DAL
    const subscription = await subscriptionDAL.getSubscriptionById(transactionId);

    if (!subscription) {
      return NextResponse.json({
        RspCode: '01',
        Message: 'Order not found'
      });
    }

    // Check if already processed
    if (subscription.Status !== 'pending') {
      return NextResponse.json({
        RspCode: '02',
        Message: 'Order already updated'
      });
    }

    // Get additional payment info
    const transactionNo = vnp_Params['vnp_TransactionNo'];
    const bankCode = vnp_Params['vnp_BankCode'];
    const cardType = vnp_Params['vnp_CardType'];
    const payDate = vnp_Params['vnp_PayDate'];

    // Update subscription based on response code
    if (responseCode === '00') {
      console.log('[VNPay IPN] Payment successful for transaction:', transactionId);
      
      const startDate = new Date();
      const endDate = subscription.BillingPeriod === 'yearly'
        ? new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate())
        : new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());

      // Parse pay date
      let payDateTime: Date | undefined = undefined;
      if (payDate) {
        const year = parseInt(payDate.substring(0, 4));
        const month = parseInt(payDate.substring(4, 6)) - 1;
        const day = parseInt(payDate.substring(6, 8));
        const hour = parseInt(payDate.substring(8, 10));
        const minute = parseInt(payDate.substring(10, 12));
        const second = parseInt(payDate.substring(12, 14));
        payDateTime = new Date(year, month, day, hour, minute, second);
      }

      // Cancel all other active subscriptions for this user using DAL
      await subscriptionDAL.cancelAllActiveSubscriptions(subscription.UserId, transactionId);

      console.log('[VNPay IPN] Updating subscription to active');
      await subscriptionDAL.updateSubscription(transactionId, {
        status: 'active',
        startDate,
        endDate,
        transactionNo,
        bankCode,
        cardType,
        payDate: payDateTime || undefined,
      });
      
      console.log('[VNPay IPN] Subscription updated successfully');
    } else {
      await subscriptionDAL.updateSubscription(transactionId, { status: 'cancelled' });
    }

    return NextResponse.json({
      RspCode: '00',
      Message: 'Success'
    });
  } catch (error) {
    console.error('Error processing VNPay IPN:', error);
    return NextResponse.json({
      RspCode: '99',
      Message: 'Unknown error'
    });
  }
}
