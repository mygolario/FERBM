"use client";

import { useEffect, useRef, ReactNode } from "react";

interface VideoHeroProps {
  videoSrc: string;
  children: ReactNode;
}

export function VideoHero({ videoSrc, children }: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay blocked — video will remain as a poster frame
      });
    }
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Multi-layer atmosphere overlay */}
      <div className="hero-overlay absolute inset-0 z-[1]" />

      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] text-white/30 font-medium tracking-widest">SCROLL</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-accent-gold/50 to-transparent animate-bounce" />
        </div>
      </div>
    </section>
  );
}
