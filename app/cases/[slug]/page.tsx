import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookButton from "../../components/BookButton";
import { CASES, caseBySlug, hasPage } from "../../data/cases";

export function generateStaticParams() {
  return CASES.filter(hasPage).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = caseBySlug(slug);
  if (!item) return {};
  return {
    title: `${item.title} — объект ВАС СТРОЙ`,
    description: `${[item.kind, item.area ? `${item.area} м²` : null, item.term, item.scope].filter(Boolean).join(", ")}.`,
  };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = caseBySlug(slug);
  if (!item) notFound();

  return (
    <main className="case-page">
      <div className="shell case-page-header">
        <Link className="masthead-logo" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="masthead-logo-mark" src="/vectors/vas-stroy.svg" alt="ВАС СТРОЙ" />
        </Link>
        <Link className="case-page-back" href="/#cases">← Все объекты</Link>
      </div>

      <div className="shell">
        <h1 className="case-page-title">{item.title}</h1>
        <dl className="case-page-facts">
          <div><dt>Тип объекта</dt><dd>{item.kind}</dd></div>
          <div><dt>Заказчик</dt><dd>{item.customer}</dd></div>
          {item.area ? <div><dt>Площадь</dt><dd>{item.area.toLocaleString("ru-RU")} м²</dd></div> : null}
          <div><dt>Состав работ</dt><dd>{item.scope}</dd></div>
          {item.term ? <div><dt>Срок</dt><dd>{item.term}</dd></div> : null}
        </dl>
        <div className="case-page-photo">
          <Image src={item.image} alt={item.title} fill sizes="100vw" priority />
        </div>
        <div className="case-page-gallery">
          {item.gallery.map((src, index) => (
            <div key={src} className="case-page-shot">
              <Image src={src} alt={`${item.title} — фото ${index + 1}`} fill sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
          ))}
        </div>
        <div className="case-page-copy">
          {/* TODO: add the project description, work scope and price */}
          <p>Подробное описание объекта, состав работ и результаты появятся здесь.</p>
          <BookButton className="cases-cta" offer={{ title: `Предложение по объекту, как «${item.title}»`, image: item.image, badge: "КП", submitLabel: "Получить предложение", source: `case:${item.slug}`, perks: ["Расчёт стоимости и график работ", "Опыт на объектах такого типа", "Ответ в течение рабочего дня"] }}>Получить коммерческое предложение</BookButton>
        </div>
      </div>
    </main>
  );
}
