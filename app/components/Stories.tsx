"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Lineicons } from "@lineiconshq/react-lineicons";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@lineiconshq/free-icons";
import { STORIES } from "../data/stories";
import StoryViewer from "./StoryViewer";

const DRAG_THRESHOLD = 5;
// phones show the stories as a two-column grid, four at a time
const PAGE = 4;
// iOS-like deceleration: speed keeps FRICTION^ms of itself every millisecond
const FRICTION = 0.998;
const MIN_SPEED = 0.015;

export default function Stories() {
  const trackRef = useRef<HTMLUListElement>(null);
  const drag = useRef({ active: false, moved: false, startX: 0, startLeft: 0, justDragged: false });
  const samples = useRef<{ t: number; x: number }[]>([]);
  const glide = useRef(0);
  const [edge, setEdge] = useState({ start: true, end: false });
  const [visible, setVisible] = useState(PAGE);
  const [open, setOpen] = useState<{ index: number; origin: DOMRect | null } | null>(null);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  const move = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("li");
    const step = (card?.offsetWidth ?? 280) + 16;
    el.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  };

  // click-and-drag with the mouse, with iOS-style momentum on release (touch already scrolls natively)
  const stopGlide = () => {
    cancelAnimationFrame(glide.current);
    glide.current = 0;
  };

  useEffect(() => stopGlide, []);

  const onPointerDown = (event: React.PointerEvent<HTMLUListElement>) => {
    const el = trackRef.current;
    if (!el || event.pointerType !== "mouse" || event.button !== 0) return;
    stopGlide();
    samples.current = [{ t: performance.now(), x: event.clientX }];
    drag.current = { active: true, moved: false, startX: event.clientX, startLeft: el.scrollLeft, justDragged: false };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLUListElement>) => {
    const el = trackRef.current;
    const d = drag.current;
    if (!el || !d.active) return;
    const dx = event.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > DRAG_THRESHOLD) {
      d.moved = true;
      el.classList.add("is-dragging");
      el.setPointerCapture(event.pointerId);
    }
    if (!d.moved) return;
    el.scrollLeft = d.startLeft - dx;
    const now = performance.now();
    samples.current.push({ t: now, x: event.clientX });
    samples.current = samples.current.filter((sample) => now - sample.t < 100);
  };

  const endDrag = () => {
    const el = trackRef.current;
    const d = drag.current;
    if (!el || !d.active) return;
    d.active = false;
    if (!d.moved) return;
    d.justDragged = true;
    window.setTimeout(() => { d.justDragged = false; }, 0);

    // release velocity from the last ~100 ms of movement (0 if the pointer rested before letting go)
    const now = performance.now();
    const recent = samples.current.filter((sample) => now - sample.t < 100);
    let velocity = 0;
    if (recent.length > 1 && now - recent[recent.length - 1].t < 80) {
      const first = recent[0];
      const last = recent[recent.length - 1];
      velocity = (first.x - last.x) / Math.max(1, last.t - first.t); // px of scrollLeft per ms
    }

    const max = el.scrollWidth - el.clientWidth;
    let last = performance.now();
    const step = (time: number) => {
      const dt = Math.min(48, time - last);
      last = time;
      el.scrollLeft = Math.max(0, Math.min(max, el.scrollLeft + velocity * dt));
      velocity *= Math.pow(FRICTION, dt);
      const atEdge = el.scrollLeft <= 0 || el.scrollLeft >= max;
      if (Math.abs(velocity) < MIN_SPEED || atEdge) {
        glide.current = 0;
        el.classList.remove("is-dragging");
        return;
      }
      glide.current = requestAnimationFrame(step);
    };
    glide.current = requestAnimationFrame(step);
  };

  const openStory = (index: number, card: HTMLElement) => {
    if (drag.current.justDragged) return;
    setOpen({ index, origin: card.getBoundingClientRect() });
  };

  return (
    <section className="stories" id="stories" aria-labelledby="stories-title">
      <div className="shell stories-head">
        <h2 id="stories-title">Истории</h2>
        <div className="stories-nav">
          <button type="button" aria-label="Назад" disabled={edge.start} onClick={() => move(-1)}>
            <Lineicons icon={ArrowLeftOutlined} size={22} strokeWidth={1.6} />
          </button>
          <button type="button" aria-label="Вперёд" disabled={edge.end} onClick={() => move(1)}>
            <Lineicons icon={ArrowRightOutlined} size={22} strokeWidth={1.6} />
          </button>
        </div>
      </div>
      <ul
        className="stories-track"
        ref={trackRef}
        onScroll={sync}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        aria-label="Истории компании"
      >
        {STORIES.map((story, index) => (
          <li key={story.id} className={`story${index >= visible ? " is-extra" : ""}`}>
            <Image src={story.src} alt="" fill sizes="(max-width: 700px) 46vw, 300px" draggable={false} />
            <span className="story-shade" aria-hidden="true" />
            <span className="story-badge">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon.svg" alt="" aria-hidden="true" draggable={false} />
            </span>
            <span className="story-tag">{story.tag}</span>
            <p className="story-title">{story.title}</p>
            <button
              type="button"
              className="story-hit"
              aria-label={`Открыть историю: ${story.title}`}
              onClick={(event) => openStory(index, event.currentTarget.parentElement as HTMLElement)}
            />
          </li>
        ))}
      </ul>
      {visible < STORIES.length ? (
        <button type="button" className="stories-more" onClick={() => setVisible((count) => Math.min(STORIES.length, count + PAGE))}>
          Загрузить ещё
        </button>
      ) : null}
      {open ? (
        <StoryViewer
          stories={STORIES}
          index={open.index}
          origin={open.origin}
          onNavigate={(index) => setOpen((current) => (current ? { ...current, index } : current))}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </section>
  );
}
