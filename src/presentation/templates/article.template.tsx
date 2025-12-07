import React from 'react';

import Link from 'next/link';
import Script from 'next/script';

// Domain
import { type Article, type ArticleLanguage } from '../../domain/article';
import { type Feature } from '../../domain/feature';
import { buildArticleSlug } from '../../domain/utils/slugify';

import { SelectorLanguage } from '../ui/molecules/selector-language/selector-language';
import { TableOfContents } from '../ui/molecules/table-of-contents/table-of-contents';
import { ArticleFooter } from '../ui/organisms/article-footer/article-footer';
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
    // 2. Otherwise, show latest published articles (excluding current one)
    const relatedArticles = seriesName
        ? seriesArticles
        : articles
              .filter(
                  (article) =>
                      article.published && article.publicIndex !== currentArticle?.publicIndex,
              )
              .sort(
                  (a, b) =>
                      new Date(b.metadata.datePublished).getTime() -
                      new Date(a.metadata.datePublished).getTime(),
              )
              .slice(0, 3);

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
        <Container className="mt-6 md:mt-10 relative">
            <Script id="json-ld" strategy="beforeInteractive" type="application/ld+json">
                {JSON.stringify(jsonLd)}
            </Script>

            <TableOfContents contentInMarkdown={contentInMarkdown} />

            <div className="flex flex-col gap-1.5 mb-6 text-sm text-zinc-500 dark:text-zinc-400">
                {seriesName && seriesPosition > 0 && (
                    <div className="flex items-center justify-between">
                        <span>
                            Part {seriesPosition} of {seriesTotal} in{' '}
                            <span className="text-zinc-900 dark:text-zinc-100">{seriesName}</span>
                        </span>
                        <div className="flex items-center gap-3">
                            {prevArticle && (
                                <Link
                                    className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                    href={`/articles/${buildArticleSlug(prevArticle.publicIndex, prevArticle.metadata.title.en)}`}
                                >
                                    ← Prev
                                </Link>
                            )}
                            {nextArticle && (
                                <Link
                                    className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                    href={`/articles/${buildArticleSlug(nextArticle.publicIndex, nextArticle.metadata.title.en)}`}
                                >
                                    Next →
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                <SelectorLanguage
                    articleId={articleId}
                    availableLanguages={availableLanguages}
                    currentLanguage={currentLanguage}
                />
            </div>

            <MarkdownRenderer content={contentInMarkdown} />

            <ArticleFooter
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
