import React from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Calendar, Hash, Receipt, ShoppingBag } from "lucide-react";

type Props = {
  searchParams: Promise<{
    success?: string;
    orderNo?: string;
    date?: string;
    ref?: string;
    error?: string;
  }>;
};

export const metadata = {
  title: "وضعیت پرداخت سفارش | فربم",
};

export default async function OrdersPage({ searchParams }: Props) {
  const params = await searchParams;
  const isSuccess = params.success === "true";
  const orderNo = params.orderNo || "";
  const date = params.date || "";
  const refCode = params.ref || "";
  const errorMsg = params.error || "";

  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <div className="glass-panel border border-border-dark p-8 sm:p-10 rounded-sm text-center space-y-8">
        
        {/* SUCCESS STATE */}
        {isSuccess ? (
          <>
            <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 flex items-center justify-center rounded-full mx-auto text-green-400">
              <CheckCircle2 size={44} className="stroke-[1.5]" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-white">پرداخت شما با موفقیت انجام شد!</h1>
              <p className="text-xs text-text-muted">
                سپاس از انتخاب آثار کارگاهی فربم. سفارش شما با موفقیت در سیستم ثبت گردید.
              </p>
            </div>

            {/* Receipt details */}
            <div className="bg-black/40 border border-border-dark/60 rounded-sm p-4 text-xs text-right space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text-muted flex items-center gap-1">
                  <Hash size={14} />
                  <span>شماره سفارش:</span>
                </span>
                <strong className="text-white font-sans">{orderNo}</strong>
              </div>
              <div className="flex justify-between items-center border-t border-border-dark/30 pt-3">
                <span className="text-text-muted flex items-center gap-1">
                  <Calendar size={14} />
                  <span>تاریخ ثبت:</span>
                </span>
                <span className="text-white">{decodeURIComponent(date)}</span>
              </div>
              {refCode && (
                <div className="flex justify-between items-center border-t border-border-dark/30 pt-3">
                  <span className="text-text-muted flex items-center gap-1">
                    <Receipt size={14} />
                    <span>کد رهگیری بانکی (شماره ارجاع):</span>
                  </span>
                  <strong className="text-white font-sans">{refCode}</strong>
                </div>
              )}
            </div>

            <p className="text-[11px] text-text-muted leading-relaxed max-w-md mx-auto">
              سفارش شما در حال حاضر در مرحله آماده‌سازی و بسته‌بندی ویژه شکستنی‌ها قرار دارد. به محض تحویل مرسوله به مامور پست چاپار/تیپاکس، کد رهگیری ارسال پستی برای شما پیامک خواهد شد.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link
                href="/account"
                className="w-full sm:w-1/2 py-3 rounded-sm silver-gradient text-black font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <span>پیگیری سفارش در پنل کاربری</span>
              </Link>
              <Link
                href="/shop"
                className="w-full sm:w-1/2 py-3 border border-border-dark rounded-sm hover:bg-surface/50 text-white font-semibold text-xs transition-colors flex items-center justify-center"
              >
                <span>ادامه بازدید از گالری</span>
              </Link>
            </div>
          </>
        ) : (
          /* FAILURE / CANCEL STATE */
          <>
            <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 flex items-center justify-center rounded-full mx-auto text-red-400">
              <XCircle size={44} className="stroke-[1.5]" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-black text-white">تراکنش ناموفق بود یا لغو شد</h1>
              <p className="text-xs text-text-muted">
                پرداخت شما توسط درگاه تایید نگردید و سفارش شما در حالت معلق قرار گرفت.
              </p>
            </div>

            {orderNo && (
              <div className="bg-black/40 border border-border-dark/60 rounded-sm p-4 text-xs text-right space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted flex items-center gap-1">
                    <Hash size={14} />
                    <span>شماره سفارش معلق:</span>
                  </span>
                  <strong className="text-white font-sans">{orderNo}</strong>
                </div>
                {errorMsg && (
                  <div className="flex justify-between items-center border-t border-border-dark/30 pt-3">
                    <span className="text-text-muted">علت خطا:</span>
                    <span className="text-red-400 font-semibold">{decodeURIComponent(errorMsg)}</span>
                  </div>
                )}
              </div>
            )}

            <p className="text-[11px] text-text-muted leading-relaxed max-w-md mx-auto">
              هیچ مبلغی از حساب شما کسر نگردیده است. در صورتی که وجهی کسر شده باشد، بانک صادرکننده کارت ظرف حداکثر ۷۲ ساعت آینده آن را به صورت خودکار به حساب شما باز خواهد گرداند.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link
                href="/checkout"
                className="w-full sm:w-1/2 py-3 rounded-sm silver-gradient text-black font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <ShoppingBag size={14} />
                <span>تلاش مجدد برای پرداخت سفارش</span>
              </Link>
              <Link
                href="/shop"
                className="w-full sm:w-1/2 py-3 border border-border-dark rounded-sm hover:bg-surface/50 text-white font-semibold text-xs transition-colors flex items-center justify-center"
              >
                <span>بازگشت به گالری آثار</span>
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
