"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Lineicons } from "@lineiconshq/react-lineicons";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@lineiconshq/free-icons";
import type { Story } from "../data/stories";
import { openBooking } from "../lib/booking";
import StoryForm from "./StoryForm";

const CLOSE_MS = 320;

// Instagram-style viewer: the story on the left, author / description / lead form on the right
export default function StoryViewer({
  stories,
  index,
  origin,
  onNavigate,
  onClose,
}: {
  stories: readonly Story[];
  index: number;
  origin: DOMRect | null;
  onNavigate: (index: number) => void;
  onClose: () => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  const [sent, setSent] = useState(false);
  const story = stories[index];

  // grow out of the card that was clicked
  useLayoutEffect(() => {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    if (dialog && origin) {
      const box = dialog.getBoundingClientRect();
      const dx = origin.left + origin.width / 2 - (box.left + box.width / 2);
      const dy = origin.top + origin.height / 2 - (box.top + box.height / 2);
      dialog.style.setProperty("--sv-x", `${dx}px`);
      dialog.style.setProperty("--sv-y", `${dy}px`);
      dialog.style.setProperty("--sv-s", String(Math.min(1, origin.width / box.width)));
    }
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    document.body.classList.add("sv-open");
    return () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove("sv-open");
    };
  }, [origin]);

  const close = useCallback(() => {
    setShown(false);
    window.setTimeout(() => {
      onClose();
      returnFocus.current?.focus?.();
    }, CLOSE_MS);
  }, [onClose]);

  const go = useCallback(
    (dir: 1 | -1) => {
      const next = index + dir;
      if (next < 0 || next >= stories.length) return;
      setSent(false);
      onNavigate(next);
    },
    [index, stories.length, onNavigate],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    const onKey = (event: KeyboardEvent) => {
      if (document.querySelector(".lm")) return;
      const target = event.target as HTMLElement | null;
      const typing = target?.matches("input, textarea");
      if (event.key === "Escape") close();
      if (!typing && event.key === "ArrowRight") go(1);
      if (!typing && event.key === "ArrowLeft") go(-1);
      if (event.key !== "Tab" || !dialog) return;
      const focusable = [...dialog.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled])")];
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
  }, [close, go]);

  const context = ["Заявка с сайта (история)", `История: ${story.title}`, `Страница: ${window.location.pathname}`].join("\n");

  return createPortal(
    <div className={`sv${shown ? " is-shown" : ""}`} role="presentation" onClick={close} data-lenis-prevent>
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
          <Image key={story.id} className="sv-photo" src={story.src} alt="" fill sizes="(max-width: 800px) 100vw, 430px" priority />
          <span className="sv-shade" aria-hidden="true" />
          <button
            type="button"
            className="sv-arrow sv-prev"
            aria-label="Предыдущая история"
            disabled={index === 0}
            onClick={(event) => { event.stopPropagation(); go(-1); }}
          >
            <Lineicons icon={ArrowLeftOutlined} size={18} strokeWidth={1.6} />
          </button>
          <button
            type="button"
            className="sv-arrow sv-next"
            aria-label="Следующая история"
            disabled={index === stories.length - 1}
            onClick={(event) => { event.stopPropagation(); go(1); }}
          >
            <Lineicons icon={ArrowRightOutlined} size={18} strokeWidth={1.6} />
          </button>
          <button type="button" className="sv-close sv-close-media" aria-label="Закрыть" onClick={close}>
            <span aria-hidden="true" />
          </button>
          <ol className="sv-progress" aria-hidden="true">
            {stories.map((item, i) => (
              <li key={item.id} className={i <= index ? "is-done" : ""} />
            ))}
          </ol>
          <div key={`cap-${story.id}`} className="sv-caption">
            <p className="sv-caption-title">{story.title}</p>
            <p className="sv-caption-text">{story.text}</p>
          </div>
        </div>

        <div className="sv-panel">
          <header className="sv-author">
            <span className="sv-avatar">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon.svg" alt="" aria-hidden="true" />
            </span>
            <span className="sv-author-text">
              <strong>ВАС СТРОЙ</strong>
              <span>{story.tag} · {index + 1} из {stories.length}</span>
            </span>
            <button type="button" className="sv-close" aria-label="Закрыть" onClick={close}>
              <span aria-hidden="true" />
            </button>
          </header>

          <div className="sv-body">
            <div key={story.id} className="sv-story-text">
              {story.facts.length ? (
                <ul className="sv-facts">
                  {story.facts.map((fact) => (
                    <li key={fact}>{fact}</li>
                  ))}
                </ul>
              ) : null}
              <h3 id={titleId}>{story.title}</h3>
              <p>{story.text}</p>
            </div>

            <div className="sv-apply">
              {sent ? (
                <div className="sv-sent" role="status">
                  <h4>Заявка принята</h4>
                  <p>Менеджер свяжется с вами в течение рабочего дня и уточнит детали.</p>
                </div>
              ) : (
                <>
                  <h4>Обсудим ваш проект?</h4>
                  <p className="sv-apply-text">
                    Оставьте заявку: инженер изучит задачу, подготовит смету и календарный график и свяжется с вами в течение рабочего дня. Работаем по договору с гарантией и фиксируем цену и сроки.
                  </p>
                  <StoryForm key={story.id} context={context} onSuccess={() => setSent(true)} />
                </>
              )}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="btn-primary sv-cta-m"
          onClick={() =>
            openBooking({
              title: "Оставить заявку",
              meta: `История: ${story.title}`,
              submitLabel: "Оставить заявку",
              source: `story: ${story.title}`,
            })
          }
        >
          Оставить заявку
        </button>
      </div>
    </div>,
    document.body,
  );
}
