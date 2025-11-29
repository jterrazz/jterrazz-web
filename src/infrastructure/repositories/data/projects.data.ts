// Domain
import {
    type Project,
    ProjectArchitecture,
    ProjectCategory,
    ProjectStatus,
    ProjectTechnology,
} from '../../../domain/project.js';

const REPOSITORY_BASE_URL = 'https://github.com/jterrazz/';

export const projectsData: Project[] = [
    // {
    //     components: [
    //         {
    //             architectures: [ProjectArchitecture.Atomic, ProjectArchitecture.Clean],
    //             description:
    //                 'A next.js website with server side rendering for mobile and desktop browsers. Built with clean architecture and atomic design principles.',
    //
    //             name: 'Website',
    //             sourceUrl: new URL('https://gogle.com'),
    //             status: ProjectStatus.Concept,
    //             technologies: [
    //                 ProjectTechnology.NextJs,
    //                 ProjectTechnology.React,
    //                 ProjectTechnology.TailwindCSS,
    //             ],
    //         },
    //         {
    //             architectures: [ProjectArchitecture.Clean],
    //             description:
    //                 'A typescript api server with prisma with a postgres database. Built with clean architecture.',
    //             name: 'API',
    //             sourceUrl: new URL(REPOSITORY_BASE_URL + 'capitaine-api'),
    //             status: ProjectStatus.Concept,
    //             technologies: [
    //                 ProjectTechnology.NodeJs,
    //                 ProjectTechnology.Express,
    //                 ProjectTechnology.Prisma,
    //                 ProjectTechnology.Postgres,
    //             ],
    //         },
    //     ],
    // },
    {
        components: [
            {
                architectures: [
                    ProjectArchitecture.Atomic,
                    ProjectArchitecture.Clean,
                    ProjectArchitecture.Spectrum,
                ],
                description:
                    'A react native mobile application for reaching your goals through daily habits.',
                name: 'Mobile Client',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}capitaine-mobile`),
                status: ProjectStatus.Building,
                technologies: [
                    ProjectTechnology.ReactNative,
                    ProjectTechnology.Sass,
                    ProjectTechnology.TailwindCSS,
                ],
            },
        ],
        description: 'A day to day copilot for your life.',
        index: 1,
        name: 'Capitaine IO',
        status: ProjectStatus.Building,
        type: ProjectCategory.Application,
        url: new URL('https://capitaine.io'),
    },
    {
        components: [
            {
                architectures: [
                    ProjectArchitecture.DomainInfrastructure,
                    ProjectArchitecture.Hexagonal,
                ],
                description:
                    'A typescript api server with prisma with a sqlite database. Built with clean architecture.',
                name: 'API',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}fake-news-api`),
                status: ProjectStatus.Active,
                technologies: [
                    ProjectTechnology.NodeJs,
                    ProjectTechnology.Hono,
                    ProjectTechnology.Prisma,
                    ProjectTechnology.Sqlite,
                    ProjectTechnology.Typescript,
                ],
            },
            {
                architectures: [
                    ProjectArchitecture.Atomic,
                    ProjectArchitecture.DomainInfrastructure,
                    ProjectArchitecture.Spectrum,
                ],
                description: 'A react native mobile application for guessing fake news.',
                name: 'Mobile Client',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}fake-news-mobile`),
                status: ProjectStatus.Active,
                technologies: [ProjectTechnology.ReactNative, ProjectTechnology.Typescript],
            },
        ],
        description: 'A fake news app to playfully question headlines.',
        index: 2,
        name: 'Fake News',
        status: ProjectStatus.Active,
        type: ProjectCategory.Application,
        url: new URL('https://fake-news.jterrazz.com'),
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

                name: 'Web Client',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}jterrazz-web`),
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
        index: 0,
        name: 'Jterrazz',
        status: ProjectStatus.Active,
        type: ProjectCategory.Application,
        url: new URL('https://jterrazz.com'),
    },
    {
        components: [
            {
                architectures: [],
                description:
                    'This package provides a consistent TypeScript configuration for projects.',
                name: 'Typescript',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}package-typescript`),
                status: ProjectStatus.Active,
                technologies: [ProjectTechnology.NodeJs, ProjectTechnology.Typescript],
            },
            {
                architectures: [],
                description:
                    'A shareable typescript quality configuration that can be used across multiple projects. This repository provides a common set of code quality and formatting rules to ensure consistency of code across different projects.',
                name: 'Quality',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}package-quality`),
                status: ProjectStatus.Active,
                technologies: [ProjectTechnology.NodeJs, ProjectTechnology.Typescript],
            },
            {
                architectures: [],
                description:
                    'This package provides Jest configuration and test packages for TypeScript projects',
                name: 'Test',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}package-test`),
                status: ProjectStatus.Active,
                technologies: [ProjectTechnology.NodeJs, ProjectTechnology.Typescript],
            },
            {
                architectures: [],
                description: 'A shareable typescript logger package for node.js applications.',
                name: 'Logger',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}package-logger`),
                status: ProjectStatus.Archived,
                technologies: [ProjectTechnology.NodeJs, ProjectTechnology.Typescript],
            },
            {
                architectures: [],
                description: 'A shareable typescript http package for node.js applications.',
                name: 'Http',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}package-http`),
                status: ProjectStatus.Archived,
                technologies: [ProjectTechnology.NodeJs, ProjectTechnology.Typescript],
            },
        ],
        createdAt: new Date('2024-01-01'),
        description: 'A collection of typescript packages for building my node.js applications.',
        index: 3,
        name: 'Typescript Packages',
        status: ProjectStatus.Active,
        type: ProjectCategory.Application,
        url: new URL('https://npm.js'),
    },
    {
        components: [
            {
                architectures: [],
                articleUrl: new URL(
                    'https://medium.com/a-42-journey/expert-systems-how-to-implement-a-backward-chaining-resolver-in-python-bf7d8924f72f',
                ),
                description:
                    'Backward chaining rule based system in Python. RPN, Tree resolver, Tree representation, logic rule system, prompt.',
                name: 'Expert System',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-expert-system`),
                status: ProjectStatus.Completed,
                technologies: [ProjectTechnology.Python],
            },
            {
                architectures: [],
                description:
                    'Advanced binary security project - Exploits and reverse engineering - x86 and x86-64 binaries.',
                name: 'Override',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-override`),
                status: ProjectStatus.Completed,
                technologies: [ProjectTechnology.Radare2, ProjectTechnology.Gdb],
            },
            {
                architectures: [],
                description:
                    'Intermediate cybersecurity project, and an introduction to binary analysis - X86 binaries.',
                name: 'Rainfall',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-rainfall`),
                status: ProjectStatus.Completed,
                technologies: [ProjectTechnology.Radare2, ProjectTechnology.Gdb],
            },
            {
                architectures: [],
                description: 'Entry level cybersecurity project - X86 binaries.',
                name: 'Snowcrash',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-snowcrash`),
                status: ProjectStatus.Completed,
                technologies: [ProjectTechnology.Radare2, ProjectTechnology.Gdb],
            },
            {
                architectures: [],
                description:
                    'Virtual machine simulating basic processors operations, with basic notions of Assembly. Written in C.',
                name: 'Corewar',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-corewar`),
                status: ProjectStatus.Completed,
                technologies: [ProjectTechnology.C, ProjectTechnology.Assembly],
            },
            {
                architectures: [],
                articleUrl: new URL('https://medium.com/p/7d4fef3d7507'),
                description:
                    'Nm and otool implementation in C. Parse Mach-o files, supports fat binaries, archives and corrupted binaries.',
                name: 'NM Otool',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-nm-otool`),
                status: ProjectStatus.Completed,
                technologies: [ProjectTechnology.C],
            },
            {
                architectures: [],
                articleUrl: new URL(
                    'https://medium.com/a-42-journey/implementing-the-sha256-and-md5-hash-functions-in-c-78c17e657794?postPublishedType=initial',
                ),
                description:
                    'OpenSSL implementation in C. Supports md5, sha1, sha256, sha224, sha512 and sha384 algorithms.',
                name: 'MD5 & SHA256',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-ssl-md5`),
                status: ProjectStatus.Completed,
                technologies: [ProjectTechnology.C],
            },
            {
                architectures: [],
                description:
                    'A web application for discovering and streaming peer to peer videos. Made with NodeJS, Koa, Typescript, MongoDB, NextJS (ReactJS with SSR).',
                name: 'Hypertube',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-hypertube`),
                status: ProjectStatus.Completed,
                technologies: [
                    ProjectTechnology.NodeJs,
                    ProjectTechnology.Koa,
                    ProjectTechnology.Typescript,
                    ProjectTechnology.MongoDB,
                    ProjectTechnology.NextJs,
                    ProjectTechnology.React,
                ],
            },
            {
                architectures: [],
                articleUrl: new URL(
                    'https://medium.com/a-42-journey/how-to-create-your-own-malloc-library-b86fedd39b96',
                ),
                description: 'C implementation of the malloc library using mmap.',
                name: 'Malloc',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-malloc`),
                status: ProjectStatus.Completed,
                technologies: [ProjectTechnology.C],
            },
            {
                architectures: [],
                articleUrl: new URL(
                    'https://medium.com/a-42-journey/build-your-own-quines-3dd117a89fdb',
                ),
                description:
                    "This project addresses auto-replication issues, and confronts you the Kleene's recursion theorem.",
                name: 'Dr Quine',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-dr-quine`),
                status: ProjectStatus.Completed,
                technologies: [ProjectTechnology.C],
            },
            {
                architectures: [],
                description: 'Algorithmic C project for the 42 Paris School',
                name: 'Fillit',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-fillit`),
                status: ProjectStatus.Completed,
                technologies: [ProjectTechnology.C],
            },
            {
                architectures: [],
                description: 'Custom printf implementation in C.',
                name: 'Ft Printf',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-ft-printf`),
                status: ProjectStatus.Completed,
                technologies: [ProjectTechnology.C],
            },
            {
                architectures: [],
                description: 'Read lines from a file descriptor.',
                name: 'Get Next Line',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-get-next-line`),
                status: ProjectStatus.Completed,
                technologies: [ProjectTechnology.C],
            },
            {
                architectures: [],
                description: 'Handle a virtual anthill efficiently.',
                name: 'Lem In',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-lem-in`),
                status: ProjectStatus.Completed,
                technologies: [ProjectTechnology.C],
            },
            {
                architectures: [],
                articleUrl: new URL(
                    'https://medium.com/a-42-journey/a-quick-guide-to-code-your-first-assembly-functions-43c2032ebfda',
                ),
                description: 'Basic functions implemented in Assembly using the x86 Intel syntax.',
                name: 'Libft ASM',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-libft-asm`),
                status: ProjectStatus.Completed,
                technologies: [ProjectTechnology.Assembly],
            },
            {
                architectures: [],
                description: 'The basic libc library used in all the 42 school projects.',
                name: 'Libft',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-libft`),
                status: ProjectStatus.Completed,
                technologies: [ProjectTechnology.C],
            },
            {
                architectures: [],
                description:
                    'Sorts data on a stack, with a limited set of instructions and limited number of moves. In C.',
                name: 'Push Swap',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-push-swap`),
                status: ProjectStatus.Completed,
                technologies: [ProjectTechnology.C],
            },
            {
                architectures: [],
                description: 'My 42 paris school entry test.',
                name: 'Piscine Reloaded',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-piscine-reloaded`),
                status: ProjectStatus.Completed,
                technologies: [ProjectTechnology.C],
            },
        ],
        createdAt: new Date('2020-01-01'),
        description: 'Some projects I did at the 42 Paris School.',
        index: 4,
        name: '42 Projects',
        status: ProjectStatus.Completed,
        type: ProjectCategory.Application,
        url: new URL('https://github.com'),
    },
];
