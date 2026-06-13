"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { ShoppingBag, Heart, User, Menu, X } from "lucide-react";

export const Header: React.FC = () => {
  const { getCartItemsCount, wishlist, setIsCartOpen } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "صفحه اصلی", path: "/" },
    { name: "فروشگاه هنر", path: "/shop" },
    { name: "وبلاگ سفالگری", path: "/blog" },
    { name: "درباره برند", path: "/#about" },
    { name: "تماس با ما", path: "/#contact" },
  ];

  const cartCount = getCartItemsCount();
  const wishlistCount = wishlist.length;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-border-dark backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-foreground hover:text-accent-silver transition-colors focus:outline-none"
          aria-label="منوی اصلی"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo - Center on Mobile, Right on Desktop */}
        <div className="flex-1 md:flex-initial flex justify-center md:justify-start">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-widest silver-text-gradient font-sans">
              FERBM
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              link.path === "/"
                ? pathname === "/"
                : pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors duration-250 hover:text-accent-silver ${
                  isActive
                    ? "text-white border-b-2 border-accent-silver pb-1"
                    : "text-text-muted"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons (Left) */}
        <div className="flex items-center gap-5">
          <Link
            href="/account"
            className="text-text-muted hover:text-white transition-colors"
            title="حساب کاربری"
          >
            <User size={20} />
          </Link>

          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            className="relative text-text-muted hover:text-white transition-colors"
            title="علاقه‌مندی‌ها"
          >
            <Heart size={20} className={wishlistCount > 0 ? "fill-accent-silver text-accent-silver" : ""} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent-silver text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-sans">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative text-text-muted hover:text-white transition-colors focus:outline-none"
            title="سبد خرید"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-sans">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-border-dark absolute top-20 left-0 w-full p-6 space-y-4 flex flex-col items-center">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium text-foreground hover:text-accent-silver transition-colors py-2"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
