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
            description: 'Dynamically allocated memory in C',
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
            description: 'Basic cryptographic algorithms explained',
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
            description: 'Understand how your computer compiles and executes binaries.',
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
            description: 'A challenge about self replicating programs',
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
                'Become a better programmer by understanding the language your processor speaks',
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
            description: 'Inference reasoning using Python',
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
                'Learn Node.js backend development — part 1 — Handle your first HTTP request with typescript and koa.',
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
                'How Open.MT is leveraging open-source technologies to revolutionize e-commerce',
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
            description: 'Learn the basics of application design',
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
            description: 'Learn the concept of dependencies',
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
            description: 'Learn the concept of hexagonal architecture',
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
            description: 'Learn the concept of clean architecture',
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
            description: 'A mobile app to playfully read and question news',
            title: 'Fake News: Playfully Questioning Reality',
        },
        previewImage: DEFAULT_PREVIEW_IMAGE_JPG,
        publicIndex: 13,
        published: true,
    },
];

const processMarkdownContent = (content: string, filename: string): string => {
    return content.replace(
        /!\[([^\]]*)\]\(assets\/([^)]+)\)/g,
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
