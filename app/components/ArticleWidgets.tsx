"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* ---------- scroll reveal ---------- */

export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // with reduced motion the .reveal styles are already visible (see CSS)
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setSeen(true);
      observer.disconnect();
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal${seen ? " is-in" : ""} ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

/* ---------- reading progress bar ---------- */

export function ReadingProgress({ targetId }: { targetId: string }) {
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const target = document.getElementById(targetId);
    const bar = barRef.current;
    if (!target || !bar) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const box = target.getBoundingClientRect();
      const total = box.height - window.innerHeight * 0.6;
      const done = Math.min(1, Math.max(0, (-box.top + window.innerHeight * 0.2) / Math.max(1, total)));
      bar.style.transform = `scaleX(${done})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [targetId]);

  return (
    <div className="read-progress" aria-hidden="true">
      <span ref={barRef} />
    </div>
  );
}

/* ---------- share (copy link) ---------- */

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Скопируйте ссылку:", window.location.href);
    }
  };

  return (
    <button type="button" className="share-btn" onClick={copy}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
        <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
      </svg>
      <span>{copied ? "Ссылка скопирована" : "Поделиться"}</span>
    </button>
  );
}

/* ---------- accordion ---------- */

export function Accordion({ title, items }: { title?: string; items: readonly { q: string; a: string }[] }) {
  const base = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="a-accordion">
      {title ? <h3 className="a-block-title">{title}</h3> : null}
      <ul>
        {items.map((item, index) => {
          const isOpen = open === index;
          return (
            <li key={item.q} className={isOpen ? "is-open" : ""}>
              <button type="button" aria-expanded={isOpen} aria-controls={`${base}-${index}`} onClick={() => setOpen(isOpen ? null : index)}>
                <span>{item.q}</span>
                <span className="a-acc-sign" aria-hidden="true" />
              </button>
              <div id={`${base}-${index}`} className="a-acc-panel" role="region">
                <div>
                  <p>{item.a}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- zoomable photo + lightbox ---------- */

export function Zoomable({ src, alt, caption, width, height }: { src: string; alt: string; caption?: string; width?: number; height?: number }) {
  const [open, setOpen] = useState(false);
  // wider than 4:3: stretched to the container width as is.
  // taller than 4:3 (squares, portraits): shown whole inside a 4:3 frame, the free sides are filled with a soft grey.
  const known = Boolean(width && height);
  const tall = known && (width as number) / (height as number) < 4 / 3;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.classList.add("sv-open");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("sv-open");
    };
  }, [open]);

  return (
    <>
      <figure className="a-photo">
        <button type="button" className={`a-photo-btn${tall ? " is-tall" : ""}${known ? "" : " is-unknown"}`} onClick={() => setOpen(true)} aria-label={`Увеличить фото: ${alt}`}>
          {known && !tall ? (
            <Image className="a-photo-img" src={src} alt={alt} width={width as number} height={height as number} sizes="(max-width: 900px) 100vw, 860px" />
          ) : (
            <Image src={src} alt={alt} fill sizes="(max-width: 900px) 100vw, 860px" />
          )}
          <span className="a-photo-zoom" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="6" />
              <path d="m20 20-4.2-4.2M11 8.5v5M8.5 11h5" />
            </svg>
          </span>
        </button>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
      {open
        ? createPortal(
            <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={() => setOpen(false)} data-lenis-prevent>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} />
              {caption ? <p>{caption}</p> : null}
              <button type="button" className="lightbox-close" aria-label="Закрыть" onClick={() => setOpen(false)}>
                <span aria-hidden="true" />
              </button>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
