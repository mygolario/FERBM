"use client";

import React from "react";
import { MessageCircle, Send } from "lucide-react";

export const ContactBar: React.FC = () => {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "989100000000";
  const telegramUsername = process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || "ferbm_store";

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "سلام، درباره محصولات سرامیکی گالری FERBM سوالی داشتم."
  )}`;
  const telegramUrl = `https://t.me/${telegramUsername}`;

  return (
    <div className="fixed bottom-6 left-6 flex flex-col gap-3 z-40">
      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full glass-panel border border-border-dark flex items-center justify-center text-text-muted hover:text-white hover:border-accent-silver transition-all duration-300 shadow-xl hover:-translate-y-1"
        title="ارتباط در واتس‌اپ"
      >
        {/* WhatsApp Icon */}
        <MessageCircle size={22} className="stroke-[1.5]" />
      </a>

      {/* Telegram Button */}
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full glass-panel border border-border-dark flex items-center justify-center text-text-muted hover:text-white hover:border-accent-silver transition-all duration-300 shadow-xl hover:-translate-y-1"
        title="ارتباط در تلگرام"
      >
        {/* Telegram Icon */}
        <Send size={20} className="stroke-[1.5] -mr-[2px]" />
      </a>
    </div>
  );
};
