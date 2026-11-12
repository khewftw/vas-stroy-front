"use client";

import { useEffect, useRef, useState } from "react";
import CircleViewer from "./CircleViewer";

const STORAGE_KEY = "vasstroy-circle-closed";
// once closed, the circle stays away for this many days (kept in localStorage, so it survives reloads and new tabs)
const HIDE_DAYS = 30;

// the round video in the bottom-right corner: a light looping preview, the full video with sound opens in a popup
export default function CircleVideo() {
  const discRef = useRef<HTMLButtonElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [closed, setClosed] = useState(true); // true until sessionStorage has been read, so nothing flashes
  const [origin, setOrigin] = useState<DOMRect | null>(null);
  const [open, setOpen] = useState(false);
  const [engaged, setEngaged] = useState(false); // the visitor has clicked it: stop nudging

  useEffect(() => {
    const read = () => {
      try {
        const until = Number(localStorage.getItem(STORAGE_KEY) ?? 0);
        setClosed(until > Date.now());
      } catch {
        setClosed(false);
      }
    };
    const timer = window.setTimeout(read, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (closed) return null;

  // "Включить звук" follows the pointer, 20px below it (above it when the pointer is at the very bottom edge)
  const moveHint = (event: React.PointerEvent) => {
    const hint = hintRef.current;
    if (!hint || event.pointerType !== "mouse") return;
    const half = hint.offsetWidth / 2;
    const x = Math.min(window.innerWidth - half - 8, Math.max(half + 8, event.clientX));
    const below = event.clientY + 20;
    const y = below + hint.offsetHeight + 8 > window.innerHeight ? event.clientY - 20 - hint.offsetHeight : below;
    hint.style.left = `${x}px`;
    hint.style.top = `${y}px`;
    hint.classList.add("is-on");
  };
  const hideHint = () => hintRef.current?.classList.remove("is-on");

  const dismiss = () => {
    setClosed(true);
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now() + HIDE_DAYS * 24 * 60 * 60 * 1000));
    } catch {}
  };

  return (
    <>
      <div className={`cv${scrolled ? " is-on" : ""}${engaged ? " is-engaged" : ""}`}>
        <button
          ref={discRef}
          type="button"
          className="cv-disc"
          aria-label="Смотреть видео: приветствие от ВАС СТРОЙ"
          onPointerEnter={moveHint}
          onPointerMove={moveHint}
          onPointerLeave={hideHint}
          onClick={() => {
            hideHint();
            setEngaged(true);
            setOrigin(discRef.current?.getBoundingClientRect() ?? null);
            setOpen(true);
          }}
        >
          {scrolled ? <video src="/main-circle-lite.webm" autoPlay muted loop playsInline preload="auto" aria-hidden="true" /> : null}
          <span className="cv-muted" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" />
              <path d="m16 9.5 5 5m0-5-5 5" />
            </svg>
          </span>
        </button>
        <button type="button" className="cv-x" aria-label="Закрыть видео" onClick={dismiss}>
          <span aria-hidden="true" />
        </button>
      </div>
      <span ref={hintRef} className="cv-hint" aria-hidden="true">Включить звук</span>
      {open ? <CircleViewer origin={origin} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
