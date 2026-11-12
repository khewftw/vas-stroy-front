"use client";

import { useEffect, useRef } from "react";

const EASE = 0.14;

// the "Подробнее" pill trails the pointer over a case card with a slight lag
export default function CasesGrid({ children, ...rest }: React.HTMLAttributes<HTMLDivElement> & { "data-reveal"?: string; "data-reveal-stagger"?: boolean }) {
  const state = useRef<{ card: HTMLElement | null; x: number; y: number; tx: number; ty: number; raf: number }>({
    card: null, x: 0, y: 0, tx: 0, ty: 0, raf: 0,
  });

  useEffect(() => {
    const s = state.current;
    return () => cancelAnimationFrame(s.raf);
  }, []);

  const tick = () => {
    const s = state.current;
    if (!s.card) return;
    s.x += (s.tx - s.x) * EASE;
    s.y += (s.ty - s.y) * EASE;
    s.card.style.setProperty("--mx", `${s.x.toFixed(1)}px`);
    s.card.style.setProperty("--my", `${s.y.toFixed(1)}px`);
    s.raf = requestAnimationFrame(tick);
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const card = (e.target as Element).closest<HTMLElement>(".case-card, .news-item");
    const s = state.current;
    if (!card) return;
    const box = card.getBoundingClientRect();
    s.tx = e.clientX - box.left;
    s.ty = e.clientY - box.top;
    if (s.card !== card) {
      // entering a new card: start right under the pointer, no slide-in
      cancelAnimationFrame(s.raf);
      s.card = card;
      s.x = s.tx;
      s.y = s.ty;
      s.raf = requestAnimationFrame(tick);
    }
  };

  const onLeave = () => {
    const s = state.current;
    cancelAnimationFrame(s.raf);
    s.card = null;
  };

  return (
    <div {...rest} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  );
}
