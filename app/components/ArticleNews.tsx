"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Lineicons } from "@lineiconshq/react-lineicons";
import { ArrowAngularTopRightOutlined } from "@lineiconshq/free-icons";
import { NEWS } from "../data/news";

const PAGE = 3;

// latest news under the story: three at a time, a quiet text button loads more
export default function ArticleNews() {
  const [count, setCount] = useState(PAGE);
  const items = NEWS.slice(0, count);

  return (
    <section className="a-news" aria-labelledby="a-news-title">
      <div className="a-wrap">
        <h2 id="a-news-title">Последние новости</h2>
        <div className="news-grid">
          {items.map((item) => (
            <Link key={item.datetime} className="news-item news-card is-in" href={`/news/${item.slug}`}>
              <figure className="news-shot">
                <Image src={item.src} alt={item.alt} fill sizes="(max-width: 900px) 100vw, 380px" />
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
            </Link>
          ))}
        </div>
        {count < NEWS.length ? (
          <button type="button" className="a-loadmore" onClick={() => setCount((value) => Math.min(NEWS.length, value + PAGE))}>
            Загрузить ещё
          </button>
        ) : null}
      </div>
    </section>
  );
}
