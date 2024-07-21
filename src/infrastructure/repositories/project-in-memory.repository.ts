import {
    Project,
    ProjectArchitecture,
    ProjectCategory,
    ProjectStatus,
    ProjectTechnology,
} from '../../domain/project/project.js';

export const getProjects = (): Project[] => [
    {
        components: [
            {
                architectures: [ProjectArchitecture.Atomic, ProjectArchitecture.Clean],
                description:
                    'A next.js website with server side rendering for mobile and desktop browsers. Built with clean architecture and atomic design principles.',

                name: 'Website',
                sourceUrl: new URL('https://google.com'), // TODO
                status: ProjectStatus.Active,
                technologies: [
                    ProjectTechnology.NextJs,
                    ProjectTechnology.React,
                    ProjectTechnology.TailwindCSS,
                ],
            },
            {
                architectures: [ProjectArchitecture.Clean],
                description:
                    'A typescript api server with prisma with a postgres database. Built with clean architecture.',
                name: 'API',
                sourceUrl: new URL('https://google.com'),
                status: ProjectStatus.Active,
                technologies: [
                    ProjectTechnology.NodeJs,
                    ProjectTechnology.Express,
                    ProjectTechnology.Prisma,
                    ProjectTechnology.Postgres,
                ],
            },
        ],
        createdAt: new Date('2024-06-02'),
        description: 'A day to day copilot for your life.',
        id: 1,
        name: 'Capitaine IO',
        status: ProjectStatus.Building,
        type: ProjectCategory.Application,
        url: new URL('https://capitaine.io'),
    },
    {
        components: [
            {
                architectures: [
                    ProjectArchitecture.Atomic,
                    ProjectArchitecture.Clean,
                    ProjectArchitecture.Spectrum,
                ],
                description:
                    'A next.js website with server side rendering for mobile and desktop browsers.',

                name: 'Website',
                sourceUrl: new URL('https://google.com'), // TODO
                status: ProjectStatus.Active,
                technologies: [
                    ProjectTechnology.NextJs,
                    ProjectTechnology.React,
                    ProjectTechnology.Sass,
                    ProjectTechnology.TailwindCSS,
                ],
            },
        ],
        createdAt: new Date('2024-06-01'),
        description:
            'A personal portfolio website showcasing my development projects, photography, and articles.',
        id: 0,
        name: 'Jterrazz',
        status: ProjectStatus.Active,
        type: ProjectCategory.Application,
        url: new URL('https://jterrazz.com'),
    },
    {
        components: [
            {
                // TODO
                architectures: [],
                description:
                    'A typescript package for http requests with axios and a clean architecture.',
                name: 'Http',
                sourceUrl: new URL('https://google.com'), // TODO
                status: ProjectStatus.Concept, // TODO
                technologies: [ProjectTechnology.NodeJs], // TODO
            },
            {
                architectures: [],
                description:
                    'A typescript package for logging with winston and a clean architecture.',
                // TODO
                name: 'Logger',
                sourceUrl: new URL('https://google.com'), // TODO
                status: ProjectStatus.Active, // TODO
                technologies: [ProjectTechnology.NodeJs], // TODO
            },
            {
                // TODO
                architectures: [],

                description: 'A typescript package for testing with jest and a clean architecture.',

                // TODO
                name: 'Test',
                sourceUrl: new URL('https://google.com'),
                status: ProjectStatus.Active, // TODO
                technologies: [ProjectTechnology.NodeJs], // TODO
            },
            {
                // TODO
                architectures: [],

                description:
                    'A typescript package for quality with eslint and a clean architecture.',

                // TODO
                name: 'Quality',
                sourceUrl: new URL('https://google.com'),
                status: ProjectStatus.Active, // TODO
                technologies: [ProjectTechnology.NodeJs], // TODO
            },
            {
                // TODO
                architectures: [],

                description:
                    'A typescript package for typescript with eslint and a clean architecture.',

                // TODO
                name: 'Typescript',

                sourceUrl: new URL('https://google.com'),
                // TODO
                status: ProjectStatus.Active,
                technologies: [ProjectTechnology.NodeJs], // TODO
            },
        ],
        createdAt: new Date('2024-01-01'),
        description: 'Some configuration packages for my personal projects.',
        id: 3,
        name: 'Typescript',
        status: ProjectStatus.Active,
        type: ProjectCategory.Application,
        url: new URL('https://npm.js'), // TODO
    },
    {
        // TODO
        // 42 corewar - 42 devstation - 42 dr quine - 42 expert system - 42 fillit - 42 ft-p - 42 ft-printf - 42 get-next-line - 42 hypertube - 42 lem-in - 42 libft - 42 libft-asm - 42 malloc - 42 matcha - 42 nm-otool - 42 override - 42 piscine-reloaded - 42 push-swap - 42 rainfall - 42 snowcrash - 42 ssl-md5
        components: [
            {
                // TODO
                architectures: [],

                description:
                    'A typescript api server with prisma with a postgres database. Built with clean architecture.',

                // TODO
                name: 'Hypertube',
                sourceUrl: new URL('https://google.com'),
                status: ProjectStatus.Active, // TODO
                technologies: [ProjectTechnology.NodeJs], // TODO
            },
            {
                // TODO
                architectures: [],

                description:
                    'A typescript api server with prisma with a postgres database. Built with clean architecture.',

                // TODO
                name: 'Corewar',

                sourceUrl: new URL('https://google.com'),
                // TODO
                status: ProjectStatus.Active,
                technologies: [ProjectTechnology.NodeJs], // TODO
            },
            {
                // TODO
                architectures: [],

                description:
                    'A typescript api server with prisma with a postgres database. Built with clean architecture.',

                // TODO
                name: 'Dr Quine',

                sourceUrl: new URL('https://google.com'),
                // TODO
                status: ProjectStatus.Active,
                technologies: [ProjectTechnology.NodeJs], // TODO
            },
            {
                // TODO
                architectures: [],

                // TODO
                articleUrl: new URL('https://google.com'),

                description:
                    'A typescript api server with prisma with a postgres database. Built with clean architecture.',

                // TODO
                name: 'Expert System',

                sourceUrl: new URL('https://google.com'),

                // TODO
                status: ProjectStatus.Active,
                // TODO
                technologies: [ProjectTechnology.NodeJs],
            },
        ],
        createdAt: new Date('2020-01-01'),
        description: 'Some projects I did at 42 School.',
        id: 4,
        name: '42 Projects',
        status: ProjectStatus.Active,
        type: ProjectCategory.Application,
        url: new URL('https://github.com'),
    },
    {
        components: [],
        description:
            'An open marketplace for buying and selling goods, by the community, for the community.',
        id: 2,
        name: 'Open Market',
        status: ProjectStatus.Concept,
        type: ProjectCategory.Application,
        url: new URL('https://open.mt'),
    },
];
