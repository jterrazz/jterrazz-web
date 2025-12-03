import React from 'react';

import Script from 'next/script';

// Domain
import { type Article, type ArticleLanguage } from '../../domain/article';
import { type Feature } from '../../domain/feature';

import { buildArticleSlug } from '../../domain/utils/slugify';
import { LanguageSelector } from '../ui/molecules/language-selector';
import { TableOfContents } from '../ui/molecules/table-of-contents';
import { ArticleFooter } from '../ui/organisms/article-footer';
import { ArticleInMarkdown } from '../ui/organisms/article-in-markdown';
import { MainContainer } from '../ui/organisms/main-container';

type ArticleTemplateProps = {
    articleId: string;
    articles: Article[];
    availableLanguages: ArticleLanguage[];
    category: string;
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
    category,
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
