import { getTranslations, setRequestLocale } from "next-intl/server";

import { buildArticleSlug } from "../../domain/utils/slugify";

import { articlesRepository } from "../../infrastructure/repositories/articles.repository";
import { contentLinksRepository } from "../../infrastructure/repositories/content-links.repository";
import { experimentsRepository } from "../../infrastructure/repositories/experiments.repository";
import { userRepository } from "../../infrastructure/repositories/user.repository";
import { buildMetadata } from "../../infrastructure/seo/build-metadata";
import { buildPersonJsonLd } from "../../infrastructure/seo/json-ld";

import type { Locale } from "../../i18n/config";
import { HelloWorldTemplate } from "../../presentation/templates/hello-world.template";
import { JsonLdScript } from "../../presentation/ui/atoms/json-ld-script/json-ld-script";

// Force static generation for this page
export const dynamic = "force-static";
export const revalidate = false;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return buildMetadata({
    alternateLanguages: {
      en: "/",
      fr: "/fr",
    },
    description: t("description"),
    keywords: [
      "Jean-Baptiste Terrazzoni",
      "AI Agent Developer",
      "Fintech Engineer",
      "intelligent systems",
      "TypeScript",
      "Node.js",
      "Next.js",
      "React",
      "Solidity",
      "self-improvement",
      "personal growth",
      "crypto",
      "blockchain",
    ],
    locale,
    path: locale === "en" ? "" : `/${locale}`,
    title: t("seoTitle"),
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });

  const userExperiences = userRepository.getExperiences();
  const allArticles = articlesRepository.getAll();

  // Featured articles - specific selection of series and standalone articles
  const featuredSeriesNames = ["Using AI", "Abundant Intelligence", "Application Design"];
  const featuredStandaloneIndexes = [13]; // "Let's playfully question everything"

  // Group articles by series
  const seriesMap = new Map<string, typeof allArticles>();
  const standaloneArticles: typeof allArticles = [];

  for (const article of allArticles) {
    if (article.metadata.series) {
      const existing = seriesMap.get(article.metadata.series) || [];
      existing.push(article);
      seriesMap.set(article.metadata.series, existing);
    } else {
      standaloneArticles.push(article);
    }
  }

  // Build featured articles list
  const featuredArticlesWithDates: Array<{
    articleCount?: number;
    experimentSlug?: string;
    imageUrl: string;
    latestDate: Date;
    slug: string;
    tagline: string;
    title: string;
  }> = [];

  // Add featured series
  for (const seriesName of featuredSeriesNames) {
    const articles = seriesMap.get(seriesName);
    if (!articles || articles.length === 0) continue;

    const sortedByDateAsc = articles.sort(
      (a, b) =>
        new Date(a.metadata.datePublished).getTime() - new Date(b.metadata.datePublished).getTime(),
    );
    const firstArticle = sortedByDateAsc[0];
    const latestArticle = sortedByDateAsc[sortedByDateAsc.length - 1];

    featuredArticlesWithDates.push({
      articleCount: articles.length,
      imageUrl: firstArticle.imageUrl ?? "",
      latestDate: new Date(latestArticle.metadata.dateModified),
      slug: buildArticleSlug(firstArticle.publicIndex, firstArticle.metadata.title.en),
      tagline: firstArticle.metadata.tagline[locale as Locale] ?? firstArticle.metadata.tagline.en,
      title: seriesName,
    });
  }

  // Add featured standalone articles
  for (const index of featuredStandaloneIndexes) {
    const article = standaloneArticles.find((a) => a.publicIndex === index);
    if (!article) continue;

    featuredArticlesWithDates.push({
      experimentSlug: contentLinksRepository.getExperimentSlugForArticle(article.publicIndex),
      imageUrl: article.imageUrl ?? "",
      latestDate: new Date(article.metadata.dateModified),
      slug: buildArticleSlug(article.publicIndex, article.metadata.title.en),
      tagline: article.metadata.tagline[locale as Locale] ?? article.metadata.tagline.en,
      title: article.metadata.title[locale as Locale] ?? article.metadata.title.en,
    });
  }

  // Sort by latest date (newest first) and remove the date field
  const featuredArticles = featuredArticlesWithDates
    .sort((a, b) => b.latestDate.getTime() - a.latestDate.getTime())
    .map(({ latestDate, ...rest }) => rest);

  // Featured experiments - specific selection
  const featuredSlugs = ["capitaine", "signews", "jterrazz"];
  const featuredExperiments = featuredSlugs
    .map((slug) => experimentsRepository.getBySlug(slug))
    .filter((exp) => exp !== undefined)
    .map((experiment) => {
      const linkedArticleIndex = contentLinksRepository.getArticleIndexForExperiment(
        experiment.slug,
      );
      const linkedArticle = linkedArticleIndex
        ? allArticles.find((a) => a.publicIndex === linkedArticleIndex)
        : undefined;
      const articleUrl = linkedArticle
        ? `/articles/${buildArticleSlug(linkedArticle.publicIndex, linkedArticle.metadata.title.en)}`
        : null;

      return {
        ...experiment,
        articleUrl,
        components: experiment.components.map((component) => ({
          ...component,
          sourceUrl: component.sourceUrl.toString(),
        })),
        url: experiment.url ? experiment.url.toString() : "",
      };
    });

  const jsonLd = buildPersonJsonLd({ description: t("description") });

  // Translations for client component
  const translations = {
    focus: t("focus"),
    focusAreas: {
      aiAgents: {
        description: t("focusAreas.aiAgents.description"),
        title: t("focusAreas.aiAgents.title"),
      },
      aiEngineering: {
        description: t("focusAreas.aiEngineering.description"),
        title: t("focusAreas.aiEngineering.title"),
      },
      architecture: {
        description: t("focusAreas.architecture.description"),
        title: t("focusAreas.architecture.title"),
      },
      decentralization: {
        description: t("focusAreas.decentralization.description"),
        title: t("focusAreas.decentralization.title"),
      },
    },
    journey: t("journey"),
    featuredExperiments: t("featuredExperiments"),
    featuredArticles: t("featuredArticles"),
    readArticles: t("readArticles"),
    title: t("title"),
    viewAll: t("viewAll"),
  };

  return (
    <>
      <JsonLdScript data={jsonLd} id="homepage-json-ld" />
      <HelloWorldTemplate
        description={t("description")}
        experiences={userExperiences}
        featuredExperiments={featuredExperiments}
        featuredArticles={featuredArticles}
        translations={translations}
      />
    </>
  );
}
