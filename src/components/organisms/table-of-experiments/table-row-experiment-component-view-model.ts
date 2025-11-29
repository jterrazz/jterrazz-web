// Domain
import { ExperimentStatus } from '../../../domain/experiment';

import { DotPulseColor } from '../../atoms/status/dot-pulse';

export const experimentComponentStatusToDoPulseState = (
    status: ExperimentStatus,
): DotPulseColor => {
    switch (status) {
        case ExperimentStatus.Active:
            return DotPulseColor.Green;
        case ExperimentStatus.Archived:
            return DotPulseColor.Black;
        case ExperimentStatus.Building:
        case ExperimentStatus.Concept:
            return DotPulseColor.Blue;
        case ExperimentStatus.Completed:
            return DotPulseColor.Gray;
    }
};

export const experimentStatusToDescription = (status: ExperimentStatus): string => {
    switch (status) {
        case ExperimentStatus.Active:
            return 'The experiment is alive and evolving.';
        case ExperimentStatus.Archived:
            return 'The experiment is archived and not available anymore.';
        case ExperimentStatus.Building:
            return 'The experiment is currently being build and will release soon.';
        case ExperimentStatus.Completed:
            return 'The experiment is completed and available for read-only.';
        case ExperimentStatus.Concept:
            return 'The experiment is currently in concept and will be build soon.';
    }
};
