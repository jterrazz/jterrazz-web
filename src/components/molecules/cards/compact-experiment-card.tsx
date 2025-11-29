'use client';

import React from 'react';

import { Github } from 'lucide-react';
import Link from 'next/link';

// Domain
import { type Experiment } from '../../../domain/experiment';

// Utils
import { cn } from '../../../lib/utils';

export type CompactExperimentCardProps = {
    className?: string;
    experiment: Experiment;
};

export const CompactExperimentCard: React.FC<CompactExperimentCardProps> = ({
    className,
    experiment,
}) => {
    const technologies = Array.from(
        new Set(experiment.components.flatMap((c) => c.technologies)),
    );

    return (
        <Link
            className={cn(
                'group flex flex-col p-6 rounded-2xl transition-all duration-300',
                'bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm',
                'border border-zinc-200/60 dark:border-zinc-800/60',
                'hover:bg-white dark:hover:bg-zinc-900',
                'hover:border-zinc-300 dark:hover:border-zinc-700',
                'hover:shadow-xl hover:shadow-zinc-200/40 dark:hover:shadow-zinc-900/40 hover:-translate-y-1',
                className,
            )}
            href={`/experiments/${experiment.slug}`}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                    {experiment.name}
                </h3>
                {experiment.url && (
                    <div
                        className="text-zinc-300 group-hover:text-zinc-900 dark:text-zinc-600 dark:group-hover:text-zinc-100 transition-colors"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(experiment.url?.toString(), '_blank');
                        }}
                    >
                        <Github size={18} />
                    </div>
                )}
            </div>

            {/* Description */}
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 mb-6 flex-1 font-normal">
                {experiment.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                <div className="flex items-center gap-2 overflow-hidden">
                    {technologies.slice(0, 3).map((tech) => (
                        <div className="flex items-center gap-1.5" key={tech}>
                            <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                            <span className="text-[10px] font-mono font-medium text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                                {tech}
                            </span>
                        </div>
                    ))}
                </div>
                <span className="text-[10px] font-mono text-zinc-300 dark:text-zinc-600 shrink-0 ml-2 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors">
                    {experiment.year}
                </span>
            </div>
        </Link>
    );
};
