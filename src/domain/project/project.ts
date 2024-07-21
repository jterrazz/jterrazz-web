export enum ProjectStatus {
    Active = 'active',
    Building = 'building',
    Concept = 'concept',
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
    TailwindCSS = 'TailwindCSS',
    Sass = 'Sass',
    NodeJs = 'Node.js',
    Express = 'Express',
    Prisma = 'Prisma',
    Postgres = 'Postgres',
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
    id: number;
    name: string;
    description: string;
    url: URL;
    type: ProjectCategory;
    status: ProjectStatus;
    createdAt?: Date;
    components: Array<ProjectComponent>;
};
