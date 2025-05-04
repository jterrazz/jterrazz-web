import { type Project, type ProjectRepository } from '../../domain/project.js';

import { projectsData } from './data/projects.data.js';

export class ProjectInMemoryRepository implements ProjectRepository {
    private readonly projectsData: Project[];

    constructor() {
        this.projectsData = projectsData;
    }

    getProjectByIndex(index: string) {
        return this.projectsData.find((project) => String(project.index) === index);
    }

    getProjects() {
        return this.projectsData;
    }
}
