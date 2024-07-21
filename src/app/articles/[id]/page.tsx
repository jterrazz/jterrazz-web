import { promises as fs } from 'node:fs';

import { ArticleTemplate } from '../../../components/templates/ArticleTemplate.js';

export async function generateStaticParams() {
    return [{ id: '1' }, { id: '2' }];
}

async function getPost() {
    return await fs.readFile(
        process.cwd() + '/src/infrastructure/data/posts/00001.create-malloc-library.md',
        'utf8',
    );
}

export default async function ArticlePage() {
    // const article: PostArticle = {
    //     content: 'Hello, World',
    //     title: 'Hello, World!',
    //     year: '2024',
    // };
    const article = await getPost();

    return <ArticleTemplate article={article} />;
}
