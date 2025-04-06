export enum ProjectStatus {
    Active = 'active',
    Building = 'building',
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
    // Frontend
    NextJs = 'Next.js',
    React = 'React',
    ReactNative = 'React Native',
    TailwindCSS = 'TailwindCSS',
    Sass = 'Sass',

    // Backend
    NodeJs = 'Node.js',
    Express = 'Express',
    Hono = 'Hono',
    Prisma = 'Prisma',
    Koa = 'Koa',

    // Languages
    C = 'C',
    Assembly = 'Assembly',
    Python = 'Python',

    // TypeScript
    Typescript = 'Typescript',

    // Database
    Postgres = 'Postgres',
    MongoDB = 'MongoDB',
    Sqlite = 'SQLite',

    // Tools
    Radare2 = 'Radare2',
    Gdb = 'GDB',
}

export enum ProjectArchitecture {
    // Code Architectures
    Clean = 'Clean Architecture',
    Hexagonal = 'Hexagonal Architecture',
    DomainInfrastructure = 'Domain/Infrastructure Architecture',
    Atomic = 'Atomic Design',

    // Design Systems
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
