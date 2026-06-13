"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore, Product } from "@/context/StoreContext";
import { formatToman } from "@/lib/toman";
import { Heart, ShoppingBag, ShieldCheck, Truck, Sparkles, Flame, Check } from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  product,
  relatedProducts,
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const images = product.images || [];
  const activeImage =
    typeof images[activeImageIndex]?.image === "object"
      ? (images[activeImageIndex].image as any).url
      : "/placeholder.png";

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const isFavorite = isInWishlist(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      
      {/* breadcrumb */}
      <div className="text-xs text-text-muted flex gap-2 items-center">
        <Link href="/" className="hover:text-white">صفحه اصلی</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-white">فروشگاه آثار</Link>
        <span>/</span>
        <span className="text-white font-medium">{product.title}</span>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full bg-black border border-border-dark rounded-sm overflow-hidden">
            <Image
              src={activeImage}
              alt={product.title}
              fill
              priority
              className="object-cover filter grayscale contrast-110 hover:grayscale-0 transition-all duration-300"
            />
            {product.isSoldOut && (
              <span className="absolute top-4 right-4 bg-red-950/90 border border-red-500/30 text-red-200 text-xs font-bold px-3 py-1.5 rounded-sm backdrop-blur-sm">
                اتمام موجودی (نایاب)
              </span>
            )}
            {product.isUnique && !product.isSoldOut && (
              <span className="absolute top-4 right-4 bg-black/95 border border-accent-gold/40 text-accent-gold text-xs font-bold px-3 py-1.5 rounded-sm backdrop-blur-sm">
                تک نسخه (یونیک)
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {images.map((img: any, idx) => {
                const thumbUrl = typeof img.image === "object" ? img.image.url : "/placeholder.png";
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 bg-black border rounded-sm overflow-hidden flex-shrink-0 transition-colors ${
                      idx === activeImageIndex ? "border-accent-silver" : "border-border-dark hover:border-text-muted"
                    }`}
                  >
                    <Image
                      src={thumbUrl}
                      alt={`${product.title} - ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Details info */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-accent-gold">
              <Sparkles size={12} />
              <span>{product.category?.name || "سفالینه کارگاهی"}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black text-white">{product.title}</h1>
            
            <div className="text-2xl font-bold text-white py-2">
              {formatToman(product.price)}
            </div>

            {/* Description */}
            <div className="text-sm text-text-muted leading-relaxed space-y-4 border-t border-border-dark pt-4">
              <p>
                این اثر سرامیکی، با استفاده از خاک پرپخت کارگاهی ورز داده شده و فرم یافته است. به علت اعمال تماماً دستی لعاب، هیچ دو اثری کاملاً مشابه یکدیگر نخواهند بود و جزئیات بافتی روی کار گویای اصالت ساخت کارگاهی آن است.
              </p>
              <p>
                پخت ثانویه در دمای ۱۲۵۰ درجه سانتی‌گراد کوره الکتریکی مقاومت خارق‌العاده سنگینه (Stoneware) را به این اثر بخشیده است.
              </p>
            </div>
          </div>

          {/* Purchase Actions */}
          <div className="space-y-6 border-t border-border-dark pt-6">
            
            <div className="flex flex-wrap items-center gap-4">
              {/* Quantity selector (only show if not unique and not sold out) */}
              {!product.isSoldOut && !product.isUnique && (
                <div className="flex items-center border border-border-dark bg-black rounded-sm h-12">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 text-text-muted hover:text-white text-lg font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-bold font-sans">
                    {quantity.toLocaleString("fa-IR")}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 text-text-muted hover:text-white text-lg font-bold"
                  >
                    +
                  </button>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.isSoldOut}
                className={`flex-1 min-w-[200px] h-12 rounded-sm flex items-center justify-center gap-2 font-bold text-sm tracking-wide transition-all ${
                  product.isSoldOut
                    ? "bg-surface-dark border border-border-dark text-text-muted cursor-not-allowed"
                    : isAdded
                    ? "bg-green-950 border border-green-500/30 text-green-200"
                    : "silver-gradient text-black hover:opacity-90"
                }`}
              >
                {product.isSoldOut ? (
                  <span>اتمام موجودی</span>
                ) : isAdded ? (
                  <>
                    <Check size={16} />
                    <span>به سبد اضافه شد</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>افزودن به سبد خرید</span>
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`w-12 h-12 border rounded-sm flex items-center justify-center transition-all ${
                  isFavorite
                    ? "border-accent-silver bg-accent-silver/10 text-white"
                    : "border-border-dark text-text-muted hover:text-white hover:border-text-muted"
                }`}
                title="افزودن به علاقه‌مندی‌ها"
              >
                <Heart size={18} className={isFavorite ? "fill-accent-silver text-accent-silver" : ""} />
              </button>
            </div>

            {/* Shipping Info Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-text-muted pt-2">
              <div className="flex gap-3 p-3 rounded-sm bg-surface border border-border-dark/40">
                <Truck size={18} className="text-accent-gold flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-white font-bold">بسته‌بندی ویژه اشیاء شکستنی</h4>
                  <p>استفاده از ضربه‌گیر پلاستیکی چندلایه و فوم محافظ مخصوص برای ضمانت سلامت ارسال آثار سرامیکی.</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 rounded-sm bg-surface border border-border-dark/40">
                <Flame size={18} className="text-accent-silver flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-white font-bold">ارسال با چاپار و تیپاکس</h4>
                  <p>امکان رهگیری لحظه‌ای مرسوله و تحویل سریع درب منزل در تمام نقاط کشور.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-border-dark pt-16">
          <h2 className="text-2xl font-black text-white mb-8">آثار مشابه دیگر</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => {
              const imgUrl = typeof p.images?.[0]?.image === "object" ? p.images[0].image.url : "/placeholder.png";
              return (
                <div
                  key={p.id}
                  className="group relative flex flex-col bg-surface-dark border border-border-dark p-4 rounded-sm glass-panel glass-panel-hover"
                >
                  <div className="relative aspect-square bg-black mb-4 overflow-hidden rounded-sm border border-border-dark/60">
                    <Image
                      src={imgUrl}
                      alt={p.title}
                      fill
                      className="object-cover filter grayscale contrast-110 group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-grow space-y-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-accent-silver line-clamp-1 transition-colors">
                      {p.title}
                    </h3>
                    <div className="flex justify-between items-baseline pt-2 border-t border-border-dark/40 text-xs">
                      <span className="font-semibold text-white">{formatToman(p.price)}</span>
                      <Link href={`/shop/${p.slug}`} className="text-accent-silver hover:underline">
                        مشاهده اثر
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
