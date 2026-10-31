"use client";

import { useEffect } from "react";

// the footer sits fixed behind the page; this reserves matching space under <main> so scrolling uncovers it
export default function FooterReveal() {
  useEffect(() => {
    const footer = document.querySelector<HTMLElement>(".footer");
    if (!footer) return;
    const root = document.documentElement;
    const sync = () => {
      const h = footer.offsetHeight;
      // a footer taller than the screen can't be fully uncovered, so fall back to a normal footer
      const fits = h <= window.innerHeight;
      root.style.setProperty("--footer-h", `${h}px`);
      root.classList.toggle("footer-reveal", fits);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(footer);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
      root.classList.remove("footer-reveal");
      root.style.removeProperty("--footer-h");
    };
  }, []);
  return null;
}
