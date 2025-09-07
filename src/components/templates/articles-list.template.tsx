'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

import { HighlightedText } from '../atoms/highlighted-text.jsx';
import { Badge, BadgeColor } from '../atoms/status/badge.jsx';
import { HeadingSection } from '../atoms/typography/heading-section.jsx';
import { Highlight } from '../molecules/typography/highlight.jsx';

import {
    type ArticleRowViewModel,
    type ArticleSeriesViewModel,
    type ArticlesListViewModel,
} from './articles-list.template.view-model.js';

// Featured article component for series
const FeaturedArticle: React.FC<{ article: ArticleRowViewModel }> = ({ article }) => {
    return (
        <Link className="block group" href={`/articles/${article.slug}`}>
            <article className="transition-all duration-200">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-center">
                    {/* Large image on the left */}
                    <div className="col-span-12 md:col-span-7">
                        <div className="relative w-full h-48 sm:h-64 md:h-[22rem] lg:h-[26rem] overflow-hidden bg-gray-100">
                            <Image
                                alt={article.title}
                                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 60vw"
                                src={article.imageUrl}
                            />
                        </div>
                    </div>
                    {/* Text on the right */}
                    <div className="col-span-12 md:col-span-5 flex flex-col justify-center min-w-0 md:pt-1 space-y-3 md:space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 line-clamp-3">{article.title}</h2>
                        <p className="text-base md:text-lg text-gray-600 leading-7 line-clamp-2 md:line-clamp-3 max-w-[48ch]">
                            {article.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs md:text-sm text-gray-500">
                            <span>{article.datePublished}</span>
                            <span>•</span>
                            <span>{article.readingTime}</span>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
};

// Series grid article component (image on top, then content)
const SeriesArticleCard: React.FC<{ article: ArticleRowViewModel }> = ({ article }) => {
    return (
        <Link className="block group" href={`/articles/${article.slug}`}>
            <article className="transition-colors duration-200">
                {/* Top image without borders/box */}
                <div className="relative w-full h-40 sm:h-44 md:h-48 bg-gray-100">
                    <Image
                        alt={article.title}
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 33vw"
                        src={article.imageUrl}
                    />
                </div>
                {/* Content */}
                <div className="pt-3 md:pt-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 leading-snug line-clamp-2 group-hover:text-black">
                        {article.title}
                    </h3>
                    <p className="text-sm md:text-[15px] text-gray-600 mb-2 leading-6 line-clamp-2 max-w-[55ch]">
                        {article.description}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] md:text-[12px] text-gray-500">
                        <span>{article.datePublished}</span>
                        <span>•</span>
                        <span>{article.readingTime}</span>
                    </div>
                </div>
            </article>
        </Link>
    );
};

// Series component
const ArticleSeries: React.FC<{ series: ArticleSeriesViewModel; isFirst?: boolean }> = ({ series, isFirst = false }) => {
    return (
        <section className="pb-10">
            {!isFirst && <div className="h-px bg-gray-200 mb-8 md:mb-10" />}
            <h2 className="text-xs md:text-sm font-semibold tracking-wider text-gray-600 mb-3 md:mb-4">{series.seriesTitle}</h2>
            
            {/* Featured Article */}
            <FeaturedArticle article={series.featuredArticle} />
            
            {/* Related Articles Grid */}
            {series.relatedArticles.length > 0 && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                    {series.relatedArticles.map((article) => (
                        <SeriesArticleCard article={article} key={article.slug} />
                    ))}
                </div>
            )}
        </section>
    );
};

// Simple row for standalone articles
export const ArticleRow: React.FC<{ article: ArticleRowViewModel }> = ({ article }) => {
    const color = article.isCodeCategory ? BadgeColor.Green : BadgeColor.Blue;

    return (
        <article className="border-b border-black-and-white py-2.5 md:py-3 hover:bg-gray-50">
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
        // Flatten all articles for JSON-LD
        const allArticles = [
            ...viewModel.series.flatMap(series => [series.featuredArticle, ...series.relatedArticles]),
            ...viewModel.standaloneArticles
        ];

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
            hasPart: allArticles.map((article) => ({
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
        <div className="w-full min-h-screen bg-white">
            <Script
                id="articles-list-json-ld"
                strategy="beforeInteractive"
                type="application/ld+json"
            >
                {JSON.stringify(articlesListJsonLd)}
            </Script>

            {/* Hero Section */}
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-6 pt-6 pb-8 md:pt-10 md:pb-12">
                    <Highlight
                        button={viewModel.button}
                        description={viewModel.highlightDescription}
                        title={viewModel.highlightTitle}
                    />
                </div>
            </div>

            {/* Articles Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="space-y-12">
                    {/* Article Series */}
                    {viewModel.series.map((series, index) => (
                        <ArticleSeries isFirst={index === 0} key={`series-${index}`} series={series} />
                    ))}
                    
                    {/* Standalone Articles */}
                    {viewModel.standaloneArticles.length > 0 && (
                        <section aria-label="Other articles">
                            <div className="h-px bg-gray-200 mb-10" />
                            <HeadingSection>
                                <HighlightedText className="pr-2 text-sm font-semibold tracking-wide text-gray-600">Other posts</HighlightedText>
                            </HeadingSection>

                            <nav aria-label="Article navigation">
                                {viewModel.standaloneArticles.map((article) => (
                                    <ArticleRow article={article} key={article.slug} />
                                ))}
                            </nav>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};
