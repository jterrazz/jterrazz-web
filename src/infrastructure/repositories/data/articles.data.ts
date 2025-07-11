import { sanitizeAiText } from 'ai-text-sanitizer';
import { promises as fs } from 'node:fs';

import { type Article, ArticleCategory, type ArticleLanguage } from '../../../domain/article.js';

type ArticleConfig = Omit<Article, 'content' | 'imageUrl'> & {
    filename: string;
    previewImage?: string;
};

const CDN_BASE_URL = 'https://github.com/jterrazz/jterrazz-web/raw/main/content';
const DEFAULT_PREVIEW_IMAGE_JPG = 'thumbnail.jpg';

const ARTICLES_CONFIG: ArticleConfig[] = [
    {
        filename: '2019-06-01 Malloc',
        metadata: {
            category: ArticleCategory.Code,
            dateModified: '2025-06-23',
            datePublished: '2019-06-01',
            description:
                'Step-by-step guide to implement malloc, free and realloc with mmap, understanding heap management, alignment and performance pitfalls.',
            title: 'Build Your Own malloc in C',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 1,
        published: true,
    },
    {
        filename: '2019-06-07 Sha256',
        metadata: {
            category: ArticleCategory.Code,
            dateModified: '2025-06-24',
            datePublished: '2019-06-07',
            description:
                'Code cryptographic hashes from scratch, explore message padding, processing rounds and why SHA-256 replaces MD5 in secure systems.',
            title: 'SHA-256 & MD5 in C – Complete Hashing Guide',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 2,
        published: true,
    },
    {
        filename: '2019-07-25 Nm Otool',
        metadata: {
            category: ArticleCategory.Code,
            dateModified: '2025-06-25',
            datePublished: '2019-07-25',
            description:
                'Build your own nm/otool clones to inspect Mach-O symbol tables and learn low-level binary analysis on macOS.',
            title: 'Reverse-Engineer Binaries with nm and otool',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 3,
        published: true,
    },
    {
        filename: '2019-08-27 Quine',
        metadata: {
            category: ArticleCategory.Code,
            dateModified: '2025-06-26',
            datePublished: '2019-08-27',
            description:
                'Challenge yourself to create a program that prints its own source while grasping strings, I/O and compiler quirks.',
            title: 'Write a Self-Replicating Quine in C',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 4,
        published: true,
    },
    {
        filename: '2019-08-28 Assembly',
        metadata: {
            category: ArticleCategory.Code,
            dateModified: '2025-06-27',
            datePublished: '2019-08-28',
            description:
                'Hands-on intro to registers, calling conventions and optimisation by coding small assembly functions.',
            title: 'Your First x86-64 Assembly Routines',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 5,
        published: true,
    },
    {
        filename: '2019-09-10 Expert System',
        metadata: {
            category: ArticleCategory.Code,
            dateModified: '2025-06-28',
            datePublished: '2019-09-10',
            description:
                'Create an AI reasoning engine in Python that derives conclusions from rules using classic backward chaining.',
            title: 'Build a Backward-Chaining Expert System',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 6,
        published: true,
    },
    {
        filename: '2020-11-03 Koa',
        metadata: {
            category: ArticleCategory.Code,
            dateModified: '2025-06-29',
            datePublished: '2020-11-03',
            description:
                'Architect a modern Node backend using Koa middleware, routing, validation and testing in TypeScript.',
            title: 'TypeScript REST API with Koa.js',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 7,
        published: true,
    },
    {
        filename: '2023-07-02 Open Market',
        metadata: {
            category: ArticleCategory.Build,
            dateModified: '2025-07-01',
            datePublished: '2023-07-02',
            description:
                'Architecture, tech stack and decentralised commerce concepts behind the Open.MT marketplace project.',
            title: 'Inside Open.MT – Building an Open-Source Marketplace',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 8,
        published: true,
    },
    {
        filename: '2024-12-20 Application Design Introduction',
        metadata: {
            category: ArticleCategory.Code, // TODO: change to Architecture
            dateModified: '2025-07-02',
            datePublished: '2024-12-20',
            description:
                'Kick-off to the Application Design series covering principles for sustainable, scalable software.',
            title: 'Software Design 0 – Why Architecture Matters',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 9,
        published: true,
    },
    {
        filename: '2024-12-21 Application Design Dependencies',
        metadata: {
            category: ArticleCategory.Code, // TODO: change to Architecture
            dateModified: '2025-07-03',
            datePublished: '2024-12-21',
            description:
                'Learn dependency inversion & injection to keep codebases flexible, testable and maintainable.',
            title: 'Software Design 1 – Mastering Dependencies',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 10,
        published: true,
    },
    {
        filename: '2024-12-22 Application Design Hexagonal',
        metadata: {
            category: ArticleCategory.Code, // TODO: change to Architecture
            dateModified: '2025-07-04',
            datePublished: '2024-12-22',
            description:
                'Implement ports-and-adapters to isolate domain logic from frameworks, UIs and databases.',
            title: 'Software Design 2 – Hexagonal Architecture',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 11,
        published: true,
    },
    {
        filename: '2024-12-23 Application Design Clean Architecture',
        metadata: {
            category: ArticleCategory.Code, // TODO: change to Architecture
            dateModified: '2025-07-05',
            datePublished: '2024-12-23',
            description:
                'Apply SOLID and layer boundaries to craft maintainable, decoupled systems that scale.',
            title: 'Software Design 3 – Clean Architecture in Practice',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 12,
        published: true,
    },
    {
        filename: '2025-04-06 Fake News',
        metadata: {
            category: ArticleCategory.Build,
            dateModified: '2025-07-06',
            datePublished: '2025-04-06',
            description:
                'Discover a mobile game that gamifies media literacy and helps users detect misinformation.',
            title: 'Fake News App – Playful Critical Thinking',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 13,
        published: true,
    },
    {
        filename: '2025-05-06 Navigating the AI Revolution',
        metadata: {
            category: ArticleCategory.Insight,
            dateModified: '2025-07-07',
            datePublished: '2025-05-06',
            description:
                'Practical roadmap to thrive amid accelerating AI adoption, disruption and new opportunities.',
            title: 'AI Series 0 – Navigating the AI Revolution',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 14,
        published: true,
    },
    {
        filename: '2025-05-07 Applied Intelligence',
        metadata: {
            category: ArticleCategory.Insight,
            dateModified: '2025-07-08',
            datePublished: '2025-05-07',
            description:
                'Tactics, workflows and tools to integrate AI into daily productivity and decision-making.',
            title: 'AI Series 1 – Applied Intelligence for Everyday Work',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 15,
        published: true,
    },
    {
        filename: '2025-05-08 Architects of Inversion - The Collapse of Execution',
        metadata: {
            category: ArticleCategory.Insight,
            dateModified: '2025-07-09',
            datePublished: '2025-05-08',
            description:
                'How AI flips traditional execution models and reshapes creative and operational roles.',
            title: 'AI Series 2 – The Collapse of Execution',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 16,
        published: true,
    },
    {
        filename: '2025-05-09 Architects of Inversion - The World That Follows',
        metadata: {
            category: ArticleCategory.Insight,
            dateModified: '2025-07-10',
            datePublished: '2025-05-09',
            description:
                'Envision societal, economic and personal changes in a post-automation world.',
            title: 'AI Series 3 – Life After the Execution Collapse',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 17,
        published: true,
    },
    {
        filename: '2025-05-18 AI Cheatsheet 2025',
        metadata: {
            category: ArticleCategory.Insight,
            dateModified: '2025-07-11',
            datePublished: '2025-05-18',
            description:
                'A concise reference of key AI concepts, frameworks and resources to stay current this year.',
            title: 'AI Cheatsheet 2025',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 18,
        published: true,
    },
    {
        filename: '2025-05-18 Cursor',
        metadata: {
            category: ArticleCategory.Insight,
            dateModified: '2025-07-12',
            datePublished: '2025-05-18',
            description:
                'Master Cursor features to boost development with inline AI suggestions, context and automation.',
            title: 'Cursor Editor – AI-Powered Coding Workflow',
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

const sanitizeText = (text: string | undefined): string | undefined =>
    text ? sanitizeAiText(text).cleaned : text;

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
    const articlesDirectory = `${process.cwd()}/content`;

    return await Promise.all(
        ARTICLES_CONFIG.map(async ({ filename, previewImage, ...articleConfig }) => {
            const content: { [key in ArticleLanguage]?: string } = {};

            // Try to read both language versions
            const [enContent, frContent] = await Promise.all([
                readMarkdownFile(articlesDirectory, filename, 'en'),
                readMarkdownFile(articlesDirectory, filename, 'fr'),
            ]);

            if (enContent) content.en = sanitizeText(enContent)!;
            if (frContent) content.fr = sanitizeText(frContent)!;

            // If no content was found, throw error
            if (!Object.keys(content).length) {
                throw new Error(`No content found for article ${filename}`);
            }

            const imageUrl = previewImage
                ? `${CDN_BASE_URL}/${encodeURIComponent(filename)}/assets/${previewImage}`
                : '';

            return {
                ...articleConfig,
                content,
                imageUrl,
                metadata: {
                    ...articleConfig.metadata,
                    description: sanitizeText(articleConfig.metadata.description) ?? '',
                    title: sanitizeText(articleConfig.metadata.title) ?? '',
                },
            } as Article;
        }),
    );
};
