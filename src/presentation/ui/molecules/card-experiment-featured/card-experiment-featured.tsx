'use client';

import { IconFileTextFilled } from '@tabler/icons-react';
import Image from 'next/image';
import React from 'react';

// Domain
import { type Experiment, type ExperimentStatus } from '../../../../domain/experiment';
import { Link } from '../../../../infrastructure/navigation/navigation';
// Utils
import { cn } from '../../../utils';
import { Heading, Lead } from '../../design-system';
import { BadgeExperimentStatus } from '../badge-experiment-status/badge-experiment-status';

type ExperimentCardData = Pick<Experiment, 'name' | 'slug' | 'tagline'> & {
    articleUrl?: null | string;
    iconUrl?: string;
    status: ExperimentStatus;
};

export type CardExperimentFeaturedProps = {
    className?: string;
    experiment: ExperimentCardData;
};

export const CardExperimentFeatured: React.FC<CardExperimentFeaturedProps> = ({
    className,
    experiment,
}) => {
    const hasArticle = Boolean(experiment.articleUrl);
    const hasIcon = Boolean(experiment.iconUrl);

    return (
        <Link
            className={cn('group flex items-center gap-4 py-3', className)}
            href={`/experiments/${experiment.slug}`}
        >
            <div className="min-w-0 flex-1 transition-transform duration-200 group-hover:translate-x-1">
                <div className="flex items-center gap-2 mb-0.5">
                    <Heading
                        as="h3"
                        className="transition-colors group-hover:text-zinc-500 dark:group-hover:text-zinc-400"
                        size="title"
                    >
                        {experiment.name}
                    </Heading>
                    {hasArticle && (
                        <span className="relative shrink-0 group/tooltip">
                            <IconFileTextFilled
                                className="text-zinc-400 dark:text-zinc-500"
                                size={14}
                            />
                            <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-zinc-900 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-10">
                                Article available
                            </span>
                        </span>
                    )}
                </div>
                <Lead className="line-clamp-1" size="sm">
                    {experiment.tagline}
                </Lead>
            </div>
            <BadgeExperimentStatus className="shrink-0" status={experiment.status} />
            {hasIcon && (
                <Image
                    alt={experiment.name}
                    className="rounded-lg shadow-[0_0_6px_rgba(0,0,0,0.04)] shrink-0"
                    height={40}
                    src={experiment.iconUrl!}
                    width={40}
                />
            )}
        </Link>
    );
};
