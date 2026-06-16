import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getPayload } from "payload";
import config from "@/payload.config";
import { formatToman } from "@/lib/toman";
import { ArrowLeft, Flame, ShieldCheck, Compass } from "lucide-react";
import { VideoHero } from "@/components/landing/VideoHero";
import { VideoInterlude } from "@/components/landing/VideoInterlude";
import { Marquee } from "@/components/landing/Marquee";
import { ScrollReveal } from "@/components/landing/ScrollReveal";

const Instagram = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

/* ─── Fallback products ─── */
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

const galleryImages = [
  { id: "g1", url: "/images/star_relief_cup.png",       alt: "فنجان نجمه‌دار" },
  { id: "g2", url: "/images/three_small_bowls.png",     alt: "سه کاسه کوچک" },
  { id: "g3", url: "/images/twisted_incense_burner.png",alt: "عودسوز پیچ‌خورده" },
  { id: "g4", url: "/images/organic_fluid_holder.png",  alt: "ظرف ارگانیک مایعات" },
  { id: "g5", url: "/images/fleshy_eyeball_tower.png",  alt: "مخروط چشم‌دار" },
  { id: "g6", url: "/images/four_textured_cups.png",    alt: "چهار فنجان بافت‌دار" },
];

const marqueeItems = [
  "پخت کوره ۱۲۵۰ درجه",
  "ارسال با ضمانت شکستنی",
  "آثار تماماً تک‌نسخه",
  "دست‌ساز در آتلیه فربم",
  "امضاشده توسط هنرمند",
  "گالری آثار هنری پیشرو",
];

/* ─── Page ─── */
export default async function HomePage() {
  let featuredProducts: any[] = [];

  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({ collection: "products", limit: 4 });
    featuredProducts = docs.map((doc: any) => ({
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      price: doc.price,
      images: doc.images?.map((img: any) => ({
        image: { url: img.image?.url || "/placeholder.png", alt: img.image?.alt || doc.title },
      })) || [],
      isUnique: doc.isUnique,
      isSoldOut: doc.isSoldOut,
      category: doc.category,
    }));
  } catch {
    /* silent fallback */
  }

  if (featuredProducts.length === 0) featuredProducts = fallbackProducts;

  /* Split: hero card = first product, grid = rest */
  const [heroProduct, ...gridProducts] = featuredProducts;

  return (
    <div className="bg-background text-foreground overflow-hidden">

      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "فربم | FERBM",
            image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ferbm.com"}/images/three_small_bowls.png`,
            url: process.env.NEXT_PUBLIC_SITE_URL || "https://ferbm.com",
            telephone: "021-88888888",
            address: {
              "@type": "PostalAddress",
              streetAddress: "خیابان ولیعصر، نرسیده به میدان تجریش",
              addressLocality: "تهران",
              addressCountry: "IR",
            },
            sameAs: [
              "https://instagram.com",
              `https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || "ferbm_store"}`,
            ],
          }),
        }}
      />

      {/* ════════════════════════════════
           §1 · HERO — GLOWING VIDEO
          ════════════════════════════════ */}
      <VideoHero videoSrc="/videos/watermark-removed-Intense_close_up_inside_a_glow.mp4">
        <div className="text-center max-w-4xl mx-auto px-6">

          {/* Eyebrow label */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full
                          border border-accent-gold/25 bg-white/4 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.2em] text-accent-gold/80 uppercase">
              گالری آثار دست‌ساز — آتلیه فربم
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-[clamp(2.4rem,7vw,5.5rem)] font-black leading-[1.08] tracking-tight mb-6">
            <span className="block text-foreground">خلق زیبایی از دل</span>
            <span
              className="block"
              style={{
                background: "linear-gradient(135deg, #9A7B4F 0%, #C4A265 40%, #EDE8DF 65%, #9A7B4F 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              خاک، آتش و تاریکی
            </span>
          </h1>

          {/* Sub-heading */}
          <p className="text-[clamp(0.95rem,2vw,1.15rem)] text-text-muted max-w-xl mx-auto leading-relaxed mb-10">
            سرامیک‌های دست‌ساز آتلیه فربم؛ هر قطعه یک اثر منحصر‌به‌فرد است که از گل خام تا پخت
            ۱۲۵۰ درجه، داستانی از صبر و هنر را روایت می‌کند.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3
                         px-9 py-4 rounded-sm font-bold text-sm tracking-wide text-background
                         transition-all duration-300 hover:shadow-[0_0_32px_rgba(154,123,79,0.45)]"
              style={{ background: "linear-gradient(135deg, #9A7B4F 0%, #C4A265 100%)" }}
            >
              <span>مشاهده فروشگاه هنر</span>
              <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
            </Link>
            <Link
              href="#about"
              className="w-full sm:w-auto inline-flex items-center justify-center
                         px-9 py-4 rounded-sm border border-white/15 bg-white/5 backdrop-blur-sm
                         font-semibold text-sm text-foreground/90
                         transition-all duration-300 hover:border-accent-gold/35 hover:bg-white/10"
            >
              داستان کارگاه ما
            </Link>
          </div>
        </div>
      </VideoHero>

      {/* ════════════════════════════════
           §2 · MARQUEE TICKER
          ════════════════════════════════ */}
      <div className="py-5 border-y border-border-dark bg-surface-dark/60">
        <Marquee items={marqueeItems} />
      </div>

      {/* ════════════════════════════════
           §3 · VALUES STRIP
          ════════════════════════════════ */}
      <section className="py-16 border-b border-border-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border-dark rounded-sm overflow-hidden">

            {[
              {
                icon: <Flame size={24} className="text-accent-gold" />,
                title: "پخت کوره ۱۲۵۰ درجه",
                desc: "استحکام فوق‌العاده و لعاب‌های گالری‌پسند با کیفیت بی‌نظیر",
              },
              {
                icon: <ShieldCheck size={24} className="text-accent-silver" />,
                title: "ضمانت ارسال شکستنی",
                desc: "بسته‌بندی ویژه ضربه‌گیر با پوشش کامل کارگاهی برای هر سفارش",
              },
              {
                icon: <Compass size={24} className="text-accent-gold" />,
                title: "آثار تماماً تک‌نسخه",
                desc: "هر اثر به عنوان مجسمه‌ای مستقل شماره‌گذاری و امضا می‌شود",
              },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="flex flex-col items-center text-center p-10 bg-surface-dark/40 h-full
                                hover:bg-surface-dark/80 transition-colors duration-500 space-y-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full border border-border-dark bg-black/40">
                    {item.icon}
                  </div>
                  <h3 className="text-white font-bold text-[15px]">{item.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
           §4 · FEATURED PRODUCTS
               Asymmetric editorial grid
          ════════════════════════════════ */}
      <section className="py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-14 gap-4">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.22em] text-accent-gold uppercase mb-2 block">
                Collection
              </span>
              <h2 className="text-[clamp(1.7rem,4vw,2.8rem)] font-black text-foreground">
                آثار برجسته هفته
              </h2>
              <p className="text-sm text-text-muted mt-2">
                دست‌سازه‌های تازه از کوره درآمده و نایاب
              </p>
            </div>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 text-sm font-semibold
                         text-accent-silver hover:text-foreground transition-colors"
            >
              مشاهده همه آثار
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>

        {/* ── EDITORIAL GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Hero product card — spans 7 columns */}
          {heroProduct && (
            <ScrollReveal className="lg:col-span-7" delay={0}>
              <Link href={`/shop/${heroProduct.slug}`} className="group block h-full">
                <div className="relative overflow-hidden rounded-sm border border-border-dark h-[520px] lg:h-full min-h-[440px]
                                bg-black transition-all duration-500 hover:border-accent-gold/30
                                hover:shadow-[0_24px_64px_rgba(0,0,0,0.7)]">

                  {/* Full-color image */}
                  <Image
                    src={heroProduct.images?.[0]?.image?.url || "/placeholder.png"}
                    alt={heroProduct.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-5 right-5 flex flex-col gap-2">
                    {heroProduct.isSoldOut && (
                      <span className="bg-black/90 border border-red-800/50 text-red-300 text-[10px] font-bold px-3 py-1 rounded-sm backdrop-blur-sm">
                        اتمام موجودی
                      </span>
                    )}
                    {heroProduct.isUnique && !heroProduct.isSoldOut && (
                      <span className="bg-black/90 border border-accent-gold/40 text-accent-gold text-[10px] font-bold px-3 py-1 rounded-sm backdrop-blur-sm">
                        تک نسخه
                      </span>
                    )}
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-0 right-0 left-0 p-7">
                    <span className="text-[10px] text-accent-gold/80 font-semibold tracking-widest uppercase mb-2 block">
                      {heroProduct.category?.name || "سفال کارگاهی"}
                    </span>
                    <h3 className="text-2xl font-black text-white mb-3 group-hover:text-accent-gold transition-colors duration-300">
                      {heroProduct.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-foreground/90">
                        {formatToman(heroProduct.price)}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-silver
                                       border border-accent-silver/20 px-3 py-1.5 rounded-sm
                                       group-hover:border-accent-silver/50 transition-colors">
                        جزئیات اثر
                        <ArrowLeft size={11} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          )}

          {/* Secondary products — 3 stacked cards, span 5 columns */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {gridProducts.slice(0, 3).map((product, i) => {
              const imgUrl = product.images?.[0]?.image?.url || "/placeholder.png";
              return (
                <ScrollReveal key={product.id} delay={(i + 1) * 100}>
                  <Link href={`/shop/${product.slug}`} className="group block">
                    <div className="relative overflow-hidden rounded-sm border border-border-dark bg-black
                                    flex flex-row items-stretch h-[148px]
                                    transition-all duration-400 hover:border-accent-gold/30
                                    hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">

                      {/* Image left */}
                      <div className="relative w-[148px] flex-shrink-0 overflow-hidden">
                        <Image
                          src={imgUrl}
                          alt={product.title}
                          fill
                          sizes="148px"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                        />
                      </div>

                      {/* Info right */}
                      <div className="flex flex-col justify-between flex-1 p-5">
                        <div>
                          <span className="text-[10px] text-accent-gold/70 font-semibold tracking-widest uppercase">
                            {product.category?.name || "سفال"}
                          </span>
                          <h3 className="text-[15px] font-bold text-white mt-1 line-clamp-2
                                         group-hover:text-accent-gold transition-colors duration-300">
                            {product.title}
                          </h3>
                        </div>
                        <div className="flex items-center justify-between border-t border-border-dark/50 pt-3">
                          <span className="text-sm font-semibold text-foreground/90">
                            {formatToman(product.price)}
                          </span>
                          {product.isSoldOut ? (
                            <span className="text-[10px] text-red-400/80 font-medium">اتمام موجودی</span>
                          ) : product.isUnique ? (
                            <span className="text-[10px] text-accent-gold/80 font-medium">تک نسخه</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
           §5 · MACRO VIDEO INTERLUDE
          ════════════════════════════════ */}
      <VideoInterlude
        videoSrc="/videos/watermark-removed-Extreme_macro_close_up_slow_m.mp4"
        className="h-[480px] sm:h-[600px]"
      >
        <div className="video-interlude-overlay absolute inset-0 z-[1]" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <ScrollReveal>
            <span className="text-[10px] font-bold tracking-[0.25em] text-accent-gold/70 uppercase mb-5 block">
              Process — فرآیند خلق
            </span>
            <h2 className="text-[clamp(1.8rem,5vw,3.5rem)] font-black text-white leading-tight max-w-2xl mx-auto mb-5">
              هر ترک، هر بافت،<br />
              <span style={{
                background: "linear-gradient(135deg,#9A7B4F,#C4A265)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                داستانی از صبر و آتش
              </span>
            </h2>
            <p className="text-sm text-foreground/60 max-w-md mx-auto leading-relaxed mb-8">
              فرآیند تولید هر قطعه سرامیک بیش از سه هفته زمان می‌برد؛ از ورز دادن گل
              تا پخت نهایی در دمای ۱۲۵۰ درجه سانتی‌گراد.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-sm
                         border border-white/15 bg-white/8 backdrop-blur-sm
                         text-xs font-bold text-white
                         hover:border-accent-gold/40 hover:bg-white/12 transition-all"
            >
              مشاهده مستندات کارگاهی
              <ArrowLeft size={13} />
            </Link>
          </ScrollReveal>
        </div>
      </VideoInterlude>

      {/* ════════════════════════════════
           §6 · BRAND STORY / ABOUT
          ════════════════════════════════ */}
      <section id="about" className="py-28 border-y border-border-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">

            {/* Image column */}
            <ScrollReveal>
              <div className="relative">
                {/* Main image */}
                <div className="relative aspect-[4/5] rounded-sm overflow-hidden border border-border-dark">
                  <Image
                    src="/images/three_small_bowls.png"
                    alt="آتلیه فربم — سه کاسه"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* Floating accent card */}
                <div className="absolute -left-5 bottom-10 w-48 p-5 rounded-sm border border-border-dark glass-panel shadow-2xl hidden sm:block">
                  <div className="text-3xl font-black text-foreground mb-0.5">+۵ سال</div>
                  <div className="text-xs text-text-muted leading-relaxed">تجربه در سرامیک‌سازی هنری و گالری‌پسند</div>
                </div>
              </div>
            </ScrollReveal>

            {/* Text column */}
            <div className="space-y-7">
              <ScrollReveal delay={100}>
                <div className="inline-flex items-center gap-2">
                  <span className="w-5 h-[1px] bg-accent-gold" />
                  <span className="text-[11px] font-semibold tracking-[0.2em] text-accent-gold uppercase">
                    About — داستان فربم
                  </span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={150}>
                <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-black text-foreground leading-tight">
                  خلق زیبایی از دل تاریکی؛
                  <br />
                  <span style={{
                    background: "linear-gradient(135deg,#9A7B4F,#C4A265)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>
                    فلسفه گالری فربم
                  </span>
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <p className="text-[15px] text-text-muted leading-[1.85]">
                  ما در فربم عقیده داریم خاک رس صرفاً ماده اولیه‌ای برای ساخت ظروف نیست.
                  هر ظرف سرامیکی که در آتلیه ما ورز داده می‌شود، فرم می‌گیرد و در کوره
                  گداخته می‌گردد، تجسمی از خطوط مدرن و تفکر مینیمالیستی است.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={250}>
                <p className="text-[15px] text-text-muted leading-[1.85]">
                  آثار ما با استفاده از بدنه رسی پرپخت و لعاب‌های دست‌ساز اختصاصی در دمای
                  بیش از ۱۲۰۰ درجه پخته می‌شوند. هر محصول شناسنامه امضاشده توسط هنرمند را
                  به همراه دارد.
                </p>
              </ScrollReveal>

              {/* Pull-quote */}
              <ScrollReveal delay={300}>
                <blockquote className="border-r-2 border-accent-gold pr-5 py-1 my-6">
                  <p className="text-[17px] font-semibold text-foreground/90 italic leading-relaxed">
                    «آتش می‌پرورد آنچه خاک آغاز کرده»
                  </p>
                </blockquote>
              </ScrollReveal>

              <ScrollReveal delay={350}>
                <Link
                  href="/#contact"
                  className="group inline-flex items-center gap-2 text-sm font-bold text-accent-silver
                             hover:text-foreground transition-colors duration-300"
                >
                  بازدید از آتلیه و تماس با هنرمند
                  <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
           §7 · CINEMATIC PANORAMA VIDEO
          ════════════════════════════════ */}
      <VideoInterlude
        videoSrc="/videos/watermark-removed-Cinematic_slow_motion_panning.mp4"
        className="h-[380px] sm:h-[480px]"
      >
        <div className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,8,8,0.85) 0%, rgba(8,8,8,0.25) 30%, rgba(8,8,8,0.25) 70%, rgba(8,8,8,0.85) 100%)",
          }}
        />
        <div className="relative z-10 h-full flex items-center justify-center">
          <ScrollReveal>
            <div className="text-center px-6">
              <span className="text-[9px] font-bold tracking-[0.3em] text-foreground/30 uppercase block mb-4">
                FERBM Studio — آتلیه هنری
              </span>
              <p className="text-[clamp(1.1rem,3.5vw,2rem)] font-black text-foreground/80 max-w-lg mx-auto leading-tight">
                هنر در دست‌هایی شکل می‌گیرد که عاشق خاک‌اند
              </p>
            </div>
          </ScrollReveal>
        </div>
      </VideoInterlude>

      {/* ════════════════════════════════
           §8 · GALLERY GRID
          ════════════════════════════════ */}
      <section className="py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <ScrollReveal>
          <div className="text-center mb-16 space-y-3">
            <span className="text-[11px] font-semibold tracking-[0.22em] text-accent-gold uppercase">
              Gallery — گالری
            </span>
            <h2 className="text-[clamp(1.7rem,4vw,2.5rem)] font-black text-foreground">
              در اینستاگرام همراه ما باشید
            </h2>
            <p className="text-sm text-text-muted max-w-md mx-auto">
              تصاویری از زندگی کارگاهی و فرآیند پخت کوره در آتلیه سفال فربم
            </p>
          </div>
        </ScrollReveal>

        {/* Masonry-inspired grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {galleryImages.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 60}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative block overflow-hidden rounded-sm border border-border-dark
                             bg-black hover:border-accent-gold/30 transition-all duration-500
                             ${i === 0 ? "row-span-2 aspect-[3/4] md:aspect-auto md:h-full" : "aspect-square"}`}
              >
                <Image
                  src={item.url}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500
                                 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                   flex items-center gap-2 bg-black/75 backdrop-blur-sm
                                   px-4 py-2 rounded-sm border border-white/10">
                    <Instagram size={13} className="text-white/80" />
                    <span className="text-[11px] text-white/90 font-semibold">اینستاگرام</span>
                  </div>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════
           §9 · CONTACT
          ════════════════════════════════ */}
      <section id="contact" className="py-28 border-t border-border-dark relative overflow-hidden">

        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 60%, rgba(154,123,79,0.07) 0%, transparent 70%)",
          }}
        />

        <ScrollReveal>
          <div className="relative max-w-2xl mx-auto px-4 text-center space-y-6">

            <span className="text-[11px] font-semibold tracking-[0.22em] text-accent-gold uppercase block">
              Contact — تماس
            </span>

            <h2 className="text-[clamp(1.8rem,4.5vw,3rem)] font-black text-foreground leading-tight">
              ارتباط مستقیم<br />
              <span style={{
                background: "linear-gradient(135deg,#9A7B4F,#C4A265)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                با کارگاه فربم
              </span>
            </h2>

            <p className="text-[15px] text-text-muted leading-[1.85] max-w-lg mx-auto">
              جهت سفارش‌های عمده، هماهنگی بازدید حضوری از آتلیه و یا مشورت درباره
              کارهای شخصی‌سازی‌شده سفارشی با ما در تماس باشید.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "989100000000"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2
                           px-8 py-4 rounded-sm
                           border border-border-dark hover:border-accent-gold/35
                           text-sm font-semibold text-foreground/90
                           bg-surface-dark/40 hover:bg-surface-dark/80
                           transition-all duration-300"
              >
                تماس در واتس‌اپ
              </a>
              <a
                href={`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || "ferbm_store"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2
                           px-8 py-4 rounded-sm font-bold text-sm text-background
                           transition-all duration-300 hover:shadow-[0_0_28px_rgba(154,123,79,0.4)]"
                style={{ background: "linear-gradient(135deg, #9A7B4F 0%, #C4A265 100%)" }}
              >
                ارتباط در تلگرام
              </a>
            </div>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-4 pt-8">
              <div className="w-16 h-[1px] bg-border-dark" />
              <span className="text-accent-gold/30 text-xs">✦</span>
              <div className="w-16 h-[1px] bg-border-dark" />
            </div>

            <p className="text-[12px] text-text-muted/50">
              تهران، خیابان ولیعصر — آتلیه فربم
            </p>

          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}
