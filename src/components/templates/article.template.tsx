import React from 'react';

import Script from 'next/script';

// Domain
import { type Article, type ArticleLanguage } from '../../domain/article';
import { type Feature } from '../../domain/feature';

import { buildArticleSlug } from '../../lib/slugify';
import { LanguageSelector } from '../molecules/language-selector';
import { TableOfContents } from '../molecules/table-of-contents';
import { ArticleFooter } from '../organisms/article-footer';
import { ArticleInMarkdown } from '../organisms/article-in-markdown';
import { MainContainer } from '../organisms/main-container';

type ArticleTemplateProps = {
    articleId: string;
    articles: Article[];
    availableLanguages: ArticleLanguage[];
    category: string;
    contentInMarkdown: string;
    currentLanguage: ArticleLanguage;
    dateModified: string;
    datePublished: string;
    features: Feature[];
    title: string;
};

// TODO Move to viewmodel
export const ArticleTemplate: React.FC<ArticleTemplateProps> = ({
    articleId,
    articles,
    availableLanguages,
    category,
    contentInMarkdown,
    currentLanguage,
    dateModified,
    datePublished,
    title,
}) => {
    // Find the current article to get its series info
    const currentArticle = articles.find((a) => {
        const slug = buildArticleSlug(a.publicIndex, a.metadata.title.en);
        return slug === articleId || a.publicIndex.toString() === articleId.split('-')[0];
    });
    const seriesName = currentArticle?.metadata.series;

    // Filter logic:
    // 1. If part of a series, show other articles from that series
    // 2. Otherwise, show latest published articles (excluding current one)
    const relatedArticles = seriesName
        ? articles
              .filter((a) => a.metadata.series === seriesName)
              .sort(
                  (a, b) =>
                      new Date(a.metadata.datePublished).getTime() -
                      new Date(b.metadata.datePublished).getTime(),
              )
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
        dateModified: new Date(dateModified).toISOString(),
        datePublished: new Date(datePublished).toISOString(),
        headline: title,
        inLanguage: currentLanguage,
        ...(availableLanguages.length > 1 && {
            inLanguage: availableLanguages,
        }),
    };

    return (
        <MainContainer className="mt-8 md:mt-16 relative">
            <Script id="json-ld" strategy="beforeInteractive" type="application/ld+json">
                {JSON.stringify(jsonLd)}
            </Script>

            <TableOfContents contentInMarkdown={contentInMarkdown} />

            <LanguageSelector
                articleId={articleId}
                availableLanguages={availableLanguages}
                className="mb-12"
                currentLanguage={currentLanguage}
            />

            <ArticleInMarkdown className="mb-6" contentInMarkdown={contentInMarkdown} />

            <ArticleFooter
                category={category}
                className="mt-16"
                currentArticleId={articleId}
                dateModified={dateModified}
                datePublished={datePublished}
                relatedArticles={relatedArticles}
                seriesTitle={seriesName}
            />
        </MainContainer>
    );
};
