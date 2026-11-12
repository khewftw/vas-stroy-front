"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Lineicons } from "@lineiconshq/react-lineicons";
import { ArrowAngularTopRightOutlined } from "@lineiconshq/free-icons";
import { NEWS as ITEMS } from "../data/news";
import CasesGrid from "./CasesGrid";

export default function News() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const items = [...grid.querySelectorAll<HTMLElement>(".news-item")];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const show = () => {
      const cols = window.matchMedia("(max-width: 900px)").matches ? 1 : 3;
      items.forEach((item, index) => {
        const step = reduce ? 0 : (cols === 1 ? index : index % cols);
        item.style.transitionDelay = `${step * 120}ms`;
        item.classList.add("is-in");
      });
      // the stagger delay must not linger on hover transitions
      window.setTimeout(() => items.forEach((item) => { item.style.transitionDelay = ""; }), 1200);
    };

    if (reduce) {
      show();
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      show();
      observer.disconnect();
    }, { threshold: 0.15 });
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="news" id="news" aria-labelledby="news-title">
      <div className="shell">
        <div className="section-head" data-reveal data-reveal-stagger>
          <h2 id="news-title">Новости</h2>
          <p className="section-lead">
            События компании, сданные объекты и заметки о строительстве для заказчиков.
          </p>
        </div>
        <CasesGrid>
          <div className="news-grid" ref={gridRef}>
            {ITEMS.map((item) => (
              <Link key={item.datetime} className="news-item news-card" href={`/news/${item.slug}`}>
                <figure className="news-shot">
                  <Image src={item.src} alt={item.alt} fill sizes="(max-width: 900px) 100vw, 33vw" />
                  <span className="news-go" aria-hidden="true">
                    <Lineicons icon={ArrowAngularTopRightOutlined} size={22} strokeWidth={1.6} />
                  </span>
                </figure>
                <div className="news-body">
                  <div className="news-meta">
                    <span className="news-tag">{item.tag}</span>
                    <time dateTime={item.datetime}>{item.date}</time>
                  </div>
                  <h3 className="news-item-title">{item.title.join(" ")}</h3>
                  <p className="news-item-text">{item.text}</p>
                </div>
                <span className="case-hint" aria-hidden="true">Подробнее</span>
              </Link>
            ))}
          </div>
        </CasesGrid>
      </div>
    </section>
  );
}
