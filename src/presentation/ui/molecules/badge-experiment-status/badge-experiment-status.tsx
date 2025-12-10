import React from 'react';

// Domain
import { ExperimentStatus } from '../../../../domain/experiment';

// Utils
import { cn } from '../../../utils';

type StatusTranslations = {
    active: string;
    archived: string;
    building: string;
    completed: string;
    concept: string;
};

export type BadgeExperimentStatusProps = {
    className?: string;
    status: ExperimentStatus;
    translations: StatusTranslations;
};

/**
 * Get translated status label
 */
function getStatusLabel(status: ExperimentStatus, translations: StatusTranslations): string {
    switch (status) {
        case ExperimentStatus.Active:
            return translations.active;
        case ExperimentStatus.Archived:
            return translations.archived;
        case ExperimentStatus.Building:
            return translations.building;
        case ExperimentStatus.Completed:
            return translations.completed;
        case ExperimentStatus.Concept:
            return translations.concept;
        default:
            return status;
    }
}

export const BadgeExperimentStatus: React.FC<BadgeExperimentStatusProps> = ({
    className,
    status,
    translations,
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
            <span>{getStatusLabel(status, translations)}</span>
        </div>
    );
};
