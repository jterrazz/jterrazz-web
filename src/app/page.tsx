import React from 'react';

import { type Article } from '../domain/article.js';
import { type UserExperience } from '../domain/user.js';

import { ArticleInMemoryRepository } from '../infrastructure/repositories/article-in-memory.repository.js';
import { UserInMemoryRepository } from '../infrastructure/repositories/user-in-memory.repository.js';

import { HelloWorldTemplate } from '../components/templates/hello-world.template.js';

export default async function HomePage() {
    const userRepository = new UserInMemoryRepository();
    const articlesRepository = new ArticleInMemoryRepository();
    const userExperiences: UserExperience[] = userRepository.getExperiences();
    const topArticles: Article[] = await articlesRepository.getArticles();
    const description =
        "I'm passionate about building meaningful products. With a love for finance and technology, I'm here to create, connect, and share ideas that make a difference.";

    return (
        <HelloWorldTemplate
            description={description}
            experiences={userExperiences}
            topArticles={topArticles.map((article) => ({
                description: article.metadata.description,
                id: article.publicIndex.toString(),
                imageUrl: article.imageUrl ?? '/assets/image-computer-table.webp',
                title: article.metadata.title,
            }))}
        />
    );
}
