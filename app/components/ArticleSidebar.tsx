import Link from "next/link";
import { Lineicons } from "@lineiconshq/react-lineicons";
import { ArrowAngularTopRightOutlined } from "@lineiconshq/free-icons";
import { NEWS } from "../data/news";
import BookButton from "./BookButton";

// right column: a call to action and the latest news
export default function ArticleSidebar({ title }: { title: string }) {
  return (
    <aside className="a-aside" aria-label="Дополнительно">
      <div className="a-aside-cta">
        <span className="a-aside-deco" aria-hidden="true">
          <Lineicons icon={ArrowAngularTopRightOutlined} size={28} strokeWidth={1.5} />
        </span>
        <p className="a-aside-kicker">Нужен такой же объект?</p>
        <h2>Рассчитаем стоимость и сроки под вашу задачу с инженерной точностью</h2>
        <ul className="a-aside-points">
          <li>Выезд инженера на объект</li>
          <li>Смета и календарный график</li>
          <li>Цена и сроки в договоре</li>
        </ul>
        <BookButton
          className="btn-primary a-aside-btn"
          offer={{ title: "Получить коммерческое предложение", meta: `Статья: ${title}`, submitLabel: "Получить предложение", source: `article-aside: ${title}` }}
        >
          Получить предложение
        </BookButton>
        <a className="a-aside-phone" href="tel:+78432177777">+7 (843) 217-77-77</a>
      </div>

      <div className="a-aside-news">
        <div className="a-aside-head">
          <h2>Последние новости</h2>
          <Link href="/#news">Все</Link>
        </div>
        <ul>
          {NEWS.slice(0, 5).map((item) => (
            <li key={item.datetime}>
              <Link href={`/news/${item.slug}`}>
                <span className="a-aside-meta">
                  <span>{item.tag}</span>
                  <time dateTime={item.datetime}>{item.date}</time>
                </span>
                <span className="a-aside-title">{item.title.join(" ")}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
