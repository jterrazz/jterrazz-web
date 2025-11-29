'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

// Domain
import { ArticleCategory } from '../../domain/article.js';

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
                            <span className="text-zinc-900 dark:text-zinc-100">
                                {article.category}
                            </span>
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

// Standard Grid Card (used for related articles and latest updates)
const GridArticleCard: React.FC<{ article: ArticleRowViewModel }> = ({ article }) => {
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

// Compact Horizontal Card (for Other Posts)
const CompactArticleCard: React.FC<{ article: ArticleRowViewModel }> = ({ article }) => {
    return (
        <Link className="block group" href={`/articles/${article.slug}`}>
            <article className="grid grid-cols-1 sm:grid-cols-12 gap-6 py-6 border-b border-zinc-100 dark:border-zinc-800 last:border-0 items-start">
                {/* Image (Left on desktop) */}
                <div className="sm:col-span-4 md:col-span-3">
                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-900 rounded-xl">
                        <Image
                            alt={article.title}
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 25vw, 25vw"
                            src={article.imageUrl}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="sm:col-span-8 md:col-span-9 flex flex-col h-full justify-center">
                    <div className="flex items-center gap-2 mb-2 text-xs font-medium tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                        <span className="text-zinc-900 dark:text-zinc-100">{article.category}</span>
                        <span>•</span>
                        <span>{article.datePublished}</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                        {article.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2 mb-3 max-w-2xl">
                        {article.description}
                    </p>
                    <div className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                        {article.readingTime}
                    </div>
                </div>
            </article>
        </Link>
    );
};

// Series component
const ArticleSeries: React.FC<{ series: ArticleSeriesViewModel }> = ({ series }) => {
    return (
        <section className="pb-16 md:pb-24">
            <SectionDivider className="mb-12 md:mb-16" title={`${series.seriesTitle} Series`} />

            {/* Featured Article */}
            <div className="mb-12 md:mb-16">
                <FeaturedArticle article={series.featuredArticle} />
            </div>

            {/* Related Articles Grid */}
            {series.relatedArticles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {series.relatedArticles.map((article) => (
                        <GridArticleCard article={article} key={article.slug} />
                    ))}
                </div>
            )}
        </section>
    );
};

// Simple row for standalone articles
export const ArticleRow: React.FC<{ article: ArticleRowViewModel }> = ({ article }) => {
    const color = article.isProject ? BadgeColor.Green : BadgeColor.Blue;

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
    const [filter, setFilter] = useState<'AI' | 'All' | 'Architecture' | 'Project'>('All');

    const filterMap: Record<string, ArticleCategory[]> = {
        AI: [ArticleCategory.Insight],
        Architecture: [ArticleCategory.Architecture],
        Project: [ArticleCategory.Project],
    };

    // Filter Helper
    const shouldShow = (article: ArticleRowViewModel): boolean => {
        if (filter === 'All') return true;
        // Convert view model category string back to ArticleCategory if needed,
        // but our view model category is just the string value.
        // ArticleCategory values are 'insight', 'code', 'build'.
        // We need to check if the article.category matches the allowed categories for the current filter.
        const allowedCategories = filterMap[filter];
        return allowedCategories
            ? allowedCategories.includes(article.category as ArticleCategory)
            : true;
    };

    // Filter content
    const filteredSeries = viewModel.series.filter((s) =>
        // A series is shown if its featured article (representative of the series) matches
        shouldShow(s.featuredArticle),
    );

    const filteredStandalone = viewModel.standaloneArticles.filter(shouldShow);

    // Latest sections might be hidden if they don't match filter
    const showLatestArticle = viewModel.latestArticle && shouldShow(viewModel.latestArticle);
    const showLatestProject =
        viewModel.latestProjectArticle && shouldShow(viewModel.latestProjectArticle);

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

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12">
                <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
                    {['All', 'AI', 'Architecture', 'Project'].map((f) => (
                        <button
                            className={`
                                px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
                                ${
                                    filter === f
                                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg shadow-zinc-900/20 dark:shadow-zinc-100/20'
                                        : 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200'
                                }
                            `}
                            key={f}
                            onClick={() =>
                                setFilter(f as 'AI' | 'All' | 'Architecture' | 'Project')
                            }
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Articles Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 pb-24">
                <div className="space-y-20">
                    {/* Latest Updates Section */}
                    {(showLatestArticle || showLatestProject) && (
                        <section className="pb-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                                {/* Latest Article */}
                                {showLatestArticle && viewModel.latestArticle && (
                                    <div className="flex flex-col gap-8">
                                        <SectionDivider title="Latest Article" />
                                        <div className="h-full">
                                            <GridArticleCard article={viewModel.latestArticle} />
                                        </div>
                                    </div>
                                )}

                                {/* Latest Project */}
                                {showLatestProject && viewModel.latestProjectArticle && (
                                    <div className="flex flex-col gap-8">
                                        <SectionDivider title="Latest Project" />
                                        <div className="h-full">
                                            <GridArticleCard
                                                article={viewModel.latestProjectArticle}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Article Series */}
                    {filteredSeries.map((series, index) => (
                        <ArticleSeries key={`series-${index}`} series={series} />
                    ))}

                    {/* Standalone Articles */}
                    {filteredStandalone.length > 0 && (
                        <section aria-label="Other articles">
                            <SectionDivider className="mb-12" title="Other Posts" />

                            <div className="flex flex-col gap-2 max-w-4xl">
                                {filteredStandalone.map((article) => (
                                    <CompactArticleCard article={article} key={article.slug} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};
