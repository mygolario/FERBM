import React from "react";
import { Database, AlertTriangle, Settings, RefreshCw } from "lucide-react";

interface DbMissingErrorProps {
  message?: string;
  details?: string;
}

export function DbMissingError({ message, details }: DbMissingErrorProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 antialiased text-right" dir="rtl">
      <div className="max-w-md w-full glass-panel border border-border-dark p-8 rounded-sm space-y-6 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent-gold/10 rounded-full blur-3xl pointer-events-none" />

        {/* Icon & Status */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
              <Database size={32} />
            </div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-black border border-border-dark flex items-center justify-center text-red-400">
              <AlertTriangle size={12} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 text-center">
          <h2 className="text-xl font-black text-white tracking-wide">خطا در اتصال به پایگاه داده</h2>
          <p className="text-xs text-text-muted leading-relaxed">
            {message || "سیستم قادر به برقراری ارتباط با پایگاه داده (Database) نمی‌باشد. این خطا معمولاً به دلیل عدم تنظیم یا پیکربندی نادرست متغیرهای محیطی رخ می‌دهد."}
          </p>
        </div>

        {/* Tech details box */}
        <div className="bg-black/40 border border-border-dark/60 p-4 rounded-sm space-y-3 font-sans">
          <div className="flex items-center gap-2 border-b border-border-dark/40 pb-2 text-xs text-white font-sans">
            <Settings size={14} className="text-accent-gold" />
            <span className="font-bold">راهنمای بررسی مدیر سیستم:</span>
          </div>
          
          <ul className="text-[11px] leading-relaxed text-text-muted space-y-2 list-disc list-inside">
            <li>
              متغیر محیطی <code className="bg-surface-dark px-1.5 py-0.5 rounded text-white font-mono text-[10px]">DATABASE_URI</code> در فایل <code className="font-mono">.env.local</code> یا پنل Vercel تعریف نشده یا نادرست است.
            </li>
            <li>
              از صحت آدرس، نام کاربری، رمز عبور و پورت سرور PostgreSQL اطمینان حاصل کنید.
            </li>
            <li>
              در صورت وجود کاراکترهای خاص (مانند <code className="font-mono">@</code>) در پسورد پایگاه داده، سیستم آنها را به صورت خودکار تصحیح می‌کند، با این حال بررسی مجدد آن توصیه می‌شود.
            </li>
          </ul>

          {details && (
            <div className="mt-3 pt-2 border-t border-border-dark/40 text-left">
              <p className="text-[10px] font-mono text-red-400/80 break-all">{details}</p>
            </div>
          )}
        </div>

        {/* Buttons / Actions */}
        <div className="pt-2">
          <button
            onClick={() => typeof window !== "undefined" && window.location.reload()}
            className="w-full py-2.5 rounded-sm silver-gradient text-black font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>تلاش مجدد و بارگذاری صفحه</span>
          </button>
        </div>
      </div>
    </div>
  );
}
