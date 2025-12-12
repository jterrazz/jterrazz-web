'use client';

import React from 'react';

import { Link } from '../../../../infrastructure/navigation/navigation';

// Domain
import { type Experiment } from '../../../../domain/experiment';

// Utils
import { cn } from '../../../utils';

// Minimal type for the fields actually used by this component
// Works with both Experiment and serialized versions
type ExperimentCardData = Pick<Experiment, 'description' | 'name' | 'slug' | 'year'> & {
    url?: string | URL;
};

export type CardExperimentCompactProps = {
    className?: string;
    experiment: ExperimentCardData;
};

export const CardExperimentCompact: React.FC<CardExperimentCompactProps> = ({
    className,
    experiment,
}) => {
    return (
        <Link
            className={cn('group flex flex-col py-3', className)}
            href={`/experiments/${experiment.slug}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                    {experiment.name}
                </h3>
                <span className="text-xs text-zinc-400 dark:text-zinc-500">{experiment.year}</span>
            </div>

            {/* Description */}
            <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">
                {experiment.description}
            </p>
        </Link>
    );
};
