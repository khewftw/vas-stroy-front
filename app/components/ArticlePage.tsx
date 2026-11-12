import Image from "next/image";
import Link from "next/link";
import ArticleBlocks from "./ArticleBlocks";
import ArticleNews from "./ArticleNews";
import ArticleSidebar from "./ArticleSidebar";
import { ReadingProgress, ShareButton } from "./ArticleWidgets";
import FooterReveal from "./FooterReveal";
import SiteFooter from "./SiteFooter";
import { ARTICLES, readingMinutes, type Article } from "../data/articles";
import { NEWS_ARTICLES } from "../data/newsArticles";

// the opening paragraph of a story, shown as its short description in the lists of other stories
const summary = (article: Article) => {
  const block = article.blocks.find((item) => item.type === "intro" || item.type === "p");
  return block && "text" in block ? block.text : article.subtitle;
};

// one layout for both kinds of story: an object (case) and a news item
export default function ArticlePage({ article, kind }: { article: Article; kind: "case" | "news" }) {
  const isCase = kind === "case";
  const base = isCase ? "/cases" : "/news";
  const pool = isCase ? ARTICLES : NEWS_ARTICLES;
  const more = pool.filter((item) => item.slug !== article.slug).slice(0, 3);

  return (
    <>
      <main id="main" className="article-page">
        <ReadingProgress targetId="article-body" />

        <header className="a-hero">
          <Image className="a-hero-img" src={article.cover} alt="" fill sizes="100vw" priority />
          <span className="a-hero-shade" aria-hidden="true" />
          <div className="a-wrap a-hero-inner">
            <nav className="a-crumbs" aria-label="Хлебные крошки">
              <Link href={isCase ? "/#cases" : "/#news"}>{isCase ? "Объекты" : "Новости"}</Link>
              <span aria-hidden="true">/</span>
              <span>{article.tag}</span>
            </nav>
            <h1>{article.title}</h1>
            <p className="a-hero-sub">{article.subtitle}</p>
            <div className="a-meta">
              <span className="a-chip">Читать {readingMinutes(article)} мин</span>
              <span>{article.author}</span>
              <time dateTime={article.datetime}>{article.date}</time>
              <ShareButton />
            </div>
          </div>
        </header>

        <div className="a-wrap a-layout">
          <article id="article-body" className="a-article">
            <ArticleBlocks blocks={article.blocks} title={article.title} />
          </article>
          <ArticleSidebar title={article.title} />
        </div>

        <section className="a-more" aria-labelledby="a-more-title">
          <div className="a-wrap">
            <h2 id="a-more-title">{isCase ? "Другие объекты" : "Читайте также"}</h2>
            <ul>
              {more.map((item) => (
                <li key={item.slug}>
                  <Link href={`${base}/${item.slug}`}>
                    <span className="a-more-img">
                      <Image src={item.cover} alt="" fill sizes="(max-width: 900px) 100vw, 380px" />
                    </span>
                    <span className="a-more-tag">{item.tag}</span>
                    <span className="a-more-title">{item.title}</span>
                    <span className="a-more-text">{summary(item)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
        {isCase ? <ArticleNews /> : null}
        <div id="contacts" aria-hidden="true" />
      </main>
      <SiteFooter reveal={false} narrow />
      <FooterReveal />
    </>
  );
}
