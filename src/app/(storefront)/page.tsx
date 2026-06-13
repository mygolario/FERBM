import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getPayload } from "payload";
import config from "@/payload.config";
import { formatToman } from "@/lib/toman";
import { ArrowLeft, Sparkles, ShieldCheck, Flame, Compass } from "lucide-react";

// Mock Products using local assets as fallback
const fallbackProducts = [
  {
    id: "1",
    title: "مخروط چشم‌دار اساطیری",
    slug: "fleshy-eyeball-tower",
    price: 1850000,
    images: [{ image: { url: "/images/fleshy_eyeball_tower.png", alt: "مخروط چشم‌دار اساطیری" } }],
    isUnique: true,
    isSoldOut: false,
    category: { name: "تندیس‌ها" },
  },
  {
    id: "2",
    title: "مجموعه چهار فنجان بافت‌دار",
    slug: "four-textured-cups",
    price: 1200000,
    images: [{ image: { url: "/images/four_textured_cups.png", alt: "مجموعه چهار فنجان بافت‌دار" } }],
    isUnique: false,
    isSoldOut: false,
    category: { name: "فنجان‌ها" },
  },
  {
    id: "3",
    title: "ظرف رخ موش مینیاتوری",
    slug: "mouse-face-vessel",
    price: 950000,
    images: [{ image: { url: "/images/mouse_face_vessel.png", alt: "ظرف رخ موش مینیاتوری" } }],
    isUnique: true,
    isSoldOut: true,
    category: { name: "ظروف گالری" },
  },
  {
    id: "4",
    title: "کاسه صدفی خاردار نقره‌ای",
    slug: "spiky-seashell-bowl",
    price: 2400000,
    images: [{ image: { url: "/images/spiky_seashell_bowl.png", alt: "کاسه صدفی خاردار نقره‌ای" } }],
    isUnique: true,
    isSoldOut: false,
    category: { name: "کاسه‌ها" },
  },
];

const mockInstagram = [
  { id: "ig1", url: "/images/star_relief_cup.png", link: "https://instagram.com" },
  { id: "ig2", url: "/images/three_small_bowls.png", link: "https://instagram.com" },
  { id: "ig3", url: "/images/twisted_incense_burner.png", link: "https://instagram.com" },
  { id: "ig4", url: "/images/organic_fluid_holder.png", link: "https://instagram.com" },
  { id: "ig5", url: "/images/fleshy_eyeball_tower.png", link: "https://instagram.com" },
  { id: "ig6", url: "/images/four_textured_cups.png", link: "https://instagram.com" },
];

export default async function HomePage() {
  let featuredProducts: any[] = [];

  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "products",
      limit: 4,
    });
    // Safely map payload outputs
    featuredProducts = docs.map((doc: any) => ({
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      price: doc.price,
      images: doc.images?.map((img: any) => ({
        image: {
          url: img.image?.url || "/placeholder.png",
          alt: img.image?.alt || doc.title,
        },
      })) || [],
      isUnique: doc.isUnique,
      isSoldOut: doc.isSoldOut,
      category: doc.category,
    }));
  } catch (error) {
    console.warn("Could not load products from database, falling back to mock data:", error);
  }

  // Use fallback if database query returned empty
  if (featuredProducts.length === 0) {
    featuredProducts = fallbackProducts;
  }

  return (
    <div className="bg-black text-foreground relative overflow-hidden">
      {/* JSON-LD LocalBusiness Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "فربم | FERBM",
            "image": `${process.env.NEXT_PUBLIC_SITE_URL || "https://ferbm.com"}/images/three_small_bowls.png`,
            "url": process.env.NEXT_PUBLIC_SITE_URL || "https://ferbm.com",
            "telephone": "021-88888888",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "خیابان ولیعصر، نرسیده به میدان تجریش، بن‌بست آتلیه هنر",
              "addressLocality": "تهران",
              "addressCountry": "IR"
            },
            "sameAs": [
              "https://instagram.com",
              `https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || "ferbm_store"}`
            ]
          })
        }}
      />
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] flex items-center justify-center bg-black overflow-hidden border-b border-border-dark">
        {/* Background Image with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero_banner.png"
            alt="FERBM Art Hero"
            fill
            priority
            className="object-cover opacity-35 scale-105 filter grayscale contrast-125"
          />
          {/* Silver metallic vignette overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl px-4 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-silver/30 bg-white/5 backdrop-blur-md text-xs font-semibold tracking-wider text-accent-silver">
            <Sparkles size={12} className="animate-pulse" />
            <span>گالری آثار دست‌ساز و تک‌نسخه</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            تجسّم تاریکی و اصالت در قالب <br />
            <span className="silver-text-gradient">سرامیک و سفالینه لوکس</span>
          </h1>

          <p className="text-base sm:text-lg text-text-muted max-w-xl mx-auto leading-relaxed">
            کشف کنید؛ مجموعه‌ای از دست‌سازه‌های پخته شده در دمای بالای کوره که داستان هنر مدرن کارگاهی را روایت می‌کنند.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-3 rounded-sm silver-gradient text-black font-bold text-sm tracking-wide transition-transform duration-300 hover:scale-[1.02]"
            >
              مشاهده فروشگاه هنر
            </Link>
            <Link
              href="#about"
              className="w-full sm:w-auto px-8 py-3 rounded-sm border border-border-dark bg-surface/30 text-white font-semibold text-sm transition-colors hover:bg-surface/65"
            >
              داستان کارگاه ما
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-[1px] h-12 bg-gradient-to-b from-accent-silver to-transparent" />
        </div>
      </section>

      {/* 2. VALUES / STATS */}
      <section className="py-12 border-b border-border-dark bg-surface-dark/40">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center p-6 space-y-2">
            <Flame size={28} className="text-accent-gold" />
            <h3 className="text-white font-bold text-sm">پخت کوره ۱۲۵۰ درجه</h3>
            <p className="text-xs text-text-muted">استحکام فوق‌العاده و لعاب‌های با کیفیت گالری</p>
          </div>
          <div className="flex flex-col items-center p-6 space-y-2 border-y md:border-y-0 md:border-x border-border-dark/60">
            <ShieldCheck size={28} className="text-accent-silver" />
            <h3 className="text-white font-bold text-sm">ضمانت ارسال شکستنی</h3>
            <p className="text-xs text-text-muted">بسته‌بندی ویژه ضربه‌گیر با پوشش کامل کارگاهی</p>
          </div>
          <div className="flex flex-col items-center p-6 space-y-2">
            <Compass size={28} className="text-accent-gold" />
            <h3 className="text-white font-bold text-sm">آثار تماماً تک‌نسخه</h3>
            <p className="text-xs text-text-muted">هر اثر به عنوان مجسمه‌ای مستقل شماره‌گذاری می‌شود</p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">آثار برجسته هفته</h2>
            <p className="text-sm text-text-muted mt-2">دست‌سازه‌های تازه از کوره درآمده و نایاب</p>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold text-accent-silver hover:underline flex items-center gap-1 group"
          >
            مشاهده همه آثار
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => {
            const imgUrl = product.images?.[0]?.image?.url || "/placeholder.png";
            return (
              <div
                key={product.id}
                className="group relative flex flex-col bg-surface-dark border border-border-dark p-4 rounded-sm glass-panel glass-panel-hover"
              >
                {/* Image Wrap */}
                <div className="relative aspect-square bg-black mb-4 overflow-hidden rounded-sm border border-border-dark/60">
                  <Image
                    src={imgUrl}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale contrast-110 group-hover:grayscale-0"
                  />
                  {/* Badges */}
                  {product.isSoldOut && (
                    <span className="absolute top-3 right-3 bg-red-950/80 border border-red-500/30 text-red-200 text-[10px] font-bold px-2 py-1 rounded-sm backdrop-blur-sm">
                      اتمام موجودی
                    </span>
                  )}
                  {product.isUnique && !product.isSoldOut && (
                    <span className="absolute top-3 right-3 bg-black/80 border border-accent-gold/40 text-accent-gold text-[10px] font-bold px-2 py-1 rounded-sm backdrop-blur-sm">
                      تک نسخه
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[10px] text-accent-gold font-medium">
                      {product.category?.name || "سفال کارگاهی"}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-accent-silver transition-colors mt-1 line-clamp-1">
                      {product.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border-dark/40">
                    <span className="text-sm font-semibold text-white">
                      {formatToman(product.price)}
                    </span>
                    <Link
                      href={`/shop/${product.slug}`}
                      className="text-xs text-accent-silver font-semibold hover:underline"
                    >
                      جزئیات اثر
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3.5. SHOWCASE BANNER */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden border-y border-border-dark">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/collection_banner.png"
            alt="فرآیند ساخت و گل‌گری"
            fill
            className="object-cover opacity-30 scale-102 filter grayscale contrast-115"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        </div>
        <div className="relative z-10 text-center max-w-3xl px-4 space-y-4">
          <span className="text-accent-gold text-xs font-bold tracking-widest uppercase">شکل‌گیری از هنر ناب</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">هر ترک، هر بافت، داستانی از صبر و آتش</h2>
          <p className="text-sm text-text-muted max-w-lg mx-auto leading-relaxed">
            فرآیند تولید دستی هر قطعه سرامیک بیش از سه هفته زمان می‌برد؛ از ورز دادن گل تا پخت نهایی در دمای ۱۲۵۰ درجه سانتی‌گراد.
          </p>
          <div className="pt-2">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-sm border border-accent-silver/45 hover:border-accent-silver bg-white/5 backdrop-blur-sm text-xs font-bold text-white transition-all hover:bg-white/10"
            >
              <span>مشاهده مستندات کارگاهی (وبلاگ)</span>
              <ArrowLeft size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. ABOUT BRAND STORY */}
      <section id="about" className="py-24 bg-surface-dark/30 border-y border-border-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative aspect-[4/3] bg-black rounded-sm overflow-hidden border border-border-dark">
            <Image
              src="/images/three_small_bowls.png"
              alt=" FERBM Studio"
              fill
              className="object-cover opacity-60 filter grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>

          {/* Story Text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1 text-accent-gold text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-gold"></span>
              <span>هنرمند و خمیره گل</span>
            </div>
            <h2 className="text-3xl font-black text-white leading-snug">
              خلق زیبایی از دل تاریکی؛ <br />
              داستان فلسفه گالری فربم
            </h2>
            <p className="text-sm text-text-muted leading-relaxed">
              ما در فربم عقیده داریم خاک رس صرفاً ماده اولیه‌ای برای ساخت ظروف نیست. هر ظرف سرامیکی که در آتلیه ما ورز داده می‌شود، فرم می‌گیرد و در کوره گداخته می‌گردد، تجسمی از خطوط مدرن و تفکر مینیمالیستی است.
            </p>
            <p className="text-sm text-text-muted leading-relaxed">
              آثار ما با استفاده از بدنه رسی پرپخت و لعاب‌های دست‌ساز و اختصاصی در دمای بیش از ۱۲۰۰ درجه پخته می‌شوند تا مقاومت بی‌نظیر سنگینه و زیبایی خیره‌کننده آثار هنری گالری را یکجا به ارمغان آورند. هر محصول شناسنامه امضاشده توسط هنرمند را به همراه دارد.
            </p>
            <div className="pt-4">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 text-sm font-bold text-accent-silver hover:underline"
              >
                <span>بازدید از آتلیه و تماس با هنرمند</span>
                <ArrowLeft size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INSTAGRAM FEED PLACEHOLDER */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-2xl sm:text-3xl font-black text-white">در اینستاگرام همراه ما باشید</h2>
          <p className="text-sm text-text-muted max-w-md mx-auto">
            تصاویری از زندگی کارگاهی و فرآیند پخت کوره در آتلیه سفال فربم
          </p>
        </div>

        {/* IG Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mockInstagram.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square bg-black rounded-sm overflow-hidden border border-border-dark group block hover:border-accent-silver/50 transition-colors"
            >
              <Image
                src={item.url}
                alt="Instagram Post"
                fill
                sizes="(max-width: 768px) 50vw, 16vw"
                className="object-cover opacity-60 transition-all duration-300 group-hover:scale-105 group-hover:opacity-90 filter grayscale"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[10px] bg-black/80 px-2 py-1 border border-border-dark text-white rounded-sm">
                  مشاهده در اینستاگرام
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 6. CONTACT INFOBAR */}
      <section id="contact" className="py-20 bg-surface-dark border-t border-border-dark text-center">
        <div className="max-w-2xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl font-black text-white">ارتباط مستقیم با کارگاه</h2>
          <p className="text-sm text-text-muted leading-relaxed">
            جهت سفارش‌های عمده، هماهنگی برای بازدید حضوری از آتلیه و یا مشورت درباره کارهای شخصی‌سازی شده سفارشی با ما در تماس باشید.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "989100000000"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-sm border border-border-dark hover:border-accent-silver/40 text-sm font-semibold transition-all"
            >
              تماس در واتس‌اپ
            </a>
            <a
              href={`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || "ferbm_store"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-sm silver-gradient text-black font-bold text-sm transition-all"
            >
              ارتباط در تلگرام
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
