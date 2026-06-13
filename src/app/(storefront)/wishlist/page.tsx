"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatToman } from "@/lib/toman";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 min-h-[70vh]">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="text-3xl font-black text-white">علاقه‌مندی‌های شما</h1>
        <p className="text-sm text-text-muted">
          آثاری که ذخیره کرده‌اید تا بعداً به سبد خرید خود اضافه کنید
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-16 space-y-6">
          <div className="w-16 h-16 bg-surface-dark border border-border-dark flex items-center justify-center rounded-full mx-auto text-text-muted">
            <Heart size={28} />
          </div>
          <p className="text-sm text-text-muted">لیست علاقه‌مندی‌های شما در حال حاضر خالی است.</p>
          <Link
            href="/shop"
            className="block w-full py-3 rounded-sm silver-gradient text-black font-bold text-sm"
          >
            مشاهده فروشگاه هنر
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlist.map((product) => {
            const imgUrl =
              typeof product.images?.[0]?.image === "object"
                ? product.images[0].image.url
                : "/placeholder.png";

            return (
              <div
                key={product.id}
                className="group relative flex flex-col bg-surface-dark border border-border-dark p-4 rounded-sm glass-panel glass-panel-hover"
              >
                {/* Image */}
                <div className="relative aspect-square bg-black mb-4 overflow-hidden rounded-sm border border-border-dark/60">
                  <Image
                    src={imgUrl}
                    alt={product.title}
                    fill
                    className="object-cover filter grayscale contrast-110 group-hover:grayscale-0 transition-all duration-300"
                  />
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
                <div className="flex-grow flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-accent-silver transition-colors mt-1 line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-1">
                      {product.isUnique ? "تک نسخه (یونیک)" : "نسخه کارگاهی"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border-dark/40">
                    <span className="text-sm font-bold text-white">
                      {formatToman(product.price)}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-2">
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.isSoldOut}
                      className="col-span-3 h-10 rounded-sm silver-gradient text-black font-bold text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingBag size={14} />
                      <span>خرید</span>
                    </button>
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="h-10 border border-border-dark rounded-sm flex items-center justify-center text-text-muted hover:text-red-400 hover:border-red-400/30 transition-colors"
                      title="حذف از لیست"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
