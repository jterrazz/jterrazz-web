import { ProjectStatus } from '../../../domain/project/project.js';

import { StatusBadgeState } from '../../atoms/status/Badge.jsx';

export const projectStatusToStatusBadgeState = (status: ProjectStatus): StatusBadgeState => {
    switch (status) {
        case ProjectStatus.Active:
            return StatusBadgeState.Success;
        case ProjectStatus.Building:
        case ProjectStatus.Concept:
            return StatusBadgeState.Warning;
        case ProjectStatus.Archived:
        default:
            return StatusBadgeState.Disabled;
    }
};
