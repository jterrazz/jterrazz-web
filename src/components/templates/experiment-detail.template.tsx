'use client';

import React from 'react';

import { ArrowRight, ArrowUpRight, Download, Github, Globe, Layers } from 'lucide-react';

// Domain
import { type Experiment, type ExperimentComponent } from '../../domain/experiment';

// Utils
import { cn } from '../../lib/utils';

import { ExperimentStatusBadge } from '../atoms/status/experiment-status-badge';
import { SectionDivider } from '../molecules/section-divider';

type ExperimentDetailTemplateProps = {
    experiment: Experiment;
};

export const ExperimentDetailTemplate: React.FC<ExperimentDetailTemplateProps> = ({
    experiment,
}) => {
    // Helper to render store buttons
    const renderStoreButton = (
        href: string,
        label: string,
        icon: React.ReactNode,
        variant: 'primary' | 'secondary' = 'primary',
    ) => (
        <a
            className={cn(
                'flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 font-medium text-sm',
                variant === 'primary'
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-lg shadow-zinc-900/20 dark:shadow-zinc-100/20 hover:-translate-y-0.5'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700',
            )}
            href={href}
            rel="noreferrer"
            target="_blank"
        >
            {icon}
            <span>{label}</span>
        </a>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 pb-32">
            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-4 md:px-6 border-b border-zinc-100 dark:border-zinc-900 overflow-hidden">
                {/* Background Texture */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('/assets/texture-dots.png')] bg-repeat" />

                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="flex flex-col gap-8">
                        {/* Title & Badges */}
                        <div className="space-y-6">
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                                {experiment.name}
                            </h1>

                            <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-3xl font-light">
                                {experiment.description}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-4 pt-4">
                            {experiment.articleUrl &&
                                renderStoreButton(
                                    experiment.articleUrl,
                                    'Read Article',
                                    <ArrowRight size={18} />,
                                )}
                            {experiment.storeLinks?.web &&
                                renderStoreButton(
                                    experiment.storeLinks.web,
                                    'Visit Website',
                                    <Globe size={18} />,
                                )}
                            {experiment.storeLinks?.appStore &&
                                renderStoreButton(
                                    experiment.storeLinks.appStore,
                                    'App Store',
                                    <Download size={18} />,
                                )}
                            {experiment.url &&
                                !experiment.storeLinks?.web &&
                                renderStoreButton(
                                    experiment.url.toString(),
                                    'View Project',
                                    <ArrowUpRight size={18} />,
                                )}
                            {experiment.url?.toString().includes('github') &&
                                renderStoreButton(
                                    experiment.url.toString(),
                                    'Source Code',
                                    <Github size={18} />,
                                    'secondary',
                                )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-6 pt-20 space-y-24">
                {/* Screenshots (Showcase) */}
                {experiment.images?.screenshots && experiment.images.screenshots.length > 0 && (
                    <section className="overflow-hidden">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-8">
                            Showcase
                        </h3>
                        <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] -mx-4 px-4 md:mx-0 md:px-0">
                            {experiment.images.screenshots.map((screenshot) => (
                                <div
                                    className="snap-center shrink-0 relative rounded-2xl overflow-hidden shadow-xl shadow-zinc-200/50 dark:shadow-zinc-900/50 border border-zinc-200 dark:border-zinc-800 w-[280px] md:w-[320px] aspect-[9/19]"
                                    key={screenshot}
                                >
                                    <img
                                        alt={`${experiment.name} screenshot`}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        src={screenshot}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* About Section */}
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                        <div className="md:col-span-4 space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                                    About
                                </h3>
                                <div className="h-1 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                            </div>

                            <div className="flex flex-col items-start gap-6">
                                <ExperimentStatusBadge
                                    className="border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800"
                                    status={experiment.status}
                                />
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                                        <span className="font-mono uppercase tracking-wider text-xs">
                                            Year
                                        </span>
                                        <span className="h-px w-8 bg-zinc-200 dark:bg-zinc-800" />
                                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                            {experiment.year}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                                        <span className="font-mono uppercase tracking-wider text-xs">
                                            Context
                                        </span>
                                        <span className="h-px w-8 bg-zinc-200 dark:bg-zinc-800" />
                                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                            {experiment.context}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-8">
                            <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                                {experiment.longDescription || experiment.description}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Components (If applicable) */}
                {experiment.components && experiment.components.length > 0 && (
                    <section>
                        <SectionDivider className="mb-12" title="Components" />
                        <div className="grid grid-cols-1 gap-6">
                            {experiment.components.map((component) => (
                                <ExperimentComponentCard
                                    component={component}
                                    key={component.name}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

// Sub-component for architecture parts
const ExperimentComponentCard: React.FC<{ component: ExperimentComponent }> = ({ component }) => {
    return (
        <div className="group relative p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1 space-y-3 pr-12">
                    <div className="flex items-center gap-3">
                        <Layers className="text-zinc-400" size={20} />
                        <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                            {component.name}
                        </h4>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {component.description}
                    </p>
                </div>

                <div className="flex flex-col items-end gap-4 shrink-0 pt-2 md:pt-0">
                    <ExperimentStatusBadge status={component.status} />
                    <a
                        className="flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all"
                        href={component.sourceUrl.toString()}
                        rel="noreferrer"
                        target="_blank"
                        title="View Source"
                    >
                        <Github size={18} />
                    </a>
                </div>
            </div>
        </div>
    );
};
