"use client";

import { openBooking, type BookingPayload, type OfferId } from "../lib/booking";

export default function BookButton({
  className,
  children,
  offer = "call",
}: {
  className: string;
  children: React.ReactNode;
  offer?: OfferId | BookingPayload;
}) {
  return (
    <button type="button" className={className} onClick={() => openBooking(offer)}>
      {children}
    </button>
  );
}
