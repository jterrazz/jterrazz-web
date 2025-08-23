'use client';

import React from 'react';

import Link from 'next/link';
import Script from 'next/script';

import { HighlightedText } from '../atoms/highlighted-text.jsx';
import { Badge, BadgeColor } from '../atoms/status/badge.jsx';
import { HeadingSection } from '../atoms/typography/heading-section.jsx';
import { Highlight } from '../molecules/typography/highlight.jsx';
import { MainContainer } from '../organisms/main-container.jsx';

import {
    type ArticleRowViewModel,
    type ArticlesListViewModel,
} from './articles-list.template.view-model.js';

export const ArticleRow: React.FC<{ article: ArticleRowViewModel }> = ({ article }) => {
    const color = article.isCodeCategory ? BadgeColor.Green : BadgeColor.Blue;

    return (
        <article className="border-b border-black-and-white py-3 hover:bg-gray-50">
            <Link
                aria-label={`Read article: ${article.title} - ${article.category}`}
                className="flex items-center justify-between transition-colors duration-200"
                href={`/articles/${article.slug}`}
            >
                <h3 className="font-medium text-left">{article.title}</h3>
                <Badge color={color} value={article.category} />
            </Link>
        </article>
    );
};

type ArticlesListTemplateProps = {
    viewModel: ArticlesListViewModel;
};

export const ArticlesListTemplate: React.FC<ArticlesListTemplateProps> = ({ viewModel }) => {
    // Structured data for articles list
    const articlesListJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        author: {
            '@type': 'Person',
            jobTitle: 'AI Agent Developer, Fintech Engineer',
            name: 'Jean-Baptiste Terrazzoni',
            url: 'https://jterrazz.com',
        },
        description:
            'A collection of articles on AI, fintech, coding, and personal growth by Jean-Baptiste Terrazzoni - AI Agent Developer and Fintech Engineer.',
        hasPart: viewModel.articles.map((article) => ({
            '@type': 'BlogPosting',
            about: article.category,
            author: {
                '@type': 'Person',
                name: 'Jean-Baptiste Terrazzoni',
                url: 'https://jterrazz.com',
            },
            name: article.title,
            url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/articles/${article.slug}`,
        })),
        name: 'Articles by Jean-Baptiste Terrazzoni',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/articles`,
    };

    return (
        <MainContainer>
            <Script
                id="articles-list-json-ld"
                strategy="beforeInteractive"
                type="application/ld+json"
            >
                {JSON.stringify(articlesListJsonLd)}
            </Script>

            <Highlight
                button={viewModel.button}
                description={viewModel.highlightDescription}
                title={viewModel.highlightTitle}
            />

            <section aria-label="Articles list">
                <HeadingSection>
                    <HighlightedText className="pr-2">Posts</HighlightedText>
                </HeadingSection>

                <nav aria-label="Article navigation">
                    {viewModel.articles.map((article) => (
                        <ArticleRow article={article} key={article.slug} />
                    ))}
                </nav>
            </section>
        </MainContainer>
    );
};
