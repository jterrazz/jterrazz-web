import React from 'react';
import Link from 'next/link';
import Script from 'next/script';

import { type Article, type ArticleLanguage } from '../../domain/article.js';
import { type Feature } from '../../domain/feature.js';

import { ArticleInMarkdown } from '../organisms/article-in-markdown.js';
import { MainContainer } from '../organisms/main-container.jsx';

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
                <div className="rounded-lg bg-white border border-black/10 px-6 py-2 text-xs text-black/70 shadow-sm font-medium max-w-2xl w-full text-center">
                    Final text polished by AI for readability. The underlying concepts &
                    architecture are my own.
                </div>
            </aside>
            <Script id="json-ld" strategy="beforeInteractive" type="application/ld+json">
                {JSON.stringify(jsonLd)}
            </Script>

            {availableLanguages.length > 1 && (
                <div className="flex justify-center">
                    <div
                        aria-label="Language selection"
                        className="inline-flex border border-black/10 hover:border-black/20 transition-colors duration-300 rounded-full overflow-hidden"
                        role="navigation"
                    >
                        {availableLanguages.map((lang) => (
                            <Link
                                aria-current={currentLanguage === lang ? 'page' : undefined}
                                className={`
                                    px-6 py-2.5 text-[11px] font-medium tracking-[0.2em]
                                    transition-all duration-300 ease-out
                                    ${
                                        currentLanguage === lang
                                            ? 'bg-black text-white'
                                            : 'text-black/70 hover:text-black'
                                    }
                                `}
                                href={`/articles/${articleId}/${lang}`}
                                hrefLang={lang}
                                key={lang}
                                rel={currentLanguage === lang ? 'canonical' : 'alternate'}
                            >
                                {lang.toUpperCase()}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <ArticleInMarkdown className="mb-6" contentInMarkdown={contentInMarkdown} />
            <p className="text-center text-storm-cloud text-sm mt-4 italic">
                Last updated on {new Date(dateModified).toLocaleDateString()}
            </p>
            <p className="text-center text-storm-cloud text-sm mt-2 italic">
                Published on {new Date(datePublished).toLocaleDateString()}
            </p>
        </MainContainer>
    );
};
