import { ProjectStatus } from '../../../domain/project.js';

import { DotPulseColor } from '../../atoms/status/dot-pulse.js';

export const projectComponentStatusToDoPulseState = (status: ProjectStatus): DotPulseColor => {
    switch (status) {
        case ProjectStatus.Active:
        case ProjectStatus.Alive:
            return DotPulseColor.Green;
        case ProjectStatus.Building:
        case ProjectStatus.Concept:
            return DotPulseColor.Blue;
        case ProjectStatus.Archived:
            return DotPulseColor.Black;
        case ProjectStatus.Completed:
            return DotPulseColor.Gray;
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
        case ProjectStatus.Alive:
            return 'The project is alive and evolving.';
        case ProjectStatus.Completed:
            return 'The project is completed and available for read-only.';
    }
};