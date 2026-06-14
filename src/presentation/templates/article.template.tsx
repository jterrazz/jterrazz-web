import { IconFlaskFilled } from '@tabler/icons-react';
import Script from 'next/script';
import React from 'react';

// Domain
import { type Article, type ArticleLanguage } from '../../domain/article';
import { type Feature } from '../../domain/feature';
import {
    calculateReadingTimeMinutes,
    stripArticleMasthead,
} from '../../domain/utils/article-content';
import { buildArticleSlug } from '../../domain/utils/slugify';
import { Link } from '../../infrastructure/navigation/navigation';
import { ArticleByline } from '../ui/molecules/article-byline/article-byline';
import { TableOfContents } from '../ui/molecules/table-of-contents/table-of-contents';
import { ArticleFooter } from '../ui/organisms/article-footer/article-footer';
import { ArticleHeader } from '../ui/organisms/article-header/article-header';
import { Container } from '../ui/organisms/container/container';
import { MarkdownRenderer } from '../ui/organisms/markdown-renderer/markdown-renderer';

type ArticleTemplateProps = {
    articleId: string;
    articles: Article[];
    availableLanguages: ArticleLanguage[];
    contentInMarkdown: string;
    currentLanguage: ArticleLanguage;
    dateModified: string;
    datePublished: string;
    description: string;
    features: Feature[];
    imageUrl?: string;
    linkedExperiment?: null | { name: string; slug: string };
    title: string;
};

// TODO Move to viewmodel
export const ArticleTemplate: React.FC<ArticleTemplateProps> = ({
    articleId,
    articles,
    availableLanguages,
    contentInMarkdown,
    currentLanguage,
    dateModified,
    datePublished,
    description,
    imageUrl,
    linkedExperiment,
    title,
}) => {
    // Find the current article to get its series info
    const currentArticle = articles.find((a) => {
        const slug = buildArticleSlug(a.publicIndex, a.metadata.title.en);
        return slug === articleId || a.publicIndex.toString() === articleId.split('-')[0];
    });
    const seriesName = currentArticle?.metadata.series;

    // Get series articles sorted by publish date
    const seriesArticles = seriesName
        ? articles
              .filter((a) => a.metadata.series === seriesName)
              .sort(
                  (a, b) =>
                      new Date(a.metadata.datePublished).getTime() -
                      new Date(b.metadata.datePublished).getTime(),
              )
        : [];

    // Calculate current position in series
    const currentSeriesIndex = seriesArticles.findIndex(
        (a) => buildArticleSlug(a.publicIndex, a.metadata.title.en) === articleId,
    );
    const seriesPosition = currentSeriesIndex + 1;
    const seriesTotal = seriesArticles.length;

    // Get prev/next articles in series
    const prevArticle = currentSeriesIndex > 0 ? seriesArticles[currentSeriesIndex - 1] : null;
    const nextArticle =
        currentSeriesIndex < seriesArticles.length - 1
            ? seriesArticles[currentSeriesIndex + 1]
            : null;

    // Filter logic:
    // 1. If part of a series, show other articles from that series
    // 2. Otherwise, show latest articles (first of each series, or standalone)
    const relatedArticles = seriesName
        ? seriesArticles
        : (() => {
              // Group articles by series
              const seriesMap = new Map<string, Article[]>();
              const standaloneArticles: Article[] = [];

              for (const article of articles) {
                  if (!article.published || article.publicIndex === currentArticle?.publicIndex) {
                      continue;
                  }

                  if (article.metadata.series) {
                      const existing = seriesMap.get(article.metadata.series) || [];
                      existing.push(article);
                      seriesMap.set(article.metadata.series, existing);
                  } else {
                      standaloneArticles.push(article);
                  }
              }

              // Get first article of each series (sorted by publish date)
              const seriesFirstArticles: Article[] = [];
              for (const [, seriesArticlesList] of seriesMap) {
                  const sorted = seriesArticlesList.sort(
                      (a, b) =>
                          new Date(a.metadata.datePublished).getTime() -
                          new Date(b.metadata.datePublished).getTime(),
                  );
                  if (sorted[0]) {
                      seriesFirstArticles.push(sorted[0]);
                  }
              }

              // Combine and sort by latest date
              return [...seriesFirstArticles, ...standaloneArticles]
                  .sort(
                      (a, b) =>
                          new Date(b.metadata.datePublished).getTime() -
                          new Date(a.metadata.datePublished).getTime(),
                  )
                  .slice(0, 3);
          })();

    /*
     * The masthead owns the title + hero image, so strip them from the body to
     * avoid rendering them twice. Reading time is computed from the full source.
     */
    const { body } = stripArticleMasthead(contentInMarkdown);
    const readingTimeMinutes = calculateReadingTimeMinutes(contentInMarkdown);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        author: {
            '@type': 'Person',
            name: 'Jean-Baptiste Terrazzoni',
            url: 'https://jterrazz.com',
        },
        dateModified: new Date(dateModified).toISOString(),
        datePublished: new Date(datePublished).toISOString(),
        description: description,
        headline: title,
        image: imageUrl
            ? [`${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}${imageUrl}`]
            : [],
        inLanguage: currentLanguage,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/articles/${articleId}`,
        },
        ...(availableLanguages.length > 1 && {
            inLanguage: availableLanguages,
        }),
    };

    return (
        <Container className="mt-10 md:mt-20 relative" size="wide">
            <Script id="json-ld" strategy="afterInteractive" type="application/ld+json">
                {JSON.stringify(jsonLd)}
            </Script>

            {linkedExperiment && (
                <Link
                    className="group flex items-center gap-2 mb-2 px-3 py-2 -mx-3 rounded-lg text-sm text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                    href={`/experiments/${linkedExperiment.slug}`}
                >
                    <IconFlaskFilled className="text-zinc-400 dark:text-zinc-500" size={14} />
                    <span>
                        Part of the{' '}
                        <span className="text-zinc-900 dark:text-zinc-100 font-medium group-hover:underline underline-offset-2">
                            {linkedExperiment.name}
                        </span>{' '}
                        experiment
                    </span>
                </Link>
            )}

            <ArticleHeader
                category={currentArticle?.metadata.category}
                className="mb-10 md:mb-14"
                description={description}
                imageUrl={imageUrl}
                locale={currentLanguage}
                nextHref={
                    nextArticle
                        ? `/articles/${buildArticleSlug(nextArticle.publicIndex, nextArticle.metadata.title.en)}`
                        : null
                }
                prevHref={
                    prevArticle
                        ? `/articles/${buildArticleSlug(prevArticle.publicIndex, prevArticle.metadata.title.en)}`
                        : null
                }
                seriesName={seriesName}
                seriesPosition={seriesName && seriesPosition > 0 ? seriesPosition : undefined}
                seriesTotal={seriesName ? seriesTotal : undefined}
                title={title}
            />

            <div className="md:grid md:grid-cols-[15rem_minmax(0,1fr)] md:gap-x-20 lg:gap-x-32">
                <aside className="mb-10 md:mb-0">
                    <ArticleByline
                        className="mb-8 md:mb-10"
                        datePublished={datePublished}
                        locale={currentLanguage}
                        readingTimeMinutes={readingTimeMinutes}
                    />
                    <TableOfContents
                        className="hidden md:block md:sticky md:top-28"
                        contentInMarkdown={body}
                        variant="sidebar"
                    />
                </aside>

                <MarkdownRenderer className="max-w-3xl" content={body} />
            </div>

            <ArticleFooter
                articleUrl={currentArticle?.attestation ? `/articles/${articleId}` : undefined}
                attestation={currentArticle?.attestation}
                className="mt-12 md:mt-16"
                currentArticleId={articleId}
                dateModified={dateModified}
                datePublished={datePublished}
                relatedArticles={relatedArticles}
                seriesTitle={seriesName}
            />
        </Container>
    );
};
