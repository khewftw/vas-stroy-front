"use client";

import { useEffect, useRef, useState } from "react";

const FINE_POINTER_QUERY =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[role='button']",
  "[role='link']",
  "[contenteditable='true']",
  "[data-cursor='interactive']",
  ".news-item",
  ".editorial-picture",
  ".quality-card",
].join(",");

function isInteractive(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  if (target.closest(INTERACTIVE_SELECTOR)) return true;

  const root = document.documentElement;
  const cursorWasEnabled = root.classList.contains("custom-cursor-enabled");
  if (cursorWasEnabled) root.classList.remove("custom-cursor-enabled");

  let element: Element | null = target;
  let hasPointerCursor = false;

  try {
    while (element && element !== document.body) {
      if (window.getComputedStyle(element).cursor === "pointer") {
        hasPointerCursor = true;
        break;
      }
      element = element.parentElement;
    }
  } finally {
    if (cursorWasEnabled) root.classList.add("custom-cursor-enabled");
  }

  return hasPointerCursor;
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(FINE_POINTER_QUERY);
    const sync = () => setEnabled(media.matches);

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const base = cursorRef.current;
    const tint = tintRef.current;
    if (!base || !tint) return;

    // two stacked blend layers: "difference" inverts what is under the pointer, the tint layer turns that into blue-on-white / white-on-blue
    const layers = [base, tint];
    const cursor = {
      style: {
        set transform(value: string) {
          layers.forEach((layer) => (layer.style.transform = value));
        },
      },
      classList: {
        add: (name: string) => layers.forEach((layer) => layer.classList.add(name)),
        remove: (name: string) => layers.forEach((layer) => layer.classList.remove(name)),
        toggle: (name: string, force: boolean) => layers.forEach((layer) => layer.classList.toggle(name, force)),
      },
    };

    document.documentElement.classList.add("custom-cursor-enabled");

    const EASE = 0.16;
    let frame = 0;
    let x = 0;
    let y = 0;
    let cx = 0;
    let cy = 0;
    let started = false;
    let lastTarget: EventTarget | null = null;

    let angle = 0;

    const renderPosition = () => {
      const dx = x - cx;
      const dy = y - cy;
      cx += dx * EASE;
      cy += dy * EASE;
      const lag = Math.hypot(dx, dy);
      const settled = lag < 0.1;
      if (settled) {
        cx = x;
        cy = y;
      }
      // the faster the pointer moves, the longer the blob stretches along its direction
      const stretch = settled ? 1 : 1 + Math.min(lag / 35, 2.2);
      if (lag > 1.5) angle = Math.atan2(dy, dx);
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%) rotate(${angle}rad) scale(${stretch}, ${1 / Math.sqrt(stretch)})`;
      frame = settled ? 0 : window.requestAnimationFrame(renderPosition);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      x = event.clientX;
      y = event.clientY;
      if (!started) {
        started = true;
        cx = x;
        cy = y;
      }
      cursor.classList.add("is-visible");

      if (event.target !== lastTarget) {
        lastTarget = event.target;
        cursor.classList.toggle("is-interactive", isInteractive(event.target));
      }

      if (!frame) frame = window.requestAnimationFrame(renderPosition);
    };

    const onPointerLeave = () => {
      cursor.classList.remove("is-visible");
      started = false;
    };

    // the surface under a still pointer changes while scrolling (e.g. the header turning white)
    let scrollFrame = 0;
    const onScroll = () => {
      if (!started || scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        const under = document.elementFromPoint(x, y);
        cursor.classList.toggle("is-interactive", isInteractive(under));
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    return () => {
      document.documentElement.classList.remove("custom-cursor-enabled");
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(scrollFrame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div className="custom-cursor custom-cursor-base" ref={cursorRef} aria-hidden="true">
        <span />
      </div>
      <div className="custom-cursor custom-cursor-tint" ref={tintRef} aria-hidden="true">
        <span />
      </div>
    </>
  );
}
