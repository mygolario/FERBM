"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatToman } from "@/lib/toman";
import { Grid, LayoutGrid, Search, SlidersHorizontal, Sliders } from "lucide-react";

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  images?: Array<{
    image: {
      url: string;
      alt: string;
    } | string;
  }>;
  category?: {
    id: string;
    name: string;
  };
  isUnique?: boolean;
  isSoldOut?: boolean;
  inStock?: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ShopClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export const ShopClient: React.FC<ShopClientProps> = ({
  initialProducts,
  categories,
}) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(5000000);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isMasonry, setIsMasonry] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category?.id === selectedCategory);
    }

    // Price filter
    result = result.filter((p) => p.price <= maxPrice);

    // Sorting
    if (sortBy === "cheapest") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "expensive") {
      result.sort((a, b) => b.price - a.price);
    } else {
      // default "newest", since ID or createdAt handles it
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [initialProducts, search, selectedCategory, maxPrice, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header & Tagline */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-white">فروشگاه سرامیک فربم</h1>
        <p className="text-sm text-text-muted">
          مجموعه‌ای منحصر‌به‌فرد از سفالینه‌های لوکس و ظروف تک‌نسخه هنری
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden lg:block space-y-8 p-6 glass-panel border border-border-dark rounded-sm h-fit">
          
          {/* Search */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm">جستجوی آثار</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="نام اثر یا دسته‌بندی..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-sm text-sm"
              />
              <Search size={16} className="absolute top-1/2 right-3 -translate-y-1/2 text-text-muted" />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-sm">دسته‌بندی‌ها</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`text-right text-sm py-1.5 px-3 rounded-sm transition-colors ${
                  selectedCategory === "all"
                    ? "bg-accent-silver/10 text-white font-semibold"
                    : "text-text-muted hover:text-white"
                }`}
              >
                همه آثار
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-right text-sm py-1.5 px-3 rounded-sm transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-accent-silver/10 text-white font-semibold"
                      : "text-text-muted hover:text-white"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold">
              <h3 className="text-white">محدوده قیمت</h3>
              <span className="text-accent-gold text-xs">{formatToman(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={100000}
              max={5000000}
              step={50000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-accent-silver cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-muted">
              <span>۱۰۰ هزار</span>
              <span>۵ میلیون تومان</span>
            </div>
          </div>

        </aside>

        {/* PRODUCTS SECTION */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 glass-panel border border-border-dark rounded-sm">
            
            {/* Filter Toggle Mobile */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-border-dark text-sm rounded-sm text-white hover:bg-surface/50"
            >
              <SlidersHorizontal size={16} />
              <span>فیلترها و جستجو</span>
            </button>

            {/* Sorting */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs text-text-muted whitespace-nowrap">مرتب‌سازی:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-3 py-1.5 rounded-sm text-xs"
              >
                <option value="newest">جدیدترین آثار</option>
                <option value="cheapest">ارزان‌ترین</option>
                <option value="expensive">گران‌ترین</option>
              </select>
            </div>

            {/* Layout Toggle */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setIsMasonry(false)}
                className={`p-2 rounded-sm transition-colors ${
                  !isMasonry ? "bg-accent-silver/10 text-white" : "text-text-muted hover:text-white"
                }`}
                title="نمایش شبکه‌ای"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setIsMasonry(true)}
                className={`p-2 rounded-sm transition-colors ${
                  isMasonry ? "bg-accent-silver/10 text-white" : "text-text-muted hover:text-white"
                }`}
                title="نمایش آجری (Masonry)"
              >
                <Grid size={18} />
              </button>
            </div>

          </div>

          {/* Mobile Filters Panel */}
          {showMobileFilters && (
            <div className="lg:hidden p-6 glass-panel border border-border-dark rounded-sm space-y-6 animate-in slide-in-from-top duration-250">
              <div className="space-y-2">
                <label className="text-xs text-text-muted">جستجو</label>
                <input
                  type="text"
                  placeholder="نام اثر..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2 rounded-sm text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-text-muted">دسته‌بندی</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm text-xs"
                >
                  <option value="all">همه دسته‌بندی‌ها</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted">حداکثر قیمت:</span>
                  <span className="text-accent-gold font-semibold">{formatToman(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={5000000}
                  step={50000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-accent-silver"
                />
              </div>
            </div>
          )}

          {/* Products Render */}
          {filteredProducts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-3 glass-panel border border-border-dark rounded-sm">
              <p className="text-text-muted text-sm">هیچ اثری با معیارهای انتخاب شده یافت نشد.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                  setMaxPrice(5000000);
                }}
                className="text-xs text-accent-silver font-semibold underline"
              >
                حذف تمام فیلترها
              </button>
            </div>
          ) : (
            <div
              className={
                isMasonry
                  ? "columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
                  : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              }
            >
              {filteredProducts.map((product) => {
                const imgUrl =
                  typeof product.images?.[0]?.image === "object"
                    ? product.images[0].image.url
                    : "/placeholder.png";

                return (
                  <div
                    key={product.id}
                    className={`break-inside-avoid group relative flex flex-col bg-surface-dark border border-border-dark p-4 rounded-sm glass-panel glass-panel-hover ${
                      isMasonry ? "mb-6" : ""
                    }`}
                  >
                    {/* Image */}
                    <div className="relative aspect-square bg-black mb-4 overflow-hidden rounded-sm border border-border-dark/60">
                      <Image
                        src={imgUrl}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 30vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale contrast-110 group-hover:grayscale-0"
                      />
                      {/* Badges */}
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
                        <span className="text-[10px] text-accent-gold font-medium">
                          {product.category?.name || "سفالینه هنری"}
                        </span>
                        <h3 className="text-base font-bold text-white group-hover:text-accent-silver transition-colors mt-1 line-clamp-1">
                          {product.title}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border-dark/40">
                        <span className="text-sm font-bold text-white">
                          {formatToman(product.price)}
                        </span>
                        <Link
                          href={`/shop/${product.slug}`}
                          className="text-xs py-1.5 px-3 border border-border-dark rounded-sm hover:border-accent-silver hover:text-white transition-colors"
                        >
                          مشاهده اثر
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </main>

      </div>

    </div>
  );
};
