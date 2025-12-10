'use client';

import React from 'react';

import { ArrowRight } from 'lucide-react';

import { Link } from '../../../../infrastructure/navigation/navigation';

// Domain
import {
    type Experiment,
    type ExperimentContext,
    type ExperimentStatus,
} from '../../../../domain/experiment';

// Utils
import { cn } from '../../../utils';

import { BadgeExperimentStatus } from '../badge-experiment-status/badge-experiment-status';

// Minimal type for the fields actually used by this component
// Works with both Experiment and serialized versions
type ExperimentCardData = Pick<Experiment, 'description' | 'name' | 'slug' | 'year'> & {
    context: ExperimentContext;
    status: ExperimentStatus;
    url?: string | URL;
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
                'group flex flex-col h-full p-5 md:p-6 rounded-2xl transition-colors',
                'border border-zinc-200 dark:border-zinc-800',
                'hover:border-zinc-300 dark:hover:border-zinc-700',
                'bg-white dark:bg-zinc-950',
                className,
            )}
            href={`/experiments/${experiment.slug}`}
        >
            {/* Header: Icon, Title & Status */}
            <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-white dark:text-zinc-900 select-none">
                        {experiment.name.charAt(0)}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-snug group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors truncate">
                            {experiment.name}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                        <span>{experiment.year}</span>
                        <span>•</span>
                        <span>{experiment.context}</span>
                    </div>
                </div>
                <BadgeExperimentStatus className="shrink-0" status={experiment.status} />
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-4 flex-1">
                {experiment.description}
            </p>

            {/* CTA Link */}
            <div className="mt-auto flex items-center gap-2 text-xs font-medium text-zinc-900 dark:text-zinc-200 group-hover:translate-x-1 transition-transform duration-300">
                {experiment.url ? 'View project' : 'Read more'}
                <ArrowRight size={14} />
            </div>
        </Link>
    );
};
