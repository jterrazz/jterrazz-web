import React from 'react';

// Domain
import { ExperimentStatus } from '../../../../domain/experiment';

// Utils
import { cn } from '../../../utils';

export type BadgeExperimentStatusProps = {
    className?: string;
    status: ExperimentStatus;
};

export const BadgeExperimentStatus: React.FC<BadgeExperimentStatusProps> = ({
    className,
    status,
}) => {
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
                'flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-xs font-medium text-zinc-900 dark:text-zinc-100 shadow-sm',
                className,
            )}
        >
            <div className={cn('w-1.5 h-1.5 rounded-full', getStatusDotColor(status))} />
            <span>{status}</span>
        </div>
    );
};
