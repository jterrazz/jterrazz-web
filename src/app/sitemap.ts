import { type MetadataRoute } from 'next';

import { ArticleInMemoryRepository } from '../infrastructure/repositories/article-in-memory.repository.js';

import { buildArticleSlug } from '../lib/slugify.js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jterrazz.com';
    const articlesRepository = new ArticleInMemoryRepository();
    const articles = await articlesRepository.getArticles();

    const articleUrls = articles.flatMap((article) => {
        const languages = Object.keys(article.content);
        return languages.map((lang) => ({
            changeFrequency: 'monthly' as const,
            lastModified: new Date(article.metadata.dateModified),
            priority: 0.8,
            url: `${baseUrl}/articles/${buildArticleSlug(article.publicIndex, article.metadata.title)}/${lang}`,
        }));
    });

    // Add main pages
    const mainPages = [
        {
            changeFrequency: 'weekly' as const,
            lastModified: new Date(),
            priority: 1.0,
            url: baseUrl,
        },
        {
            changeFrequency: 'weekly' as const,
            lastModified: new Date(),
            priority: 0.9,
            url: `${baseUrl}/articles`,
        },
        {
            changeFrequency: 'monthly' as const,
            lastModified: new Date(),
            priority: 0.7,
            url: `${baseUrl}/applications`,
        },
        {
            changeFrequency: 'monthly' as const,
            lastModified: new Date(),
            priority: 0.6,
            url: `${baseUrl}/photographs`,
        },
    ];

    return [...mainPages, ...articleUrls];
} 