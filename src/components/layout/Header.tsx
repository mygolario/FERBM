"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { ShoppingBag, Heart, User, Menu, X } from "lucide-react";

export const Header: React.FC = () => {
  const { getCartItemsCount, wishlist, setIsCartOpen } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { name: "صفحه اصلی",    path: "/" },
    { name: "فروشگاه هنر",  path: "/shop" },
    { name: "وبلاگ",        path: "/blog" },
    { name: "درباره برند",  path: "/#about" },
    { name: "تماس با ما",  path: "/#contact" },
  ];

  const cartCount     = getCartItemsCount();
  const wishlistCount = wishlist.length;

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-500 ${
        isScrolled
          ? "bg-black/85 backdrop-blur-xl border-b border-border-dark shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          : "bg-transparent backdrop-blur-sm border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-foreground/70 hover:text-accent-gold transition-colors focus:outline-none"
          aria-label="منوی اصلی"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Brand Logo */}
        <div className="flex-1 md:flex-initial flex justify-center md:justify-start">
          <Link href="/" className="flex items-center gap-2 group">
            <span
              className="text-[22px] font-black tracking-[0.2em] transition-all duration-300
                         group-hover:tracking-[0.28em]"
              style={{
                background: "linear-gradient(135deg, #9A7B4F 0%, #C4A265 40%, #EDE8DF 65%, #9A7B4F 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              FERBM
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              link.path === "/"
                ? pathname === "/"
                : pathname.startsWith(link.path.replace("/#", "/"));
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`text-[13px] font-medium tracking-wide transition-colors duration-250
                  hover:text-accent-gold ${
                    isActive
                      ? "text-foreground border-b border-accent-gold pb-0.5"
                      : "text-text-muted"
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-5">
          <Link
            href="/account"
            className="text-text-muted hover:text-accent-gold transition-colors"
            title="حساب کاربری"
          >
            <User size={19} />
          </Link>

          <Link
            href="/wishlist"
            className="relative text-text-muted hover:text-accent-gold transition-colors"
            title="علاقه‌مندی‌ها"
          >
            <Heart
              size={19}
              className={wishlistCount > 0 ? "fill-accent-gold text-accent-gold" : ""}
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent-gold text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative text-text-muted hover:text-accent-gold transition-colors focus:outline-none"
            title="سبد خرید"
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent-gold text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden absolute top-[72px] left-0 w-full py-6 px-6 space-y-1
                      bg-black/95 backdrop-blur-xl border-b border-border-dark"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-3 text-base font-medium
                         text-foreground/80 hover:text-accent-gold transition-colors
                         border-b border-border-dark/40 last:border-0"
            >
              {link.name}
              <span className="text-accent-gold/30 text-xs">←</span>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
