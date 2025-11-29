'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

import { Badge, BadgeColor } from '../atoms/status/badge.jsx';
import { SectionDivider } from '../molecules/section-divider.js';
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
                        <div className="relative w-full h-48 sm:h-64 md:h-[22rem] lg:h-[26rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900 rounded-2xl">
                            <Image
                                alt={article.title}
                                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 60vw"
                                src={article.imageUrl}
                            />
                        </div>
                    </div>
                    {/* Text on the right */}
                    <div className="col-span-12 md:col-span-5 flex flex-col justify-center min-w-0 md:pt-1 space-y-4">
                        <div className="flex items-center gap-3 text-xs font-medium tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                            <span className="text-zinc-900 dark:text-zinc-100">{article.category}</span>
                            <span>•</span>
                            <span>{article.datePublished}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 line-clamp-3 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                            {article.title}
                        </h2>
                        <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3 max-w-[48ch]">
                            {article.description}
                        </p>
                        <div className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                            {article.readingTime}
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
        <Link className="block group h-full" href={`/articles/${article.slug}`}>
            <article className="flex flex-col h-full transition-colors duration-200">
                {/* Top image */}
                <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-zinc-100 dark:bg-zinc-900 rounded-2xl mb-4">
                    <Image
                        alt={article.title}
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 33vw"
                        src={article.imageUrl}
                    />
                </div>
                {/* Content */}
                <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3 text-xs font-medium tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                        <span className="text-zinc-900 dark:text-zinc-100">{article.category}</span>
                        <span>•</span>
                        <span>{article.datePublished}</span>
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 leading-snug line-clamp-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                        {article.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2 mb-4 flex-1">
                        {article.description}
                    </p>
                    <div className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mt-auto">
                        {article.readingTime}
                    </div>
                </div>
            </article>
        </Link>
    );
};

// Series component
const ArticleSeries: React.FC<{ isFirst?: boolean; series: ArticleSeriesViewModel }> = ({
    isFirst = false,
    series,
}) => {
    return (
        <section className="pb-16 md:pb-24">
            <SectionDivider className="mb-12 md:mb-16" title={series.seriesTitle} />
            
            {/* Featured Article */}
            <div className="mb-12 md:mb-16">
                <FeaturedArticle article={series.featuredArticle} />
            </div>
            
            {/* Related Articles Grid */}
            {series.relatedArticles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
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
        <article className="group py-4 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors rounded-lg px-2 -mx-2">
            <Link
                aria-label={`Read article: ${article.title} - ${article.category}`}
                className="flex items-center justify-between"
                href={`/articles/${article.slug}`}
            >
                <div className="flex flex-col gap-1">
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                        {article.title}
                    </h3>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {article.datePublished} • {article.readingTime}
                    </span>
                </div>
                <Badge color={color} value={article.category} />
            </Link>
        </article>
    );
};

type ArticlesListTemplateProps = {
    viewModel: ArticlesListViewModel;
};

export const ArticlesListTemplate: React.FC<ArticlesListTemplateProps> = ({ viewModel }) => {
    const allArticles = [
        ...viewModel.series.flatMap((series) => [
            series.featuredArticle,
            ...series.relatedArticles,
        ]),
        ...viewModel.standaloneArticles,
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
        <div className="w-full min-h-screen bg-white dark:bg-zinc-950">
            <Script
                id="articles-list-json-ld"
                strategy="beforeInteractive"
                type="application/ld+json"
            >
                {JSON.stringify(articlesListJsonLd)}
            </Script>

            {/* Hero Section */}
            <div className="w-full">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <Highlight
                        button={viewModel.button}
                        description={viewModel.highlightDescription}
                        title={viewModel.highlightTitle}
                    />
                </div>
            </div>

            {/* Articles Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 pb-24">
                <div className="space-y-20">
                    {/* Article Series */}
                    {viewModel.series.map((series, index) => (
                        <ArticleSeries
                            isFirst={index === 0}
                            key={`series-${index}`}
                            series={series}
                        />
                    ))}

                    {/* Standalone Articles */}
                    {viewModel.standaloneArticles.length > 0 && (
                        <section aria-label="Other articles">
                            <SectionDivider className="mb-12" title="Other Posts" />

                            <nav aria-label="Article navigation" className="max-w-3xl">
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
