import React from 'react';
import { type Metadata } from 'next';

import { ArticleInMemoryRepository } from '../../infrastructure/repositories/article-in-memory.repository.js';
import { UserInMemoryRepository } from '../../infrastructure/repositories/user-in-memory.repository.js';

import { ArticlesListTemplate } from '../../components/templates/articles-list.template.js';
import { ArticlesListViewModelImpl } from '../../components/templates/articles-list.template.view-model.js';

// Force static generation for this page
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
    description: 'A collection of articles on coding, product concepts, and more.',
    title: 'Articles - Jterrazz',
};

export default async function ArticlesPage() {
    const articlesRepository = new ArticleInMemoryRepository();
    const userRepository = new UserInMemoryRepository();
    const articles = await articlesRepository.getArticles();

    // TODO: Move to template directly
    const highlightTitle = 'Articles';
    const highlightDescription =
        'Dive into my articles. From coding and new product concepts, explore new things.';

    const viewModel = new ArticlesListViewModelImpl(
        articles,
        highlightTitle,
        highlightDescription,
        userRepository,
    );

    return <ArticlesListTemplate viewModel={viewModel.getViewModel()} />;
}
