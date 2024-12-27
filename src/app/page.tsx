import React from 'react';

import { UserExperience, UserValue } from '../domain/user.js';

import { ArticleInMemoryRepository } from '../infrastructure/repositories/article-in-memory.repository.js';
import { UserInMemoryRepository } from '../infrastructure/repositories/user-in-memory.repository.js';

import { ArticlesListViewModelImpl } from '../components/templates/articles-list.template.view-model.js';
import { HelloWorldTemplate } from '../components/templates/hello-world.template.js';

export default async function HomePage() {
    const articleRepository = new ArticleInMemoryRepository();
    const userRepository = new UserInMemoryRepository();
    const userExperiences: UserExperience[] = userRepository.getExperiences();
    const userValues: UserValue[] = userRepository.getProfile().values;
    const description =
        'I’m passionate about building meaningful products. With a love for finance and technology, I’m here to create, connect, and share ideas that make a difference.';

    const articles = await articleRepository.getArticles();

    // TODO Bad ViewModel
    const viewModel = new ArticlesListViewModelImpl(
        articles,
        'Articles',
        'Dive into my articles. From coding and new product concepts, explore new things.',
        userRepository,
    );

    return (
        <HelloWorldTemplate
            experiences={userExperiences}
            values={userValues}
            description={description}
            articles={viewModel.getViewModel()}
        />
    );
}
