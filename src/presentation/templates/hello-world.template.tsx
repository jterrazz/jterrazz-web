'use client';

import React from 'react';

// Domain
import { type Experiment } from '../../domain/experiment';
import { type UserExperience } from '../../domain/user';
import { Container, Heading, Lead } from '../ui/design-system';
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
    kicker: string;
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
    experiences: _experiences,
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
            <Container>
                <SectionHero
                    button={button}
                    description={description}
                    kicker={t.kicker}
                    title={t.title}
                    titleAccent={t.titleAccent}
                />
            </Container>

            <Container>
                <div className="space-y-12 pb-12 md:pb-16">
                    <section>
                        <DividerSection
                            className="mb-4"
                            link={{ href: '/experiments', text: t.viewAll }}
                            title={t.featuredExperiments}
                        />
                        <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                            {featuredExperiments.map((experiment) => (
                                <CardExperimentFeatured
                                    experiment={experiment}
                                    key={experiment.name}
                                />
                            ))}
                        </div>
                    </section>

                    <section>
                        <DividerSection
                            className="mb-4"
                            link={{ href: '/articles', text: t.viewAll }}
                            title={t.featuredArticles}
                        />
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
                    </section>

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
                </div>
            </Container>
        </div>
    );
};
