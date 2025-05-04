import { ProjectStatus } from '../../../domain/project.js';

import { DotPulseColor } from '../../atoms/status/dot-pulse.js';

export const projectComponentStatusToDoPulseState = (status: ProjectStatus): DotPulseColor => {
    switch (status) {
        case ProjectStatus.Active:
            return DotPulseColor.Green;
        case ProjectStatus.Archived:
            return DotPulseColor.Black;
        case ProjectStatus.Building:
        case ProjectStatus.Concept:
            return DotPulseColor.Blue;
        case ProjectStatus.Completed:
            return DotPulseColor.Gray;
    }
};

export const projectStatusToDescription = (status: ProjectStatus): string => {
    switch (status) {
        case ProjectStatus.Active:
            return 'The project is alive and evolving.';
        case ProjectStatus.Archived:
            return 'The project is archived and not available anymore.';
        case ProjectStatus.Building:
            return 'The project is currently being build and will release soon.';
        case ProjectStatus.Completed:
            return 'The project is completed and available for read-only.';
        case ProjectStatus.Concept:
            return 'The project is currently in concept and will be build soon.';
    }
};
