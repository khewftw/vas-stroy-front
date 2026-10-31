"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

// TODO: replace placeholder news with real company publications
const ITEMS = [
  { date: "24 октября", datetime: "2026-10-24", title: ["Сдан бизнес-центр", "класса А"], text: "Завершили генподряд на объекте площадью 18 500 м² и передали заказчику исполнительную документацию.", src: "/new/images/cases/case-2/02-modern_apartment_living_room_int.jpg", alt: "Холл бизнес-центра после отделки" },
  { date: "10 октября", datetime: "2026-10-10", title: ["Заключили контракт", "по 44-ФЗ"], text: "Выиграли конкурс на строительство социального объекта и приступили к подготовительным работам.", src: "/new/images/cases/case-1/06-modern_hallway_with_orange_walls.jpg", alt: "Коридор общественного здания" },
  { date: "26 сентября", datetime: "2026-09-26", title: ["Расширили парк", "строительной техники"], text: "Пополнили собственный парк техники, чтобы сокращать сроки монолитных и земляных работ.", src: "/new/images/quiz/4.jpg", alt: "Строительная площадка" },
  { date: "12 сентября", datetime: "2026-09-12", title: ["Как читать смету", "на коммерческий объект"], text: "Разбираем структуру сметы: работы, материалы, резерв и что влияет на итоговую стоимость.", src: "/new/images/quiz/2.jpg", alt: "Документация проекта" },
  { date: "29 августа", datetime: "2026-08-29", title: ["Фасады:", "вентилируемая система или мокрый"], text: "Сравниваем решения для коммерческих зданий по стоимости, срокам и эксплуатации.", src: "/new/images/hero.jpg", alt: "Фасад здания" },
  { date: "15 августа", datetime: "2026-08-15", title: ["Что нужно знать", "о гарантии на объект"], text: "Как устроена гарантийная ответственность подрядчика и что фиксировать в договоре.", src: "/new/images/cases/case-2/07-modern_minimalist_bathroom_interior.jpg", alt: "Сданный объект" },
] as const;

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
        <div className="news-grid" ref={gridRef}>
          {ITEMS.map((item) => (
            <article key={item.datetime} className="news-item">
              <time dateTime={item.datetime}>{item.date}</time>
              <h3 className="news-item-title">
                {item.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <p className="news-item-text">{item.text}</p>
              <a className="news-item-link" href="#news">Читать подробнее →</a>
              <figure className="news-shot">
                <Image src={item.src} alt={item.alt} fill sizes="(max-width: 900px) 100vw, 33vw" />
              </figure>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
