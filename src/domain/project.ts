export enum ProjectArchitecture {
    Atomic = 'Atomic Design',
    // Code Architectures
    Clean = 'Clean Architecture',
    DomainInfrastructure = 'Domain/Infrastructure Architecture',
    Hexagonal = 'Hexagonal Architecture',

    // Design Systems
    Spectrum = "Spectrum (Adobe's Design System)",
}

export enum ProjectCategory {
    Application = 'application',
    Photography = 'photography',
    Writing = 'writing',
}

export enum ProjectStatus {
    Active = 'active',
    Archived = 'archived',
    Building = 'building',
    Completed = 'completed',
    Concept = 'concept',
}

export enum ProjectTechnology {
    Assembly = 'Assembly',
    // Languages
    C = 'C',
    Express = 'Express',
    Gdb = 'GDB',
    Hono = 'Hono',

    Koa = 'Koa',
    MongoDB = 'MongoDB',
    // Frontend
    NextJs = 'Next.js',
    // Backend
    NodeJs = 'Node.js',
    // Database
    Postgres = 'Postgres',

    Prisma = 'Prisma',
    Python = 'Python',
    // Tools
    Radare2 = 'Radare2',

    React = 'React',

    ReactNative = 'React Native',
    Sass = 'Sass',
    Sqlite = 'SQLite',

    TailwindCSS = 'TailwindCSS',
    // TypeScript
    Typescript = 'Typescript',
}

export type Project = {
    components: Array<ProjectComponent>;
    createdAt?: Date;
    description: string;
    index: number;
    name: string;
    status: ProjectStatus;
    type: ProjectCategory;
    url: URL;
};

export type ProjectComponent = {
    architectures: Array<ProjectArchitecture>;
    articleUrl?: URL;
    description: string;
    name: string;
    sourceUrl: URL;
    status: ProjectStatus;
    technologies: Array<ProjectTechnology>;
};

export interface ProjectRepository {
    getProjectByIndex(index: string): Project | undefined;
    getProjects(): Project[];
}
