import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  // Simple conversion to Persian numerals for year
  const persianYear = currentYear.toLocaleString("fa-IR").replace(/,/g, "");

  return (
    <footer className="bg-surface-dark border-t border-border-dark py-16 text-text-muted mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white tracking-widest font-sans">
            FERBM
          </h3>
          <p className="text-sm leading-relaxed">
            سرامیک دست‌ساز فربم؛ پیوندی میان خاک، هنر و آتش. ما در کارگاه هنری خود با الهام از خطوط طبیعی و مدرن، آثاری تک نسخه و گالری‌پسند برای خانه‌های خاص می‌آفرینیم.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-base mb-4">دسترسی سریع</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/shop" className="hover:text-white transition-colors">
                فروشگاه محصولات
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-white transition-colors">
                وبلاگ و مقالات آموزشی
              </Link>
            </li>
            <li>
              <Link href="/#about" className="hover:text-white transition-colors">
                داستان برند ما
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="hover:text-white transition-colors">
                لیست علاقه‌مندی‌ها
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-white font-semibold text-base mb-4">خدمات مشتریان</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="hover:text-white transition-colors cursor-pointer">
                شرایط مرجوعی شکستنی‌ها
              </span>
            </li>
            <li>
              <span className="hover:text-white transition-colors cursor-pointer">
                روش‌های ویژه بسته‌بندی ایمن
              </span>
            </li>
            <li>
              <span className="hover:text-white transition-colors cursor-pointer">
                نحوه ارسال با چاپار و تیپاکس
              </span>
            </li>
            <li>
              <span className="hover:text-white transition-colors cursor-pointer">
                سوالات متداول
              </span>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 text-sm">
          <h4 className="text-white font-semibold text-base mb-4">کارگاه و گالری فربم</h4>
          <p>
            <strong className="text-white">آدرس:</strong> تهران، خیابان ولیعصر، نرسیده به میدان تجریش، بن‌بست آتلیه هنر
          </p>
          <p>
            <strong className="text-white">شماره تماس پشتیبانی:</strong> ۰۲۱-۸۸۸۸۸۸۸۸
          </p>
          <p>
            <strong className="text-white">ایمیل:</strong> info@ferbm.com
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-border-dark/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-center md:text-right">
          تمامی حقوق مادی و معنوی این وب‌سایت متعلق به گالری سفال فربم (FERBM) می‌باشد. © {persianYear}
        </p>
        
        {/* Payment Gateways / Trust Badges logos mock */}
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <span>پرداخت امن از طریق درگاه رسمی زیبال</span>
          <span className="w-1 h-1 bg-border-dark rounded-full"></span>
          <span>ضمانت سلامت تحویل شکستنی</span>
        </div>
      </div>
    </footer>
  );
};
