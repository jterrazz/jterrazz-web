import {
    type Experiment,
    ExperimentArchitecture,
    ExperimentCategory,
    ExperimentContext,
    ExperimentStatus,
} from '../../domain/experiment';

const REPOSITORY_BASE_URL = 'https://github.com/jterrazz/';

const experiments: Experiment[] = [
    {
        category: ExperimentCategory.App,
        components: [
            {
                architectures: [
                    ExperimentArchitecture.Atomic,
                    ExperimentArchitecture.Clean,
                    ExperimentArchitecture.Spectrum,
                ],
                description: 'React Native Application.',
                name: 'Mobile Client',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}capitaine-mobile`),
                status: ExperimentStatus.Building,
            },
        ],
        context: ExperimentContext.Personal,
        description: 'A day to day copilot for your life.',
        longDescription:
            "Capitaine is more than just a habit tracker; it's a personal growth companion. Built with React Native and a focus on clean architecture, it helps users build sustainable habits through data-driven insights and a frictionless user experience.",
        name: 'Capitaine',
        slug: 'capitaine',
        status: ExperimentStatus.Building,
        tags: ['React Native', 'TypeScript', 'Node.js', 'Clean Architecture'],
        url: new URL('https://capitaine.io'),
        year: 2024,
    },
    {
        category: ExperimentCategory.App,
        components: [
            {
                architectures: [ExperimentArchitecture.Atomic, ExperimentArchitecture.Clean],
                description: 'React Native Application.',
                name: 'Mobile Client',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}fake-news-mobile`),
                status: ExperimentStatus.Completed,
            },
            {
                description: 'Serverless functions.',
                name: 'Backend',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}fake-news-backend`),
                status: ExperimentStatus.Completed,
            },
        ],
        context: ExperimentContext.Personal,
        description: 'A game to train your mind to spot AI fakes.',
        longDescription:
            'AI News challenges your critical thinking by presenting a mix of real and AI-generated headlines. Can you tell the difference? Built with React Native and AWS Lambda.',
        name: 'AI News',
        privacyUrl: '/experiments/ai-news/privacy',
        slug: 'ai-news',
        status: ExperimentStatus.Completed,
        tags: ['React Native', 'TypeScript', 'AWS', 'AI'],
        url: new URL('https://apps.apple.com/us/app/ai-news-smart-world-news/id6742116038'),
        year: 2025,
    },
    {
        articleUrl: '/articles/13',
        category: ExperimentCategory.App,
        components: [
            {
                architectures: [ExperimentArchitecture.Atomic, ExperimentArchitecture.Clean],
                description: 'NextJS Application.',
                name: 'Website',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}jterrazz-web`),
                status: ExperimentStatus.Building,
            },
        ],
        context: ExperimentContext.Personal,
        description: 'My portfolio and article website.',
        longDescription:
            "This very website you're viewing! A Next.js application showcasing my projects, articles, and photography. Built with a focus on performance, accessibility, and clean code.",
        name: 'jterrazz.com',
        slug: 'jterrazz',
        status: ExperimentStatus.Building,
        tags: ['NextJS', 'TypeScript', 'Tailwind', 'Clean Architecture'],
        url: new URL('https://jterrazz.com'),
        year: 2024,
    },
    {
        category: ExperimentCategory.Lib,
        components: [
            {
                description: 'Python Library.',
                name: 'Library',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}package-python-store-analyzer`),
                status: ExperimentStatus.Completed,
            },
        ],
        context: ExperimentContext.Personal,
        description: 'Analyze App Store reviews with sentiment analysis.',
        longDescription:
            'A Python library for fetching, analyzing, and visualizing App Store reviews. Includes sentiment analysis capabilities to understand user feedback patterns.',
        name: 'store-analyzer',
        slug: 'store-analyzer',
        status: ExperimentStatus.Completed,
        tags: ['Python', 'NLP', 'Data Analysis'],
        url: new URL('https://pypi.org/project/store-analyzer/'),
        year: 2025,
    },
    {
        category: ExperimentCategory.Lib,
        components: [
            {
                description: 'TypeScript Library.',
                name: 'Library',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}package-typescript-ai-text-sanitizer`),
                status: ExperimentStatus.Completed,
            },
        ],
        context: ExperimentContext.Personal,
        description: 'Clean AI-generated text artifacts.',
        longDescription:
            'A TypeScript utility library for cleaning common artifacts from AI-generated text, including markdown formatting issues, unwanted markers, and inconsistent whitespace.',
        name: 'ai-text-sanitizer',
        slug: 'ai-text-sanitizer',
        status: ExperimentStatus.Completed,
        tags: ['TypeScript', 'AI', 'Text Processing'],
        url: new URL('https://www.npmjs.com/package/ai-text-sanitizer'),
        year: 2025,
    },
    {
        category: ExperimentCategory.Lib,
        components: [
            {
                description: 'TypeScript Library.',
                name: 'Library',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}package-typescript-open-music-api`),
                status: ExperimentStatus.Completed,
            },
        ],
        context: ExperimentContext.Personal,
        description: 'A TypeScript library to search music from Itunes API.',
        longDescription:
            'This library provides a clean API to search and fetch music data from the iTunes API, with full TypeScript support and convenient data transformations.',
        name: 'open-music-api',
        slug: 'open-music-api',
        status: ExperimentStatus.Completed,
        tags: ['TypeScript', 'Music', 'API'],
        url: new URL('https://www.npmjs.com/package/open-music-api'),
        year: 2024,
    },
    {
        category: ExperimentCategory.Lib,
        components: [
            {
                description: 'TypeScript Library.',
                name: 'Library',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}package-typescript-iso-country`),
                status: ExperimentStatus.Completed,
            },
        ],
        context: ExperimentContext.Personal,
        description: 'A TypeScript library to get country informations.',
        longDescription:
            'A zero-dependency TypeScript library providing comprehensive country data including names, codes, currencies, and regions with full type safety.',
        name: 'iso-country',
        slug: 'iso-country',
        status: ExperimentStatus.Completed,
        tags: ['TypeScript', 'i18n'],
        url: new URL('https://www.npmjs.com/package/@jterrazz/iso-country'),
        year: 2024,
    },
    {
        category: ExperimentCategory.Lib,
        components: [
            {
                description: 'TypeScript Library.',
                name: 'Library',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}package-typescript-quality`),
                status: ExperimentStatus.Completed,
            },
        ],
        context: ExperimentContext.Personal,
        description:
            'An all-in-one toolkit to enforce code quality, with biome, eslint and typescript.',
        longDescription:
            'A comprehensive code quality toolkit that bundles and configures Biome, ESLint, and TypeScript for consistent formatting, linting, and type checking across projects.',
        name: '@jterrazz/quality',
        slug: 'quality',
        status: ExperimentStatus.Completed,
        tags: ['TypeScript', 'Biome', 'ESLint', 'DX'],
        url: new URL('https://www.npmjs.com/package/@jterrazz/quality'),
        year: 2024,
    },
    {
        articleUrl: '/articles/1',
        category: ExperimentCategory.System,
        components: [
            {
                description: 'C Library.',
                name: 'Library',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-malloc`),
                status: ExperimentStatus.Completed,
            },
        ],
        context: ExperimentContext.School42,
        description: 'A custom malloc implementation.',
        longDescription:
            'A from-scratch implementation of memory allocation functions (malloc, free, realloc) in C, exploring memory management strategies, fragmentation handling, and system calls.',
        name: 'ft_malloc',
        slug: 'malloc',
        status: ExperimentStatus.Completed,
        tags: ['C', 'Memory'],
        url: new URL(`${REPOSITORY_BASE_URL}42-malloc`),
        year: 2019,
    },
    {
        articleUrl: '/articles/5',
        category: ExperimentCategory.System,
        components: [
            {
                description: 'Assembly Library.',
                name: 'Library',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-libft-asm`),
                status: ExperimentStatus.Completed,
            },
        ],
        context: ExperimentContext.School42,
        description: 'A low-level library built with x86-64 assembly.',
        longDescription:
            'A collection of standard library functions implemented in x86-64 assembly, demonstrating low-level programming concepts like register manipulation, calling conventions, and memory operations.',
        name: 'libft_asm',
        slug: 'libft-asm',
        status: ExperimentStatus.Completed,
        tags: ['Assembly', 'x86-64'],
        url: new URL(`${REPOSITORY_BASE_URL}42-libft-asm`),
        year: 2019,
    },
    {
        articleUrl: '/articles/2',
        category: ExperimentCategory.System,
        components: [
            {
                description: 'C Library.',
                name: 'Library',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-ssl-md5`),
                status: ExperimentStatus.Completed,
            },
        ],
        context: ExperimentContext.School42,
        description: 'SSL and hashing algorithms.',
        longDescription:
            'Implementation of cryptographic hash functions (MD5, SHA-256) and SSL/TLS primitives in C, exploring the mathematics and bitwise operations behind modern security.',
        name: 'ft_ssl_md5',
        slug: 'ssl-md5',
        status: ExperimentStatus.Completed,
        tags: ['C', 'Cryptography'],
        url: new URL(`${REPOSITORY_BASE_URL}42-ssl-md5`),
        year: 2019,
    },
    {
        articleUrl: '/articles/3',
        category: ExperimentCategory.System,
        components: [
            {
                description: 'C Binary.',
                name: 'Binary',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-nm-otool`),
                status: ExperimentStatus.Completed,
            },
        ],
        context: ExperimentContext.School42,
        description: 'A re-implementation of nm and otool commands.',
        longDescription:
            'Recreation of the nm and otool command-line utilities for analyzing Mach-O binaries, parsing symbol tables, and understanding executable file formats.',
        name: 'nm_otool',
        slug: 'nm-otool',
        status: ExperimentStatus.Completed,
        tags: ['C', 'Mach-O'],
        url: new URL(`${REPOSITORY_BASE_URL}42-nm-otool`),
        year: 2019,
    },
    {
        category: ExperimentCategory.System,
        components: [
            {
                description: 'C Binary.',
                name: 'Binary',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-woody-woodpacker`),
                status: ExperimentStatus.Completed,
            },
        ],
        context: ExperimentContext.School42,
        description: 'A binary packer that encrypts and adds code to ELF files.',
        longDescription:
            'A proof-of-concept binary packer that modifies ELF executables by injecting custom code and encrypting sections, demonstrating binary manipulation techniques.',
        name: 'woody_woodpacker',
        slug: 'woody-woodpacker',
        status: ExperimentStatus.Completed,
        tags: ['C', 'Security', 'ELF'],
        url: new URL(`${REPOSITORY_BASE_URL}42-woody-woodpacker`),
        year: 2019,
    },
    {
        category: ExperimentCategory.System,
        components: [
            {
                description: 'C Binary.',
                name: 'Binary',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-famine`),
                status: ExperimentStatus.Completed,
            },
        ],
        context: ExperimentContext.School42,
        description: 'A file infector for educational purposes (ELF format).',
        longDescription:
            'An educational project demonstrating how file infectors work by modifying ELF binaries. Built for learning about binary formats and security concepts.',
        name: 'famine',
        slug: 'famine',
        status: ExperimentStatus.Completed,
        tags: ['C', 'Security', 'ELF'],
        url: new URL(`${REPOSITORY_BASE_URL}42-famine`),
        year: 2019,
    },
    {
        articleUrl: '/articles/6',
        category: ExperimentCategory.System,
        components: [
            {
                description: 'Python Binary.',
                name: 'Binary',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-expert-system`),
                status: ExperimentStatus.Completed,
            },
        ],
        context: ExperimentContext.School42,
        description: 'An expert system to solve propositions.',
        longDescription:
            'A backward-chaining inference engine built in Python that evaluates logical propositions using rules and facts, demonstrating AI reasoning techniques.',
        name: 'expert_system',
        slug: 'expert-system',
        status: ExperimentStatus.Completed,
        tags: ['Python', 'AI'],
        url: new URL(`${REPOSITORY_BASE_URL}42-expert-system`),
        year: 2019,
    },
    {
        articleUrl: '/articles/4',
        category: ExperimentCategory.System,
        components: [
            {
                description: 'C / Python / Assembly Binary.',
                name: 'Binary',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-dr-quine`),
                status: ExperimentStatus.Completed,
            },
        ],
        context: ExperimentContext.School42,
        description: 'A quine is a program that reproduces itself.',
        longDescription:
            'Implementation of quine programs in multiple languages (C, Python, Assembly) that output their own source code, exploring self-reference and code generation.',
        name: 'dr_quine',
        slug: 'dr-quine',
        status: ExperimentStatus.Completed,
        tags: ['C', 'Python', 'Assembly'],
        url: new URL(`${REPOSITORY_BASE_URL}42-dr-quine`),
        year: 2019,
    },
    {
        category: ExperimentCategory.System,
        components: [
            {
                description: 'C Binary.',
                name: 'Binary',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-boot2root`),
                status: ExperimentStatus.Completed,
            },
        ],
        context: ExperimentContext.School42,
        description: 'A CTF (Capture the Flag) challenge.',
        longDescription:
            'A capture-the-flag security challenge involving vulnerability discovery, exploitation techniques, and privilege escalation on a deliberately vulnerable system.',
        name: 'boot2root',
        slug: 'boot2root',
        status: ExperimentStatus.Completed,
        tags: ['C', 'Security'],
        url: new URL(`${REPOSITORY_BASE_URL}42-boot2root`),
        year: 2019,
    },
    {
        category: ExperimentCategory.System,
        components: [
            {
                description: 'C Binary.',
                name: 'Binary',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-override`),
                status: ExperimentStatus.Completed,
            },
        ],
        context: ExperimentContext.School42,
        description: 'A CTF (Capture the Flag) with 10 levels of binary exploitation.',
        longDescription:
            'Progressive binary exploitation challenges covering buffer overflows, format string vulnerabilities, and return-oriented programming techniques.',
        name: 'override',
        slug: 'override',
        status: ExperimentStatus.Completed,
        tags: ['C', 'Security', 'Exploitation'],
        url: new URL(`${REPOSITORY_BASE_URL}42-override`),
        year: 2019,
    },
    {
        category: ExperimentCategory.System,
        components: [
            {
                description: 'C Binary.',
                name: 'Binary',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-rainfall`),
                status: ExperimentStatus.Completed,
            },
        ],
        context: ExperimentContext.School42,
        description: 'A CTF (Capture the Flag) with 10 levels of binary exploitation.',
        longDescription:
            'Similar to override but with different exploitation scenarios, teaching shellcode injection, heap exploitation, and advanced binary analysis.',
        name: 'rainfall',
        slug: 'rainfall',
        status: ExperimentStatus.Completed,
        tags: ['C', 'Security', 'Exploitation'],
        url: new URL(`${REPOSITORY_BASE_URL}42-rainfall`),
        year: 2019,
    },
    {
        category: ExperimentCategory.System,
        components: [
            {
                description: 'C Binary.',
                name: 'Binary',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}42-snow-crash`),
                status: ExperimentStatus.Completed,
            },
        ],
        context: ExperimentContext.School42,
        description: 'A CTF (Capture the Flag) with 15 levels of binary exploitation.',
        longDescription:
            'An introductory CTF with varied challenges covering password cracking, reverse engineering, and basic exploitation techniques.',
        name: 'snow_crash',
        slug: 'snow-crash',
        status: ExperimentStatus.Completed,
        tags: ['C', 'Security'],
        url: new URL(`${REPOSITORY_BASE_URL}42-snow-crash`),
        year: 2019,
    },
    {
        category: ExperimentCategory.App,
        components: [
            {
                description: 'React / Solidity.',
                name: 'DApp',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}ethwaterloo-defi-dy`),
                status: ExperimentStatus.Completed,
            },
        ],
        context: ExperimentContext.Hackathon,
        description: 'A synthetic asset protocol for any basket of ERC-20 tokens.',
        longDescription:
            'Built at ETHWaterloo 2019, Defi-dy is a DeFi protocol for creating synthetic assets backed by baskets of ERC-20 tokens, using Chainlink oracles for price feeds.',
        name: 'Defi-dy',
        slug: 'defy-dy',
        status: ExperimentStatus.Completed,
        tags: ['Solidity', 'React', 'DeFi'],
        url: new URL('https://devpost.com/software/defi-dy'),
        year: 2019,
    },
    {
        category: ExperimentCategory.App,
        components: [
            {
                description: 'React / Solidity.',
                name: 'DApp',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}ethparis-collective-ventures`),
                status: ExperimentStatus.Completed,
            },
        ],
        context: ExperimentContext.Hackathon,
        description: 'Crowdfunding with Collective Venture Tokens.',
        longDescription:
            'A blockchain-based crowdfunding platform built at ETHParis 2019, using CVT tokens to represent stake in funded projects with transparent governance.',
        name: 'CVT Crowdfunding',
        slug: 'cvt-crowdfunding',
        status: ExperimentStatus.Completed,
        tags: ['Solidity', 'React', 'Crowdfunding'],
        url: new URL('https://devpost.com/software/cvt-crowdfunding'),
        year: 2019,
    },
    {
        articleUrl: '/articles/7',
        category: ExperimentCategory.Lib,
        components: [
            {
                description: 'TypeScript / Koa template.',
                name: 'Template',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}template-typescript-koa-api`),
                status: ExperimentStatus.Completed,
            },
        ],
        context: ExperimentContext.Personal,
        description: 'A KoaJS template for building APIs.',
        longDescription:
            'A production-ready template for building RESTful APIs with Koa and TypeScript, featuring structured routing, middleware patterns, and error handling.',
        name: 'template-koa-api',
        slug: 'template-koa-api',
        status: ExperimentStatus.Completed,
        tags: ['TypeScript', 'Koa', 'Template'],
        url: new URL(`${REPOSITORY_BASE_URL}template-typescript-koa-api`),
        year: 2020,
    },
    {
        category: ExperimentCategory.Lib,
        components: [
            {
                description: 'TypeScript / NextJS template.',
                name: 'Template',
                sourceUrl: new URL(`${REPOSITORY_BASE_URL}template-typescript-react-package`),
                status: ExperimentStatus.Completed,
            },
        ],
        context: ExperimentContext.Personal,
        description: 'A typescript template for building libraries.',
        longDescription:
            'A batteries-included template for creating TypeScript packages with testing, bundling, and publishing workflows pre-configured.',
        name: 'template-typescript-library',
        slug: 'template-typescript-library',
        status: ExperimentStatus.Completed,
        tags: ['TypeScript', 'Template'],
        url: new URL(`${REPOSITORY_BASE_URL}template-typescript-react-package`),
        year: 2024,
    },
];

export const experimentsRepository = {
    getAll: (): Experiment[] => experiments,
    getBySlug: (slug: string): Experiment | undefined => experiments.find((e) => e.slug === slug),
};
