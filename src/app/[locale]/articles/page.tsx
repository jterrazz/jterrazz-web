import { getTranslations, setRequestLocale } from "next-intl/server";

import { buildArticleSlug } from "../../../domain/utils/slugify";

import { SITE_CONFIG } from "../../../config/site";
import { articlesRepository } from "../../../infrastructure/repositories/articles.repository";
import { buildMetadata } from "../../../infrastructure/seo/build-metadata";
import {
  buildBlogPostingJsonLd,
  buildCollectionPageJsonLd,
} from "../../../infrastructure/seo/json-ld";

import { ArticlesListViewModelImpl } from "../../../presentation/templates/articles-list-template-view-model";
import { ArticlesListTemplate } from "../../../presentation/templates/articles-list.template";
import { JsonLdScript } from "../../../presentation/ui/atoms/json-ld-script/json-ld-script";

// Force static generation for this page
export const dynamic = "force-static";
export const revalidate = false;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "articles" });
  const path = locale === "en" ? "/articles" : `/${locale}/articles`;

  return buildMetadata({
    alternateLanguages: {
      en: "/articles",
      fr: "/fr/articles",
    },
    description: t("seoDescription"),
    keywords: [
      "AI articles",
      "fintech insights",
      "intelligent systems",
      "personal growth",
      "Jean-Baptiste Terrazzoni",
      "AI Agent Developer",
      "Fintech Engineer",
    ],
    locale,
    path,
    title: t("title"),
  });
}

export default async function ArticlesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "articles" });

  const articles = articlesRepository.getAll();

  const highlightTitle = t("title");
  const highlightDescription = t("highlightDescription");

  const viewModel = new ArticlesListViewModelImpl(
    articles,
    highlightTitle,
    highlightDescription,
    locale as "en" | "fr",
    t("viewMedium"),
  );

  const pageUrl = `${SITE_CONFIG.baseUrl}${locale === "en" ? "/articles" : `/${locale}/articles`}`;
  const jsonLd = buildCollectionPageJsonLd({
    description: t("seoDescription"),
    items: articles
      .filter((article) => article.published)
      .map((article) =>
        buildBlogPostingJsonLd({
          dateModified: new Date(article.metadata.dateModified).toISOString(),
          datePublished: new Date(article.metadata.datePublished).toISOString(),
          description: article.metadata.description.en,
          languages: Object.keys(article.content),
          title: article.metadata.title.en,
          url: `${pageUrl}/${buildArticleSlug(article.publicIndex, article.metadata.title.en)}`,
        }),
      ),
    name: "Articles by Jean-Baptiste Terrazzoni",
    url: pageUrl,
  });

  // Translations for client component
  const translations = {
    filterAll: t("filterAll"),
    filterExploration: t("filterExploration"),
    filterReflection: t("filterReflection"),
    otherPosts: t("otherPosts"),
    series: t("series"),
  };

  return (
    <>
      <JsonLdScript data={jsonLd} id="articles-json-ld" />
      <ArticlesListTemplate translations={translations} viewModel={viewModel.getViewModel()} />
    </>
  );
}
