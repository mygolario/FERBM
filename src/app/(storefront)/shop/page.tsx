import React from "react";
import { getPayload } from "payload";
import config from "@/payload.config";
import { ShopClient } from "@/components/product/ShopClient";

// Fallback products matching our 8 beautiful local ceramic images
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

const fallbackCategories = [
  { id: "cat1", name: "تندیس‌ها", slug: "sculptures" },
  { id: "cat2", name: "فنجان‌ها", slug: "cups" },
  { id: "cat3", name: "ظروف گالری", slug: "vessels" },
  { id: "cat4", name: "کاسه‌ها", slug: "bowls" },
  { id: "cat5", name: "ملزومات آرامش", slug: "accessories" },
];

export const metadata = {
  title: "فروشگاه هنر فربم | خرید سرامیک دست‌ساز",
  description: "کاتالوگ کامل ظروف سرامیکی تک‌نسخه، دکوری، فنجان و ماگ کارگاهی و کاسه‌های دست‌ساز گالری فربم.",
};

export default async function ShopPage() {
  let products: any[] = [];
  let categories: any[] = [];

  try {
    const payload = await getPayload({ config });

    // Fetch categories
    const catDocs = await payload.find({
      collection: "categories",
      limit: 100,
    });
    categories = catDocs.docs.map((doc: any) => ({
      id: doc.id,
      name: doc.name,
      slug: doc.slug,
    }));

    // Fetch products
    const prodDocs = await payload.find({
      collection: "products",
      limit: 100,
    });
    products = prodDocs.docs.map((doc: any) => ({
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
      category: doc.category
        ? {
            id: doc.category.id || doc.category,
            name: doc.category.name || "دسته‌بندی نشده",
          }
        : undefined,
      isUnique: doc.isUnique,
      isSoldOut: doc.isSoldOut,
      inStock: doc.inStock,
    }));
  } catch (error) {
    console.warn("Could not query database in shop/page.tsx, using fallbacks:", error);
  }

  // Load fallback if data empty
  if (products.length === 0) products = fallbackProducts;
  if (categories.length === 0) categories = fallbackCategories;

  return (
    <div className="pt-8 min-h-screen">
      <ShopClient initialProducts={products} categories={categories} />
    </div>
  );
}
