'use client';

import React from 'react';

import { motion } from 'framer-motion';
import Script from 'next/script';

// Domain
import { type Experiment, ExperimentCategory } from '../../domain/experiment';
import { type Feature } from '../../domain/feature';
import { UserContactType } from '../../domain/user';

type SerializableFeature = Omit<Feature, 'url'> & { url: string };

// Infrastructure
import { userRepository } from '../../infrastructure/repositories/user.repository';

import { CardExperimentCompact } from '../ui/molecules/card-experiment-compact/card-experiment-compact';
import { CardExperimentFeatured } from '../ui/molecules/card-experiment-featured/card-experiment-featured';
import { DividerSection } from '../ui/molecules/divider-section/divider-section';
import { SectionHero } from '../ui/molecules/section-hero/section-hero';

type ExperimentsListTemplateProps = {
    features: readonly SerializableFeature[];
    highlightDescription: string;
    highlightTitle: string;
    experiments: readonly SerializableExperiment[];
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
    highlightDescription,
    highlightTitle,
    experiments,
}) => {
    const button = {
        href: userRepository.getContact(UserContactType.GitHub).url.toString(),
        text: 'View GitHub',
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

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

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
            <div className="w-full border-b border-zinc-100 dark:border-zinc-900">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <SectionHero
                        button={button}
                        description={highlightDescription}
                        title={highlightTitle}
                    />
                </div>
            </div>

            {/* Experiments Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32 space-y-32">
                {/* Featured Applications */}
                {apps.length > 0 && (
                    <section>
                        <DividerSection className="mb-12" title="Applications" />
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
                            initial="hidden"
                            variants={containerVariants}
                            viewport={{ margin: '-100px', once: true }}
                            whileInView="show"
                        >
                            {apps.map((experiment) => (
                                <motion.div key={experiment.name} variants={itemVariants}>
                                    <CardExperimentFeatured experiment={experiment} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>
                )}

                {/* Libraries & Tools */}
                {libs.length > 0 && (
                    <section>
                        <DividerSection className="mb-16" title="Tooling" />
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                            initial="hidden"
                            variants={containerVariants}
                            viewport={{ margin: '-50px', once: true }}
                            whileInView="show"
                        >
                            {libs.map((experiment) => (
                                <motion.div key={experiment.name} variants={itemVariants}>
                                    <CardExperimentCompact experiment={experiment} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>
                )}

                {/* System & Research */}
                {system.length > 0 && (
                    <section>
                        <DividerSection className="mb-16" title="Systems" />
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6"
                            initial="hidden"
                            variants={containerVariants}
                            viewport={{ margin: '-50px', once: true }}
                            whileInView="show"
                        >
                            {system.map((experiment) => (
                                <motion.div key={experiment.name} variants={itemVariants}>
                                    <CardExperimentCompact experiment={experiment} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>
                )}
            </div>
        </div>
    );
};
