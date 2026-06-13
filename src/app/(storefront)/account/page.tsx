import React from "react";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { getPayload } from "payload";
import config from "@/payload.config";
import { formatToman } from "@/lib/toman";
import { LoginForm } from "@/components/auth/LoginForm";
import { LogOut, ShoppingBag, MapPin, Calendar, CreditCard } from "lucide-react";

export default async function AccountPage() {
  const session = await auth();

  // If not authenticated, render login form
  if (!session || !session.user) {
    return (
      <div className="py-20 px-4">
        <LoginForm />
      </div>
    );
  }

  const phone = (session.user as any).phone || session.user.id;
  let customerProfile: any = null;
  let ordersList: any[] = [];

  try {
    const payload = await getPayload({ config });

    // 1. Fetch customer details
    const customers = await payload.find({
      collection: "customers",
      where: {
        phone: {
          equals: phone,
        },
      },
      limit: 1,
    });

    if (customers.docs.length > 0) {
      customerProfile = customers.docs[0];

      // 2. Fetch customer orders
      const orders = await payload.find({
        collection: "orders",
        where: {
          customer: {
            equals: customerProfile.id,
          },
        },
        sort: "-createdAt",
        limit: 50,
      });
      ordersList = orders.docs;
    }
  } catch (error) {
    console.error("Error fetching account profile data:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border-dark pb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">حساب کاربری شما</h1>
          <p className="text-xs text-text-muted mt-2">
            خوش آمدید، {session.user.name || "هنردوست گرامی"}
          </p>
        </div>

        {/* Logout Form using Server Action */}
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 border border-border-dark hover:border-red-500/30 text-text-muted hover:text-red-400 rounded-sm text-xs transition-colors"
          >
            <LogOut size={14} />
            <span>خروج از حساب</span>
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Profile Details (4 cols) */}
        <div className="lg:col-span-4 p-6 glass-panel border border-border-dark rounded-sm space-y-6">
          <h2 className="text-sm font-bold text-white border-b border-border-dark pb-2">
            اطلاعات کاربری
          </h2>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <span className="text-text-muted">نام و نام خانوادگی:</span>
              <p className="text-white font-semibold">{customerProfile?.name || session.user.name}</p>
            </div>
            <div className="space-y-1">
              <span className="text-text-muted">شماره تلفن همراه:</span>
              <p className="text-white font-semibold font-sans">{phone}</p>
            </div>
            {session.user.email && !session.user.email.includes("@ferbm.com") && (
              <div className="space-y-1">
                <span className="text-text-muted">آدرس ایمیل:</span>
                <p className="text-white font-semibold font-sans">{session.user.email}</p>
              </div>
            )}
          </div>

          {/* Delivery Addresses */}
          {customerProfile?.addresses && customerProfile.addresses.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-border-dark/60">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <MapPin size={12} className="text-accent-gold" />
                <span>نشانی ثبت شده</span>
              </h3>
              {customerProfile.addresses.map((addr: any, idx: number) => (
                <div key={idx} className="p-3 bg-black/30 border border-border-dark/60 rounded-sm text-[11px] leading-relaxed text-text-muted">
                  <strong>{addr.province}، {addr.city}</strong>
                  <p className="mt-1">{addr.fullAddress}</p>
                  <p className="mt-1 font-sans">کد پستی: {addr.postalCode}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders History (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-base font-bold text-white">تاریخچه سفارشات شما</h2>

          {ordersList.length === 0 ? (
            <div className="p-12 text-center glass-panel border border-border-dark rounded-sm space-y-4">
              <ShoppingBag size={36} className="text-border-dark mx-auto" />
              <p className="text-sm text-text-muted">تاکنون سفارشی در این حساب ثبت نشده است.</p>
              <Link
                href="/shop"
                className="inline-block px-6 py-2 rounded-sm silver-gradient text-black font-bold text-xs"
              >
                مشاهده فروشگاه هنر
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {ordersList.map((order) => {
                let statusLabel = order.paymentStatus;
                let statusColor = "text-text-muted";

                if (order.paymentStatus === "pending_payment") {
                  statusLabel = "در انتظار پرداخت";
                  statusColor = "text-yellow-400 bg-yellow-500/5 border-yellow-500/20";
                } else if (order.paymentStatus === "paid") {
                  statusLabel = "پرداخت شده";
                  statusColor = "text-green-400 bg-green-500/5 border-green-500/20";
                } else if (order.paymentStatus === "preparing") {
                  statusLabel = "در حال آماده‌سازی";
                  statusColor = "text-blue-400 bg-blue-500/5 border-blue-500/20";
                } else if (order.paymentStatus === "shipped") {
                  statusLabel = "ارسال شده";
                  statusColor = "text-accent-silver bg-white/5 border-white/10";
                } else if (order.paymentStatus === "delivered") {
                  statusLabel = "تحویل داده شده";
                  statusColor = "text-white bg-white/10 border-white/20";
                } else if (order.paymentStatus === "cancelled") {
                  statusLabel = "لغو شده";
                  statusColor = "text-red-400 bg-red-500/5 border-red-500/20";
                }

                return (
                  <div
                    key={order.id}
                    className="p-5 glass-panel border border-border-dark rounded-sm space-y-4"
                  >
                    {/* Header line */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-dark/60 pb-3 text-xs">
                      <div className="flex gap-4">
                        <div>
                          <span className="text-text-muted ml-1">شماره سفارش:</span>
                          <strong className="text-white font-sans">{order.orderNumber}</strong>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={12} className="text-text-muted" />
                          <span className="text-text-muted">{order.jalaliCreatedAt}</span>
                        </div>
                      </div>
                      
                      <span className={`px-2.5 py-1 rounded-sm border text-[10px] font-bold ${statusColor}`}>
                        {statusLabel}
                      </span>
                    </div>

                    {/* Order items info list */}
                    <div className="space-y-2 text-xs">
                      {order.items?.map((item: any, idx: number) => {
                        const productTitle =
                          typeof item.product === "object"
                            ? item.product.title
                            : "محصول کارگاهی";
                        return (
                          <div key={idx} className="flex justify-between text-text-muted">
                            <span>
                              {productTitle} × {(item.quantity || 1).toLocaleString("fa-IR")}
                            </span>
                            <span className="font-semibold text-white">
                              {formatToman(item.priceAtPurchase * (item.quantity || 1))}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer price line */}
                    <div className="flex justify-between items-baseline pt-3 border-t border-border-dark/40 text-xs">
                      <div className="flex items-center gap-1.5 text-text-muted">
                        <CreditCard size={12} />
                        <span>روش ارسال: {order.shippingMethod === "chapar" ? "پست چاپار" : "تیپاکس"}</span>
                      </div>
                      <div>
                        <span className="text-text-muted ml-2">مبلغ پرداختی:</span>
                        <strong className="text-sm text-accent-gold">{formatToman(order.totalAmount)}</strong>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
