export enum ProjectStatus {
    InProgress = 'in-progress',
    Active = 'active',
    Archived = 'archived',
    Planned = 'planned',
}

export enum ProjectType {
    Application = 'application',
    Photography = 'photography',
}

export enum ProjectComponentTechnology {
    NextJs = 'Next.js',
    React = 'React',
    TailwindCSS = 'TailwindCSS',
    NodeJs = 'Node.js',
    Express = 'Express',
    Prisma = 'Prisma',
    Postgres = 'Postgres',
}

export enum ProjectComponentArchitecture {
    Clean = 'Clean Architecture',
    Atomic = 'Atomic Design',
}

export enum ProjectComponentType {
    Client = 'client',
    Server = 'server',
}

export type ProjectComponent = {
    name: string;
    description: string;
    sourceCodeUrl: string;
    type: ProjectComponentType;
    status: ProjectStatus;
    architectures?: Array<ProjectComponentArchitecture>;
    technologies: Array<ProjectComponentTechnology>;
};

export type Project = {
    id: number;
    name: string;
    description: string;
    url: string;
    type: ProjectType;
    status: ProjectStatus;
    createdAt: Date;
    priority?: number;
    components?: Array<ProjectComponent>;
};
