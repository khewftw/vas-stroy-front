"use client";

import Link from "next/link";
import { FormEvent, useId, useRef, useState } from "react";
import { API_URL, formatPhone } from "./ContactForm";

export type ContactMethodId = "telegram" | "max" | "call";

export const CONTACT_METHODS = [
  { id: "telegram", label: "Telegram" },
  { id: "max", label: "MAX" },
  { id: "call", label: "Звонок" },
] as const;

export default function LeadForm({
  summary,
  onSuccess,
  submitLabel = "Получить расчёт",
  note,
}: {
  summary: (method: ContactMethodId) => string;
  onSuccess: () => void;
  submitLabel?: string;
  note?: string;
}) {
  const baseId = useId();
  const consentRef = useRef<HTMLInputElement>(null);
  const [method, setMethod] = useState<ContactMethodId>("call");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("name") ?? "").trim();
    const consentMissing = !consent;
    setConsentError(consentMissing);

    if (phone.replace(/\D/g, "").length !== 11) {
      setStatus("error");
      setMessage("Проверьте номер телефона — нужно указать 10 цифр после +7.");
      return;
    }
    if (consentMissing) {
      setStatus("error");
      setMessage("");
      consentRef.current?.focus();
      return;
    }

    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || null,
          phone,
          comment: summary(method),
          consentPersonal: true,
          consentOffer: true,
        }),
      });
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      if (!response.ok) throw new Error(data?.message || "Не удалось отправить обращение.");
      try {
        sessionStorage.setItem("vasstroy-lead", "1");
      } catch {}
      onSuccess();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Связь временно недоступна. Попробуйте ещё раз.");
    }
  }

  return (
    <form className="lf" onSubmit={handleSubmit} noValidate>
      <fieldset className="lf-methods">
        <legend>Как с вами связаться?</legend>
        <div className="lf-methods-row">
          {CONTACT_METHODS.map((item) => (
            <label key={item.id} className={`lf-method${method === item.id ? " is-selected" : ""}`}>
              <input type="radio" name="contact-method" value={item.id} checked={method === item.id} onChange={() => setMethod(item.id)} />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="lf-fields">
        <label className="lf-field">
          <span>Имя</span>
          <input name="name" type="text" autoComplete="name" placeholder="Иван" />
        </label>
        <label className="lf-field">
          <span>Телефон *</span>
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7 (922) 000-00-00"
            value={phone}
            onChange={(event) => setPhone(event.target.value.trim() === "" ? "" : formatPhone(event.target.value))}
            required
          />
        </label>
      </div>

      <label className={`lf-consent${consentError && !consent ? " is-invalid" : ""}`}>
        <input
          ref={consentRef}
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          aria-invalid={consentError && !consent}
          aria-describedby={consentError ? `${baseId}-consent` : undefined}
        />
        <span>
          Я даю <Link href="/consent">согласие на обработку персональных данных</Link> и принимаю условия{" "}
          <Link href="/offer">публичной оферты</Link>
        </span>
      </label>
      {consentError ? (
        <p id={`${baseId}-consent`} className="lf-error" role="alert">
          Отметьте согласие, чтобы отправить заявку.
        </p>
      ) : null}

      <button className="btn-primary lf-submit" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Отправляем" : submitLabel}
      </button>
      {note ? <p className="lf-note">{note}</p> : null}
      <p className={`lf-error${status === "error" && message ? "" : " is-empty"}`} aria-live="polite">{message}</p>
    </form>
  );
}
