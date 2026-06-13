import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload.config";
import { requestPayment } from "@/lib/zibal";
import { getJalaliDateString } from "@/lib/jalali";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, customer, items, shippingMethod, shippingFee } = body;

    if (!amount || !customer || !items || !shippingMethod) {
      return NextResponse.json(
        { message: "اطلاعات ارسالی ناقص است." },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config });

    // 1. Check or Create Customer record
    let dbCustomer: any = null;
    const existingCustomers = await payload.find({
      collection: "customers",
      where: {
        phone: {
          equals: customer.phone,
        },
      },
      limit: 1,
    });

    if (existingCustomers.docs.length > 0) {
      dbCustomer = existingCustomers.docs[0];
      // Optionally update addresses in customer profile
      await payload.update({
        collection: "customers",
        id: dbCustomer.id,
        data: {
          name: customer.name,
          email: customer.email,
          addresses: [
            {
              province: customer.province,
              city: customer.city,
              fullAddress: customer.fullAddress,
              postalCode: customer.postalCode,
            },
          ],
        },
      });
    } else {
      dbCustomer = await payload.create({
        collection: "customers",
        data: {
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          addresses: [
            {
              province: customer.province,
              city: customer.city,
              fullAddress: customer.fullAddress,
              postalCode: customer.postalCode,
            },
          ],
        },
      });
    }

    // 2. Generate unique order number (e.g. FERBM-1718293751)
    const timestamp = Math.floor(Date.now() / 1000);
    const orderNumber = `FERBM-${timestamp}`;

    // 3. Calculate subtotal & totals
    const subtotal = amount - shippingFee;
    const jalaliDate = getJalaliDateString(new Date());

    // 4. Create Order record in database (pending_payment status)
    const dbOrder = await payload.create({
      collection: "orders",
      data: {
        orderNumber,
        customer: dbCustomer.id,
        items: items.map((item: any) => ({
          product: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.price,
        })),
        subtotal,
        shippingFee,
        shippingMethod,
        totalAmount: amount,
        paymentStatus: "pending_payment",
        shippingAddress: {
          recipientName: customer.name,
          recipientPhone: customer.phone,
          province: customer.province,
          city: customer.city,
          fullAddress: customer.fullAddress,
          postalCode: customer.postalCode,
        },
        jalaliCreatedAt: jalaliDate,
      },
    });

    // 5. Initiate Zibal Payment
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ferbm.com";
    const callbackUrl = `${siteUrl}/api/payment/verify`;
    const zibalRes = await requestPayment({
      amountToman: amount,
      orderId: dbOrder.id.toString(),
      callbackUrl,
      description: `سفارش فربم شماره ${orderNumber}`,
    });

    if (zibalRes.result === 100 && zibalRes.trackId) {
      // 6. Update order with trackId
      await payload.update({
        collection: "orders",
        id: dbOrder.id,
        data: {
          zibalTrackId: zibalRes.trackId.toString(),
        },
      });

      return NextResponse.json({
        redirectUrl: zibalRes.redirectUrl,
      });
    }

    return NextResponse.json(
      { message: zibalRes.message || "خطا در درخواست درگاه پرداخت" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Payment Request API Route Error:", error);
    return NextResponse.json(
      { message: "خطای سرور در ایجاد سفارش پستی" },
      { status: 500 }
    );
  }
}
