import { Metadata } from 'next';

import { ArticleInMemoryRepository } from '../../infrastructure/repositories/article-in-memory.repository.js';

import { ArticlesListTemplate } from '../../components/templates/articles-list.template.js';

export const metadata: Metadata = {
    description: 'A collection of articles on coding, product concepts, and more.',
    title: 'Articles - Jterrazz',
};

export default async function ArticlesPage() {
    const articlesRepository = new ArticleInMemoryRepository();
    const articles = await articlesRepository.getArticles();

    const highlightTitle = 'Articles';
    const highlightDescription =
        'Dive into my articles. From coding and new product concepts, explore new things.';

    return (
        <ArticlesListTemplate
            articles={articles}
            highlightTitle={highlightTitle}
            highlightDescription={highlightDescription}
        />
    );
}
