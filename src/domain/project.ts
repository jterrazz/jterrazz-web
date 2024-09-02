export enum ProjectStatus {
    Alive = 'alive',
    InProgress = 'in progress',
    Concept = 'concept',
    Completed = 'completed',
    Archived = 'archived',
}

export enum ProjectCategory {
    Application = 'application',
    Photography = 'photography',
    Writing = 'writing',
}

export enum ProjectTechnology {
    NextJs = 'Next.js',
    React = 'React',
    ReactNative = 'React Native',
    TailwindCSS = 'TailwindCSS',
    Sass = 'Sass',
    NodeJs = 'Node.js',
    Express = 'Express',
    Prisma = 'Prisma',
    Postgres = 'Postgres',
    C = 'C',
    Assembly = 'Assembly',
    Python = 'Python',
    Koa = 'Koa',
    TypeScript = 'TypeScript',
    MongoDB = 'MongoDB',
    Radare2 = 'Radare2',
    Gdb = 'GDB',
}

export enum ProjectArchitecture {
    // Code Architecture
    Clean = 'Clean Architecture',
    Atomic = 'Atomic Design',

    // Design System
    Spectrum = "Spectrum (Adobe's Design System)",
}

export type ProjectComponent = {
    name: string;
    description: string;
    sourceUrl: URL;
    status: ProjectStatus;
    architectures: Array<ProjectArchitecture>;
    technologies: Array<ProjectTechnology>;
    articleUrl?: URL;
};

export type Project = {
    index: number;
    name: string;
    description: string;
    url: URL;
    type: ProjectCategory;
    status: ProjectStatus;
    createdAt?: Date;
    components: Array<ProjectComponent>;
};

export interface ProjectRepository {
    getProjects(): Project[];
    getProjectByIndex(index: string): Project | undefined;
}
