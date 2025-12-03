'use client';

import React from 'react';

import { motion } from 'framer-motion';
import Script from 'next/script';

import { userDataAccess } from '../../data/user.data';
import { type Experiment, ExperimentCategory } from '../../domain/experiment';
import { type Feature } from '../../domain/feature';
import { UserContactType } from '../../domain/user';
import { CompactExperimentCard } from '../molecules/cards/compact-experiment-card';
import { FeaturedExperimentCard } from '../molecules/cards/featured-experiment-card';
import { SectionDivider } from '../molecules/section-divider';
import { Highlight } from '../molecules/typography/highlight';

type ApplicationsListTemplateProps = {
    features: readonly Feature[];
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

export const ApplicationsListTemplate: React.FC<ApplicationsListTemplateProps> = ({
    highlightDescription,
    highlightTitle,
    experiments,
}) => {
    const button = {
        href: userDataAccess.getContact(UserContactType.GitHub).url.toString(),
        text: 'View GitHub',
    };

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        description: highlightDescription,
        name: highlightTitle,
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com'}/applications`,
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
                id="applications-list-json-ld"
                strategy="beforeInteractive"
                type="application/ld+json"
            >
                {JSON.stringify(jsonLd)}
            </Script>

            {/* Hero Section */}
            <div className="w-full border-b border-zinc-100 dark:border-zinc-900">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <Highlight
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
                        <SectionDivider className="mb-12" title="Applications" />
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
                            initial="hidden"
                            variants={containerVariants}
                            viewport={{ margin: '-100px', once: true }}
                            whileInView="show"
                        >
                            {apps.map((experiment) => (
                                <motion.div key={experiment.name} variants={itemVariants}>
                                    <FeaturedExperimentCard
                                        experiment={experiment as unknown as Experiment}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>
                )}

                {/* Libraries & Tools */}
                {libs.length > 0 && (
                    <section>
                        <SectionDivider className="mb-16" title="Tooling" />
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                            initial="hidden"
                            variants={containerVariants}
                            viewport={{ margin: '-50px', once: true }}
                            whileInView="show"
                        >
                            {libs.map((experiment) => (
                                <motion.div key={experiment.name} variants={itemVariants}>
                                    <CompactExperimentCard
                                        experiment={experiment as unknown as Experiment}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>
                )}

                {/* System & Research */}
                {system.length > 0 && (
                    <section>
                        <SectionDivider className="mb-16" title="Systems" />
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6"
                            initial="hidden"
                            variants={containerVariants}
                            viewport={{ margin: '-50px', once: true }}
                            whileInView="show"
                        >
                            {system.map((experiment) => (
                                <motion.div key={experiment.name} variants={itemVariants}>
                                    <CompactExperimentCard
                                        experiment={experiment as unknown as Experiment}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>
                )}
            </div>
        </div>
    );
};
