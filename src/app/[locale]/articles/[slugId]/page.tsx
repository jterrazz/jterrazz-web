import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { type ArticleLanguage } from "../../../../domain/article";
import { buildArticleSlug } from "../../../../domain/utils/slugify";

import { type Locale, locales } from "../../../../i18n/config";
import { articlesRepository } from "../../../../infrastructure/repositories/articles.repository";
import { contentLinksRepository } from "../../../../infrastructure/repositories/content-links.repository";
import { experimentsRepository } from "../../../../infrastructure/repositories/experiments.repository";
import {
  FeatureId,
  featuresRepository,
} from "../../../../infrastructure/repositories/features.repository";
import { buildMetadata } from "../../../../infrastructure/seo/build-metadata";
import { is42RelatedArticle } from "../../../../infrastructure/seo/seo-utils";

import { ArticleTemplate } from "../../../../presentation/templates/article.template";

export const dynamicParams = true;

type ArticlePageProps = {
  params: Promise<{ locale: string; slugId: string }>;
};

export default async function ArticlePage(props: ArticlePageProps) {
  const params = await props.params;
  const { locale, slugId } = params;
  setRequestLocale(locale);

  const id = slugId.split("-")[0];
  const article = articlesRepository.getByIndex(id, locale as ArticleLanguage);

  if (!article) {
    return notFound();
  }

  // Compute canonical slug and redirect if needed
  const canonicalSlug = buildArticleSlug(article.publicIndex, article.metadata.title.en);
  if (slugId !== canonicalSlug) {
    const redirectPath =
      locale === "en" ? `/articles/${canonicalSlug}` : `/${locale}/articles/${canonicalSlug}`;
    return redirect(redirectPath);
  }

  const articles = articlesRepository.getAll();
  const features = [featuresRepository.getById(FeatureId.Source)];

  // Get linked experiment if any
  const experimentSlug = contentLinksRepository.getExperimentSlugForArticle(article.publicIndex);
  const linkedExperiment = experimentSlug ? experimentsRepository.getBySlug(experimentSlug) : null;

  // Get content in current locale, fallback to English
  const content = article.content[locale as ArticleLanguage] ?? article.content.en ?? "";
  const title = article.metadata.title[locale as Locale] ?? article.metadata.title.en;
  const description =
    article.metadata.description[locale as Locale] ?? article.metadata.description.en;

  return (
    <ArticleTemplate
      articleId={slugId}
      articles={articles}
      availableLanguages={Object.keys(article.content) as ArticleLanguage[]}
      contentInMarkdown={content}
      currentLanguage={locale as ArticleLanguage}
      dateModified={article.metadata.dateModified}
      datePublished={article.metadata.datePublished}
      description={description}
      features={features}
      imageUrl={article.imageUrl}
      linkedExperiment={
        linkedExperiment ? { name: linkedExperiment.name, slug: linkedExperiment.slug } : null
      }
      title={title}
    />
  );
}

export async function generateMetadata(props: ArticlePageProps): Promise<Metadata> {
  const params = await props.params;
  const { locale, slugId } = params;
  const id = slugId.split("-")[0];

  const article = articlesRepository.getByIndex(id, locale as ArticleLanguage);

  if (!article) {
    return { title: "Article Not Found" };
  }

  const availableLanguages = Object.keys(article.content) as ArticleLanguage[];

  // Generate hreflang links with new URL structure
  const alternateLanguages: Record<string, string> = {};
  for (const language of availableLanguages) {
    alternateLanguages[language] =
      language === "en" ? `/articles/${slugId}` : `/${language}/articles/${slugId}`;
  }

  const title = article.metadata.title[locale as Locale] ?? article.metadata.title.en;
  const description =
    article.metadata.description[locale as Locale] ?? article.metadata.description.en;
  const path = locale === "en" ? `/articles/${slugId}` : `/${locale}/articles/${slugId}`;
  const is42 = is42RelatedArticle(article.publicIndex);

  return buildMetadata({
    alternateLanguages,
    description,
    image: article.imageUrl ? { alt: title, path: article.imageUrl } : undefined,
    includeTwitterAttribution: true,
    is42Related: is42,
    locale,
    localeAlternates: availableLanguages.filter((l) => l !== locale),
    path,
    title,
    type: "article",
  });
}

export function generateStaticParams() {
  const articles = articlesRepository.getAll();

  // Generate params for all locale + slugId combinations
  return articles.flatMap((article) =>
    locales.flatMap((locale) => {
      // Only generate if article has content in this locale
      if (!article.content[locale as ArticleLanguage]) {
        return [];
      }
      return [
        {
          locale,
          slugId: buildArticleSlug(article.publicIndex, article.metadata.title.en),
        },
        {
          locale,
          slugId: String(article.publicIndex),
        },
      ];
    }),
  );
}
