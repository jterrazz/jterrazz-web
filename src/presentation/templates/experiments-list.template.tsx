'use client';

import React from 'react';

import Script from 'next/script';

// Domain
import { type Experiment, ExperimentCategory } from '../../domain/experiment';
import { type Feature } from '../../domain/feature';
import { UserContactType } from '../../domain/user';

type SerializableFeature = Omit<Feature, 'url'> & { url: string };

// Infrastructure
import { userRepository } from '../../infrastructure/repositories/user.repository';

import { CardExperimentFeatured } from '../ui/molecules/card-experiment-featured/card-experiment-featured';
import { DividerSection } from '../ui/molecules/divider-section/divider-section';
import { SectionHero } from '../ui/molecules/section-hero/section-hero';

type ExperimentsListTranslations = {
    applications: string;
    systems: string;
    tooling: string;
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

    const apps = experiments.filter((p) => p.category === ExperimentCategory.App);
    const libs = experiments.filter((p) => p.category === ExperimentCategory.Lib);
    const system = experiments.filter((p) => p.category === ExperimentCategory.System);

    return (
        <div className="w-full min-h-screen bg-white dark:bg-zinc-950">
            <Script
                id="experiments-list-json-ld"
                strategy="beforeInteractive"
                type="application/ld+json"
            >
                {JSON.stringify(jsonLd)}
            </Script>

            {/* Hero Section */}
            <div className="w-full">
                <div className="max-w-3xl mx-auto px-4 md:px-6">
                    <SectionHero
                        button={button}
                        description={highlightDescription}
                        title={highlightTitle}
                    />
                </div>
            </div>

            {/* Experiments Content */}
            <div className="max-w-3xl mx-auto px-4 md:px-6 pb-24 space-y-16">
                {/* Applications */}
                {apps.length > 0 && (
                    <section>
                        <DividerSection className="mb-6" title={t.applications} />
                        <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                            {apps.map((experiment) => (
                                <CardExperimentFeatured
                                    experiment={experiment}
                                    key={experiment.name}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Libraries & Tools */}
                {libs.length > 0 && (
                    <section>
                        <DividerSection className="mb-6" title={t.tooling} />
                        <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                            {libs.map((experiment) => (
                                <CardExperimentFeatured
                                    experiment={experiment}
                                    key={experiment.name}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* System & Research */}
                {system.length > 0 && (
                    <section>
                        <DividerSection className="mb-6" title={t.systems} />
                        <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                            {system.map((experiment) => (
                                <CardExperimentFeatured
                                    experiment={experiment}
                                    key={experiment.name}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};
