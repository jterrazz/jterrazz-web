'use client';

import React from 'react';

import { ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// Domain
import { type Experiment, ExperimentStatus } from '../../../domain/experiment';

// Utils
import { cn } from '../../../lib/utils';

import { Badge, BadgeColor } from '../../atoms/status/badge';

export const experimentStatusToStatusBadgeState = (status: ExperimentStatus): BadgeColor => {
    switch (status) {
        case ExperimentStatus.Active:
            return BadgeColor.Green;
        case ExperimentStatus.Building:
            return BadgeColor.Blue;
        case ExperimentStatus.Concept:
            return BadgeColor.Orange;
        default:
            return BadgeColor.Gray;
    }
};

export type FeaturedExperimentCardProps = {
    className?: string;
    experiment: Experiment;
};

export const FeaturedExperimentCard: React.FC<FeaturedExperimentCardProps> = ({
    className,
    experiment,
}) => {
    const technologies = Array.from(
        new Set(experiment.components.flatMap((c) => c.technologies)),
    );

    return (
        <Link
            className={cn(
                'group block relative h-full overflow-hidden rounded-3xl transition-all duration-500',
                'bg-zinc-50 dark:bg-zinc-900',
                'border border-zinc-200 dark:border-zinc-800',
                'hover:border-zinc-300 dark:hover:border-zinc-700',
                'hover:shadow-2xl hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50',
                className,
            )}
            href={`/experiments/${experiment.slug}`}
        >
            {/* Background Texture/Gradient */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-zinc-100/50 via-transparent to-transparent dark:from-zinc-800/20" />

            <div className="relative p-8 md:p-10 flex flex-col h-full z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <Badge
                                color={experimentStatusToStatusBadgeState(experiment.status)}
                                value={experiment.status}
                            />
                            <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                                {experiment.year}
                            </span>
                        </div>
                        <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors duration-300">
                            {experiment.name}
                        </h3>
                    </div>
                    <div className="p-4 rounded-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 opacity-0 -translate-y-4 translate-x-4 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-500 shadow-lg border border-zinc-100 dark:border-zinc-700">
                        <ArrowRight size={24} />
                    </div>
                </div>

                {/* Description */}
                <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-3xl mb-12 font-light">
                    {experiment.description}
                </p>

                {/* Footer / Tech Stack */}
                <div className="mt-auto pt-8 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        {technologies.slice(0, 4).map((tech) => (
                            <span
                                className="px-3 py-1.5 text-xs font-medium font-mono rounded-lg bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 shadow-sm"
                                key={tech}
                            >
                                {tech}
                            </span>
                        ))}
                        {technologies.length > 4 && (
                            <span className="px-3 py-1.5 text-xs font-medium font-mono rounded-lg bg-transparent text-zinc-400 dark:text-zinc-600">
                                +{technologies.length - 4}
                            </span>
                        )}
                    </div>

                    {/* Direct Link (Optional) */}
                    {experiment.url && (
                        <div
                            className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors z-20 cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open(experiment.url?.toString(), '_blank');
                            }}
                        >
                            <span>Live</span>
                            <ExternalLink size={16} />
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};
