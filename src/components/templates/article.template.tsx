import React from 'react';
import Link from 'next/link';
import Script from 'next/script';

import { Article, ArticleLanguage } from '../../domain/article.js';
import { Feature } from '../../domain/feature.js';

import { HighlightedText } from '../atoms/highlighted-text.jsx';
import { HeadingSection } from '../atoms/typography/heading-section.jsx';
import { ArticleInMarkdown } from '../organisms/article-in-markdown.js';
import { MainContainer } from '../organisms/main-container.jsx';

type ArticleTemplateProps = {
    title: string;
    dateModified: string;
    datePublished: string;
    contentInMarkdown: string;
    features: Feature[];
    articles: Article[];
    availableLanguages: ArticleLanguage[];
    currentLanguage: ArticleLanguage;
    articleId: string;
};

// TODO Move to viewmodel
export const ArticleTemplate: React.FC<ArticleTemplateProps> = ({
    contentInMarkdown,
    title,
    dateModified,
    datePublished,
    articles,
    availableLanguages,
    currentLanguage,
    articleId,
}) => {
    const _filteredArticles = articles.filter((article) => article.published).slice(0, 5);
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        dateModified: new Date(dateModified).toISOString(),
        datePublished: new Date(datePublished).toISOString(),
        headline: title,
    };

    return (
        <MainContainer className="my-6 md:my-6">
            <Script id="json-ld" type="application/ld+json" strategy="beforeInteractive">
                {JSON.stringify(jsonLd)}
            </Script>

            {availableLanguages.length > 1 && (
                <div className="flex justify-center mb-12">
                    <div className="inline-flex border border-black/10 hover:border-black/20 transition-colors duration-300 rounded-full overflow-hidden">
                        {availableLanguages.map((lang) => (
                            <Link
                                key={lang}
                                href={`/articles/${articleId}/${lang}`}
                                className={`
                                    px-6 py-2.5 text-[11px] font-medium tracking-[0.2em]
                                    transition-all duration-300 ease-out
                                    ${
                                        currentLanguage === lang
                                            ? 'bg-black text-white'
                                            : 'text-black/70 hover:text-black'
                                    }
                                `}
                            >
                                {lang.toUpperCase()}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <ArticleInMarkdown contentInMarkdown={contentInMarkdown} className="mb-6" />
            <p className="text-center text-storm-cloud text-sm mt-4 italic">
                Last updated on {new Date(dateModified).toLocaleDateString()}
            </p>
            <p className="text-center text-storm-cloud text-sm mt-2 italic">
                Published on {new Date(datePublished).toLocaleDateString()}
            </p>
            <HeadingSection className="mt-6 md:mt-12 flex flex-col items-center">
                <HighlightedText className="pr-2">Featured Posts</HighlightedText>
            </HeadingSection>
            {/* {filteredArticles
                .sort(
                    (a, b) =>
                        new Date(b.metadata.datePublished).getTime() -
                        new Date(a.metadata.datePublished).getTime(),
                )
                .map((article) => (
                    <ArticleRow key={article.index} article={article} />
                ))} */}
        </MainContainer>
    );
};
