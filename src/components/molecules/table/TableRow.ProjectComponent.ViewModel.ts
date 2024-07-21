import { ProjectStatus } from '../../../domain/project/project.js';

import { DotPulseState } from '../../atoms/status/DotPulse.jsx';

export const projectComponentStatusToDoPulseState = (status: ProjectStatus): DotPulseState => {
    switch (status) {
        case ProjectStatus.Active:
            return DotPulseState.Success;
        case ProjectStatus.Building:
        case ProjectStatus.Concept:
            return DotPulseState.Warning;
        case ProjectStatus.Archived:
        default:
            return DotPulseState.Disabled;
    }
};

export const projectStatusToDescription = (status: ProjectStatus): string => {
    switch (status) {
        case ProjectStatus.Active:
            return 'The project is currently active and available.';
        case ProjectStatus.Building:
            return 'The project is currently being build and will release soon.';
        case ProjectStatus.Concept:
            return 'The project is currently in concept and will be build soon.';
        case ProjectStatus.Archived:
            return 'The project is archived and not available anymore.';
    }
};
