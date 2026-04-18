'use client';

import Script from 'next/script';
import { useState } from 'react';

// Domain
import { ArticleCategory } from '../../domain/article';
import { Container } from '../ui/design-system';
import { CardArticleRow } from '../ui/molecules/card-article/card-article-row';
import { DividerSection } from '../ui/molecules/divider-section/divider-section';
import { SectionHero } from '../ui/molecules/section-hero/section-hero';
import { cn } from '../utils';
import {
    type ArticleRowViewModel,
    type ArticleSeriesViewModel,
    type ArticlesListViewModel,
} from './articles-list-template-view-model';

const ArticleSeries: React.FC<{ series: ArticleSeriesViewModel; seriesLabel: string }> = ({
    series,
    seriesLabel,
}) => {
    const allArticles = [series.featuredArticle, ...series.relatedArticles];

    return (
        <section>
            <DividerSection className="mb-4" title={`${series.seriesTitle} ${seriesLabel}`} />
            <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                {allArticles.map((article) => (
                    <CardArticleRow
                        experimentSlug={article.experimentSlug}
                        imageUrl={article.imageUrl}
                        key={article.slug}
                        slug={article.slug}
                        tagline={article.tagline}
                        title={article.title}
                    />
                ))}
            </div>
        </section>
    );
};

type FilterKey = 'All' | 'Exploration' | 'Reflection';

type ArticlesListTranslations = {
    filterAll: string;
    filterExploration: string;
    filterReflection: string;
    kicker: string;
    otherPosts: string;
    series: string;
};

type ArticlesListTemplateProps = {
    translations: ArticlesListTranslations;
    viewModel: ArticlesListViewModel;
};

export const ArticlesListTemplate: React.FC<ArticlesListTemplateProps> = ({
    translations: t,
    viewModel,
}) => {
    const [filter, setFilter] = useState<FilterKey>('All');

    const filterMap: Record<string, ArticleCategory[]> = {
        Exploration: [ArticleCategory.Exploration],
        Reflection: [ArticleCategory.Reflection],
    };

    const shouldShow = (article: ArticleRowViewModel): boolean => {
        if (filter === 'All') return true;
        const allowed = filterMap[filter];
        return allowed ? allowed.includes(article.category as ArticleCategory) : true;
    };

    const filteredSeries = viewModel.series.filter((s) => shouldShow(s.featuredArticle));
    const filteredStandalone = viewModel.standaloneArticles.filter(shouldShow);
    const showLatestExploration =
        viewModel.latestExplorationArticle && shouldShow(viewModel.latestExplorationArticle);

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

    const filters: { key: FilterKey; label: string }[] = [
        { key: 'All', label: t.filterAll },
        { key: 'Exploration', label: t.filterExploration },
        { key: 'Reflection', label: t.filterReflection },
    ];

    return (
        <div className="w-full min-h-screen bg-white dark:bg-zinc-950">
            <Script
                id="articles-list-json-ld"
                strategy="afterInteractive"
                type="application/ld+json"
            >
                {JSON.stringify(articlesListJsonLd)}
            </Script>

            <Container>
                <SectionHero
                    button={viewModel.button}
                    description={viewModel.highlightDescription}
                    kicker={t.kicker}
                    title={viewModel.highlightTitle}
                />
            </Container>

            <Container>
                <div className="mb-8 flex items-center gap-1">
                    {filters.map(({ key, label }) => {
                        const isActive = filter === key;
                        return (
                            <button
                                className={cn(
                                    'font-mono text-xs uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors',
                                    isActive
                                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100',
                                )}
                                key={key}
                                onClick={() => setFilter(key)}
                                type="button"
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </Container>

            <Container>
                <div className="space-y-12 pb-12 md:pb-16">
                    {showLatestExploration && viewModel.latestExplorationArticle && (
                        <section>
                            <DividerSection className="mb-4" title="Featured" />
                            <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                                <CardArticleRow
                                    experimentSlug={
                                        viewModel.latestExplorationArticle.experimentSlug
                                    }
                                    imageUrl={viewModel.latestExplorationArticle.imageUrl}
                                    slug={viewModel.latestExplorationArticle.slug}
                                    tagline={viewModel.latestExplorationArticle.tagline}
                                    title={viewModel.latestExplorationArticle.title}
                                />
                            </div>
                        </section>
                    )}

                    {filteredSeries.map((series) => (
                        <ArticleSeries
                            key={series.seriesTitle}
                            series={series}
                            seriesLabel={t.series}
                        />
                    ))}

                    {filteredStandalone.length > 0 && (
                        <section>
                            <DividerSection className="mb-4" title={t.otherPosts} />
                            <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                                {filteredStandalone.map((article) => (
                                    <CardArticleRow
                                        experimentSlug={article.experimentSlug}
                                        imageUrl={article.imageUrl}
                                        key={article.slug}
                                        slug={article.slug}
                                        tagline={article.tagline}
                                        title={article.title}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </Container>
        </div>
    );
};
