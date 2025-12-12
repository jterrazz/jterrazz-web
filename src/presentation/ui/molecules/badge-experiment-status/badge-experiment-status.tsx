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
    const getStatusStyles = (status: ExperimentStatus) => {
        switch (status) {
            case ExperimentStatus.Active:
                return {
                    dot: 'bg-emerald-500',
                    label: 'Active',
                    text: 'text-emerald-600 dark:text-emerald-400',
                };
            case ExperimentStatus.Building:
                return {
                    dot: 'bg-blue-500',
                    label: 'Building',
                    text: 'text-blue-600 dark:text-blue-400',
                };
            case ExperimentStatus.Concept:
                return {
                    dot: 'bg-amber-500',
                    label: 'Concept',
                    text: 'text-amber-600 dark:text-amber-400',
                };
            default:
                return null;
        }
    };

    const styles = getStatusStyles(status);

    if (!styles) return null;

    return (
        <span className={cn('inline-flex items-baseline gap-1.5', className)}>
            <span
                className={cn('w-1.5 h-1.5 rounded-full shrink-0 translate-y-[-1px]', styles.dot)}
            />
            <span className={cn('text-xs', styles.text)}>{styles.label}</span>
        </span>
    );
};
