'use client';

import React from 'react';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import {
    type Experiment,
    type ExperimentContext,
    type ExperimentStatus,
} from '../../../../domain/experiment';

import { cn } from '../../../utils';

import { BadgeExperimentStatus } from '../badge-experiment-status/badge-experiment-status';

// Minimal type for the fields actually used by this component
// Works with both Experiment and serialized versions
type ExperimentCardData = Pick<Experiment, 'name' | 'slug' | 'description' | 'year'> & {
    context: ExperimentContext;
    status: ExperimentStatus;
    url?: URL | string;
};

export type CardExperimentFeaturedProps = {
    className?: string;
    experiment: ExperimentCardData;
};

export const CardExperimentFeatured: React.FC<CardExperimentFeaturedProps> = ({
    className,
    experiment,
}) => {
    return (
        <Link
            className={cn(
                'group flex flex-col h-full p-6 sm:p-8 rounded-xl transition-all duration-300',
                'bg-white dark:bg-zinc-950',
                'border border-zinc-200 dark:border-zinc-800',
                'hover:shadow-xl hover:shadow-zinc-200/40 dark:hover:shadow-black/40 hover:-translate-y-1',
                'hover:border-zinc-300 dark:hover:border-zinc-700',
                'relative overflow-hidden',
                className,
            )}
            href={`/experiments/${experiment.slug}`}
        >
            {/* Subtle gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 via-transparent to-transparent dark:from-zinc-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative flex flex-col h-full z-10">
                {/* Header: Title & Status */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                        {experiment.name}
                    </h3>
                    <BadgeExperimentStatus className="shrink-0" status={experiment.status} />
                </div>

                {/* Content */}
                <div className="flex-1 mb-8">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3 font-normal">
                        {experiment.description}
                    </p>
                </div>

                {/* Footer: Meta info */}
                <div className="flex items-center justify-between pt-6 border-t border-zinc-100/80 dark:border-zinc-800/60 mt-auto">
                    <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500 font-mono uppercase tracking-wider">
                        <span>{experiment.year}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                        <span>{experiment.context}</span>
                    </div>

                    <div
                        className={cn(
                            'flex items-center gap-2 text-xs font-medium transition-all duration-300',
                            'text-zinc-400 dark:text-zinc-500',
                            'group-hover:text-zinc-900 dark:group-hover:text-zinc-100 group-hover:translate-x-1',
                        )}
                    >
                        {experiment.url ? (
                            <>
                                <span>View Project</span>
                                <ArrowRight size={14} />
                            </>
                        ) : (
                            <span>Read More</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};
