import { Project } from './project.js';

export interface ProjectRepository {
    getProjects(): Project[];
}
