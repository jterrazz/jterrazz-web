'use client';

import React from 'react';

import { ArrowRight, ArrowUpRight, Download, Github, Globe } from 'lucide-react';

// Domain
import {
    type Experiment,
    type ExperimentComponent,
    ExperimentContext,
} from '../../domain/experiment';

// Utils
import { cn } from '../utils';

import { BadgeExperimentStatus } from '../ui/molecules/badge-experiment-status/badge-experiment-status';
import { DividerSection } from '../ui/molecules/divider-section/divider-section';

// Serializable version of Experiment for Server → Client transfer
type SerializableExperiment = Omit<Experiment, 'components' | 'url'> & {
    articleUrl: null | string;
    components: Array<
        Omit<ExperimentComponent, 'sourceUrl'> & {
            sourceUrl: string;
        }
    >;
    url: string;
};

type ExperimentDetailTranslations = {
    context: {
        hackathon: string;
        personal: string;
        professional: string;
        school42: string;
    };
    detail: {
        about: string;
        appStore: string;
        components: string;
        privacyPolicy: string;
        readArticle: string;
        showcase: string;
        sourceCode: string;
        viewProject: string;
        visitWebsite: string;
        year: string;
    };
};

type ExperimentDetailTemplateProps = {
    experiment: SerializableExperiment;
    translations: ExperimentDetailTranslations;
};

/**
 * Get translated context label
 */
function getContextLabel(
    context: ExperimentContext,
    translations: ExperimentDetailTranslations['context'],
): string {
    switch (context) {
        case ExperimentContext.Personal:
            return translations.personal;
        case ExperimentContext.School42:
            return translations.school42;
        case ExperimentContext.Professional:
            return translations.professional;
        case ExperimentContext.Hackathon:
            return translations.hackathon;
        default:
            return context;
    }
}

export const ExperimentDetailTemplate: React.FC<ExperimentDetailTemplateProps> = ({
    experiment,
    translations: t,
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
                                    t.detail.readArticle,
                                    <ArrowRight size={18} />,
                                )}
                            {experiment.storeLinks?.web &&
                                renderStoreButton(
                                    experiment.storeLinks.web,
                                    t.detail.visitWebsite,
                                    <Globe size={18} />,
                                )}
                            {experiment.storeLinks?.appStore &&
                                renderStoreButton(
                                    experiment.storeLinks.appStore,
                                    t.detail.appStore,
                                    <Download size={18} />,
                                )}
                            {experiment.url &&
                                !experiment.storeLinks?.web &&
                                renderStoreButton(
                                    experiment.url.toString(),
                                    t.detail.viewProject,
                                    <ArrowUpRight size={18} />,
                                )}
                            {experiment.url?.toString().includes('github') &&
                                renderStoreButton(
                                    experiment.url.toString(),
                                    t.detail.sourceCode,
                                    <Github size={18} />,
                                    'secondary',
                                )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 md:px-6 pt-20">
                <div className="max-w-5xl mx-auto space-y-24">
                    {/* Screenshots (Showcase) */}
                    {experiment.images?.screenshots && experiment.images.screenshots.length > 0 && (
                        <section className="overflow-hidden">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-8">
                                {t.detail.showcase}
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
                                        {t.detail.about}
                                    </h3>
                                    <div className="h-1 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                                </div>

                                <div className="flex flex-col items-start gap-6">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                                            <span className="font-mono uppercase tracking-wider text-xs">
                                                {t.detail.year}
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
                                                {getContextLabel(experiment.context, t.context)}
                                            </span>
                                        </div>
                                    </div>
                                    {experiment.hasPrivacyPolicy && (
                                        <a
                                            className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 underline underline-offset-2 transition-colors"
                                            href={`/experiments/${experiment.slug}/privacy`}
                                        >
                                            {t.detail.privacyPolicy}
                                        </a>
                                    )}
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
                            <DividerSection className="mb-6" title={t.detail.components} />
                            <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
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
        </div>
    );
};

// Serialized version of ExperimentComponent for Server → Client transfer
type SerializableExperimentComponent = Omit<ExperimentComponent, 'sourceUrl'> & {
    sourceUrl: string;
};

// Sub-component for architecture parts - minimalist style
const ExperimentComponentCard: React.FC<{
    component: SerializableExperimentComponent;
}> = ({ component }) => {
    return (
        <a
            className="group flex items-center justify-between gap-4 py-3"
            href={component.sourceUrl}
            rel="noreferrer"
            target="_blank"
        >
            <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:underline underline-offset-4">
                        {component.name}
                    </h4>
                    <BadgeExperimentStatus status={component.status} />
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">
                    {component.description}
                </p>
            </div>
            <Github
                className="shrink-0 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors"
                size={16}
            />
        </a>
    );
};
