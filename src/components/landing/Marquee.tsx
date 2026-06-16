"use client";

import React from "react";

interface MarqueeProps {
  items: string[];
}

export function Marquee({ items }: MarqueeProps) {
  const content = items.map((item, i) => (
    <React.Fragment key={i}>
      <span className="inline-block text-[13px] font-medium text-text-muted/70 whitespace-nowrap">
        {item}
      </span>
      <span className="inline-block text-accent-gold/40 text-[10px] mx-5 select-none" aria-hidden="true">
        ✦
      </span>
    </React.Fragment>
  ));

  return (
    <div className="marquee-container" dir="ltr">
      <div className="marquee-track">
        <div className="inline-flex items-center">{content}</div>
        <div className="inline-flex items-center" aria-hidden="true">{content}</div>
      </div>
    </div>
  );
}
