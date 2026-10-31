import Image from "next/image";
import Link from "next/link";
import { CASES, hasPage } from "../data/cases";
import BookButton from "./BookButton";
import CasesGrid from "./CasesGrid";

export default function Cases() {
  return (
    <section className="cases" id="cases" aria-labelledby="cases-title">
      <div className="shell">
        <div className="section-head" data-reveal data-reveal-stagger>
          <div>
            <h2 id="cases-title">Объекты</h2>
          </div>
          <p className="section-lead">
            Коммерческие, промышленные и государственные объекты: площадь, состав работ и сроки по каждому проекту.
          </p>
        </div>

        <CasesGrid className="cases-grid" data-reveal="wave" data-reveal-stagger>
          {CASES.map((item) => {
            const linked = hasPage(item);
            const content = (
              <>
                <Image src={item.image} alt={item.title} fill sizes="(max-width: 900px) 100vw, 60vw" />
                <span className="case-shade" aria-hidden="true" />
                <span className="case-hint" aria-hidden="true">Подробнее</span>
                <span className="case-body">
                  <span className="case-title">{item.title}</span>
                  <span className="case-meta">
                    {[item.kind, item.area ? `${item.area.toLocaleString("ru-RU")} м²` : null, item.term].filter(Boolean).join(" · ")}
                  </span>
                  {linked ? <span className="case-more">Подробнее об объекте →</span> : null}
                </span>
              </>
            );
            return linked ? (
              <Link key={item.slug} href={`/cases/${item.slug}`} className="case-card">
                {content}
              </Link>
            ) : (
              <div key={item.slug} className="case-card is-static">
                {content}
              </div>
            );
          })}
        </CasesGrid>

        <div className="cases-offer" data-reveal>
          <div className="cases-offer-copy">
            <h3>Есть объект? Подготовим коммерческое предложение</h3>
            <p className="cases-offer-text">Расчёт стоимости, график работ и состав договора. Ответим в течение рабочего дня.</p>
          </div>
          <BookButton className="cases-offer-button" offer="quote">
            <span>Получить коммерческое предложение</span>
          </BookButton>
        </div>
      </div>
    </section>
  );
}
