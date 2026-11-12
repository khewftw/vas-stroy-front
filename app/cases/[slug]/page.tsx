import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticlePage from "../../components/ArticlePage";
import { ARTICLES, articleBySlug } from "../../data/articles";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} — ВАС СТРОЙ`,
    description: article.subtitle,
    openGraph: { title: article.title, description: article.subtitle, images: [article.cover] },
  };
}

export default async function CaseArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) notFound();
  return <ArticlePage article={article} kind="case" />;
}
