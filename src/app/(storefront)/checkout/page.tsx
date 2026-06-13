"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { formatToman } from "@/lib/toman";
import { iranProvincesAndCities } from "@/lib/iranCities";
import { calculateShipping } from "@/lib/shipping";
import { ChevronLeft, CreditCard, MapPin, Truck, User, ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const { cart, getCartSubtotal, clearCart } = useStore();
  const [step, setStep] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [shippingMethod, setShippingMethod] = useState<"chapar" | "tipax">("chapar");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 bg-surface-dark border border-border-dark flex items-center justify-center rounded-full mx-auto text-text-muted">
          <ShoppingBag size={28} />
        </div>
        <h1 className="text-xl font-bold text-white">سبد خرید شما خالی است</h1>
        <p className="text-sm text-text-muted">
          برای ثبت سفارش، ابتدا محصولاتی را به سبد خرید خود اضافه کنید.
        </p>
        <Link
          href="/shop"
          className="block w-full py-3 rounded-sm silver-gradient text-black font-bold text-sm"
        >
          بازدید از فروشگاه هنر
        </Link>
      </div>
    );
  }

  // Calculate cart weight (each item default 500 grams if not specified)
  const totalWeight = cart.reduce((sum, item) => {
    const w = item.product.weight || 500;
    return sum + w * item.quantity;
  }, 0);

  // Compute shipping rates
  const shippingRates = selectedProvince
    ? calculateShipping({
        originProvince: "تهران",
        destProvince: selectedProvince,
        weightGrams: totalWeight,
      })
    : null;

  const shippingFee = shippingRates
    ? shippingMethod === "chapar"
      ? shippingRates.chapar.cost
      : shippingRates.tipax.cost
    : 0;

  const subtotal = getCartSubtotal();
  const totalAmount = subtotal + shippingFee;

  // Province change handler
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prov = e.target.value;
    setSelectedProvince(prov);
    setSelectedCity(""); // reset city
  };

  const cities = selectedProvince
    ? iranProvincesAndCities.find((p) => p.name === selectedProvince)?.cities || []
    : [];

  // Submit Handler -> Calls Payment Gateway API
  const handlePayment = async () => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/payment/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          customer: {
            name,
            phone,
            email,
            province: selectedProvince,
            city: selectedCity,
            fullAddress,
            postalCode,
          },
          items: cart.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
          shippingMethod,
          shippingFee,
        }),
      });

      const data = await response.json();
      if (data.redirectUrl) {
        // Redirect to Zibal gateway
        window.location.href = data.redirectUrl;
      } else {
        setErrorMsg(data.message || "خطا در برقراری ارتباط با درگاه پرداخت زیبال");
      }
    } catch (error) {
      setErrorMsg("خطایی در اتصال به درگاه رخ داد. لطفا مجددا تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* RIGHT: WIZARD FORM (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Steps Indicator */}
          <div className="flex justify-between items-center text-xs sm:text-sm border-b border-border-dark pb-6">
            <button
              onClick={() => step > 1 && setStep(1)}
              className={`flex items-center gap-1.5 ${
                step === 1 ? "text-white font-bold" : "text-text-muted"
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step >= 1 ? "bg-accent-silver text-black font-sans font-black" : "bg-surface-dark border border-border-dark text-text-muted"
              }`}>۱</span>
              <span>مشخصات</span>
            </button>
            <div className="flex-1 h-[1px] bg-border-dark mx-2" />
            <button
              onClick={() => step > 2 && setStep(2)}
              disabled={step < 2}
              className={`flex items-center gap-1.5 ${
                step === 2 ? "text-white font-bold" : "text-text-muted"
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step >= 2 ? "bg-accent-silver text-black font-sans font-black" : "bg-surface-dark border border-border-dark text-text-muted"
              }`}>۲</span>
              <span>نشانی تحویل</span>
            </button>
            <div className="flex-1 h-[1px] bg-border-dark mx-2" />
            <button
              onClick={() => step > 3 && setStep(3)}
              disabled={step < 3}
              className={`flex items-center gap-1.5 ${
                step === 3 ? "text-white font-bold" : "text-text-muted"
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step >= 3 ? "bg-accent-silver text-black font-sans font-black" : "bg-surface-dark border border-border-dark text-text-muted"
              }`}>۳</span>
              <span>روش ارسال</span>
            </button>
          </div>

          {/* STEP 1: Personal info */}
          {step === 1 && (
            <div className="space-y-6 glass-panel border border-border-dark p-6 sm:p-8 rounded-sm animate-in fade-in duration-200">
              <div className="flex items-center gap-2 border-b border-border-dark pb-3">
                <User size={18} className="text-accent-silver" />
                <h2 className="text-lg font-bold text-white">۱. اطلاعات خریدار</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-text-muted">نام و نام خانوادگی خریدار *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: آریو حسینی"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 px-4 rounded-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-text-muted">شماره تماس (همراه) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-11 px-4 rounded-sm text-left font-sans"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-text-muted">آدرس ایمیل (اختیاری)</label>
                    <input
                      type="email"
                      placeholder="info@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 px-4 rounded-sm text-left font-sans"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={!name || !phone}
                onClick={() => setStep(2)}
                className="w-full py-3 mt-4 rounded-sm silver-gradient text-black font-bold text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                ادامه به آدرس تحویل
              </button>
            </div>
          )}

          {/* STEP 2: Address info */}
          {step === 2 && (
            <div className="space-y-6 glass-panel border border-border-dark p-6 sm:p-8 rounded-sm animate-in fade-in duration-200">
              <div className="flex items-center gap-2 border-b border-border-dark pb-3">
                <MapPin size={18} className="text-accent-silver" />
                <h2 className="text-lg font-bold text-white">۲. نشانی تحویل مرسوله</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-text-muted">انتخاب استان *</label>
                    <select
                      value={selectedProvince}
                      onChange={handleProvinceChange}
                      className="w-full h-11 px-3 rounded-sm"
                    >
                      <option value="">انتخاب کنید...</option>
                      {iranProvincesAndCities.map((p) => (
                        <option key={p.name} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-text-muted">انتخاب شهر *</label>
                    <select
                      value={selectedCity}
                      disabled={!selectedProvince}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full h-11 px-3 rounded-sm disabled:opacity-50"
                    >
                      <option value="">انتخاب کنید...</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-text-muted">آدرس دقیق پستی *</label>
                  <textarea
                    required
                    placeholder="خیابان، کوچه، پلاک، واحد..."
                    rows={3}
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    className="w-full p-4 rounded-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-text-muted">کد پستی ۱۰ رقمی *</label>
                  <input
                    type="text"
                    required
                    placeholder="کد پستی ده رقمی روی کارت ملی"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full h-11 px-4 rounded-sm font-sans"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 border border-border-dark rounded-sm hover:bg-surface/50 text-white font-semibold text-sm transition-colors"
                >
                  بازگشت
                </button>
                <button
                  type="button"
                  disabled={!selectedProvince || !selectedCity || !fullAddress || !postalCode}
                  onClick={() => setStep(3)}
                  className="w-2/3 py-3 rounded-sm silver-gradient text-black font-bold text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  ادامه به روش ارسال
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Shipping selection */}
          {step === 3 && shippingRates && (
            <div className="space-y-6 glass-panel border border-border-dark p-6 sm:p-8 rounded-sm animate-in fade-in duration-200">
              <div className="flex items-center gap-2 border-b border-border-dark pb-3">
                <Truck size={18} className="text-accent-silver" />
                <h2 className="text-lg font-bold text-white">۳. انتخاب روش ارسال</h2>
              </div>

              <div className="space-y-4">
                {/* Option 1: Chapar */}
                <label
                  className={`flex gap-4 p-4 border rounded-sm cursor-pointer transition-all ${
                    shippingMethod === "chapar"
                      ? "border-accent-silver bg-accent-silver/5"
                      : "border-border-dark hover:border-text-muted bg-black/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === "chapar"}
                    onChange={() => setShippingMethod("chapar")}
                    className="accent-accent-silver mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-white text-sm">{shippingRates.chapar.name}</h3>
                      <span className="text-sm font-bold text-accent-gold">
                        {formatToman(shippingRates.chapar.cost)}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted">{shippingRates.chapar.details}</p>
                    <span className="inline-block text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-sm text-text-muted mt-2">
                      تحویل تقریبی: {shippingRates.chapar.deliveryTimeDays}
                    </span>
                  </div>
                </label>

                {/* Option 2: Tipax */}
                <label
                  className={`flex gap-4 p-4 border rounded-sm cursor-pointer transition-all ${
                    shippingMethod === "tipax"
                      ? "border-accent-silver bg-accent-silver/5"
                      : "border-border-dark hover:border-text-muted bg-black/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === "tipax"}
                    onChange={() => setShippingMethod("tipax")}
                    className="accent-accent-silver mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-white text-sm">{shippingRates.tipax.name}</h3>
                      <span className="text-sm font-bold text-accent-gold">
                        {formatToman(shippingRates.tipax.cost)}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted">{shippingRates.tipax.details}</p>
                    <span className="inline-block text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-sm text-text-muted mt-2">
                      تحویل تقریبی: {shippingRates.tipax.deliveryTimeDays}
                    </span>
                  </div>
                </label>
              </div>

              {errorMsg && (
                <div className="p-4 rounded-sm bg-red-950/40 border border-red-500/20 text-red-200 text-xs text-center">
                  {errorMsg}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3 border border-border-dark rounded-sm hover:bg-surface/50 text-white font-semibold text-sm transition-colors"
                >
                  نشانی تحویل
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handlePayment}
                  className="w-2/3 py-3 rounded-sm silver-gradient text-black font-bold text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
                >
                  <CreditCard size={16} />
                  <span>{isLoading ? "در حال اتصال به درگاه زیبال..." : "انتقال به درگاه زیبال و پرداخت"}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* LEFT: ORDER SUMMARY (5 cols) */}
        <div className="lg:col-span-5 p-6 glass-panel border border-border-dark rounded-sm space-y-6">
          <h2 className="text-base font-bold text-white border-b border-border-dark pb-3">
            خلاصه خرید شما
          </h2>

          {/* Cart Items */}
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
            {cart.map((item) => {
              const imgUrl =
                typeof item.product.images?.[0]?.image === "object"
                  ? item.product.images[0].image.url
                  : "/placeholder.png";
              return (
                <div key={item.product.id} className="flex gap-3 text-xs">
                  <div className="relative w-12 h-12 bg-black border border-border-dark rounded-sm overflow-hidden flex-shrink-0">
                    <Image src={imgUrl} alt={item.product.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <span className="text-white font-semibold line-clamp-1">{item.product.title}</span>
                    <span className="text-[10px] text-text-muted">
                      تعداد: {item.quantity.toLocaleString("fa-IR")}
                    </span>
                  </div>
                  <span className="text-white font-semibold self-center">
                    {formatToman(item.product.price * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Amounts */}
          <div className="border-t border-border-dark pt-4 space-y-3 text-xs">
            <div className="flex justify-between text-text-muted">
              <span>جمع اقلام:</span>
              <span>{formatToman(subtotal)}</span>
            </div>
            
            <div className="flex justify-between text-text-muted">
              <span>هزینه بسته‌بندی و ارسال:</span>
              <span>
                {selectedProvince
                  ? formatToman(shippingFee)
                  : "پس از وارد کردن نشانی"}
              </span>
            </div>

            <div className="flex justify-between text-sm font-bold text-white border-t border-border-dark/60 pt-3">
              <span>مبلغ نهایی پرداخت:</span>
              <span className="text-base text-accent-gold">{formatToman(totalAmount)}</span>
            </div>
          </div>

          {/* Security notice */}
          <p className="text-[10px] text-text-muted leading-relaxed text-right border-t border-border-dark/40 pt-4">
            پرداخت با پروتکل SSL توسط شاپرک و درگاه رسمی زیبال با پشتیبانی شتاب صورت می‌گیرد. ضمانت بیمه کامل اشیاء شکستنی شامل بازپرداخت کامل خسارت در صورت آسیب حین حمل پستی است.
          </p>
        </div>

      </div>
    </div>
  );
}
