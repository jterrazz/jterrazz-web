'use client';

import Script from 'next/script';
import React from 'react';

// Domain
import { type Experiment, ExperimentCategory } from '../../domain/experiment';
import { type Feature } from '../../domain/feature';
import { UserContactType } from '../../domain/user';
// Infrastructure
import { userRepository } from '../../infrastructure/repositories/user.repository';
import { Container } from '../ui/design-system';
import { CardExperimentFeatured } from '../ui/molecules/card-experiment-featured/card-experiment-featured';
import { DividerSection } from '../ui/molecules/divider-section/divider-section';
import { SectionHero } from '../ui/molecules/section-hero/section-hero';

type SerializableFeature = Omit<Feature, 'url'> & { url: string };

type ExperimentsListTranslations = {
    applications: string;
    foundation: string;
    hackathons: string;
    kicker: string;
    systems: string;
    viewGitHub: string;
};

type ExperimentsListTemplateProps = {
    experiments: readonly SerializableExperiment[];
    features: readonly SerializableFeature[];
    highlightDescription: string;
    highlightTitle: string;
    translations: ExperimentsListTranslations;
};

type SerializableExperiment = Omit<Experiment, 'components' | 'url'> & {
    articleUrl: null | string;
    components: Array<
        Omit<Experiment['components'][number], 'sourceUrl'> & {
            sourceUrl: string;
        }
    >;
    url: string;
};

export const ExperimentsListTemplate: React.FC<ExperimentsListTemplateProps> = ({
    experiments,
    highlightDescription,
    highlightTitle,
    translations: t,
}) => {
    const button = {
        href: userRepository.getContact(UserContactType.GitHub).url.toString(),
        text: t.viewGitHub,
    };

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        description: highlightDescription,
        name: highlightTitle,
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/experiments`,
    };

    const groups: { items: readonly SerializableExperiment[]; title: string }[] = [
        {
            items: experiments.filter((p) => p.category === ExperimentCategory.App),
            title: t.applications,
        },
        {
            items: experiments.filter((p) => p.category === ExperimentCategory.Hackathon),
            title: t.hackathons,
        },
        {
            items: experiments.filter((p) => p.category === ExperimentCategory.Foundation),
            title: t.foundation,
        },
        {
            items: experiments.filter((p) => p.category === ExperimentCategory.System),
            title: t.systems,
        },
    ].filter((g) => g.items.length > 0);

    return (
        <div className="w-full min-h-screen bg-white dark:bg-zinc-950">
            <Script
                id="experiments-list-json-ld"
                strategy="afterInteractive"
                type="application/ld+json"
            >
                {JSON.stringify(jsonLd)}
            </Script>

            <Container>
                <SectionHero
                    button={button}
                    description={highlightDescription}
                    kicker={t.kicker}
                    title={highlightTitle}
                />
            </Container>

            <Container>
                <div className="space-y-12 pb-12 md:pb-16">
                    {groups.map((group) => (
                        <section key={group.title}>
                            <DividerSection className="mb-4" title={group.title} />
                            <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                                {group.items.map((experiment) => (
                                    <CardExperimentFeatured
                                        experiment={experiment}
                                        key={experiment.name}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </Container>
        </div>
    );
};
