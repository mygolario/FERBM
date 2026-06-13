import React from "react";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@/payload.config";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";

// Local fallbacks matching the 8 images
const fallbackProducts = [
  {
    id: "p1",
    title: "مخروط چشم‌دار اساطیری",
    slug: "fleshy-eyeball-tower",
    price: 1850000,
    images: [{ image: { url: "/images/fleshy_eyeball_tower.png", alt: "مخروط چشم‌دار اساطیری" } }],
    category: { id: "cat1", name: "تندیس‌ها" },
    isUnique: true,
    isSoldOut: false,
  },
  {
    id: "p2",
    title: "مجموعه چهار فنجان بافت‌دار",
    slug: "four-textured-cups",
    price: 1200000,
    images: [{ image: { url: "/images/four_textured_cups.png", alt: "مجموعه چهار فنجان بافت‌دار" } }],
    category: { id: "cat2", name: "فنجان‌ها" },
    isUnique: false,
    isSoldOut: false,
  },
  {
    id: "p3",
    title: "ظرف رخ موش مینیاتوری",
    slug: "mouse-face-vessel",
    price: 950000,
    images: [{ image: { url: "/images/mouse_face_vessel.png", alt: "ظرف رخ موش مینیاتوری" } }],
    category: { id: "cat3", name: "ظروف گالری" },
    isUnique: true,
    isSoldOut: true,
  },
  {
    id: "p4",
    title: "نگهدارنده ارگانیک سیالات",
    slug: "organic-fluid-holder",
    price: 1600000,
    images: [{ image: { url: "/images/organic_fluid_holder.png", alt: "نگهدارنده ارگانیک سیالات" } }],
    category: { id: "cat3", name: "ظروف گالری" },
    isUnique: true,
    isSoldOut: false,
  },
  {
    id: "p5",
    title: "کاسه صدفی خاردار نقره‌ای",
    slug: "spiky-seashell-bowl",
    price: 2400000,
    images: [{ image: { url: "/images/spiky_seashell_bowl.png", alt: "کاسه صدفی خاردار نقره‌ای" } }],
    category: { id: "cat4", name: "کاسه‌ها" },
    isUnique: true,
    isSoldOut: false,
  },
  {
    id: "p6",
    title: "فنجان با نقش برجسته ستاره",
    slug: "star-relief-cup",
    price: 320000,
    images: [{ image: { url: "/images/star_relief_cup.png", alt: "فنجان با نقش برجسته ستاره" } }],
    category: { id: "cat2", name: "فنجان‌ها" },
    isUnique: false,
    isSoldOut: false,
  },
  {
    id: "p7",
    title: "مجموعه سه کاسه لعابی دکوراتیو",
    slug: "three-small-bowls",
    price: 1550000,
    images: [{ image: { url: "/images/three_small_bowls.png", alt: "مجموعه سه کاسه لعابی دکوراتیو" } }],
    category: { id: "cat4", name: "کاسه‌ها" },
    isUnique: true,
    isSoldOut: false,
  },
  {
    id: "p8",
    title: "عودسوز مارپیچ کارگاهی",
    slug: "twisted-incense-burner",
    price: 780000,
    images: [{ image: { url: "/images/twisted_incense_burner.png", alt: "عودسوز مارپیچ کارگاهی" } }],
    category: { id: "cat5", name: "ملزومات آرامش" },
    isUnique: true,
    isSoldOut: false,
  },
];

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = fallbackProducts.find((p) => p.slug === slug);
  return {
    title: product ? `${product.title} | گالری فربم` : "جزئیات اثر سرامیکی فربم",
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  let product: any = null;
  let relatedProducts: any[] = [];

  try {
    const payload = await getPayload({ config });
    const docs = await payload.find({
      collection: "products",
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    });

    if (docs.docs.length > 0) {
      const dbProduct = docs.docs[0];
      product = {
        id: dbProduct.id,
        title: dbProduct.title,
        slug: dbProduct.slug,
        price: dbProduct.price,
        images: dbProduct.images?.map((img: any) => ({
          image: {
            url: img.image?.url || "/placeholder.png",
            alt: img.image?.alt || dbProduct.title,
          },
        })) || [],
        category: dbProduct.category
          ? {
              id: dbProduct.category.id || dbProduct.category,
              name: dbProduct.category.name || "دسته‌بندی نشده",
            }
          : undefined,
        isUnique: dbProduct.isUnique,
        isSoldOut: dbProduct.isSoldOut,
        inStock: dbProduct.inStock,
      };

      // Query related products in db
      if (dbProduct.category) {
        const catId = dbProduct.category.id || dbProduct.category;
        const relDocs = await payload.find({
          collection: "products",
          where: {
            category: {
              equals: catId,
            },
            id: {
              not_equals: dbProduct.id,
            },
          },
          limit: 4,
        });
        relatedProducts = relDocs.docs.map((doc: any) => ({
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
        }));
      }
    }
  } catch (error) {
    console.warn("Could not load product from db, using fallback:", error);
  }

  // Load fallback if db query failed
  if (!product) {
    const fbProduct = fallbackProducts.find((p) => p.slug === slug);
    if (!fbProduct) {
      notFound();
    }
    product = fbProduct;
    // Mock related products
    relatedProducts = fallbackProducts
      .filter((p) => p.category.id === fbProduct.category.id && p.id !== fbProduct.id)
      .slice(0, 4);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ferbm.com";
  const productImg = typeof product.images?.[0]?.image === "object"
    ? product.images[0].image.url
    : typeof product.images?.[0]?.image === "string"
    ? product.images[0].image
    : "/placeholder.png";

  return (
    <div className="min-h-screen">
      {/* JSON-LD Product Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.title,
            "image": productImg.startsWith("http") ? productImg : `${siteUrl}${productImg}`,
            "description": `خرید اثر هنری سرامیکی ${product.title} با طراحی مدرن و مینیمال از گالری کارگاهی فربم.`,
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "IRR",
              "availability": product.isSoldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
              "url": `${siteUrl}/shop/${product.slug}`
            }
          })
        }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </div>
  );
}
