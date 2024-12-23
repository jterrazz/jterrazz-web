import { promises as fs } from 'node:fs';

import { Article, ArticleCategory } from '../../../domain/article.js';

type ArticleConfig = Omit<Article, 'contentInMarkdown'> & {
    filename: string;
};

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
        publicIndex: 12,
        published: true,
    },
];

export const readMarkdownArticles = async (): Promise<Article[]> => {
    const articlesDirectory = `${process.cwd()}/content/articles`;

    return await Promise.all(
        ARTICLES_CONFIG.map(async ({ filename, ...articleConfig }) => {
            let contentInMarkdown: string;

            try {
                contentInMarkdown = await fs.readFile(
                    `${articlesDirectory}/${filename}/en.md`,
                    'utf8',
                );
            } catch {
                // Fallback to French version if English is not available
                contentInMarkdown = await fs.readFile(
                    `${articlesDirectory}/${filename}/fr.md`,
                    'utf8',
                );
            }

            return {
                ...articleConfig,
                contentInMarkdown: contentInMarkdown.replace(
                    /!\[([^\]]*)\]\(assets\/([^)]+)\)/g,
                    (match, altText, p1) =>
                        `![${altText}](https://cdn.jsdelivr.net/gh/jterrazz/jterrazz-web@main/content/articles/${encodeURIComponent(filename)}/assets/${encodeURIComponent(p1)})`,
                ),
            };
        }),
    );
};
