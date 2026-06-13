"use client";

import React, { useState, useEffect } from "react";
import "../../app/globals.css"; // Ensure Tailwind classes compile inside the admin dashboard
import { formatToman } from "../../lib/toman";
import { TrendingUp, Users, ShoppingBag, Eye, Globe, ChevronLeft } from "lucide-react";

interface AnalyticsData {
  sales: {
    totalSales: number;
    ordersCount: number;
    bestSellers: { title: string; count: number; sales: number }[];
  };
  traffic: {
    todayViews: number;
    weekViews: number;
    monthViews: number;
    activeUsers: number;
    conversionRate: string;
    trafficSources: { source: string; count: number; percentage: number }[];
    topPages: { path: string; title: string; views: number }[];
    isRealData: boolean;
  };
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading admin dashboard analytics:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-zinc-400 font-sans">
        <div className="w-8 h-8 border-4 border-zinc-700 border-t-zinc-300 rounded-full animate-spin mx-auto mb-4" />
        <span>در حال بارگذاری آمار گالری فربم...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-red-400 font-sans">
        <span>خطا در دریافت اطلاعات آماری.</span>
      </div>
    );
  }

  const { sales, traffic } = data;

  return (
    <div className="p-6 md:p-8 space-y-8 bg-zinc-950 min-h-screen text-zinc-100 font-sans" style={{ direction: "rtl", textAlign: "right" }}>
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white">داشبورد اختصاصی گالری فربم</h1>
          <p className="text-xs text-zinc-400 mt-1">آمار فروشگاه و ترافیک ورودی خریداران به صورت یکپارچه</p>
        </div>

        {!traffic.isRealData && (
          <div className="px-3 py-1 border border-amber-500/20 bg-amber-500/5 text-amber-300 text-[10px] font-bold rounded-sm">
            حالت نمایشی فعال است (اتصال به گوگل آنالیتیکس در حالت تستی)
          </div>
        )}
      </div>

      {/* METRICS ROW (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Today views */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-sm space-y-3">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs">بازدید امروز</span>
            <Eye size={18} />
          </div>
          <div className="text-2xl font-black text-white font-sans">
            {traffic.todayViews.toLocaleString("fa-IR")}
          </div>
          <p className="text-[10px] text-zinc-500">مجموع کل آمار ترافیک صفحات</p>
        </div>

        {/* Card 2: Active users */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-sm space-y-3">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs">کاربران فعال آنلاین</span>
            <Users size={18} className="text-green-400" />
          </div>
          <div className="text-2xl font-black text-green-400 font-sans">
            {traffic.activeUsers.toLocaleString("fa-IR")}
          </div>
          <p className="text-[10px] text-zinc-500">کاربران در حال گشت‌وگذار در فروشگاه</p>
        </div>

        {/* Card 3: Total Sales */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-sm space-y-3">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs">کل فروش (پرداخت شده)</span>
            <ShoppingBag size={18} className="text-yellow-500" />
          </div>
          <div className="text-xl font-bold text-yellow-500">
            {formatToman(sales.totalSales)}
          </div>
          <p className="text-[10px] text-zinc-500">شامل {(sales.ordersCount).toLocaleString("fa-IR")} سفارش پرداخت شده</p>
        </div>

        {/* Card 4: Conversion Rate */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-sm space-y-3">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs">نرخ تبدیل (بازدید به خرید)</span>
            <TrendingUp size={18} className="text-zinc-300" />
          </div>
          <div className="text-2xl font-black text-white font-sans">
            {Number(traffic.conversionRate).toLocaleString("fa-IR")}٪
          </div>
          <p className="text-[10px] text-zinc-500">نسبت بازدیدهای موفق به تراکنش‌های پرداختی</p>
        </div>

      </div>

      {/* GRID COLUMN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* RIGHT: TOP PAGES & TRAFFIC SOURCES (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Top Pages */}
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-sm space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe size={14} className="text-zinc-400" />
              <span>محبوب‌ترین صفحات بازدید شده</span>
            </h3>
            
            <div className="space-y-3 text-xs">
              {traffic.topPages.map((page, idx) => (
                <div key={idx} className="flex justify-between items-center p-2.5 rounded-sm bg-zinc-950 border border-zinc-800/40">
                  <div className="space-y-1">
                    <span className="text-white font-semibold">{page.title}</span>
                    <p className="text-[10px] text-zinc-500 font-sans">{page.path}</p>
                  </div>
                  <span className="text-zinc-400 font-sans font-bold">{page.views.toLocaleString("fa-IR")} بازدید</span>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-sm space-y-4">
            <h3 className="text-sm font-bold text-white">منابع ترافیک خریداران</h3>
            
            <div className="space-y-4 text-xs">
              {traffic.trafficSources.map((source, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-zinc-300">
                    <span>{source.source}</span>
                    <span className="font-sans">{source.percentage.toLocaleString("fa-IR")}٪</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className="h-full bg-zinc-400 rounded-full"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* LEFT: BEST SELLING PRODUCTS (5 cols) */}
        <div className="lg:col-span-5 p-6 bg-zinc-900 border border-zinc-800 rounded-sm space-y-4">
          <h3 className="text-sm font-bold text-white">محصولات پرفروش کارگاه</h3>
          
          {sales.bestSellers.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs">
              داده‌ای جهت نمایش محصولات پرفروش موجود نیست.
            </div>
          ) : (
            <div className="space-y-4">
              {sales.bestSellers.map((item, idx) => (
                <div key={idx} className="p-3 bg-zinc-950 border border-zinc-800/60 rounded-sm space-y-2 text-xs">
                  <div className="flex justify-between items-center text-white font-bold">
                    <span>{item.title}</span>
                    <span className="text-yellow-500">{formatToman(item.sales)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span>تعداد فروخته شده:</span>
                    <strong className="text-zinc-400 font-sans font-bold">
                      {item.count.toLocaleString("fa-IR")} عدد
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
export const CustomDashboard = Dashboard;
