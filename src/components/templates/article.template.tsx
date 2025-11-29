import React from 'react';

import Script from 'next/script';

// Domain
import { type Article, type ArticleLanguage } from '../../domain/article';
import { type Feature } from '../../domain/feature';

import { AIBanner } from '../molecules/ai-banner';
import { LanguageSelector } from '../molecules/language-selector';
import { ArticleInMarkdown } from '../organisms/article-in-markdown';
import { MainContainer } from '../organisms/main-container';

type ArticleTemplateProps = {
    articleId: string;
    articles: Article[];
    availableLanguages: ArticleLanguage[];
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
    contentInMarkdown,
    currentLanguage,
    dateModified,
    datePublished,
    title,
}) => {
    const _filteredArticles = articles.filter((article) => article.published).slice(0, 5);
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
        <MainContainer className="my-6 md:my-6">
            <aside aria-label="Article metadata" className="flex justify-center mb-8">
                <AIBanner />
            </aside>
            <Script id="json-ld" strategy="beforeInteractive" type="application/ld+json">
                {JSON.stringify(jsonLd)}
            </Script>

            <LanguageSelector
                articleId={articleId}
                availableLanguages={availableLanguages}
                className="mb-8"
                currentLanguage={currentLanguage}
            />

            <ArticleInMarkdown className="mb-6" contentInMarkdown={contentInMarkdown} />
            <p className="text-center text-zinc-500 dark:text-zinc-400 text-sm mt-4 italic">
                Last updated on {new Date(dateModified).toLocaleDateString()}
            </p>
            <p className="text-center text-zinc-500 dark:text-zinc-400 text-sm mt-2 italic">
                Published on {new Date(datePublished).toLocaleDateString()}
            </p>
        </MainContainer>
    );
};
