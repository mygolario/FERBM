import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload.config";

export async function GET() {
  let totalSales = 0;
  let ordersCount = 0;
  let bestSellers: { title: string; count: number; sales: number }[] = [];

  try {
    const payload = await getPayload({ config });
    const orders = await payload.find({
      collection: "orders",
      where: {
        paymentStatus: {
          equals: "paid",
        },
      },
      limit: 1000,
    });

    ordersCount = orders.docs.length;
    
    // Calculate total sales and item occurrences
    const productSalesMap: Record<string, { title: string; count: number; sales: number }> = {};

    orders.docs.forEach((order: any) => {
      totalSales += order.totalAmount || 0;
      order.items?.forEach((item: any) => {
        const prod = item.product;
        const prodId = typeof prod === "object" ? prod.id : prod;
        const prodTitle = typeof prod === "object" ? prod.title : "محصول نامشخص";
        const qty = item.quantity || 1;
        const price = item.priceAtPurchase || 0;

        if (!productSalesMap[prodId]) {
          productSalesMap[prodId] = { title: prodTitle, count: 0, sales: 0 };
        }
        productSalesMap[prodId].count += qty;
        productSalesMap[prodId].sales += qty * price;
      });
    });

    bestSellers = Object.values(productSalesMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

  } catch (error) {
    console.warn("Could not query orders for analytics:", error);
  }

  // GA4 API Integration Mock/Real handler
  const gaPropertyId = process.env.GA4_PROPERTY_ID;
  const serviceAccountKey = process.env.GA4_SERVICE_ACCOUNT_KEY;

  let trafficMetrics = {
    todayViews: 145,
    weekViews: 980,
    monthViews: 4200,
    activeUsers: 8,
    conversionRate: ordersCount > 0 ? ((ordersCount / 4200) * 100).toFixed(2) : "1.80",
    trafficSources: [
      { source: "اینستاگرام (Instagram)", count: 2450, percentage: 58 },
      { source: "ورود مستقیم (Direct)", count: 1260, percentage: 30 },
      { source: "جستجوی گوگل (Organic Search)", count: 490, percentage: 12 },
    ],
    topPages: [
      { path: "/", title: "صفحه اصلی گالری", views: 2100 },
      { path: "/shop", title: "فروشگاه هنر سرامیک", views: 1450 },
      { path: "/shop/fleshy-eyeball-tower", title: "مخروط چشم‌دار اساطیری", views: 320 },
      { path: "/blog/clay-wedging-art", title: "آموزش ورز دادن گل رس", views: 240 },
    ],
    isRealData: false,
  };

  // If credentials exist, we would load @google-analytics/data
  // Here we write the logic check, keeping it ready for real credentials
  if (gaPropertyId && serviceAccountKey && serviceAccountKey !== "mock_service_account_key") {
    try {
      // In production, instantiate BetaAnalyticsDataClient and run query
      // const client = new BetaAnalyticsDataClient({ credentials: JSON.parse(serviceAccountKey) });
      // const [response] = await client.runReport({ ... });
      // parse response and update trafficMetrics.isRealData = true
    } catch (e) {
      console.error("GA4 Data API call failed, using mocks:", e);
    }
  }

  return NextResponse.json({
    sales: {
      totalSales,
      ordersCount,
      bestSellers,
    },
    traffic: trafficMetrics,
  });
}
