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
                date: '2019-06-01',
                title: 'How to create your own malloc library',
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
                date: '2019-06-07',
                title: 'Implementing the sha256 and md5 hash functions in C',
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
                date: '2019-07-25',
                title: 'Everything you need to build your own nm and otool',
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
                date: '2019-08-27',
                title: 'Build a self replicating program (quine)',
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
                date: '2019-08-28',
                title: 'Quickly code your first assembly functions (Intel x86–64 syntax)',
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
                date: '2019-09-10',
                title: 'Expert Systems: Implement a backward chaining resolver in Python',
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
                date: '2020-11-03',
                title: 'Learn to Build a Simple, yet Powerful Web Server with Typescript and Koa',
            },
            published: false,
        },
        {
            contentInMarkdown: await fs.readFile(
                `${articlesDirectory}/00008.app-open-market.md`,
                'utf8',
            ),
            index: 8,
            metadata: {
                category: ArticleCategory.App,
                date: '2023-07-02',
                title: "The Future of Shopping with Open.MT's Open-Source Technologies",
            },
            published: true,
        },
    ];
};
