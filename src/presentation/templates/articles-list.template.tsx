"use client";

import { useState } from "react";

import Script from "next/script";

// Domain
import { ArticleCategory } from "../../domain/article";

import { CardArticleRow } from "../ui/molecules/card-article/card-article-row";
import { DividerSection } from "../ui/molecules/divider-section/divider-section";
import { SectionHero } from "../ui/molecules/section-hero/section-hero";

import {
  type ArticleRowViewModel,
  type ArticleSeriesViewModel,
  type ArticlesListViewModel,
} from "./articles-list-template-view-model";

// Series section component
const ArticleSeries: React.FC<{ series: ArticleSeriesViewModel; seriesLabel: string }> = ({
  series,
  seriesLabel,
}) => {
  const allArticles = [series.featuredArticle, ...series.relatedArticles];

  return (
    <section>
      <DividerSection className="mb-6" title={`${series.seriesTitle} ${seriesLabel}`} />
      <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
        {allArticles.map((article) => (
          <CardArticleRow
            experimentSlug={article.experimentSlug}
            imageUrl={article.imageUrl}
            key={article.slug}
            slug={article.slug}
            tagline={article.tagline}
            title={article.title}
          />
        ))}
      </div>
    </section>
  );
};

type ArticlesListTranslations = {
  filterAll: string;
  filterExploration: string;
  filterReflection: string;
  otherPosts: string;
  series: string;
};

type ArticlesListTemplateProps = {
  translations: ArticlesListTranslations;
  viewModel: ArticlesListViewModel;
};

export const ArticlesListTemplate: React.FC<ArticlesListTemplateProps> = ({
  translations: t,
  viewModel,
}) => {
  const [filter, setFilter] = useState<"All" | "Exploration" | "Reflection">("All");

  const filterMap: Record<string, ArticleCategory[]> = {
    Reflection: [ArticleCategory.Reflection],
    Exploration: [ArticleCategory.Exploration],
  };

  // Filter Helper
  const shouldShow = (article: ArticleRowViewModel): boolean => {
    if (filter === "All") return true;
    const allowedCategories = filterMap[filter];
    return allowedCategories
      ? allowedCategories.includes(article.category as ArticleCategory)
      : true;
  };

  // Filter content
  const filteredSeries = viewModel.series.filter((s) => shouldShow(s.featuredArticle));
  const filteredStandalone = viewModel.standaloneArticles.filter(shouldShow);

  // Featured articles visibility
  const showLatestExploration =
    viewModel.latestExplorationArticle && shouldShow(viewModel.latestExplorationArticle);

  const allArticles = [
    ...viewModel.series.flatMap((series) => [series.featuredArticle, ...series.relatedArticles]),
    ...viewModel.standaloneArticles,
  ];

  const articlesListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    author: {
      "@type": "Person",
      jobTitle: "AI Agent Developer, Fintech Engineer",
      name: "Jean-Baptiste Terrazzoni",
      url: "https://jterrazz.com",
    },
    description:
      "A collection of articles on AI, fintech, coding, and personal growth by Jean-Baptiste Terrazzoni - AI Agent Developer and Fintech Engineer.",
    hasPart: allArticles.map((article) => ({
      "@type": "BlogPosting",
      about: article.category,
      author: {
        "@type": "Person",
        name: "Jean-Baptiste Terrazzoni",
        url: "https://jterrazz.com",
      },
      name: article.title,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://jterrazz.com"}/articles/${article.slug}`,
    })),
    name: "Articles by Jean-Baptiste Terrazzoni",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://jterrazz.com"}/articles`,
  };

  return (
    <div className="w-full min-h-screen bg-white dark:bg-zinc-950">
      <Script id="articles-list-json-ld" strategy="beforeInteractive" type="application/ld+json">
        {JSON.stringify(articlesListJsonLd)}
      </Script>

      {/* Hero Section */}
      <div className="w-full">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <SectionHero
            button={viewModel.button}
            description={viewModel.highlightDescription}
            title={viewModel.highlightTitle}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 mb-10">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            {[
              { key: "All", label: t.filterAll },
              { key: "Exploration", label: t.filterExploration },
              { key: "Reflection", label: t.filterReflection },
            ].map(({ key, label }) => (
              <button
                className={`
                                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                                    ${
                                      filter === key
                                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                                    }
                                `}
                key={key}
                onClick={() => setFilter(key as "All" | "Exploration" | "Reflection")}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Content */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 pb-24 space-y-12">
        {/* Featured Articles */}
        {showLatestExploration && (
          <section>
            <DividerSection className="mb-6" title="Featured" />
            <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
              {viewModel.latestExplorationArticle && (
                <CardArticleRow
                  experimentSlug={viewModel.latestExplorationArticle.experimentSlug}
                  imageUrl={viewModel.latestExplorationArticle.imageUrl}
                  slug={viewModel.latestExplorationArticle.slug}
                  tagline={viewModel.latestExplorationArticle.tagline}
                  title={viewModel.latestExplorationArticle.title}
                />
              )}
            </div>
          </section>
        )}

        {/* Article Series */}
        {filteredSeries.map((series) => (
          <ArticleSeries key={series.seriesTitle} series={series} seriesLabel={t.series} />
        ))}

        {/* Standalone Articles */}
        {filteredStandalone.length > 0 && (
          <section>
            <DividerSection className="mb-6" title={t.otherPosts} />
            <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredStandalone.map((article) => (
                <CardArticleRow
                  experimentSlug={article.experimentSlug}
                  imageUrl={article.imageUrl}
                  key={article.slug}
                  slug={article.slug}
                  tagline={article.tagline}
                  title={article.title}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
