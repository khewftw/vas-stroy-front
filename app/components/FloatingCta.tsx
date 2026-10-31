"use client";

import { useEffect, useState } from "react";
import { openBooking } from "../lib/booking";

export default function FloatingCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const footer = document.getElementById("contacts");
      const nearFooter = footer ? footer.getBoundingClientRect().top < window.innerHeight * 0.9 : false;
      const book = document.getElementById("book")?.getBoundingClientRect();
      const inForm = book ? book.top < window.innerHeight * 0.7 && book.bottom > window.innerHeight * 0.3 : false;
      setVisible(window.scrollY > window.innerHeight * 0.8 && !nearFooter && !inForm);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className={`floating-cta${visible ? " is-visible" : ""}`} aria-hidden={!visible}>
      <button type="button" className="floating-cta-main" tabIndex={visible ? 0 : -1} onClick={() => openBooking("quote")}>
        <span>Запросить КП</span>
      </button>
      <a className="floating-cta-phone" href="tel:+78432177777" aria-label="Позвонить" tabIndex={visible ? 0 : -1}>
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" />
        </svg>
      </a>
    </div>
  );
}
