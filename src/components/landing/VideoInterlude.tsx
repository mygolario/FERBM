"use client";

import { useEffect, useRef, ReactNode } from "react";

interface VideoInterludeProps {
  videoSrc: string;
  children?: ReactNode;
  className?: string;
}

export function VideoInterlude({ videoSrc, children, className = "" }: VideoInterludeProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`relative overflow-hidden ${className}`}>
      {/* Background video — plays only when in viewport */}
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Children render overlays + content */}
      {children}
    </section>
  );
}
