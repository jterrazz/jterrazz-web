'use client';

import React from 'react';

// Domain
import { type Experiment } from '../../domain/experiment';
import { type UserExperience } from '../../domain/user';
import { ArrowLink, Container, Heading, Lead, Meta } from '../ui/design-system';
import { CardArticleRow } from '../ui/molecules/card-article/card-article-row';
import { CardExperimentFeatured } from '../ui/molecules/card-experiment-featured/card-experiment-featured';
import { DividerSection } from '../ui/molecules/divider-section/divider-section';
import { SectionHero } from '../ui/molecules/section-hero/section-hero';

interface Article {
    articleCount?: number;
    experimentSlug?: string;
    imageUrl: string;
    slug: string;
    tagline: string;
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
    featuredArticles: string;
    featuredExperiments: string;
    focus: string;
    focusAreas: {
        aiAgents: { description: string; title: string };
        aiEngineering: { description: string; title: string };
        architecture: { description: string; title: string };
        decentralization: { description: string; title: string };
    };
    journey: string;
    readArticles: string;
    title: string;
    titleAccent: string;
    viewAll: string;
};

type HelloWorldTemplateProps = {
    description: string;
    experiences: UserExperience[];
    featuredArticles: Article[];
    featuredExperiments: SerializableExperiment[];
    translations: HelloWorldTranslations;
};

const JourneyItem = ({ experience }: { experience: UserExperience }) => (
    <div className="flex items-baseline justify-between gap-4 py-3">
        <div className="min-w-0">
            <Heading as="h3" className="mb-0.5 truncate" size="title">
                {experience.title}
            </Heading>
            <Lead className="truncate" size="sm">
                {experience.organization}
            </Lead>
        </div>
        <Meta className="shrink-0">{experience.year}</Meta>
    </div>
);

const FocusItem = ({ description, title }: { description: string; title: string }) => (
    <div className="py-3">
        <Heading as="h3" className="mb-0.5" size="title">
            {title}
        </Heading>
        <Lead size="sm">{description}</Lead>
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
            <Container width="shell">
                <SectionHero
                    button={button}
                    description={description}
                    title={t.title}
                    titleAccent={t.titleAccent}
                />
            </Container>

            <Container width="shell">
                {/* Featured pair — side by side once the shell is wide enough */}
                <div className="grid gap-12 pb-12 lg:grid-cols-2 lg:items-start">
                    <section>
                        <DividerSection className="mb-4" title={t.featuredExperiments} />
                        <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                            {featuredExperiments.map((experiment) => (
                                <CardExperimentFeatured
                                    experiment={experiment}
                                    key={experiment.name}
                                />
                            ))}
                        </div>
                        <div className="mt-5 flex justify-end">
                            <ArrowLink href="/experiments" tone="subtle">
                                {t.viewAll}
                            </ArrowLink>
                        </div>
                    </section>

                    <section>
                        <DividerSection className="mb-4" title={t.featuredArticles} />
                        <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                            {featuredArticles.slice(0, 4).map((article) => (
                                <CardArticleRow
                                    articleCount={article.articleCount}
                                    experimentSlug={article.experimentSlug}
                                    imageUrl={article.imageUrl}
                                    key={article.title}
                                    slug={article.slug}
                                    tagline={article.tagline}
                                    title={article.title}
                                />
                            ))}
                        </div>
                        <div className="mt-5 flex justify-end">
                            <ArrowLink href="/articles" tone="subtle">
                                {t.viewAll}
                            </ArrowLink>
                        </div>
                    </section>
                </div>
            </Container>

            {/* Focus + Journey — solo sections, reading width, left-aligned on the shell */}
            <Container width="shell">
                <div className="max-w-180 space-y-12 pb-12 md:pb-16">
                    <section>
                        <DividerSection className="mb-4" title={t.focus} />
                        <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
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

                    <section>
                        <DividerSection className="mb-4" title={t.journey} />
                        <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                            {experiences.slice(0, 6).map((experience) => (
                                <JourneyItem
                                    experience={experience}
                                    key={`${experience.year}-${experience.organization}`}
                                />
                            ))}
                        </div>
                    </section>
                </div>
            </Container>
        </div>
    );
};
