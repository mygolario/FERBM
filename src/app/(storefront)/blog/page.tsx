import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getPayload } from "payload";
import config from "@/payload.config";
import { getJalaliDateString } from "@/lib/jalali";
import { Calendar, Clock, BookOpen, ArrowLeft } from "lucide-react";

const fallbackPosts = [
  {
    id: "b1",
    title: "هنر ورز دادن گل رس؛ گام نخست در سفالگری کارگاهی",
    slug: "clay-wedging-art",
    excerpt: "ورز دادن گل (Wedging) یکی از کلیدی‌ترین مراحل سفالگری است که نقشی حیاتی در از بین بردن حباب‌های هوا و دستیابی به بافت همگن ایفا می‌کند...",
    coverImage: { url: "/images/three_small_bowls.png", alt: "ورز دادن گل رس" },
    category: { name: "تکنیک‌ها" },
    publishedAt: "2026-06-01T10:00:00Z",
    readingTime: 6,
  },
  {
    id: "b2",
    title: "تفاوت سفال کارگاهی با تولیدات صنعتی در چیست؟",
    slug: "studio-vs-industrial",
    excerpt: "در این جستار به تفاوت‌های بنیادین میان ظروف سرامیکی دست‌ساز کوره بالا با سرامیک‌های قالبی کارخانه‌ای از نظر دوام و اصالت بصری می‌پردازیم...",
    coverImage: { url: "/images/four_textured_cups.png", alt: "سرامیک کارگاهی" },
    category: { name: "فلسفه هنر" },
    publishedAt: "2026-05-28T10:00:00Z",
    readingTime: 4,
  },
  {
    id: "b3",
    title: "جادوی اکسیدها در ساخت لعاب‌های دست‌ساز",
    slug: "oxides-in-glazes",
    excerpt: "چگونه اکسید آهن، مس و کبالت طی واکنشی شگفت‌انگیز در دمای کوره بالاتر از ۱۲۰۰ درجه، رنگ‌های زنده و شیشه‌ای روی سفال ایجاد می‌کنند...",
    coverImage: { url: "/images/organic_fluid_holder.png", alt: "لعاب های اکسیدی" },
    category: { name: "لعاب‌گری" },
    publishedAt: "2026-05-22T10:00:00Z",
    readingTime: 8,
  },
];

export const metadata = {
  title: "وبلاگ سفالگری فربم | مقالات و آموزش‌ها",
  description: "جستارهایی درباب تکنیک‌های سفالگری کارگاهی، فرم‌دهی چرخ گل، تفاوت سرامیک‌های لوکس و ساخت لعاب‌های کوره بالا.",
};

export default async function BlogPage() {
  let posts: any[] = [];

  try {
    const payload = await getPayload({ config });
    const docs = await payload.find({
      collection: "blogposts",
      sort: "-publishedAt",
      limit: 100,
    });

    posts = docs.docs.map((doc: any) => ({
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      excerpt: doc.seoDescription || "مشاهده متن کامل این جستار سفالگری...",
      coverImage: {
        url: doc.coverImage?.url || "/placeholder.png",
        alt: doc.coverImage?.alt || doc.title,
      },
      category: doc.category ? { name: doc.category.name } : undefined,
      publishedAt: doc.publishedAt || doc.createdAt,
      readingTime: doc.readingTime || 5,
    }));
  } catch (error) {
    console.warn("Could not query blog posts from Payload, using fallbacks:", error);
  }

  if (posts.length === 0) posts = fallbackPosts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-white">جستارهای سفالگری</h1>
        <p className="text-sm text-text-muted">
          یادداشت‌های آتلیه فربم درباره گل، آتش، لعاب و فلسفه ساخت اشیاء
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => {
          const formattedDate = getJalaliDateString(post.publishedAt);
          return (
            <article
              key={post.id}
              className="group flex flex-col bg-surface-dark border border-border-dark p-4 rounded-sm glass-panel glass-panel-hover"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/10] bg-black mb-4 overflow-hidden rounded-sm border border-border-dark/60">
                <Image
                  src={post.coverImage.url}
                  alt={post.coverImage.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale contrast-115 group-hover:grayscale-0"
                />
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 text-[10px] text-text-muted mb-2">
                <span className="text-accent-gold font-medium">
                  {post.category?.name || "یادداشت هنر"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={10} />
                  <span>{formattedDate}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  <span>{post.readingTime.toLocaleString("fa-IR")} دقیقه مطالعه</span>
                </span>
              </div>

              {/* Title & Excerpt */}
              <div className="flex-1 space-y-2">
                <h2 className="text-lg font-bold text-white group-hover:text-accent-silver transition-colors line-clamp-1">
                  {post.title}
                </h2>
                <p className="text-xs text-text-muted leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              {/* Read Link */}
              <div className="pt-4 mt-4 border-t border-border-dark/40 flex justify-between items-center text-xs">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-accent-silver font-semibold flex items-center gap-1 hover:underline"
                >
                  <span>ادامه مطلب</span>
                  <ArrowLeft size={12} />
                </Link>
              </div>

            </article>
          );
        })}
      </div>

    </div>
  );
}
