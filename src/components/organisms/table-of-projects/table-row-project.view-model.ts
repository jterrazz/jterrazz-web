import { ProjectStatus } from '../../../domain/project.js';

import { BadgeColor } from '../../atoms/status/badge.js';

export const projectStatusToStatusBadgeState = (status: ProjectStatus): BadgeColor => {
    switch (status) {
        case ProjectStatus.Active:
            return BadgeColor.Green;
        case ProjectStatus.Building:
            return BadgeColor.Blue;
        case ProjectStatus.Concept:
            return BadgeColor.Orange;
        case ProjectStatus.Archived:
        default:
            return BadgeColor.Gray;
    }
};
