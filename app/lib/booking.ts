export const BOOKING_EVENT = "vasstroy-booking-open";

export type BookingPayload = {
  title?: string;
  meta?: string;
  image?: string;
  submitLabel?: string;
  badge?: string;
  perks?: readonly string[];
  note?: string;
  /** Where the click came from — sent to the manager with the request */
  source?: string;
};

export const OFFERS = {
  call: {
    title: "Консультация по вашему объекту",
    image: "/new/images/hero.jpg",
    badge: "B2B",
    submitLabel: "Заказать звонок",
    perks: [
      "Свяжемся в течение рабочего дня",
      "Обсудим задачу, сроки и формат договора",
      "Подскажем по госзакупкам 44-ФЗ и 223-ФЗ",
    ],
  },
  quote: {
    title: "Коммерческое предложение по вашему объекту",
    image: "/new/images/cases/case-2/02-modern_apartment_living_room_int.jpg",
    badge: "КП",
    submitLabel: "Получить предложение",
    perks: [
      "Расчёт стоимости и график работ",
      "Состав работ и ответственность по этапам",
      "Фиксируем цену и сроки в договоре",
    ],
  },
  survey: {
    title: "Выезд на объект и оценка объёмов",
    image: "/new/images/quiz/2.jpg",
    badge: "0 ₽",
    submitLabel: "Заказать выезд",
    perks: [
      "Инженер приедет на площадку",
      "Оценим объёмы и риски",
      "Подготовим смету и календарный график",
    ],
  },
} as const satisfies Record<string, BookingPayload>;

export type OfferId = keyof typeof OFFERS;

export function openBooking(payload: BookingPayload | OfferId = "call") {
  const detail = typeof payload === "string" ? { ...OFFERS[payload], source: payload } : payload;
  window.dispatchEvent(new CustomEvent<BookingPayload>(BOOKING_EVENT, { detail }));
}
