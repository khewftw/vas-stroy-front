import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Публичная оферта — ВАС СТРОЙ",
  description: "Страница публичной оферты ВАС СТРОЙ. Условия договора ожидают утверждения.",
};

export default function OfferPage() {
  return (
    <main className="legal-page">
      <div className="shell legal-header">
        <Link className="masthead-logo" href="/">
          <img className="masthead-logo-mark" src="/vectors/vas-stroy.svg" alt="ВАС СТРОЙ" />
        </Link>
        <Link className="legal-back" href="/">Вернуться на главную ↗</Link>
      </div>
      <article className="shell legal-content">
        <h1 className="legal-title-long">
          Публичная
          <br />
          оферта
        </h1>
        <div className="legal-copy">
          <p>
            Здесь будет размещён текст публичной оферты ВАС СТРОЙ. Условия договора, стоимость и ответственность на этой странице намеренно не заполнены: их нужно утвердить до публикации.
          </p>
          <p className="legal-todo">TODO — утвердить у юриста</p>
          <p>TODO: предмет оферты и что считается акцептом заявки с сайта.</p>
          <p>TODO: порядок расчёта стоимости. Суммы здесь не указаны.</p>
          <p>TODO: сроки выполнения работ и порядок согласования замера.</p>
          <p>TODO: ответственность сторон и порядок претензий.</p>
          <p>TODO: реквизиты исполнителя для договора.</p>
          <p>
            Обработка данных, которые человек передаёт через формы, описывается в{" "}
            <Link href="/consent">согласии</Link> и в{" "}
            <Link href="/privacy">политике конфиденциальности</Link>.
          </p>
        </div>
      </article>
    </main>
  );
}