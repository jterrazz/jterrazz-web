'use client';

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
        if (filter === 'All') {
            return true;
        }
        const allowed = filterMap[filter];
        return allowed ? allowed.includes(article.category as ArticleCategory) : true;
    };

    const showLatestExploration =
        viewModel.latestExplorationArticle && shouldShow(viewModel.latestExplorationArticle);

    /*
     * Filter each timeline section in place, then drop standalone groups
     * that become empty after filtering.
     */
    const filteredTimeline = viewModel.timeline
        .map((section) => {
            if (section.kind === 'series') {
                return shouldShow(section.series.featuredArticle) ? section : null;
            }
            const articles = section.articles.filter(shouldShow);
            return articles.length > 0 ? { kind: 'standalones' as const, articles } : null;
        })
        .filter((s): s is NonNullable<typeof s> => s !== null);

    const filters: { key: FilterKey; label: string }[] = [
        { key: 'All', label: t.filterAll },
        { key: 'Exploration', label: t.filterExploration },
        { key: 'Reflection', label: t.filterReflection },
    ];

    return (
        <div className="w-full min-h-screen bg-white dark:bg-zinc-950">
            <Container>
                <SectionHero
                    button={viewModel.button}
                    description={viewModel.highlightDescription}
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
                                    'text-sm font-medium px-3.5 py-1.5 rounded-full transition-colors',
                                    isActive
                                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
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

                    {(() => {
                        /*
                         * Only the trailing standalone group carries the
                         * "Other posts" label. Earlier standalone groups get
                         * a plain unlabeled gradient rule so the page is still
                         * visually segmented without repeating the heading.
                         */
                        const lastStandaloneIdx = filteredTimeline.reduce(
                            (acc, section, idx) => (section.kind === 'standalones' ? idx : acc),
                            -1,
                        );
                        return filteredTimeline.map((section, idx) =>
                            section.kind === 'series' ? (
                                <ArticleSeries
                                    key={`series-${section.series.seriesTitle}`}
                                    series={section.series}
                                    seriesLabel={t.series}
                                />
                            ) : (
                                <section key={`standalones-${section.articles[0].slug}`}>
                                    {idx === lastStandaloneIdx ? (
                                        <DividerSection className="mb-4" title={t.otherPosts} />
                                    ) : (
                                        <div
                                            aria-hidden="true"
                                            className="h-px w-full bg-gradient-to-r from-zinc-200 to-transparent dark:from-zinc-800 dark:to-transparent mb-4"
                                        />
                                    )}
                                    <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                                        {section.articles.map((article) => (
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
                            ),
                        );
                    })()}
                </div>
            </Container>
        </div>
    );
};
