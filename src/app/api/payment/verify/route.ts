import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload.config";
import { verifyPayment } from "@/lib/zibal";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const trackId = searchParams.get("trackId");
  const success = searchParams.get("success"); // "1" for success, "0" for fail

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ferbm.com";

  if (!trackId) {
    return NextResponse.redirect(`${siteUrl}/orders?success=false&error=${encodeURIComponent("شناسه تراکنش نامعتبر است.")}`);
  }

  try {
    const payload = await getPayload({ config });

    // Find the corresponding order in the database
    const orderDocs = await payload.find({
      collection: "orders",
      where: {
        zibalTrackId: {
          equals: trackId,
        },
      },
      limit: 1,
    });

    if (orderDocs.docs.length === 0) {
      return NextResponse.redirect(
        `${siteUrl}/orders?success=false&error=${encodeURIComponent("سفارشی با این شناسه تراکنش یافت نشد.")}`
      );
    }

    const order = orderDocs.docs[0];

    // If success query is "0", transaction was cancelled by user
    if (success === "0") {
      await payload.update({
        collection: "orders",
        id: order.id,
        data: {
          paymentStatus: "cancelled",
        },
      });
      return NextResponse.redirect(
        `${siteUrl}/orders?success=false&orderNo=${order.orderNumber}&error=${encodeURIComponent("پرداخت توسط کاربر لغو شد.")}`
      );
    }

    // Call Zibal verification API
    const verifyRes = await verifyPayment(trackId);

    // Result 100 = success, 101 = already verified, 102 = reverse payment
    if (verifyRes.result === 100 || verifyRes.result === 101) {
      // Update order status to paid (or preparing)
      await payload.update({
        collection: "orders",
        id: order.id,
        data: {
          paymentStatus: "paid",
        },
      });

      // Redirect to success storefront order page
      return NextResponse.redirect(
        `${siteUrl}/orders?success=true&orderNo=${order.orderNumber}&date=${encodeURIComponent(
          order.jalaliCreatedAt || ""
        )}&ref=${verifyRes.refNumber || ""}`
      );
    } else {
      // Verification failed
      await payload.update({
        collection: "orders",
        id: order.id,
        data: {
          paymentStatus: "cancelled",
        },
      });

      return NextResponse.redirect(
        `${siteUrl}/orders?success=false&orderNo=${order.orderNumber}&error=${encodeURIComponent(
          verifyRes.message || "تایید تراکنش ناموفق بود"
        )}`
      );
    }
  } catch (error) {
    console.error("Zibal Callback Route Error:", error);
    return NextResponse.redirect(
      `${siteUrl}/orders?success=false&error=${encodeURIComponent("خطای سیستمی در پردازش پاسخ درگاه بانکی")}`
    );
  }
}
