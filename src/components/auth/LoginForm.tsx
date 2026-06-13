"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Smartphone, ShieldCheck, ArrowRight, Loader } from "lucide-react";

export const LoginForm: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [mockOtpCode, setMockOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  // Handle phone submission -> generate simulated OTP
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setErrorMsg("لطفا شماره تلفن همراه معتبر وارد کنید.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    // Simulate network delay for OTP dispatch
    setTimeout(() => {
      setIsLoading(false);
      setIsOtpSent(true);
      // Generate a mock code
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setMockOtpCode(code);
    }, 800);
  };

  // Handle OTP verification -> NextAuth signIn
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setErrorMsg("لطفا کد تایید ۴ رقمی را وارد کنید.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await signIn("credentials", {
        phone,
        otp,
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg("کد تایید وارد شده نامعتبر است.");
      } else {
        // Successful login
        router.refresh();
      }
    } catch (err) {
      setErrorMsg("خطا در برقراری ارتباط با سرور.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 glass-panel border border-border-dark rounded-sm space-y-6">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-white">ورود یا ثبت‌نام مشتریان</h2>
        <p className="text-xs text-text-muted">
          برای ثبت سفارش و مشاهده تاریخچه خرید، با شماره همراه خود وارد شوید.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-sm bg-red-950/40 border border-red-500/20 text-red-200 text-xs text-center font-sans">
          {errorMsg}
        </div>
      )}

      {/* PHASE 1: Request OTP */}
      {!isOtpSent ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-text-muted">شماره تلفن همراه</label>
            <div className="relative">
              <input
                type="tel"
                required
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 px-4 pr-10 rounded-sm text-left font-sans"
              />
              <Smartphone size={16} className="absolute top-1/2 right-3 -translate-y-1/2 text-text-muted" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-sm silver-gradient text-black font-bold text-sm flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader className="animate-spin" size={16} /> : null}
            <span>دریافت کد تایید پیامکی</span>
          </button>
        </form>
      ) : (
        /* PHASE 2: Verify OTP */
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          
          {/* Test assistance note */}
          <div className="p-4 rounded-sm bg-accent-silver/5 border border-accent-silver/20 text-xs text-accent-silver text-center space-y-1">
            <p>کد تایید پیامک شده (جهت تست):</p>
            <strong className="text-sm font-sans tracking-widest">{mockOtpCode}</strong>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-text-muted">کد تایید ۴ رقمی را وارد کنید</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="- - - -"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full h-11 px-4 pr-10 rounded-sm text-center font-sans tracking-widest text-lg"
              />
              <ShieldCheck size={16} className="absolute top-1/2 right-3 -translate-y-1/2 text-text-muted" />
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => setIsOtpSent(false)}
              className="w-1/3 h-11 border border-border-dark rounded-sm text-text-muted hover:text-white flex items-center justify-center"
            >
              <ArrowRight size={16} />
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-2/3 h-11 rounded-sm silver-gradient text-black font-bold text-sm flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader className="animate-spin" size={16} /> : null}
              <span>ورود به حساب کاربری</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
