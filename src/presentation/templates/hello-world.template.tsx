'use client';

import React from 'react';

import { ArrowRight } from 'lucide-react';

// Domain
import { type Experiment } from '../../domain/experiment';
import { type UserExperience } from '../../domain/user';

// Infrastructure
import { Link } from '../../infrastructure/navigation/navigation';

import { CardArticle } from '../ui/molecules/card-article/card-article';
import { CardExperimentFeatured } from '../ui/molecules/card-experiment-featured/card-experiment-featured';
import { DividerSection } from '../ui/molecules/divider-section/divider-section';
import { SectionHero } from '../ui/molecules/section-hero/section-hero';
import { Timeline } from '../ui/organisms/timeline/timeline';
import { TimelineItem } from '../ui/organisms/timeline/timeline-item';

interface Article {
    articleCount?: number;
    description: string;
    imageUrl: string;
    seriesName?: string;
    slug: string;
    title: string;
}

type SerializableExperiment = Omit<Experiment, 'components' | 'url'> & {
    articleUrl: null | string;
    components: Array<
        Omit<Experiment['components'][number], 'sourceUrl'> & {
            sourceUrl: string;
        }
    >;
    url: string;
};

type HelloWorldTranslations = {
    featuredExperiments: string;
    focus: string;
    focusAreas: {
        aiAgents: { description: string; title: string };
        aiEngineering: { description: string; title: string };
        architecture: { description: string; title: string };
        decentralization: { description: string; title: string };
    };
    featuredArticles: string;
    journey: string;
    readArticles: string;
    title: string;
    viewAll: string;
};

type HelloWorldTemplateProps = {
    description: string;
    experiences: UserExperience[];
    featuredArticles: Article[];
    featuredExperiments: SerializableExperiment[];
    translations: HelloWorldTranslations;
};

const FocusItem = ({ description, title }: { description: string; title: string }) => (
    <div className="px-4 first:pl-0 last:pr-0">
        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">{title}</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{description}</p>
    </div>
);

export const HelloWorldTemplate: React.FC<HelloWorldTemplateProps> = ({
    description,
    experiences,
    featuredArticles,
    featuredExperiments,
    translations: t,
}) => {
    const button = {
        href: '/articles',
        text: t.readArticles,
    };

    return (
        <div className="w-full min-h-screen bg-white dark:bg-zinc-950">
            {/* Hero Section */}
            <div className="w-full border-b border-zinc-100 dark:border-zinc-900">
                <div className="max-w-4xl mx-auto px-4 md:px-6">
                    <SectionHero button={button} description={description} title={t.title} />
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-20 space-y-24">
                {/* Featured Experiments Section */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <DividerSection className="flex-1" title={t.featuredExperiments} />
                        <Link
                            className="hidden md:flex items-center gap-2 text-sm font-bold tracking-wide uppercase text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors ml-8 whitespace-nowrap"
                            href="/experiments"
                        >
                            {t.viewAll} <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                        {featuredExperiments.map((experiment) => (
                            <CardExperimentFeatured
                                className="first:pt-0 last:pb-0"
                                experiment={experiment}
                                key={experiment.name}
                                showIcon
                            />
                        ))}
                    </div>
                </section>

                {/* Featured Articles Section */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <DividerSection className="flex-1" title={t.featuredArticles} />
                        <Link
                            className="hidden md:flex items-center gap-2 text-sm font-bold tracking-wide uppercase text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors ml-8 whitespace-nowrap"
                            href="/articles"
                        >
                            {t.viewAll} <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        {featuredArticles.slice(0, 4).map((article, index, arr) => (
                            <CardArticle
                                articleCount={article.articleCount}
                                key={article.title}
                                {...article}
                                position={index}
                                seriesName={article.seriesName}
                                total={arr.length}
                            />
                        ))}
                    </div>
                </section>

                {/* Focus Areas */}
                <section>
                    <DividerSection className="mb-8" title={t.focus} />
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-zinc-100 dark:divide-zinc-800">
                        <FocusItem
                            description={t.focusAreas.aiEngineering.description}
                            title={t.focusAreas.aiEngineering.title}
                        />
                        <FocusItem
                            description={t.focusAreas.aiAgents.description}
                            title={t.focusAreas.aiAgents.title}
                        />
                        <FocusItem
                            description={t.focusAreas.architecture.description}
                            title={t.focusAreas.architecture.title}
                        />
                        <FocusItem
                            description={t.focusAreas.decentralization.description}
                            title={t.focusAreas.decentralization.title}
                        />
                    </div>
                </section>

                {/* Timeline Section */}
                <section>
                    <DividerSection className="mb-8" title={t.journey} />

                    <div className="max-w-4xl mx-auto w-full">
                        <Timeline>
                            {experiences.map((experience, index) => (
                                <TimelineItem
                                    experience={experience}
                                    index={index}
                                    key={`${experience.title}-${experience.year}-${index}`}
                                />
                            ))}
                        </Timeline>
                    </div>
                </section>
            </div>
        </div>
    );
};
