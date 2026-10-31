"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { BOOKING_EVENT, OFFERS, type BookingPayload } from "../lib/booking";
import LeadForm, { CONTACT_METHODS, type ContactMethodId } from "./LeadForm";

const RESPONSE_TIME = "рабочего дня";

type Offer = BookingPayload & { title: string };

const FALLBACK: Offer = { ...OFFERS.call, perks: [...OFFERS.call.perks] };

export default function BookingModal() {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [offer, setOffer] = useState<Offer>(FALLBACK);

  const close = useCallback(() => {
    setOpen(false);
    returnFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<BookingPayload>).detail ?? {};
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setOffer({
        ...FALLBACK,
        ...detail,
        title: detail.title ?? FALLBACK.title,
      });
      setDone(false);
      setOpen(true);
    };
    window.addEventListener(BOOKING_EVENT, onOpen);
    return () => window.removeEventListener(BOOKING_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
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
    document.body.classList.add("booking-open");
    window.addEventListener("keydown", onKey);
    const timer = window.setTimeout(() => dialog?.querySelector<HTMLInputElement>("input[name='phone']")?.focus({ preventScroll: true }), 350);
    return () => {
      window.clearTimeout(timer);
      document.body.classList.remove("booking-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  if (!open) return null;

  const summary = (method: ContactMethodId) =>
    [
      "Заявка с сайта (всплывающее окно)",
      `Оффер: ${offer.title}`,
      offer.meta ? `Детали: ${offer.meta}` : "",
      `Способ связи: ${CONTACT_METHODS.find((item) => item.id === method)?.label ?? "—"}`,
      `Источник: ${offer.source ?? "кнопка на сайте"}`,
      `Страница: ${window.location.pathname}`,
    ]
      .filter(Boolean)
      .join("\n");

  return (
    <div className="lm" role="presentation" onClick={close} data-lenis-prevent>
      <div
        ref={dialogRef}
        className="lm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="lm-close" type="button" aria-label="Закрыть" onClick={close}>
          <span aria-hidden="true" />
        </button>

        {done ? (
          <div className="lm-done" role="status">
            <h2 id={titleId}>Заявка принята</h2>
            <p>Менеджер свяжется с вами в течение {RESPONSE_TIME}, уточнит детали по объекту и подготовит коммерческое предложение.</p>
            <button className="btn-primary lf-submit" type="button" onClick={close}>Закрыть</button>
          </div>
        ) : (
          <>
            <h2 id={titleId}>{offer.title}</h2>
            {offer.meta ? <p className="lm-meta">{offer.meta}</p> : null}
            <LeadForm
              summary={summary}
              submitLabel={offer.submitLabel ?? "Оставить заявку"}
              note={offer.note ?? `Ответим в течение ${RESPONSE_TIME}. Информация об объекте остаётся конфиденциальной.`}
              onSuccess={() => setDone(true)}
            />
          </>
        )}
      </div>
    </div>
  );
}
