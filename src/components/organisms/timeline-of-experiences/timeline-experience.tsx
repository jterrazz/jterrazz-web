'use client';

import React from 'react';

import { motion } from 'framer-motion';
import { Briefcase, Building2, Calendar, GraduationCap, MapPin } from 'lucide-react';
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
            className={cn('relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0', className)}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ margin: '-50px', once: true }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            {/* Center Node (Desktop) */}
            <div className="hidden md:flex absolute left-1/2 top-8 -translate-x-1/2 items-center justify-center z-10">
                <div
                    className={cn(
                        'relative flex items-center justify-center w-12 h-12 rounded-full border-4 transition-all duration-300',
                        'bg-white dark:bg-zinc-950',
                        isCurrent
                            ? 'border-zinc-900 dark:border-zinc-100 shadow-xl'
                            : 'border-zinc-100 dark:border-zinc-800 text-zinc-300 dark:text-zinc-600',
                    )}
                >
                    {experience.type === 'School' ? (
                        <GraduationCap
                            size={20}
                            className={cn(
                                isCurrent
                                    ? 'text-zinc-900 dark:text-zinc-100'
                                    : 'text-zinc-400 dark:text-zinc-500',
                            )}
                        />
                    ) : (
                        <Briefcase
                            size={20}
                            className={cn(
                                isCurrent
                                    ? 'text-zinc-900 dark:text-zinc-100'
                                    : 'text-zinc-400 dark:text-zinc-500',
                            )}
                        />
                    )}
                </div>
            </div>

            {/* Mobile Node (Left) */}
            <div className="md:hidden absolute left-6 top-0 -translate-x-1/2 flex flex-col items-center h-full z-10">
                <div
                    className={cn(
                        'relative flex items-center justify-center w-10 h-10 rounded-full border-4 bg-white dark:bg-zinc-950 transition-all',
                        isCurrent
                            ? 'border-zinc-900 dark:border-zinc-100'
                            : 'border-zinc-100 dark:border-zinc-800',
                    )}
                >
                    {experience.type === 'School' ? (
                        <GraduationCap size={16} className="text-zinc-500" />
                    ) : (
                        <Briefcase size={16} className="text-zinc-500" />
                    )}
                </div>
            </div>

            {/* Card & Connector Container */}
            <div
                className={cn(
                    'relative flex items-center pl-16',
                    isEven
                        ? 'md:pr-16 md:pl-0 md:justify-end'
                        : 'md:col-start-2 md:pl-16 md:justify-start',
                )}
            >
                {/* Desktop Connector Line */}
                <div
                    className={cn(
                        'hidden md:block absolute top-14 h-px bg-zinc-200 dark:bg-zinc-800 w-16',
                        isEven ? 'right-0' : 'left-0',
                    )}
                />

                {/* Content Card */}
                <div className="group w-full">
                    {/* Date Badge - Floating above card on desktop for cleaner alignment */}
                    <div
                        className={cn(
                            'flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-zinc-400 mb-3',
                            isEven ? 'md:flex-row-reverse' : 'md:flex-row',
                        )}
                    >
                        <span className="bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-md">
                            {experience.timeframe}
                        </span>
                    </div>

                    <div
                        className={cn(
                            'relative p-6 rounded-2xl border transition-all duration-300',
                            'bg-white dark:bg-zinc-900',
                            'border-zinc-200 dark:border-zinc-800',
                            'hover:border-zinc-300 dark:hover:border-zinc-700',
                            'hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50',
                            isCurrent && 'ring-1 ring-zinc-900/5 dark:ring-zinc-100/10',
                        )}
                    >
                        {/* Header */}
                        <div className="flex flex-col gap-1 mb-4">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                                {experience.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
                                <Link
                                    className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors font-medium"
                                    href={experience.organizationUrl}
                                    target="_blank"
                                >
                                    <Building2 size={14} />
                                    {experience.organization}
                                </Link>
                                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={14} />
                                    {experience.location}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        {experience.description && (
                            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                                    {experience.description}
                                </p>

                                {experience.projectUrl && (
                                    <div className="mt-4">
                                        <Link
                                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-zinc-900 dark:text-zinc-100 hover:underline decoration-zinc-400 underline-offset-4 transition-all"
                                            href={experience.projectUrl}
                                            target="_blank"
                                        >
                                            View Project
                                            <span className="text-lg leading-none">→</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
