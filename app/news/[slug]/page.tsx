import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticlePage from "../../components/ArticlePage";
import { NEWS_ARTICLES, newsArticleBySlug } from "../../data/newsArticles";

export function generateStaticParams() {
  return NEWS_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = newsArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} — ВАС СТРОЙ`,
    description: article.subtitle,
    openGraph: { title: article.title, description: article.subtitle, images: [article.cover] },
  };
}

export default async function NewsArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = newsArticleBySlug(slug);
  if (!article) notFound();
  return <ArticlePage article={article} kind="news" />;
}
