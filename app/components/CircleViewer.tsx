"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { openBooking } from "../lib/booking";
import StoryForm from "./StoryForm";

const CLOSE_MS = 320;

// popup with the full round video (sound on) on the left, greeting and the request form on the right
export default function CircleViewer({ origin, onClose }: { origin: DOMRect | null; onClose: () => void }) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  const [sent, setSent] = useState(false);
  const [muted, setMuted] = useState(false);

  useLayoutEffect(() => {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    if (dialog && origin) {
      const box = dialog.getBoundingClientRect();
      dialog.style.setProperty("--sv-x", `${origin.left + origin.width / 2 - (box.left + box.width / 2)}px`);
      dialog.style.setProperty("--sv-y", `${origin.top + origin.height / 2 - (box.top + box.height / 2)}px`);
      dialog.style.setProperty("--sv-s", String(Math.min(1, origin.width / box.width)));
    }
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    document.body.classList.add("sv-open");
    return () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove("sv-open");
    };
  }, [origin]);

  // the click that opened the popup counts as a gesture, so the video may start with sound
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {
      video.muted = true;
      setMuted(true);
      video.play().catch(() => {});
    });
  }, []);

  const close = useCallback(() => {
    setShown(false);
    window.setTimeout(() => {
      onClose();
      returnFocus.current?.focus?.();
    }, CLOSE_MS);
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    const onKey = (event: KeyboardEvent) => {
      if (document.querySelector(".lm")) return;
      if (event.key === "Escape") close();
      if (event.key !== "Tab" || !dialog) return;
      const focusable = [...dialog.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled])")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    dialog?.focus({ preventScroll: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const context = ["Заявка с сайта (видео-приветствие)", `Страница: ${window.location.pathname}`].join("\n");

  return createPortal(
    <div className={`sv cv-viewer${shown ? " is-shown" : ""}`} role="presentation" onClick={close} data-lenis-prevent>
      <div
        ref={dialogRef}
        className="sv-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sv-media">
          <video ref={videoRef} className="cv-full" src="/main-circle.webm" autoPlay loop playsInline muted={muted} />
          <button type="button" className="cv-sound" onClick={toggleSound}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" />
              {muted ? <path d="m16 9.5 5 5m0-5-5 5" /> : <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18.2 6.5a7.6 7.6 0 0 1 0 11" />}
            </svg>
            <span>{muted ? "Включить звук" : "Выключить звук"}</span>
          </button>
          <button type="button" className="sv-close sv-close-media" aria-label="Закрыть" onClick={close}>
            <span aria-hidden="true" />
          </button>
        </div>

        <div className="sv-panel">
          <header className="sv-author">
            <span className="sv-avatar">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon.svg" alt="" aria-hidden="true" />
            </span>
            <span className="sv-author-text">
              <strong>ВАС СТРОЙ</strong>
              <span>Видеообращение</span>
            </span>
            <button type="button" className="sv-close" aria-label="Закрыть" onClick={close}>
              <span aria-hidden="true" />
            </button>
          </header>

          <div className="sv-body">
            <div className="sv-story-text">
              <h3 id={titleId}>Приветствуем вас в компании ВАС СТРОЙ</h3>
              <p>Мы строим коммерческие и государственные объекты и берём ответственность за сроки, качество и бюджет. Расскажите о своей задаче, и мы подготовим расчёт.</p>
            </div>
            <div className="sv-apply">
              {sent ? (
                <div className="sv-sent" role="status">
                  <h4>Заявка принята</h4>
                  <p>Менеджер свяжется с вами в течение рабочего дня и уточнит детали.</p>
                </div>
              ) : (
                <>
                  <h4>Давайте обсудим ваш проект</h4>
                  <p className="sv-apply-text">Оставьте заявку: инженер изучит задачу, подготовит смету и календарный график и свяжется с вами в течение рабочего дня.</p>
                  <StoryForm context={context} onSuccess={() => setSent(true)} />
                </>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn-primary sv-cta-m"
          onClick={() => openBooking({ title: "Оставить заявку", meta: "Видеообращение", submitLabel: "Оставить заявку", source: "circle-video" })}
        >
          Оставить заявку
        </button>
      </div>
    </div>,
    document.body,
  );
}
