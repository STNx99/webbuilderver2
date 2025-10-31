import { NextRequest, NextResponse } from 'next/server';
import { verifyReturnUrl } from '@/lib/vnpay-utils';
import vnpayConfig from '@/lib/vnpay-config';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const vnp_Params: Record<string, any> = {};

    // Extract all query params
    searchParams.forEach((value, key) => {
      vnp_Params[key] = value;
    });

    // Verify signature
    const isValid = verifyReturnUrl(vnp_Params, vnpayConfig.vnp_HashSecret);

    if (!isValid) {
      // Redirect to checkout with error
      return NextResponse.redirect(
        new URL('/checkout?payment=failed&reason=invalid_signature', request.url)
      );
    }

    const transactionId = vnp_Params['vnp_TxnRef'];
    const responseCode = vnp_Params['vnp_ResponseCode'];
    const transactionNo = vnp_Params['vnp_TransactionNo'];
    const bankCode = vnp_Params['vnp_BankCode'];
    const cardType = vnp_Params['vnp_CardType'];
    const payDate = vnp_Params['vnp_PayDate']; // Format: YYYYMMDDHHmmss
    const amount = parseInt(vnp_Params['vnp_Amount']) / 100;

    // Find the subscription
    const subscription = await prisma.subscription.findUnique({
      where: { Id: transactionId },
    });

    if (!subscription) {
      return NextResponse.redirect(
        new URL('/checkout?payment=failed&reason=transaction_not_found', request.url)
      );
    }

    // Update subscription based on response code
    if (responseCode === '00') {
      // Payment successful
      const startDate = new Date();
      const endDate = subscription.BillingPeriod === 'yearly'
        ? new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate())
        : new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());

      // Parse pay date from VNPay format (YYYYMMDDHHmmss)
      let payDateTime = null;
      if (payDate) {
        const year = parseInt(payDate.substring(0, 4));
        const month = parseInt(payDate.substring(4, 6)) - 1;
        const day = parseInt(payDate.substring(6, 8));
        const hour = parseInt(payDate.substring(8, 10));
        const minute = parseInt(payDate.substring(10, 12));
        const second = parseInt(payDate.substring(12, 14));
        payDateTime = new Date(year, month, day, hour, minute, second);
      }

      await prisma.subscription.update({
        where: { Id: transactionId },
        data: {
          Status: 'active',
          StartDate: startDate,
          EndDate: endDate,
          TransactionNo: transactionNo || null,
          BankCode: bankCode || null,
          CardType: cardType || null,
          PayDate: payDateTime,
        },
      });

      // Redirect to success page
      return NextResponse.redirect(
        new URL(`/checkout/success?transactionId=${transactionId}&amount=${amount}`, request.url)
      );
    } else {
      // Payment failed
      await prisma.subscription.update({
        where: { Id: transactionId },
        data: {
          Status: 'failed',
        },
      });

      // Redirect to checkout with error
      return NextResponse.redirect(
        new URL(`/checkout?payment=failed&reason=payment_declined&code=${responseCode}`, request.url)
      );
    }
  } catch (error) {
    console.error('Error processing VNPay return:', error);
    return NextResponse.redirect(
      new URL('/checkout?payment=failed&reason=server_error', request.url)
    );
  }
}
