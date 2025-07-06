import { promises as fs } from 'node:fs';

import { type Article, ArticleCategory, type ArticleLanguage } from '../../../domain/article.js';

type ArticleConfig = Omit<Article, 'content' | 'imageUrl'> & {
    filename: string;
    previewImage?: string;
};

const CDN_BASE_URL = 'https://github.com/jterrazz/jterrazz-web/raw/main/content/articles';
const DEFAULT_PREVIEW_IMAGE_JPG = 'thumbnail.jpg';

const ARTICLES_CONFIG: ArticleConfig[] = [
    {
        filename: '2019-06-01 Learn Malloc',
        metadata: {
            category: ArticleCategory.Code,
            dateModified: '2024-08-29',
            datePublished: '2019-06-01',
            description:
                'Master dynamic memory allocation in C by building your own malloc library from scratch. Learn memory management, heap allocation, and system programming fundamentals with practical examples.',
            title: 'Create Your Own malloc Library from Scratch',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 1,
        published: true,
    },
    {
        filename: '2019-06-07 Learn Sha256',
        metadata: {
            category: ArticleCategory.Code,
            dateModified: '2024-08-30',
            datePublished: '2019-06-07',
            description:
                'Deep dive into cryptographic hash functions: SHA-256 and MD5 algorithms explained. Understand digital signatures, data integrity, and cryptographic security principles with code examples.',
            title: 'Unraveling the Mysteries of SHA-256 and MD5',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 2,
        published: true,
    },
    {
        filename: '2019-07-25 Learn Nm & Otool',
        metadata: {
            category: ArticleCategory.Code,
            dateModified: '2024-08-29',
            datePublished: '2019-07-25',
            description:
                'Build your own nm and otool tools to understand binary analysis, symbol tables, and Mach-O file format. Master low-level programming and binary inspection techniques.',
            title: 'Building Your Own nm and otool',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 3,
        published: true,
    },
    {
        filename: '2019-08-27 Learn Quine',
        metadata: {
            category: ArticleCategory.Code,
            dateModified: '2024-09-03',
            datePublished: '2019-08-27',
            description:
                'Explore self-replicating programs (quines) - programs that output their own source code. Challenge your programming skills with this fascinating computer science concept.',
            title: 'Build a Self-Replicating Program (Quine)',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 4,
        published: true,
    },
    {
        filename: '2019-08-28 Learn Assembly',
        metadata: {
            category: ArticleCategory.Code,
            dateModified: '2024-09-02',
            datePublished: '2019-08-28',
            description:
                'Write your first assembly functions and understand the language your processor speaks. Master low-level programming, CPU architecture, and performance optimization techniques.',
            title: 'Crafting Your First Assembly Functions',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 5,
        published: true,
    },
    {
        filename: '2019-09-10 Learn Expert System',
        metadata: {
            category: ArticleCategory.Code,
            dateModified: '2024-09-02',
            datePublished: '2019-09-10',
            description:
                'Build an expert system with backward chaining inference engine in Python. Learn artificial intelligence, rule-based systems, and automated reasoning techniques.',
            title: 'Expert Systems: A Backward Chaining Resolver in Python',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 6,
        published: true,
    },
    {
        filename: '2020-11-03 Learn Koa',
        metadata: {
            category: ArticleCategory.Code,
            dateModified: '2024-08-02',
            datePublished: '2020-11-03',
            description:
                'Build a robust web server with TypeScript and Koa.js. Master Node.js backend development, HTTP request handling, middleware patterns, and modern JavaScript frameworks.',
            title: 'Crafting a Robust Web Server with TypeScript and Koa',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 7,
        published: true,
    },
    {
        filename: '2023-07-02 Build Open Market',
        metadata: {
            category: ArticleCategory.App,
            dateModified: '2024-07-02',
            datePublished: '2023-07-02',
            description:
                'Discover how Open.MT revolutionizes e-commerce with open-source technologies. Explore modern marketplace development, decentralized commerce, and innovative shopping experiences.',
            title: 'Experience the Future of Shopping with Open.MT',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 8,
        published: true,
    },
    {
        filename: '2024-12-20 Learn Application Design - Introduction',
        metadata: {
            category: ArticleCategory.Code, // TODO: change to Architecture
            dateModified: '2024-12-20',
            datePublished: '2024-12-20',
            description:
                'Master application design fundamentals for building sustainable and scalable software. Learn software architecture principles, design patterns, and best practices for modern development.',
            title: 'Application Design: 0. Building Sustainable and Scalable Software',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 9,
        published: true,
    },
    {
        filename: '2024-12-21 Learn Application Design - Dependencies',
        metadata: {
            category: ArticleCategory.Code, // TODO: change to Architecture
            dateModified: '2024-12-21',
            datePublished: '2024-12-21',
            description:
                'Understand dependency management in software architecture. Learn dependency injection, inversion of control, and how to design loosely coupled, maintainable applications.',
            title: 'Application Design: 1. The Concept of Dependencies',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 10,
        published: true,
    },
    {
        filename: '2024-12-22 Learn Application Design - Hexagonal',
        metadata: {
            category: ArticleCategory.Code, // TODO: change to Architecture
            dateModified: '2024-12-22',
            datePublished: '2024-12-22',
            description:
                'Master hexagonal architecture (ports and adapters) for building flexible, testable applications. Learn domain-driven design, clean architecture, and separation of concerns.',
            title: 'Application Design: 2. Hexagonal Architecture',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 11,
        published: true,
    },
    {
        filename: '2024-12-23 Learn Application Design - Clean Architecture',
        metadata: {
            category: ArticleCategory.Code, // TODO: change to Architecture
            dateModified: '2024-12-23',
            datePublished: '2024-12-23',
            description:
                'Implement clean architecture principles for maintainable, scalable software. Learn SOLID principles, dependency rules, and how to structure applications for long-term success.',
            title: 'Application Design: 3. Clean Architecture',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 12,
        published: true,
    },
    {
        filename: '2025-04-06 Fake News - Playfully Questioning Reality',
        metadata: {
            category: ArticleCategory.App,
            dateModified: '2025-04-06',
            datePublished: '2025-04-06',
            description:
                'Explore Fake News, a mobile app that helps you playfully question reality and develop critical thinking skills. Learn media literacy, fact-checking, and navigating information overload.',
            title: 'Fake News: Playfully Questioning Reality',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 13,
        published: true,
    },
    {
        filename: '2025-05-06 AI - Navigating the AI Revolution',
        metadata: {
            category: ArticleCategory.World,
            dateModified: '2025-05-06',
            datePublished: '2025-05-06',
            description:
                'Navigate the AI revolution with practical insights and strategies. Understand artificial intelligence trends, opportunities, and how to adapt to the rapidly evolving technological landscape.',
            title: 'AI: 0. Navigating the AI Revolution',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 14,
        published: true,
    },
    {
        filename: '2025-05-07 AI - Applied Intelligence',
        metadata: {
            category: ArticleCategory.World,
            dateModified: '2025-05-07',
            datePublished: '2025-05-07',
            description:
                'Learn how to apply artificial intelligence to enhance your daily life and productivity. Discover practical AI tools, automation strategies, and intelligent systems for personal growth.',
            title: 'AI: 1. Applied Intelligence',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 15,
        published: true,
    },
    {
        filename: '2025-05-08 AI - Architects of Inversion - The Collapse of Execution',
        metadata: {
            category: ArticleCategory.World,
            dateModified: '2025-05-08',
            datePublished: '2025-05-08',
            description:
                'Explore the future of AI and the collapse of traditional execution models. Understand how artificial intelligence is reshaping work, creativity, and human-machine collaboration.',
            title: 'AI: 2. Architects of Inversion - The Collapse of Execution',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 16,
        published: true,
    },
    {
        filename: '2025-05-09 AI - Architects of Inversion - The World That Follows',
        metadata: {
            category: ArticleCategory.World,
            dateModified: '2025-05-09',
            datePublished: '2025-05-09',
            description:
                'Envision the world that follows the AI revolution. Explore future scenarios, societal changes, and how artificial intelligence will transform our daily lives and human potential.',
            title: 'AI: 3. Architects of Inversion - The World That Follows',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 17,
        published: true,
    },
    {
        filename: '2025-05-18 AI - Cheatsheet 2025',
        metadata: {
            category: ArticleCategory.World,
            dateModified: '2025-05-18',
            datePublished: '2025-05-18',
            description:
                'Your comprehensive AI cheatsheet for 2025. Essential artificial intelligence tools, techniques, and resources to stay ahead in the rapidly evolving AI landscape.',
            title: 'AI: Cheatsheet 2025',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 18,
        published: true,
    },
    {
        filename: '2025-05-18 AI - Cursor',
        metadata: {
            category: ArticleCategory.World,
            dateModified: '2025-05-19',
            datePublished: '2025-05-18',
            description:
                'Master Cursor, the AI-powered code editor for developers. Learn advanced coding techniques, AI-assisted development, and productivity tools for modern software engineering.',
            title: 'AI: Cursor Guide for Developers',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 19,
        published: true,
    },
];

const processMarkdownContent = (content: string, filename: string): string => {
    return content.replace(
        /!\[([^\]]*)\]\((?:\.\/)?assets\/([^)]+)\)/g,
        (match, altText, p1) =>
            `![${altText}](${CDN_BASE_URL}/${encodeURIComponent(
                filename,
            )}/assets/${encodeURIComponent(p1)})`,
    );
};

const readMarkdownFile = async (
    articlesDirectory: string,
    filename: string,
    language: ArticleLanguage,
): Promise<string | undefined> => {
    try {
        const content = await fs.readFile(
            `${articlesDirectory}/${filename}/${language}.md`,
            'utf8',
        );
        return processMarkdownContent(content, filename);
    } catch {
        return undefined;
    }
};

export const readMarkdownArticles = async (): Promise<Article[]> => {
    const articlesDirectory = `${process.cwd()}/content/articles`;

    return await Promise.all(
        ARTICLES_CONFIG.map(async ({ filename, previewImage, ...articleConfig }) => {
            const content: { [key in ArticleLanguage]?: string } = {};

            // Try to read both language versions
            const [enContent, frContent] = await Promise.all([
                readMarkdownFile(articlesDirectory, filename, 'en'),
                readMarkdownFile(articlesDirectory, filename, 'fr'),
            ]);

            if (enContent) content.en = enContent;
            if (frContent) content.fr = frContent;

            // If no content was found, throw error
            if (!Object.keys(content).length) {
                throw new Error(`No content found for article ${filename}`);
            }

            const imageUrl = previewImage
                ? `${CDN_BASE_URL}/${encodeURIComponent(filename)}/assets/${previewImage}`
                : '/assets/image-computer-table.webp';

            return {
                ...articleConfig,
                content,
                imageUrl,
            };
        }),
    );
};
