'use client';

import Image from 'next/image';
import React from 'react';

// Domain
import { type Experiment } from '../../domain/experiment';
import { type UserExperience } from '../../domain/user';
import { Link } from '../../infrastructure/navigation/navigation';
import { ArrowLink, Container, Heading, Lead, Meta } from '../ui/design-system';
import { BadgeExperimentStatus } from '../ui/molecules/badge-experiment-status/badge-experiment-status';
import { DividerSection } from '../ui/molecules/divider-section/divider-section';
import { SectionHero } from '../ui/molecules/section-hero/section-hero';
import { FeaturedArticlesShowcase } from '../ui/organisms/featured-articles-showcase/featured-articles-showcase';

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
                <div className="flex flex-col gap-14 pb-12">
                    <section>
                        <DividerSection className="mb-6" title={t.featuredArticles} />
                        <FeaturedArticlesShowcase articles={featuredArticles.slice(0, 4)} />
                        <div className="mt-5 flex justify-end">
                            <ArrowLink href="/articles" tone="subtle">
                                {t.viewAll}
                            </ArrowLink>
                        </div>
                    </section>

                    <section>
                        <DividerSection className="mb-4" title={t.featuredExperiments} />
                        <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                            {featuredExperiments.map((experiment, index) => (
                                <Link
                                    className="group flex items-center gap-5 py-4"
                                    href={`/experiments/${experiment.slug}`}
                                    key={experiment.name}
                                >
                                    <Meta className="w-6 shrink-0">
                                        {String(index + 1).padStart(2, '0')}
                                    </Meta>
                                    {experiment.iconUrl && (
                                        <Image
                                            alt={experiment.name}
                                            className="shrink-0 rounded-xl shadow-[0_0_6px_rgba(0,0,0,0.04)]"
                                            height={44}
                                            src={experiment.iconUrl}
                                            width={44}
                                        />
                                    )}
                                    <div className="min-w-0 flex-1 transition-transform duration-200 group-hover:translate-x-1">
                                        <Heading as="h3" className="mb-0.5" size="title">
                                            {experiment.name}
                                        </Heading>
                                        <Lead className="line-clamp-1" size="sm">
                                            {experiment.tagline}
                                        </Lead>
                                    </div>
                                    <BadgeExperimentStatus
                                        className="shrink-0"
                                        status={experiment.status}
                                    />
                                </Link>
                            ))}
                        </div>
                        <div className="mt-5 flex justify-end">
                            <ArrowLink href="/experiments" tone="subtle">
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
