"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { formatToman } from "@/lib/toman";
import { X, Plus, Minus, Trash2, ShoppingBag, Heart } from "lucide-react";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    getCartSubtotal,
    toggleWishlist,
  } = useStore();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCartOpen(false);
    };
    if (isCartOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const subtotal = getCartSubtotal();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="absolute inset-y-0 left-0 md:left-auto md:right-0 max-w-full flex">
        {/* Drawer Panel */}
        <div
          ref={drawerRef}
          className="w-screen max-w-md bg-surface-dark border-r md:border-r-0 md:border-l border-border-dark text-foreground flex flex-col shadow-2xl animate-in slide-in-from-left md:slide-in-from-right duration-300"
        >
          {/* Header */}
          <div className="p-6 border-b border-border-dark flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-accent-silver" />
              <h2 className="text-lg font-bold text-white">سبد خرید شما</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-text-muted hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <ShoppingBag size={48} className="text-border-dark" />
                <p className="text-text-muted text-sm">سبد خرید شما در حال حاضر خالی است.</p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2 rounded-sm silver-gradient text-black font-semibold text-xs transition-opacity hover:opacity-90"
                >
                  مشاهده فروشگاه هنر
                </Link>
              </div>
            ) : (
              cart.map((item) => {
                const imgUrl =
                  typeof item.product.images?.[0]?.image === "object"
                    ? item.product.images[0].image.url
                    : "/placeholder.png";

                return (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-4 rounded-sm bg-surface border border-border-dark/50"
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 bg-black rounded-sm overflow-hidden flex-shrink-0 border border-border-dark">
                      <Image
                        src={imgUrl}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white line-clamp-1">
                          {item.product.title}
                        </h3>
                        <p className="text-xs text-text-muted mt-1">
                          {item.product.isUnique ? "تک نسخه (یونیک)" : "نسخه کارگاهی"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Price */}
                        <span className="text-xs font-semibold text-white">
                          {formatToman(item.product.price * item.quantity)}
                        </span>

                        {/* Quantity Controls */}
                        <div className="flex items-center border border-border-dark rounded-sm bg-black">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-1 px-2 text-text-muted hover:text-white transition-colors"
                            disabled={item.product.isUnique}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 text-xs font-semibold text-white font-sans">
                            {item.quantity.toLocaleString("fa-IR")}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-1 px-2 text-text-muted hover:text-white transition-colors"
                            disabled={item.product.isUnique}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 items-center justify-start">
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-text-muted hover:text-red-400 transition-colors"
                        title="حذف از سبد"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          toggleWishlist(item.product);
                          removeFromCart(item.product.id);
                        }}
                        className="text-text-muted hover:text-white transition-colors"
                        title="ذخیره برای بعد (انتقال به علاقه‌مندی‌ها)"
                      >
                        <Heart size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-border-dark bg-black/40 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-muted">جمع کل اقلام:</span>
                <span className="text-lg font-bold text-white">{formatToman(subtotal)}</span>
              </div>
              <p className="text-[10px] text-text-muted leading-relaxed text-right">
                هزینه ارسال در مرحله نهایی بر اساس وزن مرسوله و آدرس مقصد محاسبه و اضافه خواهد شد.
              </p>
              
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center py-3 rounded-sm silver-gradient text-black font-bold text-sm tracking-wide transition-opacity hover:opacity-90"
              >
                ثبت سفارش و ورود به درگاه پرداخت
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
