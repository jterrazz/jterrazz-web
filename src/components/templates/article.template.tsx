import React from 'react';

import { Feature } from '../../domain/feature.js';

import { ArticleInMarkdown } from '../organisms/article-in-markdown.js';
import { MainContainer } from '../organisms/main-container.jsx';

type ArticleTemplateProps = {
    title: string;
    dateModified: string;
    datePublished: string;
    contentInMarkdown: string;
    features: Feature[];
    articles: Article[];
};
import Script from 'next/script';

import { Article } from '../../domain/article.js';

import { HighlightedText } from '../atoms/highlighted-text.jsx';
import { HeadingSection } from '../atoms/typography/heading-section.jsx';

// TODO Move to viewmodel
export const ArticleTemplate: React.FC<ArticleTemplateProps> = ({
    contentInMarkdown,
    title,
    dateModified,
    datePublished,
    articles,
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
