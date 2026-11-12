"use client";

import Link from "next/link";
import { FormEvent, useId, useRef, useState } from "react";
import { API_URL, formatPhone } from "./ContactForm";

// compact lead form pinned under the story text: name, phone, request, send
export default function StoryForm({ context, onSuccess }: { context: string; onSuccess: () => void }) {
  const baseId = useId();
  const consentRef = useRef<HTMLInputElement>(null);
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const request = String(data.get("request") ?? "").trim();
    setConsentError(!consent);

    if (phone.replace(/\D/g, "").length !== 11) {
      setStatus("error");
      setMessage("Проверьте номер телефона: нужно указать 10 цифр после +7.");
      return;
    }
    if (!consent) {
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
          comment: [context, request ? `Запрос: ${request}` : ""].filter(Boolean).join("\n"),
          consentPersonal: true,
          consentOffer: true,
        }),
      });
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      if (!response.ok) throw new Error(body?.message || "Не удалось отправить обращение.");
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
    <form className="sf" onSubmit={handleSubmit} noValidate>
      <label className="sf-field">
        <span>Имя</span>
        <input name="name" type="text" autoComplete="name" placeholder="Как к вам обращаться" />
      </label>
      <label className="sf-field">
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
      <label className="sf-field">
        <span>Комментарий</span>
        <textarea name="request" rows={1} placeholder="Опишите объект или задачу" />
      </label>
      <button className="btn-primary lf-submit" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Отправляем" : "Отправить заявку"}
      </button>
      <label className={`lf-consent sf-consent${consentError && !consent ? " is-invalid" : ""}`}>
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
      {consentError && !consent ? (
        <p id={`${baseId}-consent`} className="lf-error" role="alert">Отметьте согласие, чтобы отправить заявку.</p>
      ) : null}
      <p className={`lf-error${status === "error" && message ? "" : " is-empty"}`} aria-live="polite">{message}</p>
    </form>
  );
}
