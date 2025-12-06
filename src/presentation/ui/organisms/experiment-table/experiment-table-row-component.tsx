import React from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Github } from 'lucide-react';

// Domain
import { type ExperimentComponent } from '../../../../domain/experiment';

// Utils
import { cn } from '../../../utils';

import { Badge, BadgeColor, DotPulseSize } from '../../atoms/badge/badge';
import { PulseDot } from '../../atoms/pulse-dot/pulse-dot';

import {
    experimentComponentStatusToPulseDotColor,
    experimentStatusToDescription,
} from './experiment-table-row-component-view-model';

type ExperimentTableRowComponentProps = {
    className?: string;
    component: ExperimentComponent;
};

export const ExperimentTableRowComponent: React.FC<ExperimentTableRowComponentProps> = ({
    className,
    component,
}) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const allTags = [...component.architectures];
    const visibleTags = allTags.slice(0, 2);
    const hiddenTagsCount = allTags.length - 2;

    return (
        <div
            className={cn(
                'flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50',
                className,
            )}
        >
            {/* Main Card Content - Clickable Area */}
            <div
                className="p-5 flex flex-col h-full cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsExpanded(!isExpanded);
                    }
                }}
                // biome-ignore lint/a11y/useSemanticElements: Using div for complex card layout
                role="button"
                tabIndex={0}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                        {component.name}
                    </h3>
                    <PulseDot color={experimentComponentStatusToPulseDotColor(component.status)} />
                </div>

                {/* Short Description (truncated) */}
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4 line-clamp-2">
                    {component.description}
                </p>

                {/* Mini Footer */}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/50">
                    {/* Quick Tags Preview */}
                    <div className="flex items-center gap-1.5">
                        {visibleTags.map((tag) => (
                            <span
                                className="inline-block px-2 py-0.5 text-[10px] font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 rounded-full"
                                key={tag}
                            >
                                {tag}
                            </span>
                        ))}
                        {hiddenTagsCount > 0 && (
                            <span className="text-[10px] text-zinc-400 font-medium ml-1">
                                +{hiddenTagsCount}
                            </span>
                        )}
                    </div>

                    {/* Expand Toggle */}
                    <button
                        aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                        className="p-1.5 -mr-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                        onClick={() => setIsExpanded(!isExpanded)}
                        type="button"
                    >
                        <ChevronDown
                            className={cn('w-4 h-4 transition-transform duration-300', {
                                'rotate-180': isExpanded,
                            })}
                        />
                    </button>
                </div>
            </div>

            {/* Expanded Details Section */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        animate={{ height: 'auto', opacity: 1 }}
                        className="overflow-hidden border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-b-2xl"
                        exit={{ height: 0, opacity: 0 }}
                        initial={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                        <div className="p-5 space-y-5">
                            {/* Full Description */}
                            <div>
                                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">
                                    About
                                </span>
                                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                    {component.description}
                                </p>
                            </div>

                            {/* Full Tech Stack */}
                            {allTags.length > 0 && (
                                <div>
                                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">
                                        Architecture
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {allTags.map((tag) => (
                                            <Badge
                                                color={BadgeColor.Gray}
                                                filled={false}
                                                key={tag}
                                                size={DotPulseSize.Small}
                                                value={tag}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <a
                                    className={cn(
                                        'flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all shadow-sm border',
                                        'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent hover:bg-zinc-800 dark:hover:bg-zinc-200',
                                    )}
                                    href={component.sourceUrl.toString()}
                                    rel="noreferrer"
                                    target="_blank"
                                    title={experimentStatusToDescription(component.status)}
                                >
                                    <Github size={16} />
                                    View Source
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
