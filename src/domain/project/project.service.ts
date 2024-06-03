import { Photograph } from '../photograph.ts.js';
import { Project } from '../project.ts.js';

export class ProjectService {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly photographRepository: PhotographRepository,
        private readonly contactRepository: ContactRepository,
    ) {}

    public async getProjects(): Promise<Project[]> {
        return [
            {
                description: 'This is the first project',
                name: 'Project 1',
            },
            {
                description: 'This is the second project',
                name: 'Project 2',
            },
            {
                description: 'This is the third project',
                name: 'Project 3',
            },
        ];
    }

    public async getContacts(): Promise<{ name: string; href: string }[]> {
        return [
            {
                href: '/',
                name: 'X',
            },
            {
                href: '/',
                name: 'GitHub',
            },
            {
                href: '/',
                name: 'Pexels',
            },
            {
                href: '/',
                name: 'LinkedIn',
            },
        ];
    }

    public async getPhotographs(): Promise<Photograph[]> {
        return [
            {
                description: 'This is the first photograph',
                name: 'Photograph 1',
            },
            {
                description: 'This is the second photograph',
                name: 'Photograph 2',
            },
            {
                description: 'This is the third photograph',
                name: 'Photograph 3',
            },
        ];
    }
}
