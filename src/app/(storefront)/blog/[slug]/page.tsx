import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@/payload.config";
import { getJalaliDateString } from "@/lib/jalali";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";
import { DbMissingError } from "@/components/shared/DbMissingError";

// Mock posts with HTML contents for the single post view
const fallbackPosts = [
  {
    id: "b1",
    title: "هنر ورز دادن گل رس؛ گام نخست در سفالگری کارگاهی",
    slug: "clay-wedging-art",
    coverImage: { url: "/images/three_small_bowls.png", alt: "ورز دادن گل رس" },
    category: { name: "تکنیک‌ها" },
    publishedAt: "2026-06-01T10:00:00Z",
    readingTime: 6,
    contentHtml: `
      <p>یکی از کلیدی‌ترین و نخستین مراحلی که در ساخت هر اثر سرامیکی یا سفالی طی می‌شود، ورز دادن گل (Wedging) است. بسیاری از مبتدیان با نادیده گرفتن اهمیت این مرحله و عجله برای چرخ‌کاری، آثار خود را در معرض ترک خوردن حین خشک شدن یا انفجار در زمان پخت کوره قرار می‌دهند.</p>
      
      <h3>چرا ورز دادن گل رس الزامی است؟</h3>
      <p>هدف اصلی از ورز دادن گل دو چیز است: اول، از بین بردن حباب‌های کوچک هوا که در خمیره گل محبوس شده‌اند؛ دوم، یکدست کردن بافت و رطوبت در سراسر چانه گل. وجود حباب در کوره به دلیل انبساط ناگهانی هوا در دمای بالا، باعث خرد شدن ظرف سفالی می‌شود.</p>
      
      <h3>روش مارپیچی (Spiral Wedging)</h3>
      <p>این تکنیک که در کارگاه‌های مدرن بسیار رایج است، با استفاده از مچ دست انجام می‌شود. گل به جلو هدایت شده، به چرخش در می‌آید و به عقب کشیده می‌شود تا حالتی مانند صدف مارپیچی پیدا کند. انجام این فرآیند حداقل برای ۲۰ تا ۳۰ مرتبه چرخیدن گل پیشنهاد می‌گردد تا تمام تنش‌های داخل گل آزاد شده و آماده چرخ‌کاری شود.</p>
    `,
  },
  {
    id: "b2",
    title: "تفاوت سفال کارگاهی با تولیدات صنعتی در چیست؟",
    slug: "studio-vs-industrial",
    coverImage: { url: "/images/four_textured_cups.png", alt: "سرامیک کارگاهی" },
    category: { name: "فلسفه هنر" },
    publishedAt: "2026-05-28T10:00:00Z",
    readingTime: 4,
    contentHtml: `
      <p>امروزه بازار از ظروف سرامیکی کارخانه‌ای ارزان‌قیمت انباشته شده است. اما چرا هنوز سفالینه‌های کارگاهی و دست‌ساز آتلیه‌ای ارزش مالی بالا و طرفداران پرشماری دارند؟ تفاوت در چیست؟</p>
      
      <h3>روح اثر و منحصر‌به‌فرد بودن</h3>
      <p>در ساخت کارخانه‌ای، همه مراحل با ماشین‌آلات و قالب‌های یکسان انجام می‌شود و میلی‌متر به میلی‌متر فنجان‌ها همسان هستند. در حالی که در سفال کارگاهی، هر فنجان داستان مستقلی از حرکت دست هنرمند روی چرخ، نوسانات شعله یا حرارت کوره و لعاب‌دهی تجربی را روایت می‌کند. حتی در آثار هم‌خانواده، جزئیات بافتی متفاوتی را لمس خواهید کرد.</p>
      
      <h3>دمای پخت و دوام بدنه</h3>
      <p>سرامیک‌های صنعتی معمولاً در دماهای پایین (تحت عنوان سفال خاکی یا ماژولیکا) پخته شده و بدنه متخلخل دارند که زود لب‌پر می‌شود. آثار فربم در کوره با دمای بیش از ۱۲۵۰ درجه به دمای پخت سنگینه (Stoneware) می‌رسند که لعاب را کاملاً ذوب کرده و جذب بدنه می‌کند و مقاومت ظرف را بسیار بالا می‌برد.</p>
    `,
  },
  {
    id: "b3",
    title: "جادوی اکسیدها در ساخت لعاب‌های دست‌ساز",
    slug: "oxides-in-glazes",
    coverImage: { url: "/images/organic_fluid_holder.png", alt: "لعاب های اکسیدی" },
    category: { name: "لعاب‌گری" },
    publishedAt: "2026-05-22T10:00:00Z",
    readingTime: 8,
    contentHtml: `
      <p>لعاب، شیشه ذوب شده‌ای است که بدنه رسی سفال را پوشش می‌دهد تا آن را ضدآب کند. اما جادوی واقعی لعاب‌سازی کارگاهی در ترکیب فرمول‌های شیمیایی دستی با استفاده از اکسیدهای فلزی نهفته است.</p>
      
      <h3>نقش اکسیدهای فلزی در رنگ‌آمیزی</h3>
      <p>برای ایجاد لعاب‌های منحصر‌به‌فرد، پودر اکسید فلزات به ترکیب پایه لعاب شیشه‌ای اضافه می‌شود:</p>
      <ul>
        <li><strong>اکسید مس:</strong> رنگ‌های سبز فیروزه‌ای یا قرمز خون‌کبوتری در اتمسفر احیا کوره ایجاد می‌کند.</li>
        <li><strong>اکسید کبالت:</strong> رنگ آبی لاجوردی عمیق و مجلل که در سفالینه‌های ایرانی باستان اصالت فراوان دارد.</li>
        <li><strong>اکسید آهن:</strong> طیف‌های رنگی عسلی، قهوه‌ای سوخته و زرد خردلی مایل به کهربایی تولید می‌کند.</li>
      </ul>
      <p>نتیجه پخت این فرمول‌ها در کوره گازی یا الکتریکی همواره با غافلگیری‌های هنری همراه است و جلوه‌ای گالری‌پسند و چشم‌نواز روی گل ایجاد می‌کند.</p>
    `,
  },
];

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = fallbackPosts.find((p) => p.slug === slug);
  return {
    title: post ? `${post.title} | وبلاگ فربم` : "یادداشت هنر سفالگری فربم",
  };
}

export default async function BlogPostDetailPage({ params }: Props) {
  const { slug } = await params;

  if (!process.env.DATABASE_URI) {
    return <DbMissingError />;
  }

  let post: any = null;
  let relatedPosts: any[] = [];

  try {
    const payload = await getPayload({ config });
    const docs = await payload.find({
      collection: "blogposts",
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    });

    if (docs.docs.length > 0) {
      const dbPost = docs.docs[0];
      post = {
        id: dbPost.id,
        title: dbPost.title,
        slug: dbPost.slug,
        coverImage: {
          url: dbPost.coverImage?.url || "/placeholder.png",
          alt: dbPost.coverImage?.alt || dbPost.title,
        },
        category: dbPost.category ? { name: dbPost.category.name } : undefined,
        publishedAt: dbPost.publishedAt || dbPost.createdAt,
        readingTime: dbPost.readingTime || 5,
        // For richText Lexical content, we will generate dummy HTML or render simple paragraph nodes
        contentHtml: `<p>برای مشاهده محتوای کامل، لطفاً از پنل مدیریت Payload متن مقاله را بررسی فرمایید. این متن در حال حاضر ثبت شده است.</p>`,
      };
    }
  } catch (error) {
    console.warn("Could not query single blog post from db, using fallback:", error);
  }

  if (!post) {
    const fbPost = fallbackPosts.find((p) => p.slug === slug);
    if (!fbPost) {
      notFound();
    }
    post = fbPost;
    relatedPosts = fallbackPosts.filter((p) => p.id !== fbPost.id).slice(0, 2);
  }

  const formattedDate = getJalaliDateString(post.publishedAt);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Back to Blog */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-white transition-colors"
      >
        <ArrowRight size={14} />
        <span>بازگشت به یادداشت‌های کارگاهی</span>
      </Link>

      {/* Title & Info */}
      <div className="space-y-4">
        <span className="inline-block bg-accent-silver/10 border border-accent-silver/20 px-3 py-1 rounded-sm text-xs font-semibold text-accent-silver">
          {post.category?.name || "سفالگری"}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-6 text-xs text-text-muted border-y border-border-dark py-4">
          <span className="flex items-center gap-1.5">
            <User size={14} className="text-accent-gold" />
            <span>نوشته هنرمند فربم</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            <span>{formattedDate}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>{post.readingTime.toLocaleString("fa-IR")} دقیقه مطالعه</span>
          </span>
        </div>
      </div>

      {/* Cover Banner */}
      <div className="relative aspect-[16/9] w-full bg-black border border-border-dark rounded-sm overflow-hidden">
        <Image
          src={post.coverImage.url}
          alt={post.coverImage.alt}
          fill
          priority
          className="object-cover opacity-80 filter grayscale contrast-110"
        />
      </div>

      {/* Content body */}
      <div
        className="prose prose-invert prose-silver max-w-none text-sm text-text-muted leading-relaxed space-y-6 pt-4 text-right"
        style={{ direction: "rtl" }}
        dangerouslySetInnerHTML={{ __html: post.contentHtml || "" }}
      />

      {/* Related articles */}
      {relatedPosts.length > 0 && (
        <div className="border-t border-border-dark pt-12 mt-16 space-y-6">
          <h3 className="text-lg font-bold text-white">یادداشت‌های پیشنهادی دیگر</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPosts.map((rp) => (
              <Link
                key={rp.id}
                href={`/blog/${rp.slug}`}
                className="group p-4 bg-surface-dark border border-border-dark rounded-sm flex gap-4 hover:border-accent-silver/30 transition-colors"
              >
                <div className="relative w-24 h-16 bg-black border border-border-dark rounded-sm overflow-hidden flex-shrink-0">
                  <Image src={rp.coverImage.url} alt={rp.title} fill className="object-cover filter grayscale" />
                </div>
                <div className="flex flex-col justify-between">
                  <h4 className="text-sm font-bold text-white group-hover:text-accent-silver line-clamp-2 transition-colors">
                    {rp.title}
                  </h4>
                  <span className="text-[10px] text-text-muted">
                    {getJalaliDateString(rp.publishedAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
