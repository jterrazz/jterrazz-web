'use client';

import React from 'react';

import { motion } from 'framer-motion';
import { Briefcase, GraduationCap } from 'lucide-react';
import Link from 'next/link';

// Domain
import { type UserExperience } from '../../../domain/user.js';

// Utils
import { cn } from '../../../lib/utils.js';

export type TimelineEventProps = {
    className?: string;
    experience: UserExperience;
    index: number;
};

export const TimelineExperience: React.FC<TimelineEventProps> = ({
    className,
    experience,
    index,
}) => {
    const isCurrent = index === 0;
    const isEven = index % 2 === 0;

    return (
        <motion.div
            className={cn('relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16', className)}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ margin: '-50px', once: true }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            {/* Center Node (Desktop) */}
            <div className="hidden md:flex absolute left-1/2 top-8 -translate-x-1/2 items-center justify-center z-10">
                <div className={cn(
                    'w-10 h-10 rounded-full border-4 bg-white dark:bg-zinc-900 flex items-center justify-center transition-all duration-300',
                    isCurrent
                        ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 scale-110'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 group-hover:border-zinc-300 dark:group-hover:border-zinc-700 group-hover:text-zinc-600 dark:group-hover:text-zinc-400'
                )}>
                    {experience.type === 'School' ? (
                        <GraduationCap size={16} />
                    ) : (
                        <Briefcase size={16} />
                    )}
                </div>
            </div>

            {/* Mobile Node (Left) */}
            <div className="md:hidden absolute left-6 top-8 -translate-x-1/2 z-10">
                <div className={cn(
                    'w-10 h-10 rounded-full border-4 bg-white dark:bg-zinc-900 flex items-center justify-center transition-all duration-300',
                    isCurrent
                        ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600'
                )}>
                    {experience.type === 'School' ? (
                        <GraduationCap size={16} />
                    ) : (
                        <Briefcase size={16} />
                    )}
                </div>
            </div>

            {/* Content Container */}
            <div
                className={cn(
                    'relative group',
                    isEven
                        ? 'md:text-right md:pr-16'
                        : 'md:col-start-2 md:pl-16 md:text-left',
                    'pl-16 md:pl-0', // Mobile padding
                )}
            >
                {/* Connector Line (Desktop) */}
                <div className={cn(
                    "hidden md:block absolute top-12 h-px bg-zinc-200 dark:bg-zinc-800 w-16 transition-colors duration-300 group-hover:bg-zinc-300 dark:group-hover:bg-zinc-700",
                    isEven ? "right-0" : "left-0"
                )} />

                {/* Connector Line (Mobile) */}
                <div className="md:hidden absolute left-10 top-12 h-px bg-zinc-200 dark:bg-zinc-800 w-6 transition-colors duration-300 group-hover:bg-zinc-300 dark:group-hover:bg-zinc-700" />

                {/* Date - Floating Title Style */}
                <div className={cn(
                    "text-xs font-bold tracking-widest uppercase text-zinc-400 mb-4",
                    // On desktop, position date closer to the spine
                    isEven ? "md:order-last" : "" 
                )}>
                    {experience.timeframe}
                </div>

                {/* Main Content - Minimal Card */}
                <div className="relative p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 transition-all duration-300 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-lg hover:shadow-zinc-200/10 dark:hover:shadow-zinc-900/20 hover:-translate-y-0.5">
                    <div className="flex flex-col gap-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="w-full">
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                    {experience.title}
                                </h3>
                                <div className={cn(
                                    "flex items-center gap-2 mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400",
                                    isEven ? "md:justify-end" : "md:justify-start"
                                )}>
                                    <Link
                                        className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                                        href={experience.organizationUrl}
                                        target="_blank"
                                    >
                                        {experience.organization}
                                    </Link>
                                    <span>•</span>
                                    <span>{experience.location}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {experience.description && (
                            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                                {experience.description}
                            </p>
                        )}

                        {/* Project Link */}
                        {experience.projectUrl && (
                            <Link
                                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors mt-1"
                                href={experience.projectUrl}
                                target="_blank"
                            >
                                View Project
                                <span className="text-lg leading-none">→</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
