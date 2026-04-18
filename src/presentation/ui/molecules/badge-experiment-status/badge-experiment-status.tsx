import React from 'react';

// Domain
import { ExperimentStatus } from '../../../../domain/experiment';
import { Tag } from '../../design-system';

export type BadgeExperimentStatusProps = {
    className?: string;
    status: ExperimentStatus;
};

// Thin wrapper around the universal Tag that maps experiment statuses to
// a label. Only renders for "live" statuses — Completed/Archived stay
// silent to keep old entries quiet.
const STATUS_LABELS: Partial<Record<ExperimentStatus, string>> = {
    [ExperimentStatus.Active]: 'Active',
    [ExperimentStatus.Building]: 'Building',
    [ExperimentStatus.Concept]: 'Concept',
};

export const BadgeExperimentStatus: React.FC<BadgeExperimentStatusProps> = ({
    className,
    status,
}) => {
    const label = STATUS_LABELS[status];
    if (!label) return null;
    return <Tag className={className}>{label}</Tag>;
};
