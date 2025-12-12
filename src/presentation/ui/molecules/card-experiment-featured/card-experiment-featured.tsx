'use client';

import React from 'react';

import Image from 'next/image';

import { Link } from '../../../../infrastructure/navigation/navigation';

// Domain
import { type Experiment, type ExperimentStatus } from '../../../../domain/experiment';

// Utils
import { cn } from '../../../utils';

import { BadgeExperimentStatus } from '../badge-experiment-status/badge-experiment-status';

type ExperimentCardData = Pick<Experiment, 'description' | 'name' | 'slug'> & {
    iconUrl?: string;
    status: ExperimentStatus;
};

export type CardExperimentFeaturedProps = {
    className?: string;
    experiment: ExperimentCardData;
    showIcon?: boolean;
};

export const CardExperimentFeatured: React.FC<CardExperimentFeaturedProps> = ({
    className,
    experiment,
    showIcon = false,
}) => {
    return (
        <Link
            className={cn('group flex items-center gap-3 py-3', className)}
            href={`/experiments/${experiment.slug}`}
        >
            {showIcon && experiment.iconUrl && (
                <Image
                    alt={experiment.name}
                    className="rounded-xl ring-1 ring-zinc-200 dark:ring-zinc-700 shrink-0"
                    height={36}
                    src={experiment.iconUrl}
                    width={36}
                />
            )}
            <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:underline underline-offset-4">
                        {experiment.name}
                    </h3>
                    <BadgeExperimentStatus status={experiment.status} />
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">
                    {experiment.description}
                </p>
            </div>
        </Link>
    );
};
