import { ProjectStatus } from '../../../domain/project.js';

import { BadgeColor } from '../../atoms/status/badge.js';

export const projectStatusToStatusBadgeState = (status: ProjectStatus): BadgeColor => {
    switch (status) {
        case ProjectStatus.Alive:
            return BadgeColor.Green;
        case ProjectStatus.InProgress:
            return BadgeColor.Blue;
        case ProjectStatus.Concept:
            return BadgeColor.Orange;
        case ProjectStatus.Archived:
        default:
            return BadgeColor.Gray;
    }
};
