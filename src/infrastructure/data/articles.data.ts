import { promises as fs } from 'node:fs';

import { Article, ArticleCategory } from '../../domain/article.js';

export const readMarkdownArticles: () => Promise<Article[]> = async () => {
    const articlesDirectory = process.cwd() + '/src/infrastructure/data/articles';

    return [
        {
            contentInMarkdown: await fs.readFile(
                `${articlesDirectory}/00001.create-malloc-library.md`,
                'utf8',
            ),
            index: 1,
            metadata: {
                category: ArticleCategory.Code,
                dateModified: '2024-08-29',
                datePublished: '2019-06-01',
                title: 'Create Your Own malloc Library from Scratch',
                description: 'Dynamically allocated memory in C',
            },
            published: true,
        },
        {
            contentInMarkdown: await fs.readFile(
                `${articlesDirectory}/00002.master-hash-functions.md`,
                'utf8',
            ),
            index: 2,
            metadata: {
                category: ArticleCategory.Code,
                dateModified: '2024-08-30',
                datePublished: '2019-06-07',
                title: 'Unraveling the Mysteries of SHA-256 and MD5',
                description: 'Basic cryptographic algorithms explained',
            },
            published: true,
        },
        {
            contentInMarkdown: await fs.readFile(
                `${articlesDirectory}/00003.build-nm-otool.md`,
                'utf8',
            ),
            index: 3,
            metadata: {
                category: ArticleCategory.Code,
                dateModified: '2024-08-29',
                datePublished: '2019-07-25',
                title: 'Building Your Own nm and otool',
                description: 'Understand how your computer compiles and executes binaries.',
            },
            published: true,
        },
        {
            contentInMarkdown: await fs.readFile(
                `${articlesDirectory}/00004.build-a-quine.md`,
                'utf8',
            ),
            index: 4,
            metadata: {
                category: ArticleCategory.Code,
                dateModified: '2024-09-03',
                datePublished: '2019-08-27',
                title: 'Build a Self-Replicating Program (Quine)',
                description: 'A challenge about self replicating programs',
            },
            published: true,
        },
        {
            contentInMarkdown: await fs.readFile(
                `${articlesDirectory}/00005.first-assembly-functions.md`,
                'utf8',
            ),
            index: 5,
            metadata: {
                category: ArticleCategory.Code,
                dateModified: '2024-09-02',
                datePublished: '2019-08-28',
                title: 'Crafting Your First Assembly Functions',
                description:
                    'Become a better programmer by understanding the language your processor speaks',
            },
            published: true,
        },
        {
            contentInMarkdown: await fs.readFile(
                `${articlesDirectory}/00006.implement-expert-system.md`,
                'utf8',
            ),
            index: 6,
            metadata: {
                category: ArticleCategory.Code,
                dateModified: '2024-09-02',
                datePublished: '2019-09-10',
                title: 'Expert Systems: A Backward Chaining Resolver in Python',
                description: 'Inference reasoning using Python',
            },
            published: true,
        },
        {
            contentInMarkdown: await fs.readFile(
                `${articlesDirectory}/00007.build-koa-server.md`,
                'utf8',
            ),
            index: 7,
            metadata: {
                category: ArticleCategory.Code,
                dateModified: '2024-08-02',
                datePublished: '2020-11-03',
                title: 'Crafting a Robust Web Server with TypeScript and Koa',
                description:
                    'Learn Node.js backend development — part 1 — Handle your first HTTP request with typescript and koa.',
            },
            published: true,
        },
        {
            contentInMarkdown: await fs.readFile(
                `${articlesDirectory}/00008.app-open-market.md`,
                'utf8',
            ),
            index: 8,
            metadata: {
                category: ArticleCategory.App,
                dateModified: '2024-07-02',
                datePublished: '2023-07-02',
                title: 'Experience the Future of Shopping with Open.MT',
                description:
                    'How Open.MT is leveraging open-source technologies to revolutionize e-commerce',
            },
            published: true,
        },
    ];
};
