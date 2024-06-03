import {
    Project,
    ProjectComponentArchitecture,
    ProjectComponentTechnology,
    ProjectComponentType,
    ProjectStatus,
    ProjectType,
} from '../../domain/project/project.js';

export const getProjects = (): Project[] => [
    {
        createdAt: new Date('2024-06-01'),
        description:
            'A personal portfolio website showcasing my development projects, photography, and articles.',
        id: 0,
        name: 'Jterrazz',
        priority: 1,
        status: ProjectStatus.Active,
        type: ProjectType.Application,
        url: 'https://jterrazz.com',
    },
    {
        components: [
            {
                architectures: [
                    ProjectComponentArchitecture.Atomic,
                    ProjectComponentArchitecture.Clean,
                ],
                description:
                    'A next.js website with server side rendering for mobile and desktop browsers. Built with clean architecture and atomic design principles.',

                name: 'Client - Website',
                sourceCodeUrl: '', // TODO
                status: ProjectStatus.Active,
                technologies: [
                    ProjectComponentTechnology.NextJs,
                    ProjectComponentTechnology.React,
                    ProjectComponentTechnology.TailwindCSS,
                ],
                type: ProjectComponentType.Client,
            },
            {
                architectures: [ProjectComponentArchitecture.Clean],
                description:
                    'A typescript api server with prisma with a postgres database. Built with clean architecture.',
                name: 'Server - API',
                sourceCodeUrl: '',
                status: ProjectStatus.Active,
                technologies: [
                    ProjectComponentTechnology.NodeJs,
                    ProjectComponentTechnology.Express,
                    ProjectComponentTechnology.Prisma,
                    ProjectComponentTechnology.Postgres,
                ], // TODO
                type: ProjectComponentType.Server,
            },
        ],
        createdAt: new Date('2024-06-02'),
        description: 'A day to day copilot for your life.',
        id: 1,
        name: 'Capitaine IO',
        priority: 2,
        status: ProjectStatus.Active,
        type: ProjectType.Application,
        url: 'https://capitaine.io',
    },
    {
        createdAt: new Date('2030-01-01'),
        description:
            'An open marketplace for buying and selling goods, by the community, for the community.',
        id: 2,
        name: 'Open Market',
        priority: 3,
        status: ProjectStatus.Planned,
        type: ProjectType.Application,
        url: 'https://open.mt',
    },
    {
        createdAt: new Date('2024-01-01'),
        description: 'Some configuration packages for my personal projects.',
        id: 3,
        name: 'Typescript Packages',
        priority: 4,
        status: ProjectStatus.Active,
        type: ProjectType.Application,
        url: 'https://npm.js', // TODO
    },
    {
        createdAt: new Date('2020-01-01'),
        description: 'Some projects I did at 42 School.',
        id: 4,
        name: '42 School Projects',
        priority: 5,
        status: ProjectStatus.Active,
        type: ProjectType.Application,
        url: 'https://github.com', // TODO
    },
];
