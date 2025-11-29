import React from 'react';

import { ExperimentStatus } from '../../../domain/experiment';
import { cn } from '../../../lib/utils';

export type ExperimentStatusBadgeProps = {
    className?: string;
    status: ExperimentStatus;
};

export const ExperimentStatusBadge: React.FC<ExperimentStatusBadgeProps> = ({ className, status }) => {
    const getStatusDotColor = (status: ExperimentStatus) => {
        switch (status) {
            case ExperimentStatus.Active:
                return 'bg-emerald-500';
            case ExperimentStatus.Building:
                return 'bg-blue-500';
            case ExperimentStatus.Concept:
                return 'bg-amber-500';
            default:
                return 'bg-zinc-500';
        }
    };

    return (
        <div
            className={cn(
                'flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 shadow-sm',
                className,
            )}
        >
            <div
                className={cn(
                    'w-1.5 h-1.5 rounded-full animate-pulse',
                    getStatusDotColor(status),
                )}
            />
            <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
                {status}
            </span>
        </div>
    );
};

