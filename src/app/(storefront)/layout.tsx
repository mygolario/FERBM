import React from "react";
import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import "../globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactBar } from "@/components/shared/ContactBar";
import { CartDrawer } from "@/components/cart/CartDrawer";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "فربم | FERBM — سرامیک دست‌ساز و سفالینه‌های لوکس",
  description: "گالری سرامیک دست‌ساز فربم؛ خلق آثار سفالی هنری و ظروف دکوراتیو با هویت اصیل ایرانی در بستری مینیمال و لوکس.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ferbm.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "فربم | FERBM — سرامیک دست‌ساز و سفالینه‌های لوکس",
    description: "گالری سرامیک دست‌ساز فربم؛ خلق آثار سفالی هنری و ظروف دکوراتیو با هویت اصیل ایرانی در بستری مینیمال و لوکس.",
    url: "/",
    siteName: "FERBM",
    locale: "fa_IR",
    type: "website",
  },
};

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const goftinoKey = process.env.NEXT_PUBLIC_GOFTINO_KEY || "avTkWE";
  const gaId = process.env.NEXT_PUBLIC_GA4_ID || "G-XXXXXXXXXX";

  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable}`}>
      <body className="antialiased bg-black text-foreground min-h-screen">
        <StoreProvider>
          <div className="relative flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <ContactBar />
            <CartDrawer />
          </div>
        </StoreProvider>
        
        {/* Goftino Live Chat Widget */}
        <Script id="goftino-widget" strategy="lazyOnload">
          {`
            !function(){
              var l="${goftinoKey}",d=document,g=d.createElement("script"),
              s="https://www.goftino.com/widget/"+l,l=localStorage.getItem("goftino_"+l);
              g.type="text/javascript",g.async=!0,g.src=l?s+"?o="+l:s,s=d.getElementsByTagName("head")[0],s.appendChild(g);
            }();
          `}
        </Script>
      </body>
      <GoogleAnalytics gaId={gaId} />
    </html>
  );
}
