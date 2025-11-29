'use client';

import React, { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, GraduationCap, Plus, ArrowUpRight, MapPin, Building2 } from 'lucide-react';
import Link from 'next/link';

// Domain
import { type UserExperience } from '../../../domain/user';

// Utils
import { cn } from '../../../lib/utils';

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
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            className={cn('relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16', className)}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            viewport={{ margin: '-50px', once: true }}
            whileInView={{ opacity: 1, y: 0 }}
        >
            {/* Center Node (Desktop) */}
            <div className="hidden md:flex absolute left-1/2 top-8 -translate-x-1/2 items-center justify-center z-10">
                <div
                    className={cn(
                        'w-10 h-10 rounded-full border-4 bg-white dark:bg-zinc-900 flex items-center justify-center transition-all duration-300',
                        isCurrent
                            ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 scale-110'
                            : 'border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 group-hover:border-zinc-300 dark:group-hover:border-zinc-700 group-hover:text-zinc-600 dark:group-hover:text-zinc-400',
                    )}
                >
                    {experience.type === 'School' ? (
                        <GraduationCap size={16} />
                    ) : (
                        <Briefcase size={16} />
                    )}
                </div>
            </div>

            {/* Mobile Node (Left) */}
            <div className="md:hidden absolute left-6 top-8 -translate-x-1/2 z-10">
                <div
                    className={cn(
                        'w-10 h-10 rounded-full border-4 bg-white dark:bg-zinc-900 flex items-center justify-center transition-all duration-300',
                        isCurrent
                            ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100'
                            : 'border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600',
                    )}
                >
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
                    'pl-16', // Mobile padding for all items to make room for the line/dot on left
                    isEven 
                        ? 'md:text-right md:pr-16 md:pl-0' 
                        : 'md:col-start-2 md:pl-16 md:text-left',
                )}
            >
                {/* Connector Line (Desktop) */}
                <div
                    className={cn(
                        'hidden md:block absolute top-[3.25rem] h-px bg-zinc-200 dark:bg-zinc-800 w-24 transition-colors duration-300 group-hover:bg-zinc-300 dark:group-hover:bg-zinc-700',
                        // Line connects the content card (inset by 4rem padding) to the center spine area (offset by 2rem gap)
                        // Total span needed = 4rem + 2rem = 6rem (24 tailwind units)
                        isEven ? '-right-8' : '-left-8',
                    )}
                />

                {/* Connector Line (Mobile) */}
                <div className="md:hidden absolute left-10 top-12 h-px bg-zinc-200 dark:bg-zinc-800 w-6 transition-colors duration-300 group-hover:bg-zinc-300 dark:group-hover:bg-zinc-700" />

                {/* Date - Floating Title Style */}
                <div
                    className={cn(
                        'text-xs font-bold tracking-widest uppercase text-zinc-400 mb-4',
                        // On desktop, position date closer to the spine
                        isEven ? 'md:order-last' : '',
                    )}
                >
                    {experience.timeframe}
                </div>

                {/* Main Content - Minimal Card */}
                <motion.div
                    className={cn(
                        'relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer group/card overflow-hidden text-left',
                        isOpen 
                            ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 shadow-xl ring-1 ring-zinc-200 dark:ring-zinc-800' 
                            : 'bg-white/50 dark:bg-zinc-900/50 border-zinc-200/50 dark:border-zinc-800/50 hover:bg-white dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg hover:-translate-y-1'
                    )}
                    layout
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex flex-col gap-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="w-full">
                                <div className="flex items-center justify-between w-full mb-2">
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                                        {experience.title}
                                    </h3>
                                    <motion.div
                                        animate={{ 
                                            rotate: isOpen ? 45 : 0,
                                            backgroundColor: isOpen ? 'rgba(24, 24, 27, 0.1)' : 'rgba(24, 24, 27, 0)'
                                        }}
                                        className="p-1.5 rounded-full text-zinc-400 group-hover/card:text-zinc-900 dark:group-hover/card:text-zinc-100 transition-colors"
                                    >
                                        <Plus size={18} />
                                    </motion.div>
                                </div>
                                
                                <div
                                    className={cn(
                                        'flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400',
                                        // Removed text alignment classes to keep everything left-aligned
                                        'justify-start'
                                    )}
                                >
                                    <Link
                                        className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors group/link"
                                        href={experience.organizationUrl}
                                        onClick={(e) => e.stopPropagation()}
                                        target="_blank"
                                    >
                                        <Building2 size={14} className="text-zinc-400 group-hover/link:text-zinc-600 dark:text-zinc-500 dark:group-hover/link:text-zinc-400" />
                                        <span className="font-medium">{experience.organization}</span>
                                    </Link>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={14} className="text-zinc-400 dark:text-zinc-500" />
                                        <span>{experience.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    initial={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                >
                                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-2">
                                        {experience.description && (
                                            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                                                {experience.description}
                                            </p>
                                        )}

                                        {/* Experiment Link */}
                                        {experience.experimentUrl && (
                                            <div className="mt-4 flex justify-end">
                                                <Link
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold uppercase tracking-wider hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-all shadow-sm hover:shadow-md"
                                                    href={experience.experimentUrl}
                                                    onClick={(e) => e.stopPropagation()}
                                                    target="_blank"
                                                >
                                                    View Experiment
                                                    <ArrowUpRight size={14} />
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};
