import { ExperimentStatus } from '../../../../domain/experiment';

import { PulseDotColor } from '../../atoms/pulse-dot/pulse-dot';

export const experimentComponentStatusToPulseDotColor = (
    status: ExperimentStatus,
): PulseDotColor => {
    switch (status) {
        case ExperimentStatus.Active:
            return PulseDotColor.Green;
        case ExperimentStatus.Archived:
            return PulseDotColor.Black;
        case ExperimentStatus.Building:
        case ExperimentStatus.Concept:
            return PulseDotColor.Blue;
        case ExperimentStatus.Completed:
            return PulseDotColor.Gray;
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
