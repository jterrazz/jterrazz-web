import { ExperimentStatus } from '../../../../domain/experiment';

import { BadgeColor } from '../../atoms/status/badge';

export const experimentStatusToStatusBadgeState = (status: ExperimentStatus): BadgeColor => {
    switch (status) {
        case ExperimentStatus.Active:
            return BadgeColor.Green;
        case ExperimentStatus.Building:
            return BadgeColor.Blue;
        case ExperimentStatus.Concept:
            return BadgeColor.Orange;
        default:
            return BadgeColor.Gray;
    }
};
