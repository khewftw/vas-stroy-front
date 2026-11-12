"use client";

type Props = React.HTMLAttributes<HTMLDivElement> & { "data-reveal"?: boolean; "data-reveal-stagger"?: boolean };

const cardOf = (target: EventTarget | null) => (target instanceof Element ? target.closest<HTMLElement>(".bento-stat") : null);

// the accent fill grows out of the point where the pointer enters a card and shrinks back to the point where it leaves
function setPoint(card: HTMLElement, event: React.PointerEvent) {
  const box = card.getBoundingClientRect();
  const x = Math.min(box.width, Math.max(0, event.clientX - box.left));
  const y = Math.min(box.height, Math.max(0, event.clientY - box.top));
  card.style.setProperty("--fx", `${x}px`);
  card.style.setProperty("--fy", `${y}px`);
}

export default function BentoGrid({ children, ...rest }: Props) {
  const onOver = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const card = cardOf(event.target);
    if (!card || card === cardOf(event.relatedTarget)) return;
    setPoint(card, event);
    card.classList.add("is-filled");
  };

  const onOut = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const card = cardOf(event.target);
    if (!card || card === cardOf(event.relatedTarget)) return;
    setPoint(card, event);
    card.classList.remove("is-filled");
  };

  return (
    <div {...rest} onPointerOver={onOver} onPointerOut={onOut}>
      {children}
    </div>
  );
}
